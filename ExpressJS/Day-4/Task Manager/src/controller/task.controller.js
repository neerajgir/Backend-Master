import {readTask, writeTask} from '../utils/file.utils.js'

const getAllTask = (req,res)=>{
    try {
        // 1. Get the array data from your file helper
        const tasks = readTask(); 
        
        // 2. Explicitly send the data back to the client as JSON
        return res.status(200).json(tasks);
        
    } catch (error) {
        console.error("Error in getAllTask controller:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

const createTask = (req,res)=>{
    try {
        const loggedInUser = req.session.user.username; 
        const { title, description } = req.body;

        if (!title) {
            return res.status(400).json({ error: "Task title is required" });
        }
        
        // 1. Pull existing tasks array from your file helper
        const tasks = readTask(); 
        
        // 2. Build out the new task entity bound to the logged-in user
        const newTask = {
            id: Date.now(),
            title,
            description: description || "",
            createdBy: loggedInUser 
        };

        // 3. Append and save back to disk
        tasks.push(newTask);
        writeTask(tasks); 
        
        return res.status(201).json({ message: "Task created successfully!", newTask });
    } catch (error) {
        console.error("Error in createTask:", error);
        return res.status(500).json({ error: "Could not create task" });
    }
}

const updateTask = (req,res)=>{
    try{
    const id = Number(req.params.id)
    const { title: newTitle, description: newDescription } = req.body;
    const {username} = req.session?.user?.username
    if (!username) {
        return res.status(401).json({ message: "Unauthorized: No session found" });
    }

    const allTask = readTask();
    const targetTask = allTask.find((task) => task && task.id === id && task.createdBy === username);

    if(!targetTask){
        return res.status(404).json({message: "Task not found or unauthorized"})
    }

    if(newTitle !== undefined && newTitle !== null){
        targetTask.title = newTitle
    }
    if(newDescription !== undefined && newDescription !== null){
        targetTask.description = newDescription
    }

    writeTask(allTask)
    return res.status(200).json({message: "Task updated successfully", task: targetTask})
} catch (error) {
    console.error("Error in updateTask:", error);
    return res.status(500).json({ error: "Internal Server Error" });
}
}

const deleteTask = (req,res)=>{
    try {
        const id = Number(req.params.id)
        const {username} = req.session?.user?.username
        if (!username) {
            return res.status(401).json({ message: "Unauthorized: No session found" });
        }
        const allTasks = readTask(); 
        const taskExists = allTasks.some(task => task && task.id === id && task.createdBy === username);
        if (!taskExists) {
            return res.status(404).json({ message: "Task not found or unauthorized" });
        }

        const filteredTasks = allTasks.filter(task => !task || task.id !== id);
        writeTask(filteredTasks)

        return res.status(200).json({ message: "Task deleted successfully" });
    } catch (error) {
        console.error("Error in deleteTask:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

export {getAllTask, createTask, updateTask, deleteTask}