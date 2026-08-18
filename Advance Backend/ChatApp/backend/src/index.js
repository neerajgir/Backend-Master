import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cookieParser from "cookie-parser";
import cors from "cors";

import { connectDB } from "./config/db.js";
import authRoute from "./routes/auth.routes.js"
import messageRoute from "./routes/message.routes.js"


const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true
}));

// routes
app.use("/api/auth", authRoute);
app.use("/api/messages", messageRoute)

 
app.listen(PORT, ()=>{
    console.log(`Server is up on Port ${PORT}`)
    connectDB();
});