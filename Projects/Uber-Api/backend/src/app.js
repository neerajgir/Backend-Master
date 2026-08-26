import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import userRoutes from "./routes/user.routes.js"
import captainRoutes from "./routes/captain.routes.js"
import mapsRoutes from "./routes/maps.routes.js"
import connectDB from "./configs/db.config.js"

const app = express();

export const initDB = async () => {
    await connectDB();
};

//Middlewares
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
}))
app.use(cookieParser())

app.get("/", (req,res)=>{
    res.send("hello")
})

//Routes

app.use("/api/v1/users", userRoutes)
app.use("/api/v1/captains", captainRoutes)
app.use("/api/v1/maps", mapsRoutes)

export default app;