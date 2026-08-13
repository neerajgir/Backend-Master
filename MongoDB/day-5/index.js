import express from 'express';
import connectDB from './config/db.js';

const app = express();
connectDB();
const PORT = 3000;

app.get('/', (req,res)=>{
    res.send("Hello From Mongoose");
})



app.listen(PORT, ()=>{
    console.log(`Server is running on Port ${PORT}`)
})