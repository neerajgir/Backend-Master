import bcrypt from "bcrypt";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import cloudinary from "../config/cloudinary.js"

//sign-up
export const signup = async (req, res) => {
    try {
        // Validate file
        if (!req.files || !req.files.logoUrl) {
            return res.status(400).json({ error: "Logo image (field: logoUrl) is required" });
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const uploadImage = await cloudinary.uploader.upload(
            req.files.logoUrl.tempFilePath
        );

        const newUser = new User({
            _id: new mongoose.Types.ObjectId(),  // Fixed: added ()
            email: req.body.email,
            password: hashedPassword,
            channelName: req.body.channelName,
            phone: req.body.phone,
            logoUrl: uploadImage.secure_url,
            logoId: uploadImage.public_id
        });

        let user = await newUser.save();
        res.status(201).json({ user });
    } catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({ error: "Signup failed", details: error.message });
    }
};

//login

export const login = async (req,res) => {
    try {
        const existingUser = await User.findOne({email: req.body.email});
        if(!existingUser) return res.status(404).json({message: "User not found."});

        const isValid = await bcrypt.compare(req.body.password, existingUser.password);
        if(!isValid) return res.status(500).json({message: "Invalid Credentials"});

        const token = jwt.sign({
            _id: existingUser._id,
            channelName: existingUser.channelName,
            email: existingUser.email,
            phone: existingUser.phone,
            logoId: existingUser.logoId
        }, process.env.JWT_SECRET, {expiresIn: "7d"})

        res.status(200).json({
            message: "User login successfully",
            _id: existingUser._id,
            channelName: existingUser.channelName,
            email: existingUser.email,
            phone: existingUser.phone,
            logoId: existingUser.logoId,
            logoUrl:existingUser.logoUrl,
            token:token,
            subscribers:existingUser.subscribers,
            subscribedChannels:existingUser.subscribedChannels

        })

    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ error: "Login failed", details: error.message });
    }
}


//update-profile

export const updateProfile = async (req,res) => {
    try {
        
    } catch (error) {
        console.error("Update-profile error:", error);
        res.status(500).json({ error: "Update-profile failed", details: error.message });
    }
}

//subscribe

export const subscribe = async (req,res) => {
    try {
        
    } catch (error) {
        
    }
}