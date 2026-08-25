import express from "express";
import { registerUser, loginUser, getUserProfile, logoutUser } from "../controllers/user.controller.js";
import { registerValidation, loginValidation } from "../validation/user.validation.js";
import authUser from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/register", registerValidation, registerUser);
router.post("/login", loginValidation, loginUser);
router.get("/profile", authUser, getUserProfile);
router.get("/logout", authUser, logoutUser);

export default router;