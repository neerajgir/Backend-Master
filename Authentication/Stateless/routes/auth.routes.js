import express from "express";
import jwt from 'jsonwebtoken'
import User from '../models/user.model.js'
const router = express.Router();

//signup
router.post("/signup", async (req,res) => {
    try {
        const {username, password} = req.body;
        const existingUser = await User.findOne({username});

        if(existingUser) return res.status(400).json({
            success: false,
            message: "User Already Exist."
        })

        const newUser = new User({username, password});

        await newUser.save();

        res.status(201).json({
            success: true,
            message: "User register successfully.",
        })
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong",
            error: error.message
        })
    }

})

//login
router.post("/login", async (req,res) => {
    try {
        const {username, password} = req.body;

        const user = await User.findOne({username});
        if(!user) return res.status(401).json({success:false, message: "Invalid username or password"})
        const isMatch = await user.comparePassword(password)
    if(!isMatch) return res.status(400).json({success: false, message: "Invalid username or password"})
        const token = jwt.sign({id: user._id, username:user.username}, process.env.JWT_SECRET, {expiresIn: "1h"})

    res.status(200).json({
        success: true,
        message: "User login successfully.",
        token
    })
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong",
            error: error.message
        })
    }
})

export default router;