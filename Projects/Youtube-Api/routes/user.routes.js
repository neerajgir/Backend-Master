import express from "express";

const router = express.Router();


router.post("/signup", (req,res)=>{
    res.send("Hello from Utube")
})


export default router;