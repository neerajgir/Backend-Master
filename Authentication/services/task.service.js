import { addTask, fetchTasks } from "../controllers/task.controller.js";

export const createTask = async (userId, title, description)=>{
    const task = new addTask({userId, title, description});

    return await task.save();
}

export const getTask = async (userId) => {
    return await fetchTasks.find({userId}).sort({createdAt: -1})
}