import mongoose from "mongoose";

import User from "../models/user.model.js";
import Video from "../models/video.model.js";
import cloudinary from "../config/cloudinary.js";

//upload video
export const upload = async (req,res)=>{
    try {
        const {title, description, category, tags} = req.body;
        if(!req.files || !req.files.video || !req.files.thumbnail){
            return res.status(400).json({message: "Video and thumbnail are required"})
        }
        const videoUpload = await cloudinary.uploader.upload(req.files.video.tempFilePath, {resource_type: "video", folder: "videos"})
        const thumbnailUpload = await cloudinary.uploader.upload(req.files.thumbnail.tempFilePath, {folder: "thumbnails"})

         const newVideo = new Video({
            _id: new mongoose.Types.ObjectId(),
            title,
            description,
            user_id: req.user._id,
            videoUrl: videoUpload.secure_url,
            videoId: videoUpload.public_id,
            thumbnailUrl: thumbnailUpload.secure_url,
            thumbnailId: thumbnailUpload.public_id,
            category,
            tags: tags ? tags.split(",") : [],
        });
        await newVideo.save();

        res.status(201).json({
            message: "Video Uploaded Successfully", 
            video: newVideo
        })
    } catch (error) {
        console.error("Upload error:", error);
        res.status(500).json({ error: "Upload failed", details: error.message });
    }
}

//update video data
export const updateVideo = async (req,res)=>{
    try {
        
    } catch (error) {
        console.error("Upload error:", error);
        res.status(500).json({ error: "Upload failed", details: error.message });
    }
}