import { Worker } from "bullmq";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { QdrantVectorStore } from "@langchain/qdrant";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import "dotenv/config";

const worker = new Worker(
  "file-upload",
  async (job) => {
    console.log("🔄 Processing job:", job.id);
    
    try {
      // 1. Load PDF
      console.log("📖 Loading PDF from:", job.data.path);
      const loader = new PDFLoader(job.data.path);
      const docs = await loader.load();
      console.log(`✅ Loaded ${docs.length} pages`);
      
      // 2. Split
      console.log("✂️  Splitting documents...");
      const textsplitters = new RecursiveCharacterTextSplitter({
        chunkSize: 2000,
        chunkOverlap: 200,
      });
      const texts = await textsplitters.splitDocuments(docs);
      console.log(`✅ Created ${texts.length} chunks`);
      console.log("First chunk preview:", texts[0].pageContent.substring(0, 100));

      // 3. Initialize embeddings
      console.log("🔧 Initializing embeddings...");
      const embedding = new GoogleGenerativeAIEmbeddings({
        model: "gemini-embedding-001",
        apiKey: process.env.GOOGLE_API_KEY,
      });
      console.log("✅ Embeddings initialized");
      
      // 4. TEST EMBEDDING FIRST!
      console.log("🧪 Testing embedding generation...");
      const testEmbed = await embedding.embedQuery("test query");
      console.log(`✅ Test embedding dimension: ${testEmbed.length}`);
      console.log(`✅ Test embedding sample:`, testEmbed.slice(0, 3));
      
      if (testEmbed.length === 0) {
        throw new Error("❌ Embedding returned empty vector! API call failed.");
      }
      
      // 5. Connect to Qdrant
      console.log("🔌 Connecting to Qdrant...");
      const vectorStore = await QdrantVectorStore.fromExistingCollection(
        embedding,
        {
          url: "http://localhost:6333",
          collectionName: "pdf-docs",
        }
      );
      console.log("✅ Connected to Qdrant");
      
      // 6. Add documents
      // 6. Add documents IN BATCHES
console.log(`💾 Adding ${texts.length} documents to Qdrant in batches...`);

const BATCH_SIZE = 10; // Process 10 documents at a time
const MAX_RETRIES = 3;
for (let i = 0; i < texts.length; i += BATCH_SIZE) {
  if(retries>MAX_RETRIES){
    console.log("out")
  }
  else{
  const batch = texts.slice(i, i + BATCH_SIZE);
  console.log(`   Processing batch ${Math.floor(i/BATCH_SIZE) + 1}/${Math.ceil(texts.length/BATCH_SIZE)} (${batch.length} docs)`);
  
  // Generate embeddings manually
  const embeddings = await embedding.embedDocuments(
    batch.map(doc => doc.pageContent)
  );
  
  console.log(`   Generated ${embeddings.length} embeddings, dimensions: ${embeddings[0]?.length || 0}`);
  
  if (embeddings[0]?.length === 0) {
    throw new Error("Batch embedding failed - got empty vectors");
  }
  
  // Add to Qdrant
  await vectorStore.addVectors(embeddings, batch);
  console.log(`   ✅ Batch added to Qdrant`);
  
  // Small delay to avoid rate limits
  await new Promise(resolve => setTimeout(resolve, 1000));
}
}

console.log("✅✅✅ SUCCESS! All documents added");
      
    } catch (err) {
      retries++;
      if (retries<MAX_RETRIES){
      const waitTime = retries * 5000;
      await new Promise(resolve => setTimeout(() => {
        resolve
      }, waitTime))

      }
      console.error("ERROR:", err.message);
      console.error("Stack:", err.stack);
      throw err;
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

console.log("👷 Worker started and listening...");