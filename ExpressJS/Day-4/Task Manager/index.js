import express from "express";
import session from "express-session";
import cookieParser from "cookie-parser";
import authRoute from "./src/routes/auth.route.js"
import taskRoute from "./src/routes/task.route.js"
const app = express();
const PORT = 3000;

// global middleware
app.use(express.json());
app.use(session({
    secret: "taskmanager",
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure:false,
        maxAge: 1000*60*60*24
    }  
}))

app.use(cookieParser())

// routes
app.get("/",(req,res)=>{
    res.send("Hello World")
})

app.use('/auth', authRoute)
app.use("/task", taskRoute)

app.listen(PORT, ()=>{
    console.log(`Server is running on Port ${PORT}`)
})