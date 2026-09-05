import express from "express";
import dotenv from "dotenv";
dotenv.config();
import { ChatGroq } from "@langchain/groq";
import {ChatGoogleGenerativeAI} from "@langchain/google-genai";
import fs from "fs";
import { PDFParse } from "pdf-parse";
import path from 'path';
import { fileURLToPath } from 'url';
import {RecursiveCharacterTextSplitter} from "@langchain/textsplitters"
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { TaskType } from "@google/generative-ai";
import { QdrantVectorStore } from "@langchain/qdrant";




const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

const llm = new ChatGroq({
    model: "openai/gpt-oss-120b",
    apiKey: process.env.GROQ_API_KEY,
    temperature: 0.7,
    maxTokens: 100,
    maxRetries: 2,
})

// rag - retrieval augmented generation
// extract text from pdf
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const upload = async (req, res) => {
    const pdfPath = path.join(__dirname, 'knowledge.pdf');
    const buffer = fs.readFileSync(pdfPath);
    const pdfResult = new PDFParse({ data: buffer });
    const result = await pdfResult.getText();
    const text = result.text;
    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 200,
    });
    const doc = await splitter.createDocuments([text])
    console.log(doc);
}
upload();

// embeddings
const embeddings = new GoogleGenerativeAIEmbeddings({
    apiKey: process.env.GOOGLE_API_KEY,
    model: "gemini-embedding-001",
    taskType: TaskType.RETRIEVAL_DOCUMENT,
    title: "Knowledge Base Embeddings",
});
const vectorStore = await QdrantVectorStore.fromExistingCollection(embeddings, {
  url: process.env.QDRANT_URL,
  collectionName: "grocery_store",
});


app.post("/generate", async (req, res) => {
  const { prompt } = req.body;

  const response = await llm.invoke([
  { role: "user", 
    content: prompt
  }
  ]);

  res.status(200).json({ response: response.content });
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});