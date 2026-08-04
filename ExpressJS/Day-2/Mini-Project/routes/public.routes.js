import { Router } from "express";
import { generateToken } from "../utils/token.utils.js";

const publicRouter = Router();


// Generate token
publicRouter.get("/generate-token", (req,res)=>{
    const token = generateToken();

    res.status(200).json({message: "Token Generated, Save it for future usage", 
        token: token
    })
})

// Home Route

publicRouter.get("/", (req,res)=>{
    res.status(200).json({
        message: "Welcome To Home Page 🏡"
    })
})

export default publicRouter;