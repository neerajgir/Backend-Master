import express from "express";
import dotenv from "dotenv"
dotenv.config();
import {connectDB} from "./config/db.config.js"

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 5000




connectDB();
app.listen(PORT, ()=>{
    console.log(`Server is up on Port ${PORT}`)
});