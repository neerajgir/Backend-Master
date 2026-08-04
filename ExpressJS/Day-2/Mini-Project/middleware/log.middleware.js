import { error } from "console";
import fs from "fs"
import path from "path";
import { fileURLToPath } from "url";

// Handles ES modules __dirname and __filename
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware to log all request

const logMiddleware = (req,res, next)=>{
    const log = `[${new Date().toString()}] ${req.method} ${req.url}\n`
    const logFile = path.join(__dirname, "../logs/request.log");

    fs.appendFile(logFile, log, (error)=>{
        if(error){
            console.log("failed log request", error)
        }
    });
    next();
}

export default logMiddleware

