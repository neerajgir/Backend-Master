import Task from "../models/tasks.model.js";

export const createTask = async (userId, title, description)=>{
    const task = new Task({userId, title, description});

    return await task.save();
}

export const getTask = async (userId) => {
    return await Task.find({userId}).sort({createdAt: -1})
}