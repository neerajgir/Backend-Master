import bcryptjs from "bcryptjs";
import User from "../models/user.model.js"
export const signup = async (req,res)=>{
    try {
        const {fullName, email, password} = req.body;
        if(!fullName || !email || !password){
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }

        if(password.length < 8){
            return res.status(400).json({
                success: false,
                message: "Password must be 8 characters"
            })
        }

        const userExisting = await User.findOne({email});
        if(userExisting){
            return res.status(400).json({
                success: false,
                message: "User Already Exist"
            })
        }

        const salt =  await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({fullName, email, password: hashedPassword});

        if(newUser){
            generateToken(newUser._id, res);
            await newUser.save();
            res.status(200).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic
            })
        }

    } catch (error) {
        
    }
}

export const login = async (req,res) => {
    try {
        
    } catch (error) {
        
    }
}

export const logout = async (req,res) => {
    try {
        
    } catch (error) {
        
    }
}

export const updateProfile = async (req,res) => {
    try {
        
    } catch (error) {
        
    }
}