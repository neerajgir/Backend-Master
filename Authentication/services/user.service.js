import bcrypt from 'bcrypt';
import User from '../models/user.model.js' 

export const registerUser = async (username, password)=>{
    const hashPassword = await bcrypt.hash(password, 10)
    const user = new User({username, password:hashPassword})
    return await user.save();
}