import express from "express";
import dotenv from "dotenv";
dotenv.config()


const app = express();
const PORT = process.env.PORT

app.get("/", (req,res)=>{
    res.send("hello")
})


app.listen(PORT, ()=>{
    console.log(`Server is running on Port ${PORT}`)
})