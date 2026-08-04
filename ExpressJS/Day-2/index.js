import express from 'express';
import userRouter from './routers/user.routes.js';

const app = express();

app.use("/api/v1/users", userRouter)



const PORT = 8080;
app.listen(PORT, ()=>{
    console.log(`Server is running on ${PORT}`)
});