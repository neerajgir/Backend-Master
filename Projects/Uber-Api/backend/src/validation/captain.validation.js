import {body} from "express-validator";

export const registerCaptainValidation = [
    body("email").isEmail().withMessage("Please provide a valid email address"),
    body("password").isLength({ min: 8 }).withMessage("Password must be at least 8 characters long"),
    body("fullname.firstname").notEmpty().withMessage("First name is required"),
    body("vehicles.color").isLength({ min: 3 }).withMessage("Color must be at least 3 characters long"),
    body("vehicles.plate").isLength({ min: 3 }).withMessage("Plate must be at least 3 characters long"),
    body("vehicles.capacity").isInt({ min: 1 }).withMessage("Capacity must be at least 1"),
    body("vehicles.vehicleType").isIn(["car", "bike", "bus"]).withMessage("Vehicle type must be either car, bike, or bus"),
]

export const loginCaptainValidation = [
    body("email").isEmail().withMessage("Please provide a valid email address"),
    body("password").notEmpty().withMessage("Password is required")
]
