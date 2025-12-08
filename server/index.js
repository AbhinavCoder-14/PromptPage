import express from "express";
import cors from "cors";
import multer from "multer";
import "dotenv/config"
import { Queue } from "bullmq";
import { GoogleGenAI } from "@google/genai";

import { ChatMessageHistory } from "@langchain/community/stores/message/in_memory";
import { RunnableWithMessageHistory } from "@langchain/core/runnables";
import { ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { QdrantVectorStore } from "@langchain/qdrant";
import { ChatPromptTemplate, MessagesPlaceholder } from "@langchain/core/prompts";


import { createHistoryAwareRetriever } from "langchain/chains/history_aware_retriever";
import { createRetrievalChain } from "langchain/chains/retrieval";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";


const app = express();

const client = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY2,
});

const queue = new Queue("file-upload", {
  connection: {
    host: "localhost",
    port: 6379,
    password: "ITSMEBBy",
  },
});

app.use(cors());

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSufffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSufffix}-${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

app.get("/", (req, res) => {
  return res.json({ status: "all good bby" });
});


const messageHistories = new Map();
    const getMessageHistory = (sessionId) => {
      if (messageHistories.has(sessionId)) {
        return messageHistories.get(sessionId);
      }
      const history = new ChatMessageHistory();
      messageHistories.set(sessionId, history);
      return history;
    };

app.get("/chat", async (req, res) => {

  const sessionId = "default-guest";


    


  const query = req.params?.ques || "what is python?";

  const embedding = new GoogleGenerativeAIEmbeddings({
    model: "text-embedding-004",
    apiKey: process.env.GEMINI_API_KEY2,
  });

  const vectorStore = await QdrantVectorStore.fromExistingCollection(
    embedding,
    {
      url: "http://localhost:6333",
      collectionName: "pdf-docs",
    }
  );

  const ret = vectorStore.asRetriever({
    k: 10,
  });

  const llm = new ChatGoogleGenerativeAI({
      model: "gemini-2.5-flash",
      apiKey: process.env.GEMINI_API_KEY2,
      temperature: 0.7,
    });


  const result = await ret.invoke(query);
  const contextText = result.map((doc) => doc.pageContent).join("\n\n");

  const rephasePrompt = ChatPromptTemplate.fromMessages([
    new MessagesPlaceholder("chat_history"),
    ["user","{query}"],
    ["user","Given the above conversation, generate a search query to look up in order to get information relevant to the conversation",],
  ])

  const historyAwareRetriever = await createHistoryAwareRetriever({
      llm:llm,
      retriver:ret,
      rephrasePrompt: rephasePrompt,
  })
  const systemPromptText = `You are a helpful assistant. Answer the user's question using ONLY the provided context from the PDF documents. 
If the user's question cannot be answered from the provided context, say "I don't know based on the provided documents." 
Do not invent facts, do not use external knowledge, and do not hallucinate. Be concise.`;

    const qaPrompt = ChatPromptTemplate.fromMessages([
      ["system", systemPromptText],
      new MessagesPlaceholder("chat_history"),
      ["user", "{query}"],
    ]);


    const questionAnswerChain = await createStuffDocumentsChain({
      llm,
      prompt: qaPrompt,
    });


    const ragChain = await createRetrievalChain({
      retriever: historyAwareRetriever,
      combineDocsChain: questionAnswerChain,
    });


    const conversationalRagChain = new RunnableWithMessageHistory({
      runnable: ragChain,
      getMessageHistory: getMessageHistory,
      inputMessagesKey: "query",
      historyMessagesKey: "chat_history",
      outputMessagesKey: "answer",
    });

    const response = await conversationalRagChain.invoke(
      { input: query },
      { configurable: { sessionId } }
    );




  res.json({ message: response.text, docs: result });
});

app.post("/upload/pdf", upload.single("pdf"), async (req, res) => {
  await queue.add("file-ready", {
    filename: req.file.originalname,
    destination: req.file.destination,
    path: req.file.path,
  });

  console.log("upload the given pdf file :)");
});

app.listen(8000, () => {
  console.log("server started...");
});
