import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
    } catch (error) {
        console.log(error.message)
        throw new Error("Something Went Wrong in DB", error);
    }
}