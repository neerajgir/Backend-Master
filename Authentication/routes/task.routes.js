import  express from "express";
import { addTask, fetchTasks } from "../controllers/task.controller.js";
import { validateSession } from "../middlewares/session.middleware.js";

const router = express.Router();

//addTask
router.post('/', validateSession, addTask)

//fetch tasks
router.get('/', validateSession, fetchTasks)

export default router;