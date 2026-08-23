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
        const {title, description, category, tags} = req.body;
        const videoId = req.params.id

        let video = await Video.findById(videoId);
        if(!video) return res.status(404).json({message: "Video's not found."});

        if(video.user_id.toString() !== req.user._id.toString()){
            return res.status(403).json({message: "Unauthorize"}) 
        }

        if(req.files && req.files.thumbnail){
            await cloudinary.uploader.destroy(video.thumbnailId)
            const thumbnailUpload = await cloudinary.uploader.upload(req.files.thumbnail.tempFilePath, {folder: "thumbnails"})
            video.thumbnailUrl = thumbnailUpload.secure_url;
            video.thumbnailId = thumbnailUpload.public_id
        }

        video.title = title || video.title;
        video.description = description || video.description;
        video.category = category || video.category;
        video.tags = tags ? tags.split(",") : video.tags;

        await video.save();
        res.status(200).json({ message: "Video updated successfully", video });
    } catch (error) {
        console.error("Upload error:", error);
        res.status(500).json({ error: "Upload failed", details: error.message });
    }
}

//delete video
export const deleteVideo =  async (req,res)=>{
    try {
    const videoId = req.params.id;

    let video = await Video.findById(videoId);

    if(!video) return res.status(404).json({error:"Video not found!"})

    if(video.user_id.toString() !== req.user._id.toString())
      {
        return res.status(403).json({error:"Unauthorized"})
      }  

    // Delete from cloudinary
    await cloudinary.uploader.destroy(video.videoId , {resource_type:"video"});
    await cloudinary.uploader.destroy(video.thumbnailId);

    await Video.findByIdAndDelete(videoId);

    res.status(200).json({message:"video deleted successfully"})

  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: "Upload failed", details: error.message });
  }    
}

//get all videos
export const getAllVideos = async (req,res) => {
    try {
        const videos = await Video.find({user_id:req.user._id}).sort({createdAt:-1});
        res.status(200).json(videos)
    } catch (error) {
        console.error("Upload error:", error);
        res.status(500).json({ error: "Upload failed", details: error.message });
    }
}