import {validationResult} from 'express-validator';
import  {getAddressCoordinate, getAutoCompleteSuggestionservice, getDistanceAndTime, getCaptainInTheRadius} from "../services/map.services.js";
import rideModel from '../models/rider.model.js';
import { createRideService, getFareRide, confirmRideService, startRideService, endRideService} from '../services/rides.services.js';


export const createRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const {userId, pickup, destination, vehicleType} = req.body;
    try {
        const ride = await createRideService({user:req.user._id, pickup,     destination, vehicleType});
        return res.status(201).json(ride);

        const pickupCoordinates = await getAddressCoordinate(pickup);
        const nearbyCaptains = await getCaptainInTheRadius(pickupCoordinates.lat, pickupCoordinates.lng, 2);

        ride.otp = "";
        const rideWithUser = await rideModel.findOne({_id: ride._id}).populate('user');

        nearbyCaptains.map(captain => {
            sendMessageToSocket(captain.socketId, {event:'newRide', data: rideWithUser});
        })


    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const getFare = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const {pickup, destination} = req.body;
    try {
        const fare = await getFareRide(pickup, destination);
        res.status(200).json(fare);
    }catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

export const confirmRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const {rideId} = req.body;
    try {
        const ride = await confirmRideService({rideId, captainId: req.captain});
        sendMessageToSocket(ride.user.socketId, {event:'newRide', data: ride});
        res.status(200).json(ride);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

export const startRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const {rideId, otp} = req.body;
    try {
        const ride = await startRideService({rideId, otp, captainId: req.captain});
        sendMessageToSocket(ride.user.socketId, {event:'rideStarted', data: ride});
        res.status(200).json(ride);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

export const endRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const {rideId} = req.body;
    try {
        const ride = await endRideService({rideId, captainId: req.captain});
        sendMessageToSocket(ride.user.socketId, {event:'rideEnded', data: ride});
        res.status(200).json(ride);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
