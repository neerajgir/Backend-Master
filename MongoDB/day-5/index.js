import express from 'express';
import connectDB from './config/db.js';
import userRoute from './routes/user.routes.js'

const app = express();
connectDB();
app.use(express.json());

const PORT = 3000;

app.get('/', (req,res)=>{
    res.send("Hello From Mongoose");
})

app.use("/api/", userRoute)


app.listen(PORT, ()=>{
    console.log(`Server is running on Port ${PORT}`)
})