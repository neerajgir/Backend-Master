import express from "express";
import { upload, updateVideo, deleteVideo, getAllVideos } from "../controllers/video.controller.js";
import {checkAuth} from "../middleware/auth.middleware.js";

const router = express.Router();
// router.use(fileUpload({ useTempFiles: true }));

router.post("/upload", checkAuth, upload)
router.put("/upload/:id", checkAuth, updateVideo)
router.delete("/delete/:id" , checkAuth, deleteVideo)
router.get("/my-videos" , checkAuth, getAllVideos)

export default router;