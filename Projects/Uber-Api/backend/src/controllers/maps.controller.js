import {validationResult} from "express-validator";
import { getAddressCoordinate, getDistanceAndTime, getAutoCompleteSuggestionservice } from "../services/map.services.js";

export const getCoordinates = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    // Implementation for getting coordinates
    const { address } = req.query;
    try {
        // Simulate an API call to get coordinates
        const coordinates = await getAddressCoordinate(address);
        res.status(200).json( coordinates );
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

export const getDistanceTime = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    // Implementation for getting distance and time
    try {
        const { origin, destination } = req.query;
        const distanceTime = await getDistanceAndTime(origin, destination);
        res.status(200).json(distanceTime);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

export const getAutoCompleteSuggestions = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    // Implementation for getting auto-complete suggestions
    try {
        const { input } = req.query;
        const suggestions = await getAutoCompleteSuggestionservice(input);
        res.status(200).json({ suggestions });
    }   catch (error) {
        res.status(404).json({ error: error.message });
    }
};