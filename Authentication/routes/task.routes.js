import  express from "express";

const router = express.Router();

//addTask
router.post('/', addTask)

//fetch tasks
router.get('/', fetchTasks)

export default router;