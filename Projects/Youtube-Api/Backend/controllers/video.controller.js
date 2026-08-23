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
        console.error("Update error:", error);
        res.status(500).json({ error: "Update failed", details: error.message });
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
    console.error("Delete error:", error);
    res.status(500).json({ error: "Delete failed", details: error.message });
  }    
}

//get all videos
export const getAllVideos = async (req,res) => {
    try {
        const videos = await Video.find({user_id:req.user._id}).sort({createdAt:-1});
        res.status(200).json(videos)
    } catch (error) {
        console.error("Get all videos error:", error);
        res.status(500).json({ error: "Get all videos failed", details: error.message });
    }
}

//get videos by id 
export const getVideoById = async (req,res) => {
    try {
        const videoId = req.params.id;
        const userId = req.user._id;

    // Use findByIdAndUpdate to add the user ID to the viewedBy array if not already present
        const video = await Video.findByIdAndUpdate(
        videoId,
        {
        $addToSet: { viewedBy: userId },  // Add user ID to viewedBy array, avoiding duplicates
        },
        { new: true }  // Return the updated video document
    );

        if (!video) return res.status(404).json({ error: "Video not found" });

        res.status(200).json(video);
    } catch (error) {
        console.error("videos by id  error:", error);
        res.status(500).json({ error: "videos by id  failed", details: error.message });
    }
}

// Get video by category
export const getVideoByCategory = async (req,res) => {
    try {
        const videos = await Video.find({ category: req.params.category }).sort({ createdAt: -1 });
        res.status(200).json(videos);
  } catch (error) {
        console.error("Category error:", error);
        res.status(500).json({ error: "Category failed", details: error.message });
  }
}
// video by tags
export const videoByTags = async (req,res) => {
    try {
        const tag = req.params.tag;
        const videos = await Video.find({ tags: tag }).sort({ createdAt: -1 });
        res.status(200).json(videos);
  } catch (error) {
    console.error("Fetch Tags error:", error);
    res.status(500).json({ error: "Fetch Tags failed", details: error.message });
  }
}
//video likes
export const likesVideos = async (req,res) => {
    try {
        const {videoId} = req.body;

        const video = await Video.findById(videoId);
        if(!video) return res.status(404).json({ error: "Video not found" });

        const uid = req.user._id.toString();
        const alreadyLiked = video.likedBy.some((id) => id.toString() === uid);

        if(alreadyLiked){
            // toggle off
            video.likedBy = video.likedBy.filter((id) => id.toString() !== uid);
        } else {
            video.likedBy.push(req.user._id);
            // liking removes a previous dislike
            video.disLikedBy = video.disLikedBy.filter((id) => id.toString() !== uid);
        }

        await video.save();

        res.status(200).json({message: alreadyLiked ? "Like removed" : "Liked the video", video})
    } catch (error) {
        console.error("Fetch Likes error:", error);
        res.status(500).json({ error: "Fetch Likes failed", details: error.message })
    }
}
// videos dislikes

export const dislikesVideos = async (req,res)=>{
    try {
        const { videoId } = req.body;

        const video = await Video.findById(videoId);
        if(!video) return res.status(404).json({ error: "Video not found" });

        const uid = req.user._id.toString();
        const alreadyDisliked = video.disLikedBy.some((id) => id.toString() === uid);

        if(alreadyDisliked){
            // toggle off
            video.disLikedBy = video.disLikedBy.filter((id) => id.toString() !== uid);
        } else {
            video.disLikedBy.push(req.user._id);
            // disliking removes a previous like
            video.likedBy = video.likedBy.filter((id) => id.toString() !== uid);
        }

        await video.save();

        res.status(200).json({
            message: alreadyDisliked ? "Dislike removed" : "Disliked the video",
            video,
        });
    } catch (error) {
        console.error("Fetch Dislikes error:", error);
        res.status(500).json({ error: "Fetch Dislikes failed", details: error.message })
    }
}