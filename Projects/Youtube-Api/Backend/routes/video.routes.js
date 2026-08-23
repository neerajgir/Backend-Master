import express from "express";
import { upload, updateVideo, deleteVideo, getAllVideos, getVideoById, getVideoByCategory, videoByTags, likesVideos, dislikesVideos } from "../controllers/video.controller.js";
import {checkAuth} from "../middleware/auth.middleware.js";

const router = express.Router();
// router.use(fileUpload({ useTempFiles: true }));

router.post("/upload", checkAuth, upload)
router.put("/upload/:id", checkAuth, updateVideo)
router.delete("/delete/:id" , checkAuth, deleteVideo)
router.get("/my-videos" , checkAuth, getAllVideos)
router.get("/:id" , checkAuth, getVideoById)
router.get("/category/:category" , getVideoByCategory)
router.get("/tags/:tag" , videoByTags)
router.post("/like" , checkAuth, likesVideos)
router.post("/dislike" , checkAuth, dislikesVideos)


export default router;