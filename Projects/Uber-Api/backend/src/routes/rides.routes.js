import express from "express";
import {body, query} from "express-validator";
import authUser from '../middlewares/auth.middleware.js';
import authCaptain from '../middlewares/authCaptain.middleware.js';
import { confirmRide, createRide, endRide, getFare, startRide } from "../controllers/rides.controller.js";

const router = express.Router();

router.post("/create", authUser, body("pickup")
    .isString()
    .isLength({ min: 3 })
    .withMessage("Invalid pickup address"),
  body("destination")
    .isString()
    .isLength({ min: 3 })
    .withMessage("Invalid destination address"),
  body("vehicleType")
    .isString()
    .isIn(["auto", "car", "moto"])
    .withMessage("Invalid vehicle type"), createRide
);

router.get("/get-fare", authUser, body("pickup")
    .isString()
    .isLength({ min: 3 })
    .withMessage("Invalid pickup address"),
  body("destination")
    .isString()
    .isLength({ min: 3 })
    .withMessage("Invalid destination address"), getFare
);

router.post("/confirm" , authCaptain ,  body('rideId').isMongoId().withMessage('Invalid ride id'), confirmRide)

router.get("/start-ride", authCaptain, query('rideId').isMongoId().withMessage('Invalid ride id'),
query('otp').isString().isLength({ min: 6, max: 6 }).withMessage('Invalid OTP'), startRide
);

router.post("/end-ride" , authCaptain ,  body('rideId').isMongoId().withMessage('Invalid ride id') , endRide)

export default router;