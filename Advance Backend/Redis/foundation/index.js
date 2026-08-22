import express from "express"
import mongoose from "mongoose"
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

// site banner with redis
const BANNER_KEY = "app:banner";

app.post("/banner", async (req,res) => {
    await client.set(BANNER_KEY, req.body.message || "Welcome to Redis");
    res.json({success: true}) 
})

app.get("/banner", async(req,res)=>{
    const message = await client.get(BANNER_KEY);
    res.json({message})
})

app.delete("/banner", async (req,res) => {
    await client.del(BANNER_KEY);
    res.json({success: true});
})

app.get("/banner/exists", async (req , res) => {
    const exists = await client.exists(BANNER_KEY)
    res.json({exists: Boolean(exists)})    
})


connectDB().then(() => {
    console.log("MongoDB connected successfully")
}).catch(err => {
    console.error("MongoDB connection failed", err)
})

app.listen(3000, ()=>{
    console.log('Server is up on 3000')
})