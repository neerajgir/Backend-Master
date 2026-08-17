import bcrypt from "bcryptjs";
import User from "../models/user.model.js"
import {generateToken} from "../utils/utils.js"

export const signup = async (req,res)=>{
    try {
        const { fullName, email, password } = req.body;
        
        // 1. Validate inputs exist
        if (!fullName || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        // 2. Validate password length before hashing
        if (password.length < 8) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 8 characters"
            });
        }

        // 3. Check for existing record
        const userExisting = await User.findOne({ email });
        if (userExisting) {
            return res.status(400).json({
                success: false,
                message: "User already exists"
            });
        }

        // 4. Securely generate the salt and hash sequentially
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Double check hashing succeeded before passing to model
        if (!hashedPassword) {
            throw new Error("Password hashing failed");
        }

        // 5. Create instance matching the schema structure exactly
        const newUser = new User({ 
            fullName: fullName.trim(), 
            email: email.toLowerCase().trim(), 
            password: hashedPassword 
        });

        // 6. Persist to database and issue token
        await newUser.save();
        generateToken(newUser._id, res);
        
        return res.status(201).json({
            _id: newUser._id,
            fullName: newUser.fullName,
            email: newUser.email,
            profilePic: newUser.profilePic
        });

    } catch (error) {
        return res.status(500).json({ 
            success: false, 
            message: "Internal server error",
            error: error.message 
        });
    }
}

export const login = async (req,res) => {
    try {
        const {email, password} = req.body;
        const user = await User.findOne({email});
        if(!user) {
            return res.status(400).json({message: "Invalid Credentials"})
        }

        const isPasswordCorrect  = await bcrypt.compare(password, user.password);
        if(!isPasswordCorrect){
            return res.status(400).json({message: "Invalid Password"})
        }

        generateToken(user._id, res);
        res.status(200).json({
            message: "User Login Successfully",
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic  
        })
    } catch (error) {
        return res.status(500).json({ 
            success: false, 
            message: "Internal server error",
            error: error.message 
        });
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