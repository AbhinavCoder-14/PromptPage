import express from "express";
import cors from "cors";
import multer from "multer";
import { Queue } from "bullmq";
import { GoogleGenAI } from "@google/genai";

import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { QdrantVectorStore } from "@langchain/qdrant";
import { Document, SystemMessage } from "langchain";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { CharacterTextSplitter } from "@langchain/textsplitters";

import "dotenv/config";

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

app.get("/chat", async (req, res) => {


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

  const result = await ret.invoke(query);

  const contextText = result.map((doc) => doc.pageContent).join("\n\n");
  const SYSTEM_PROMPT = `you are helpfull ai assistant who answer the user query based on the avaliable context form the given pdf file. 
  Context: ${contextText}`;

  const response = await client.models.generateContent({
    model: "gemini-2.5-flash",
    config: {

      systemInstruction: {
        parts: [{ text: SYSTEM_PROMPT }],
      },
    },
    contents: [
      {
        role: "user",
        parts: [{ text: query }],
      },
    ],
  });

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
