import  express from "express";
import { addTask, fetchTasks } from "../controllers/task.controller.js";
import { validateSession } from "../middlewares/session.middleware.js";

const router = express.Router();

//addTask
router.post('/add', validateSession, addTask)

//fetch tasks
router.get('/fetch', validateSession, fetchTasks)

export default router;