import { LoginUser, logoutUser, registerUser } from "../services/user.service.js";

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

export const logout = async(req,res)=>{
    try {
        // 1. Check if the session or userId exists
        if(!req.session || !req.session.userId){
            return res.status(400).json({
                success: false,
                message: "No active session found. You are already logged out."
            });
        }

        const userId = req.session.userId;
        // 2. Call the service layer logic
        await logoutUser(userId);

        // 3. Destroy the session on the server
        req.session.destroy((err) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: "Failed to clear session during logout.",
                    error: err.message
                });
            }

            // 4. Clear the session cookie from the client
            res.clearCookie('connect.sid'); 

            return res.status(200).json({
                success: true,
                message: "Logged out successfully."
            });
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error during logout process.",
            error: error.message
        });
    }
}