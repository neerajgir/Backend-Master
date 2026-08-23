import express from "express";
import { upload, updateVideo } from "../controllers/video.controller.js";
import {checkAuth} from "../middleware/auth.middleware.js";

const router = express.Router();
// router.use(fileUpload({ useTempFiles: true }));

router.post("/upload", checkAuth, upload)
router.put("/upload/:id", checkAuth, updateVideo)

export default router;