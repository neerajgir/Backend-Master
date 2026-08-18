import express from "express";
import protectRoute from "../middlewares/auth.middleware.js"

const router = express.Router();

router.get("/users");
router.get("/:id");

router.post("send/:id");

export default router;