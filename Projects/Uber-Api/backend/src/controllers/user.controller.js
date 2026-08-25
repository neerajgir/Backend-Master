import { validationResult } from "express-validator";
import userModel from "../models/user.model.js";
import {createUser} from "../services/user.services.js";

export const registerUser = async (req, res) => {
    try {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors: errors.array()});
        }

        const {email, password, fullname} = req.body;
        const existingUser = await userModel.findOne({email});
        if(existingUser){
            return res.status(400).json({message: "User already exists"});
        }
        const hashedPassword = await userModel.hashPassword(password);

        const user = await createUser({
            firstname: fullname.firstname,
            lastname: fullname.lastname,
            email,
            password: hashedPassword
        });

        const token = user.generateAuthToken();
        res.status(201).json({message: "User created successfully", user, token});
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Internal server error"});
    }
}

export const loginUser = async (req, res) => {
    try {
        const error = validationResult(req);
        if(!error.isEmpty()) {
            return res.status(400).json({errors: error.array()});
        }

        const {email, password} = req.body;
        const user = await userModel.findOne({email}).select("+password");
        if(!user){
            return res.status(400).json({message: "Invalid email or password"});
        }

        const isMatched = await user.comparePassword(password);
        if(!isMatched){
            return res.status(400).json({message: "Invalid email or password"});
        }

        const token = user.generateAuthToken();
        res.cookie("token", token) 
        res.status(200).json({message: "Login successful", user, token});
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Internal server error"});
    }
}

export const getUserProfile = async (req, res) => {
    try{
        res.status(200).json({user: req.user});
    }catch (error) {
        console.log(error);
        res.status(500).json({message: "Internal server error"});
    }
}

export const logoutUser = async (req, res) => {
    try{
        res.clearCookie("token");
        res.status(200).json({message: "Logout successful"});
    }catch (error) {
        console.log(error);
        res.status(500).json({message: "Internal server error"});
    }
}