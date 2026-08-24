import dotenv from "dotenv";
dotenv.config()

import http from "http";
import app, { initDB } from "./app.js";

const server = http.createServer(app);
const PORT = process.env.PORT

// Initialize DB connection after env vars are loaded
await initDB();

server.listen(PORT, ()=>{
    console.log(`Server is running on Port ${PORT}`)
})