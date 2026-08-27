import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const captainSchema = new mongoose.Schema({
    fullname: {
        firstname: { type: String, required: true, minLength: [3, "First name must be at least 3 characters long"] },
        lastname: { type: String, minLength: [3, "Last name must be at least 3 characters long"] },
    },
    email: {
        type: String,
        required: true,
        minlength: [5, "Email must be at least 5 characters long"],
        unique: true,
        match: [/\S+@\S+\.\S+/, "Email is invalid"],
    },
    password: {
        type: String,
        required: true,
        select: false,
    },
    socketId: {
        type: String
    },
    vehicles: {
        color:{type: String, required: true, minlength: [3, "Color must be at least 3 characters long"]},
        plate:{type: String, required: true, minlength: [3, "Plate must be at least 3 characters long"]},
        capacity:{type: Number, required: true, min: [1, "Capacity must be at least 1"]},
        vehicleType:{type: String, required: true, enum: ["car", "bike", "bus"], message: "Vehicle type must be either car, bike, or bus"},
    },
    location: {
        type: {
            type: String,
            enum: ["Point"],
            default: "Point"
        },
        coordinates: {
            type: [Number],
            default: [0, 0],
            index: "2dsphere"
        }
    }
})

captainSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
        expiresIn: "24h",
    });
    return token;
}

captainSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
}

captainSchema.statics.hashPassword = async function (password) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
}

const captainModel = mongoose.model("captain", captainSchema);

export default captainModel;