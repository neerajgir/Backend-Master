import express from "express";
import {newComment, commentId, commentUpdateById, getCommentById} from "../controllers/comment.controller.js"
import { checkAuth } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/new", checkAuth, newComment)
router.delete("/:commentId", checkAuth, commentId)
router.put("/:commentId", checkAuth, commentUpdateById)
router.get("/comment/:videoId", checkAuth, getCommentById)


export default router;