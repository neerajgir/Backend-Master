import captainModel from "../models/captain.model.js";
import jwt from "jsonwebtoken";

const authCaptain = async (req, res, next) => {
    try {
        const token = req.cookies.token || req.header("Authorization")?.replace("Bearer ", "");
        if(!token){
            return res.status(401).json({message: "Access denied. No token provided"});
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const captain = await captainModel.findById(decoded._id).select("-password");
        if(!captain){
            return res.status(404).json({message: "Captain not found"});
        }
        req.captain = captain;
        next();
    }catch (error) {
        console.log(error);
        res.status(500).json({message: "Internal server error"});
    }
}

export default authCaptain;
