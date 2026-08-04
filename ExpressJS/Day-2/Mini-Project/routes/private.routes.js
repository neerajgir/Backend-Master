import { Router } from "express";
import authMiddleware from "../middleware/auth.middleware.js";

const privateRouter = Router();

// Dashboard Route

privateRouter.get("/dashboard", authMiddleware,(req,res)=>{
    const userName = req.user.name;
    res.status(200).send({
        message: `Welcome To Dashboard 🏠 ${userName}`
    })
})



export default privateRouter;