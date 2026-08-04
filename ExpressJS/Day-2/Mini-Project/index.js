import express from "express";
import publicRouter from "./routes/public.routes.js";

const app = express();

// Inbuilt Middleware
app.use(express.json())


// Middleware to routes
app.use("/public", publicRouter)




const PORT = 3000;

app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`)
})