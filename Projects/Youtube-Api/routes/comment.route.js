import express from "express";
import { checkAuth } from "../middleware/auth.middleware";

const router = express.Router();

router.post("/new", checkAuth, newComment)
router.delete("/:commentId", checkAuth, commentId)
router.put("/:commentId", checkAuth, commentUpdateById)
router.get("/comment/:videoId", checkAuth, getCommentById)


export default router;