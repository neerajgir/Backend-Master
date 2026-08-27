import express from "express";
import authAny from '../middlewares/authAny.middleware.js';
import {query} from "express-validator";
import { getAutoCompleteSuggestions, getCoordinates, getDistanceTime } from "../controllers/maps.controller.js";

const router = express.Router();

router.get("/get-coordinates", query("address").isString().isLength({min: 3}).withMessage("Address is required"), authAny, getCoordinates);

router.get("/get-distance-time", query("origin").isString().isLength({min: 3}).withMessage("Origin is required"), query("destination").isString().isLength({min: 3}).withMessage("Destination is required"), authAny, getDistanceTime);

router.get("/get-suggestions", query("input").isString().isLength({min: 3}).withMessage("Input is required"), authAny, getAutoCompleteSuggestions);

export default router;
