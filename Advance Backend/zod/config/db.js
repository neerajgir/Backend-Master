import mongoose from "mongoose";

export const connectDB = async ()=>{
    try {
        const uri = "mongodb+srv://neeraj:neeraj@cluster0.vk19rqu.mongodb.net/zod"
    if(!uri) {
        throw new Error("MONGO_URI is missing from your environment variables.");
    }
    const connect = await mongoose.connect(uri)
    console.log(`DBConnect: ${connect.connection.host}`)
    } catch (error) {
        console.error("MongoDB connection failed:", error.message);
    }

}