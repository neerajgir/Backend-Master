import express from "express";
import { signup, login, logout, updateProfile } from "../controllers/auth.controller.js";
const routes = express.Router();


routes.post("/signup", signup)
routes.post("/login", login)
routes.post("/logout", logout)

routes.put("/update-profile", updateProfile)


export default routes;