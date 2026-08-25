import {body} from "express-validator";

export const registerValidation = [
    body("email").isEmail().withMessage("Please provide a valid email address"),
    body("password").isLength({ min: 8 }).withMessage("Password must be at least 8 characters long"),
    body("fullname.firstname").notEmpty().withMessage("First name is required"),
]

export const loginValidation = [
    body("email").isEmail().withMessage("Please provide a valid email address"),
    body("password").notEmpty().withMessage("Password is required")
]