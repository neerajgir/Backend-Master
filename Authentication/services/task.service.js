import Task from "../models/tasks.model.js";

export const createTask = async (userId, title, description)=>{
    const task = new Task({userId, title, description});

    return await task.save();
}

export const getTask = async (userId) => {
    return await Task.find({userId}).sort({createdAt: -1})
}

export const updateTaskById = async (taskId, userId, updateData) => {
    return await Task.findOneAndUpdate(
        { _id: taskId, userId: userId }, // Security: prevents users from editing others' tasks
        { $set: updateData },
        { new: true, runValidators: true } // Returns the updated document
    );
};

export const deleteTaskById = async (taskId, userId) => {
    return await Task.findOneAndDelete({ _id: taskId, userId: userId });
};