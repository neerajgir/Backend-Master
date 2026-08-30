import express from "express";
import dotenv from "dotenv";
dotenv.config()

const PORT = process.env.PORT || 5000

const app = express();
app.use(express.json());



app.get('/', (res,req)=>{
  res.send('hello from redis')  
})


app.listen(PORT, ()=>{
    console.log(`Server is up ${PORT}`)
});
