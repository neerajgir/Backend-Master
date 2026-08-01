import express from "express";
import {data} from "./data/data.js"
const app = express();
const PORT = 8080;


// Get -Request
app.get("/", (req,res)=>{
    res.status(200).send("Hello World");
})

// industry standard
app.get("/api/v1/users", (req,res)=>{
    res.status(200).json({
        id: 1,
        name: "Neeraj Gir",
        displayName: "neearjgir"
    });
})







app.listen(PORT, (res,req)=> {
    console.log(`Server is running on port ${PORT}`)
})