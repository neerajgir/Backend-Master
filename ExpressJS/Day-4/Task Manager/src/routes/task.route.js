import { Router } from "express";
import { createTask, deleteTask, getAllTask, updateTask } from "../controller/task.controller.js";
import authMiddleware from "../../middlewares/auth.middleware.js";

const router = Router();

router.get("/", authMiddleware, getAllTask);
router.post("/", authMiddleware, createTask);
router.put("/:id", authMiddleware, updateTask);
router.delete("/:id", authMiddleware, deleteTask);

export default router;