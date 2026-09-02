import express from "express";
import dotenv from "dotenv";
dotenv.config();
import {GoogleGenAI} from "@google/genai"

const app = express();
const genAI = new GoogleGenAI({
    apiKey: process.env.GOOGLE_API_KEY,
});

const interaction = async () => {
  const response = await genAI.models.generateContent({
    model: "gemini-3.5-flash",
    contents: [{
      role: "user",
      parts: [{
        text: "Write a story about a magic backpack."
      }]
    }]
  });

  console.log(response.text);
}

interaction();

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});