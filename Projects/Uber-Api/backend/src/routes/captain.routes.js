import express from "express";
import { registerCaptain, loginCaptain, getCaptainProfile, logoutCaptain } from "../controllers/captain.controller.js";
import { registerCaptainValidation, loginCaptainValidation } from "../validation/captain.validation.js";
import authCaptain from "../middlewares/authCaptain.middleware.js";

const router = express.Router();

router.post("/register", registerCaptainValidation, registerCaptain);
router.post("/login", loginCaptainValidation, loginCaptain);
router.get("/profile", authCaptain, getCaptainProfile);
router.get("/logout", authCaptain, logoutCaptain);

export default router;
