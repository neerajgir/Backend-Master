import express from "express";
import dotenv from "dotenv";
dotenv.config();
import { ChatGroq } from "@langchain/groq";
import {ChatGoogleGenerativeAI} from "@langchain/google-genai";



const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

const llm = new ChatGroq({
    model: "openai/gpt-oss-120b",
    apiKey: process.env.GROQ_API_KEY,
    temperature: 0.7,
    maxTokens: 2080,
    maxRetries: 2,
})

app.post("/generate", async (req, res) => {
  const { prompt } = req.body;

  const response = await llm.invoke({ messages:[
  { role: "user", 
    content: prompt
  }
  ]}
);

  res.status(200).json({ response: response.content });
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});