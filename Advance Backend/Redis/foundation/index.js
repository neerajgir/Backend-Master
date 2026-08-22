import express from "express"
import mongoose from "mongoose"
import {Job, Queue, Worker} from "bullmq";
import client from "./config/client.js"
import connectDB from "./config/db.js"

const app = express();
app.use(express.json());


app.get("/redis", async (req,res) => {
    const reply = await client.ping();
    res.json({Message: `Redis replied with ${reply}`})    
})

app.get("/mongo", async (req,res) => {
    const connect = await mongoose.connection.readyState;
    res.json({message: `Mongo connected: ${connect}`});       
})





connectDB().then(() => {
    console.log("MongoDB connected successfully")
}).catch(err => {
    console.error("MongoDB connection failed", err)
})

app.listen(3000, ()=>{
    console.log('Server is up on 3000')
})