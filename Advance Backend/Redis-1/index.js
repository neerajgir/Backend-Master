import express from "express";
import dotenv from "dotenv";
dotenv.config()
import { connectDB } from "./configs/db.js"

const PORT = process.env.PORT || 5000

const app = express();
app.use(express.json());



app.get('/', (res,req)=>{
  res.send('hello from redis')  
})


connectDB();
app.listen(PORT, ()=>{
    console.log(`Server is up ${PORT}`)
});
