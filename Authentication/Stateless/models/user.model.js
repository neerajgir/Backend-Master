import mongoose from "mongoose";
import bcrypt from 'bcrypt'

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
})

//hash pass before save it

userSchema.pre("save", async (next) => {
    if(!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10)
    next();
})

userSchema.methods.comparePassword = async (password) => {
    return bcrypt.compare(password, this.password)
}

const user = mongoose.model("User", userSchema)

export default user