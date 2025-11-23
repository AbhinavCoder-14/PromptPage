import { Worker } from "bullmq";
import path from "path";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { QdrantVectorStore } from "@langchain/qdrant";
import { Document } from "langchain";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { CharacterTextSplitter } from "@langchain/textsplitters";
import 'dotenv/config'

import PDFParse  from "pdf-parse"

import { QdrantClient } from "@qdrant/js-client-rest";

// console.log("enterd in worder")

const worker = new Worker(
  "file-upload",
  async (job) => {
    console.log("enterd in worder")

    try{
      const loader = new PDFLoader(job.data.path);
      const docs = await loader.load();
      console.log(docs)


      const client = new QdrantClient({ host: "localhost", port: 6333 });
      const textsplitters = new CharacterTextSplitter({
        chunkSize:300,
        chunkOverlap: 0,
      });
  
      const texts = await textsplitters.splitDocuments(docs);
      console.log(texts);
      console.log("Job:", job.data);

    }

    catch(err){

      console.log(err)

    }
  },
  {
    concurrency: 5,
    connection: {
      host: "localhost",
      port: 6379,
      password: "ITSMEBBy",
    },
  }
);



// Path:data.Path
// read the pdf from path
// chunk the pdf,
// call the openai embedding model from every chunk,
// store the chuck in qdrant
