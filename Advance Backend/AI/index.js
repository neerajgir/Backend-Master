import express from "express";
import dotenv from "dotenv";
dotenv.config();
import {GoogleGenAI} from "@google/genai"
import {ChatGoogleGenerativeAI} from "@langchain/google-genai";
import { ChatGroq } from "@langchain/groq";
import { Annotation,StateGraph, END, START,  } from "@langchain/langgraph";

const app = express();
const genAI = new GoogleGenAI({
    apiKey: process.env.GOOGLE_API_KEY,
});

// const interaction = async () => {
//   const response = await genAI.models.generateContent({
//     model: "gemini-3.5-flash",
//     contents: [{
//       role: "user",
//       parts: [{
//         text: "Write a story about a magic backpack."
//       }]
//     }]
//   });

//   console.log(response.text);
// }

// interaction();

app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Hello, World!");
});


// app.post("/generate", async (req, res) => {
//   const { prompt } = req.body;

//   const response = await genAI.models.generateContent({
//     model: "gemini-3.5-flash",
//     contents: [{
//       role: "user",
//       parts: [{
//         text: prompt
//       }]
//     }]
//   });

//   res.status(200).json({ response: response.text });
// });


const llm = new ChatGroq({
    model: "openai/gpt-oss-120b",
    apiKey: process.env.GROQ_API_KEY,
    temperature: 0.7,
    maxTokens: 100,
    maxRetries: 2,
});

// langraph

const State = Annotation.Root({
   prompt: Annotation,
   aiMsg: Annotation,
})

const callLLM = async (state) => {
  console.log("State received in callLLM:", state);
  const response = await llm.invoke([
    {role: "system", content: "You are a helpful assistant."},
    {role: "human", content: state.prompt}
  ]);

  return { aiMsg: response.content };
}

const graph = new StateGraph(State)
.addNode("agent", callLLM) 
.addEdge(START, "agent")
.addEdge("agent", END)
.compile();


app.post("/generate", async (req, res) => {
  const { prompt } = req.body;

  const response = await graph.invoke({ prompt });

  res.status(200).json({ response: response.aiMsg });
});

// app.post("/generate", async (req, res) => {
//   const { prompt } = req.body;

//   const response = await llm.invoke([
//     {role: "system", content: "You are a helpful assistant."},
//     {role: "human", content: prompt}
//   ]);

//   res.status(200).json({ response: response.content });
// });

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});