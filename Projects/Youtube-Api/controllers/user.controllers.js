import bcrypt from "bcrypt";
import mongoose from "mongoose";
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

