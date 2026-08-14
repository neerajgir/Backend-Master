import  express from "express";
import { addTask, fetchTasks, updateTask, deleteTask } from "../controllers/task.controller.js";
import { validateSession } from "../middlewares/session.middleware.js";

const router = express.Router();

//addTask
router.post('/add', validateSession, addTask)

//fetch tasks
router.get('/fetch', validateSession, fetchTasks)

//update task
router.put('/update/:taskId', validateSession, updateTask)

//delete task
router.delete('delete/:taskId', validateSession, deleteTask)

export default router;