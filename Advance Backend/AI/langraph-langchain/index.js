import express from "express";
import dotenv from "dotenv";
dotenv.config();
import {GoogleGenAI} from "@google/genai"
import {ChatGoogleGenerativeAI} from "@langchain/google-genai";
import { ChatGroq } from "@langchain/groq";
import { Annotation,StateGraph, END, START, MessagesAnnotation, MemorySaver  } from "@langchain/langgraph";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { TavilySearch } from "@langchain/tavily";
import { SystemMessage } from "@langchain/core/messages";
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


const tool = new TavilySearch({
  apiKey: process.env.TAVILY_API_KEY,
  maxResults: 5,
  topic: "general"
});

const checkPointer = new MemorySaver();

const tools = [tool];
const toolNode = new ToolNode(tools)


const llm = new ChatGroq({
    model: "openai/gpt-oss-120b",
    apiKey: process.env.GROQ_API_KEY,
    temperature: 0.7,
    maxTokens: 2080,
    maxRetries: 2,
}).bindTools(tools);

// langraph

// const State = Annotation.Root({
//    prompt: Annotation,
//    aiMsg: Annotation,
// })



const callLLM = async (state) => {
  console.log("State received in callLLM:", state);
  const response = await llm.invoke([
    {role: "system", content: "You are a helpful assistant, and you have access to a search tool. If the user asks for information, use the search tool to find relevant information and provide it in your response, do not use tools for simple conversation, memory-based questions, greetings, or personal context."},
    // {role: "human", content: state.prompt}
    // {role: "user", content: state.messages[0].content }
    ...state.messages
  ]);
 

  // return { aiMsg: response.content };
  return { messages: [response] };
}

const shouldContinue = async (state) => {
  const lastMessage = state.messages[state.messages.length - 1];
  if (lastMessage.tool_calls && lastMessage.tool_calls.length > 0) {
    return "tools";
  }
  return END;
}

const graph = new StateGraph(MessagesAnnotation)
.addNode("agent", callLLM)
.addNode("tools", toolNode)
.addEdge(START, "agent")
.addEdge("tools", "agent")
.addConditionalEdges("agent", shouldContinue)
// .addEdge("agent", END)
.compile({checkPointer: checkPointer});


app.post("/generate", async (req, res) => {
  const { prompt } = req.body;

  // const response = await graph.invoke({ prompt });
  const response = await graph.invoke({ messages:[
  { role: "user", 
    content: prompt
  }
  ]},
  {configurable:{threadId: "user1"}}
);

  // res.status(200).json({ response: response.aiMsg });
  res.status(200).json({ response: response.messages[response.messages.length - 1].content }); 
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