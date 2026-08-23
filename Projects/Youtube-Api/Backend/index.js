import express from "express";
import dotenv from "dotenv"
dotenv.config();
import fileupload from "express-fileupload";
import cors from "cors";



import {connectDB} from "../Backend/config/db.config.js"
import userRoutes from "../Backend/routes/user.routes.js"
import videoRoutes from "../Backend/routes/video.routes.js"
import commentRoutes from "../Backend/routes/comment.route.js"
    

const PORT = process.env.PORT || 5000
const app = express();

// CLIENT_ORIGIN: comma-separated list of allowed origins (e.g. your Vercel URL).
// Unset → allow all (fine for local dev; set it in production).
const corsOptions = process.env.CLIENT_ORIGIN
    ? { origin: process.env.CLIENT_ORIGIN.split(",").map((o) => o.trim()) }
    : {};
app.use(cors(corsOptions));

app.use(express.json());
app.use(fileupload({
    useTempFiles: true,
    tempFileDir: '/tmp/'
}))

app.use("/api/v1/user", userRoutes)
app.use("/api/v1/video", videoRoutes)
app.use("/api/v1/comment", commentRoutes)





connectDB();
app.listen(PORT, ()=>{
    console.log(`Server is up on Port ${PORT}`)
});