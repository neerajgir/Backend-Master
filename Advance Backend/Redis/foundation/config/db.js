import mongoose from "mongoose";

const connectDB = async () => {
    try {
        await mongoose.connect("mongodb+srv://neeraj:neeraj@cluster0.vk19rqu.mongodb.net/Redis");
        console.log("DB connected")
    } catch (error) {
        console.log("Database connection failed", error.message)
        throw error;
    }
}

export default connectDB;

