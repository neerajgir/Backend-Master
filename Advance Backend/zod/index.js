import express from "express";


import { connectDB } from "./config/db.js";
import User from "./model/user.model.js"
import { signupSchema } from "./validations/user.validation.js";

const app = express();

const PORT = 3000

app.use(express.json())
connectDB();


//routes

app.post("/signup", async (req,res) => {
    try {
    const {data, success, error} = signupSchema.safeParse(req.body);
    if(!success) return res.status(403).json({message: "Invalid Inputs", error: error.format()})
    const {email, fullName, password} = data;
    if(!email || !fullName || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
    }

    const userExist = await User.findOne({email});
    if(userExist) {
        return res.status(400).json({ message: 'User already exists.' });
    }

    const newUser = new User({email, fullName, password});
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully!', userId: newUser._id });
    } catch (error) {
        console.error("Login Error details:", error);
        res.status(500).json({ message: 'Internal server error.' });
    }
})

app.post("/login", async (req,res) => {
    try {
        const {email, password} = req.body;
         if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required.' });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password.' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password.' });
        }

        res.status(200).json({ 
            message: 'Login successful!', 
            user: { id: user._id, email: user.email } 
        });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error.' });
    }    
})



app.listen(PORT, ()=>{
    console.log(`Sever is Up On Port ${PORT}`)
});