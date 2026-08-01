import express from "express";
import data from "./data/data.js"
const app = express();
const PORT = 8080;


// Get -Request
app.get("/", (req,res)=>{
    res.status(200).send("Hello World");
})

// industry standard
app.get("/api/v1/users", (req,res)=>{
    //req.params
   const {name} = req.params

   if(name){
    const user = data.filter((user)=>{
        return user.name == name
    })
    res.status(200).send(user)
   }
   res.status(200).send(data)
})







app.listen(PORT, (res,req)=> {
    console.log(`Server is running on port ${PORT}`)
})