import { Worker } from "bullmq";
import path from "path";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { QdrantVectorStore } from "@langchain/qdrant";
import { Document } from "langchain";
import { PDFLoader } from "@langchain/community/document_loader/fs/pdf";
import { CharacterTextSplitter } from "@langchain/textsplitters";
import { text } from "stream/consumers";

const worker = new Worker(
  "file-upload",
  async (job) => {
    const loader = new PDFLoader(data.path);
    const docs = await loader.load()

    const client = new QdrantClient({url:process.env.QDRANTURL})

    const textsplitters = new CharacterTextSplitter({
        chunkSize:500,
        chunkOverlap:0
    })

    const texts = await textsplitters.splitText(docs);
    console.log(texts)

    

    console.log("Job:", job.data);
  },
  {
    concurrency: 100,
    connection: {
      host: "localhost",
      port: "6379",
      password:process.env.REDIS_PASSWORD,
    },
  }
);

// Path:data.Path
// read the pdf from path
// chunk the pdf,
// call the openai embedding model from every chunk,
// store the chuck in qdrant
