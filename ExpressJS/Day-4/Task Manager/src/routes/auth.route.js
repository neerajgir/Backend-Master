import { Router } from "express";

const router = Router();

router.post("/login", (req,res)=>{
    res.send("Login Route")
})

router.get("/logout", (req,res)=>{
    res.send("Logout route")
})

export default router;