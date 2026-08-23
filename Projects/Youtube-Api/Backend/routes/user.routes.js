import express from "express";
import {signup, login, updateProfile, subscribe} from "../controllers/user.controller.js"
import {checkAuth} from "../middleware/auth.middleware.js"

const router = express.Router();


router.post("/signup", signup)
router.post("/login", login)
router.put("/update-profile", checkAuth, updateProfile)
router.post("/subscribe", checkAuth, subscribe)


export default router;