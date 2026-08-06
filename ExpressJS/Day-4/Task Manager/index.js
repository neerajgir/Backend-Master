import express from "express";
import session from "express-session";

import authRoute from "./src/routes/auth.route.js"
const app = express();
const PORT = 3000;


app.use(express.json());


// routes
app.get("/",(req,res)=>{
    res.send("Hello World")
})

app.use('/auth', authRoute)

app.listen(PORT, ()=>{
    console.log(`Server is running on Port ${PORT}`)
})