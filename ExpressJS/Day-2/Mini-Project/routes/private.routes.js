import { Router } from "express";

const privateRouter = Router();

// Dashboard Route

privateRouter.get("/dashboard", (req,res)=>{
    res.status(200).send({
        message: "Welcome To Dashboard 🏠"
    })
})



export default privateRouter;