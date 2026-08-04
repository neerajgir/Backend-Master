import express from "express";
import publicRouter from "./routes/public.routes.js";
import privateRouter from "./routes/private.routes.js";

const app = express();

// Inbuilt Middleware
app.use(express.json())


// Middleware to routes
app.use("/public", publicRouter)
app.use("/private", privateRouter)




const PORT = 3000;

app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`)
})