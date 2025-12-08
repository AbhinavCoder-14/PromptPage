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


import { RunnableSequence,RunnablePassthrough } from "@langchain/core/runnables";
import { StringOutputParser } from "@langchain/core/output_parsers";

const app = express();
app.use(cors());
app.use(express.json());

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

app.post("/chat", async (req, res) => {
  const sessionId = "default-guest";
  const { ques } = req.body;
  const query = ques || "what is string?";

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

  const retriever = vectorStore.asRetriever({
    k: 10,
  });

  const llm = new ChatGoogleGenerativeAI({
    model: "gemini-2.5-flash",
    apiKey: process.env.GEMINI_API_KEY2,
    temperature: 0.7,
  });

  // Create contextualize question prompt
  const contextualizeQSystemPrompt = `Given a chat history and the latest user question 
which might reference context in the chat history, formulate a standalone question 
which can be understood without the chat history. Do NOT answer the question, 
just reformulate it if needed and otherwise return it as is.`;

  const contextualizeQPrompt = ChatPromptTemplate.fromMessages([
    ["system", contextualizeQSystemPrompt],
    new MessagesPlaceholder("chat_history"),
    ["human", "{input}"],
  ]);

  // Create QA prompt
  const qaSystemPrompt = `You are a helpful assistant. Answer the user's question using ONLY the provided context from the PDF documents. 
If the user's question cannot be answered from the provided context, say "I don't know based on the provided documents." 
Do not invent facts, do not use external knowledge, and do not hallucinate. Be concise.

Context: {context}`;

  const qaPrompt = ChatPromptTemplate.fromMessages([
    ["system", qaSystemPrompt],
    new MessagesPlaceholder("chat_history"),
    ["human", "{input}"],
  ]);

  // Build the chain manually
  const historyAwareRetriever = RunnableSequence.from([
    RunnablePassthrough.assign({
      input: (input) => {
        if (input.chat_history && input.chat_history.length > 0) {
          return contextualizeQPrompt.pipe(llm).pipe(new StringOutputParser());
        }
        return input.input;
      },
    }),
    async (input) => {
      const question = typeof input.input === 'string' ? input.input : await input.input.invoke({ chat_history: input.chat_history, input: input.input });
      return retriever.invoke(question);
    },
  ]);

  const ragChain = RunnableSequence.from([
    RunnablePassthrough.assign({
      context: async (input) => {
        const docs = await historyAwareRetriever.invoke({
          input: input.input,
          chat_history: input.chat_history || [],
        });
        return docs.map((doc) => doc.pageContent).join("\n\n");
      },
    }),
    qaPrompt,
    llm,
    new StringOutputParser(),
  ]);

  // Wrap with message history
  const conversationalRagChain = new RunnableWithMessageHistory({
    runnable: ragChain,
    getMessageHistory: getMessageHistory,
    inputMessagesKey: "input",
    historyMessagesKey: "chat_history",
  });

  // Invoke the chain
  const response = await conversationalRagChain.invoke(
    { input: query },
    { configurable: { sessionId } }
  );

  // Get the documents for reference
  const docs = await retriever.invoke(query);

  res.json({ message: response, docs });
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
