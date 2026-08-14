import { createTask, getTask, updateTaskById, deleteTaskById  } from "../services/task.service.js";


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

// Update an existing task
export const updateTask = async (req, res) => {
    try {
        const { taskId } = req.params; // Extracts ID from URL, e.g., /api/task/update/12345
        const updateData = req.body;   // Extracts new values (title, description, etc.)

        const updatedTask = await updateTaskById(taskId, req.session.userId, updateData);

        if (!updatedTask) {
            return res.status(404).json({
                success: false,
                message: "Task not found or unauthorized to update."
            });
        }

        return res.status(200).json({
            success: true,
            message: "Task Updated Successfully.",
            data: updatedTask
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error updating task.",
            error: error.message
        });
    }
};


// Delete a task
export const deleteTask = async (req, res) => {
    try {
        const { taskId } = req.params;

        const deletedTask = await deleteTaskById(taskId, req.session.userId);

        if (!deletedTask) {
            return res.status(404).json({
                success: false,
                message: "Task not found or unauthorized to delete."
            });
        }

        return res.status(200).json({
            success: true,
            message: "Task Deleted Successfully."
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error deleting task.",
            error: error.message
        });
    }
};