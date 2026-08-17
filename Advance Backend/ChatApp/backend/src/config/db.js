// src/config/db.js
import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        // Fallback to an empty string avoids the "undefined" crash
        const uri = process.env.MONGO_URI || ""; 
        
        if (!uri) {
            throw new Error("MONGO_URI is missing from your environment variables.");
        }

        const connect = await mongoose.connect(uri);
        console.log(`DB Connected: ${connect.connection.host}`);
    } catch (error) {
        console.error("MongoDB connection failed:", error.message);
    }
};
