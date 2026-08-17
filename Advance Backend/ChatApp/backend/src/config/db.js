import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        const connect = await mongoose.connect(process.env.MONGO_URI);
        console.log(`DB Connected: ${connect.connection.host}`)
    } catch (error) {
        console.error("MongoDB connection failed", error);
    }
}