import express, { json } from "express";
import data from "./data/data.js"

const app = express();
const PORT = 8080;
app.use(express.json());

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

//router params
app.get("/api/v1/users/:id",(req,res)=>{
    const {id} = req.params
    const parseId = parseInt(id)

    const users = data.find((user)=>{
        return user.id == parseId
    })
    res.status(200).json({message: "User Found:", Data: users})
})

//post - send

app.post("/api/v1/users", (req,res)=>{
    // req.body and post
    const {username, password} = req.body;
    const userData = {
        id: data.length + 1,
        username, 
        password
    }
    data.push(userData);
    res.status(201).json({message: "User added successfully", data: userData})
})

// PUT AND PATCH - PUT UPDATE ALL FIELDS AND PATCH UPDATE SPECIFIC FIELD.

app.put("/api/v1/users/:id", (req,res)=>{
    const {body , params:{id}} = req;
    // const {id} = req.params;
    // const {name, email} = req.body;

    const parseId = parseInt(id)
    const userIndex = data.findIndex((user)=>{
       return user.id == parseId
    })

    if(userIndex === -1){
        res.status(404).send("User Not Found!")
    } 
    data[userIndex] = {
        id: parseId,
        ...body
    }

    res.status(200).json({message: "User Updated!", data:[userIndex]})
})


app.listen(PORT, (res,req)=> {
    console.log(`Server is running on port ${PORT}`)
})