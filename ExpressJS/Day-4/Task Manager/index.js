import express from "express";
import session from "express-session";

const app = express();
const PORT = 3000;


app.use(express.json());


// routes
app.get("/",(req,res)=>{
    res.send("Hello World")
})

app.listen(PORT, ()=>{
    console.log(`Server is running on Port ${PORT}`)
})