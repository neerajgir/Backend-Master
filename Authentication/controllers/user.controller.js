import { registerUser } from "../services/user.service.js";

export const signup = async (req,res)=>{
    try {
        const {username, password} = req.body;
        const user = await registerUser(username, password);
        res.status(201).json({
            success: true,
            message: "User register successfully!", 
            data: user
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error in signup!",
            error: error.message
        })
    }
}

export const login = ()=>{}

export const logout = ()=>{}