import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import userRoutes from "./routes/user.routes.js"
import connectDB from "./configs/db.config.js"

const app = express();

export const initDB = async () => {
    await connectDB();
};

//Middlewares
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors())
app.use(cookieParser())

app.get("/", (req,res)=>{
    res.send("hello")
})

//Routes

app.use("/api/v1/users", userRoutes)

export default app;