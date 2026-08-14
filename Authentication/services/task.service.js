import { addTask } from "../controllers/task.controller.js";

export const createTask = async (userId, title, description)=>{
    const task = new addTask({userId, title, description});

    return await task.save();
}