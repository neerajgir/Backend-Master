import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cookieParser from "cookie-parser";
import cors from "cors";
import http from "http";

import { connectDB } from "./config/db.js";
import authRoute from "./routes/auth.routes.js"
import messageRoute from "./routes/message.routes.js"
import { initSocketServer } from "./lib/socket.js";


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

const server = http.createServer(app);
initSocketServer(server);

server.listen(PORT, ()=>{
    console.log(`Server is up on Port ${PORT}`)
    connectDB();
});