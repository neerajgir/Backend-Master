import rideModel from '../models/rider.model.js';
import { getAddressCoordinate, getDistanceAndTime, getAutoCompleteSuggestionservice, getCaptainInTheRadius } from './map.services.js';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

export const getFareRide = async (pickup, destination) => {
    if(!pickup || !destination){
        throw new Error("Pickup and Destination are required");
    }
    const distanceTime = await getDistanceAndTime(pickup, destination);
    const baseFare = {
        auto: 30,
        car: 50,
        bike: 40
    }
    const perKmRate = {
        auto: 10,
        car: 15,
        bike: 8
    }

    const fare = {
        auto: Math.round(baseFare.auto + (distance_km * perKmRate.auto) + (duration_min * perMinuteRate.auto)),
        car: Math.round(baseFare.car + (distance_km * perKmRate.car) + (duration_min * perMinuteRate.car)),
        moto: Math.round(baseFare.moto + (distance_km * perKmRate.moto) + (duration_min * perMinuteRate.moto))
    }
    return fare
}

const getOtp = async (num)=>{
    function generateOtp(num) {
        const otp = crypto.randomInt(Math.pow(10, num - 1), Math.pow(10, num)).toString();
        return otp;
    }
    return generateOtp(num);
}

export const createRideService = async ({user, pickup, destination, vehicleType}) => {
    const fare = await getFareService(pickup , destination);
    const ride  = rideModel.create({
        user,
        pickup,
        destination,
        vehicleType,
        otp:getOtp(6),
        fare:fare[vehicleType]
    })

    return ride
}

export const confirmRideService = async ({rideId, captain}) => {
    await rideModel.findOneAndUpdate({
        _id:rideId
    },{
        status:"accepted",
        captain:captain._id
    })

    const ride = await rideModel.findOne({
        _id:rideId
    }).populate("user").populate("captain").select("+otp");

    return ride
}

export const startRideService = async ({rideId, otp, captain}) => {
     const ride = await rideModel.findOne({
        _id:rideId
    }).populate("user").populate("captain").select("+otp");

    if(ride.otp !== otp){
        throw new Error("Invalid OTP");
    }

    if(!ride.status === "accepted"){
        throw new Error("Ride not accepted");
    }

    await rideModel.findOneAndUpdate({
        _id:rideId
    },{
        status:"ongoing"
    });
    return ride
}

export const endRideService = async ({rideId, captain}) => {
    const ride = await rideModel.findOne({
        _id: rideId,
        captain: captain._id
    }).populate('user').populate('captain').select('+otp');

    
    if (!ride) {
        throw new Error('Ride not found');
    }

    if (ride.status !== 'ongoing') {
        throw new Error('Ride not ongoing');
    }
    
    await rideModel.findOneAndUpdate({
        _id: rideId
    }, {
        status: 'completed'
    })

    return ride;
}