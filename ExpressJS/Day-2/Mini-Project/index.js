import express from "express";
import publicRouter from "./routes/public.routes.js";
import privateRouter from "./routes/private.routes.js";
import fs, { mkdirSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import logMiddleware from "./middleware/log.middleware.js";

const app = express();


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


if(!fs.existsSync(path.join(__dirname, "logs"))){
    fs.mkdirSync(path.join(__dirname, "logs"))
}


//* Inbuilt Middleware
app.use(express.json())

//! Global custom Middleware
app.use(logMiddleware)


//? Middleware to routes
app.use("/public", publicRouter)
app.use("/private", privateRouter)




const PORT = 3000;

app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`)
})