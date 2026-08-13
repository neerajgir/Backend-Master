import mongoose from "mongoose";

const connectDB = async ()=>{
    try {
        const connection = await mongoose.connect("mongodb+srv://neeraj:neeraj@cluster0.vk19rqu.mongodb.net/UltimateBackend");
        console.log(`DB is connected: ${connection.connection.host}`);
    } catch (error) {
        console.log(`Error:`, error.message)
        process.exit(1)
    }
}

export default connectDB;