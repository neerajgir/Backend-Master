import express from 'express'
import { authenticationToken } from '../middlewares/auth.middleware.js';

const router = express.Router();


router.get("/", authenticationToken, async (req,res)=>{
    res.status(200).json({message: "Welcome to private router", user: req.user})
})

export default router;