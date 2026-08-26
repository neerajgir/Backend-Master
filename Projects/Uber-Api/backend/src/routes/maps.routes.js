import express from "express";
import authUser from '../middlewares/auth.middleware.js'; 
import {query} from "express-validator";
import { getAutoCompleteSuggestions, getCoordinates, getDistanceTime } from "../controllers/maps.controller.js";

const router = express.Router();

router.get("/get-coordinates", query("address").isString().isLength({min: 3}).withMessage("Address is required"), authUser, getCoordinates);

router.get("/get-distance-time", query("origin").isString().isLength({min: 3}).withMessage("Origin is required"), query("destination").isString().isLength({min: 3}).withMessage("Destination is required"), authUser, getDistanceTime);

router.get("/get-suggestions", query("input").isString().isLength({min: 3}).withMessage("Input is required"), authUser, getAutoCompleteSuggestions); 

export default router;