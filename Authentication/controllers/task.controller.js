import { createTask, getTask } from "../services/task.service.js";


export const addTask = async (req,res)=>{
    try {
        const {title, description} = req.body;
        if (!req.session || !req.session.userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized. Please log in first."
            });
        }

        const task = await createTask(req.session.userId, title, description);
        res.status(201).json({
            success: true,
            message: "Task Created Successfully.",
            data: task
        })
    } catch (error) {
        res.status(500).json({
            success:false,
            message: "Error in created task",
            error: error.message
        })
    }
}

export const fetchTasks = async (req,res)=>{
    try {
        if (!req.session || !req.session.userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized. Please log in first."
            });
        }
        const tasks = await getTask(req.session.userId);
        res.status(200).json({
            success: true,
            message: "Task Fetched Successfully",
            data: tasks
        })
    } catch (error) {
        res.status(500).json({
            success:false,
            message: "Error in Fetching task",
            error: error.message
        })
    }
}