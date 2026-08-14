import express from 'express';
import dotenv from 'dotenv';
import connectDB from './configs/db.js'
import session from 'express-session';


const app = express();
dotenv.config()
app.use(express.json());
const PORT = process.env.PORT;


//session config
app.use(
    session({
        secret:process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
        cookie: {maxAge: 600000} //10 Minutes 
    })
)
app.get('/', (req,res)=>{
    res.send("Hello Auth")
})


connectDB().then(()=>{
    app.listen(PORT, ()=>{
        console.log(`Server is running on Port ${PORT}`)
    })
}).catch((error)=>{
    console.log("error connecting to db: ", error)
})
