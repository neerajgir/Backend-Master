import bcrypt from 'bcrypt';
import User from '../models/user.model.js' 

export const registerUser = async (username, password)=>{
    const hashPassword = await bcrypt.hash(password, 10)
    const user = new User({username, password:hashPassword})
    return await user.save();
}

export const LoginUser = async (username, password)=>{
    const user = await User.findOne({username});
    if(!user || !(await bcrypt.compare(password, user.password))){
        throw new Error("Invalid Username Or Password")
    }

    return user;
}