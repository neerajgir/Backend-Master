import express from "express"
import client from "../practice/client.js"
import axios from "axios"

const app = express()

app.get("/", async (req,res)=>{
    const cachedData = await client.get("todoList");

    if(cachedData){
        return res.json(JSON.parse(cachedData))
    }
    const {data} = await axios.get("https://jsonplaceholder.typicode.com/todos")
    await client.set("todoList", JSON.stringify(data));
    await client.expire("todoList", 30)
    res.json(data)
})

app.listen(3000, ()=>{
    console.log("server is up on 3000")
})


