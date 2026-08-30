import express from "express";
import dotenv from "dotenv";
dotenv.config()
import { connectDB } from "./configs/db.js"
import User from "./models/user.model.js"
import client from "./configs/client.js"

const PORT = process.env.PORT || 5000

const app = express();
app.use(express.json());



// app.get("/", (req,res)=>{
//   return res.status(200).json({message: "hello from redis"}) 
// })

app.post("/create", async (req,res) => {
    const {name, email, password} =req.body;
    await client.del("user:all")
    const user = await User.create({name, email, password})
    return res.status(200).json({user})
})

app.get("/redis-get", async (req,res) => {
    const cached = await client.get("user:all")
    if(cached){
        const user = JSON.parse(cached)
        return res.json(user)
    }

    const user = await User.find({})
    await client.set("user:all", JSON.stringify(user))
    return res.json({user})
})

connectDB();
app.listen(PORT, ()=>{
    console.log(`Server is up ${PORT}`)
});
