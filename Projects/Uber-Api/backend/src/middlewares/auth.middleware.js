import userModel from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const authUser = async (req, res, next) => {
    try {
    const token = req.cookies.token || req.header("Authorization")?.replace("Bearer ", "");
    if(!token){
        return res.status(401).json({message: "Access denied. No token provided"});        
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findById(decoded._id).select("-password");
    if(!user){
        return res.status(404).json({message: "User not found"});
    }
    req.user = user;
    next();
    }catch (error) {
        console.log(error);
        res.status(500).json({message: "Internal server error"});
    }
}

export default authUser;