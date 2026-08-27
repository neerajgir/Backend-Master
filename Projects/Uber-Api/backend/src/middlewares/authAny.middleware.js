import userModel from "../models/user.model.js";
import captainModel from "../models/captain.model.js";
import jwt from "jsonwebtoken";

const authAny = async (req, res, next) => {
    try {
        const token = req.cookies.token || req.header("Authorization")?.replace("Bearer ", "");
        if(!token){
            return res.status(401).json({message: "Access denied. No token provided"});
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decoded._id);
        if(user){
            req.user = user;
            return next();
        }
        const captain = await captainModel.findById(decoded._id);
        if(captain){
            req.captain = captain;
            return next();
        }
        return res.status(404).json({message: "Account not found"});
    }catch (error) {
        console.log(error);
        res.status(500).json({message: "Internal server error"});
    }
}

export default authAny;
