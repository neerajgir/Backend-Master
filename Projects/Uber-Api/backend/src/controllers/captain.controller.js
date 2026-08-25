import { validationResult } from "express-validator";
import captainModel from "../models/captain.model.js";
import { createCaptain } from "../services/captain.services.js";

export const registerCaptain = async (req, res) => {
    try {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors: errors.array()});
        }

        const {email, password, fullname, vehicles} = req.body;
        const existingCaptain = await captainModel.findOne({email});
        if(existingCaptain){
            return res.status(400).json({message: "Captain already exists"});
        }
        const hashedPassword = await captainModel.hashPassword(password);

        const captain = await createCaptain({
            firstname: fullname.firstname,
            lastname: fullname.lastname,
            email,
            password: hashedPassword,
            color: vehicles.color,
            plate: vehicles.plate,
            capacity: vehicles.capacity,
            vehicleType: vehicles.vehicleType
        });

        const token = captain.generateAuthToken();
        res.status(201).json({message: "Captain created successfully", captain, token});
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Internal server error"});
    }
}

export const loginCaptain = async (req, res) => {
    try {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }

        const {email, password} = req.body;
        const captain = await captainModel.findOne({email}).select("+password");
        if(!captain){
            return res.status(400).json({message: "Invalid email or password"});
        }

        const isMatched = await captain.comparePassword(password);
        if(!isMatched){
            return res.status(400).json({message: "Invalid email or password"});
        }

        const token = captain.generateAuthToken();
        res.cookie("token", token);
        res.status(200).json({message: "Login successful", captain, token});
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Internal server error"});
    }
}

export const getCaptainProfile = async (req, res) => {
    try{
        res.status(200).json({captain: req.captain});
    }catch (error) {
        console.log(error);
        res.status(500).json({message: "Internal server error"});
    }
}

export const logoutCaptain = async (req, res) => {
    try{
        res.clearCookie("token");
        res.status(200).json({message: "Logout successful"});
    }catch (error) {
        console.log(error);
        res.status(500).json({message: "Internal server error"});
    }
}
