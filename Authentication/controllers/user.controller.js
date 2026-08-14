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

export const login = async (req,res)=>{
    try {
        const {username, password} = req.body;
        const user = await LoginUser(username, password);

        //save userid in session
        req.session.userId = user._id;
        res.status(200).json({
            success: true,
            message: "Login Successfully."
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error in login!",
            error: error.message
        })
    }

}

export const logout = ()=>{}