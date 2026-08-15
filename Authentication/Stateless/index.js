import express from 'express';
import dotenv from 'dotenv'
dotenv.config();

import connectDB from './config/db.js';
import authRoutes from './routes/auth.routes.js'

const app = express();
app.use(express.json())
const PORT = process.env.PORT

//routes
app.use("/auth", authRoutes)


connectDB().then(()=>{
    app.listen(PORT, ()=>{
        console.log(`Server is running on Port ${PORT}`)
    })
}).catch((error)=>{
    console.log("error connecting to db: ", error)
})
