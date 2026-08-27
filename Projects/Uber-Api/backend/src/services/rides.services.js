import rideModel from '../models/rider.model.js';
import { getDistanceAndTime } from './map.services.js';
import crypto from 'crypto';

const baseFare = {
    auto: 30,
    car: 50,
    moto: 40
};

const perKmRate = {
    auto: 10,
    car: 15,
    moto: 8
};

const perMinuteRate = {
    auto: 2,
    car: 3,
    moto: 1.5
};

export const getTripDetails = async (pickup, destination) => {
    if (!pickup || !destination) {
        throw new Error("Pickup and Destination are required");
    }
    const { distance_km, duration_min } = await getDistanceAndTime(pickup, destination);
    const fare = {
        auto: Math.round(baseFare.auto + (distance_km * perKmRate.auto) + (duration_min * perMinuteRate.auto)),
        car: Math.round(baseFare.car + (distance_km * perKmRate.car) + (duration_min * perMinuteRate.car)),
        moto: Math.round(baseFare.moto + (distance_km * perKmRate.moto) + (duration_min * perMinuteRate.moto))
    };
    return { distance_km, duration_min, fare };
};

export const getFareRide = async (pickup, destination) => {
    const { fare } = await getTripDetails(pickup, destination);
    return fare;
};

const getOtp = (num) => {
    return crypto.randomInt(Math.pow(10, num - 1), Math.pow(10, num)).toString();
};

export const createRideService = async ({ user, pickup, destination, vehicleType }) => {
    const { distance_km, duration_min, fare } = await getTripDetails(pickup, destination);
    const ride = await rideModel.create({
        user,
        pickup,
        destination,
        vehicleType,
        otp: getOtp(6),
        fare: fare[vehicleType],
        distance: Math.round(distance_km * 10) / 10,
        duration: Math.round(duration_min)
    });

    return ride;
};

export const confirmRideService = async ({ rideId, captain }) => {
    const ride = await rideModel.findOneAndUpdate({
        _id: rideId,
        status: "pending"
    }, {
        status: "accepted",
        captain: captain._id
    }, {
        new: true
    }).populate("user").populate("captain").select("+otp");

    if (!ride) {
        throw new Error("Ride is no longer available");
    }

    return ride;
};

export const startRideService = async ({ rideId, otp, captain }) => {
    const ride = await rideModel.findOne({
        _id: rideId,
        captain: captain._id
    }).populate("user").populate("captain").select("+otp");

    if (!ride) {
        throw new Error("Ride not found");
    }

    if (ride.status !== "accepted") {
        throw new Error("Ride not accepted");
    }

    if (ride.otp !== otp) {
        throw new Error("Invalid OTP");
    }

    await rideModel.findOneAndUpdate({
        _id: rideId
    }, {
        status: "ongoing"
    });

    ride.status = "ongoing";
    return ride;
};

export const endRideService = async ({ rideId, captain }) => {
    const ride = await rideModel.findOneAndUpdate({
        _id: rideId,
        captain: captain._id,
        status: "ongoing"
    }, {
        status: "completed"
    }, {
        new: true
    }).populate('user').populate('captain');

    if (!ride) {
        throw new Error('Ride not found or not ongoing');
    }

    return ride;
};
