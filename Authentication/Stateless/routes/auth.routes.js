import express from "express";
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


export default router;