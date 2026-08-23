import express from "express";
import dotenv from "dotenv"
dotenv.config();
import fileupload from "express-fileupload";



import {connectDB} from "./config/db.config.js"
import userRoutes from "./routes/user.routes.js"


const PORT = process.env.PORT || 5000
const app = express();
app.use(express.json());
app.use(fileupload({
    useTempFiles: true,
    tempFileDir: '/tmp/'
}))

app.use("/api/v1/user", userRoutes)





connectDB();
app.listen(PORT, ()=>{
    console.log(`Server is up on Port ${PORT}`)
});