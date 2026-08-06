import cookieParser from "cookie-parser";
import express from "express";
import session from "express-session";

const app = express();
const PORT = 3000;

app.use(session({
    secret: "OT/8/pn7PakW4mKEVeQIuDtV7VhvKxnp",
    saveUninitialized: false,
    resave: false,
    cookie: {maxAge: 1000*60*60*24}
}));

app.use(cookieParser("fmJ4Ahni7oXThnfWZ41khtUCPTnyPHIO9DRMZ2SYIBg="))

app.get("/", (req,res)=>{
    console.log(req.session);
    console.log(req.session.id);
    res.send("Hello World")
})
// session create
app.get("/login", (req,res)=>{
    req.session.user = {
        name: "Neeraj",
        email: "neeraj@example.com",
        age: 25
    }
    res.send("User LoggedIn")
})

// delete session
app.get("/logout", (req,res)=>{
    req.session.destroy();
    res.send("User Logout");
})

app.listen(PORT, ()=>{
    console.log(`Server is running on Port ${PORT}`)
})
