import express from 'express';
import User from '../models/user.model.js'
const router = express.Router();

//crud operations

//1 - create

router.post('/users', async (req,res)=>{
    try {
        const {name, age, weight} = req.body;
        const newUser = new User({name, age, weight})
        await newUser.save()

        res.status(201).json({
            success:true,
            data: newUser,
            message: "Successfully User Created"
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
})

//2 - read

router.get('/users', async(req,res)=>{
    try {
        const users = await User.find();

        res.status(200).json({
            success: true,
            data: users,
            message: "User Fetch Successfully"
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
})
//3 - update

router.put('/update-users/:id',async(req,res)=>{
    try {
        const {id} = req.params;
        const {name, age, weight} = req.body;

        const updateUser = await User.findByIdAndUpdate(id, {name, age, weight}, {new:true, runValidators: true})

        if(!updateUser){
            return res.status(401).json({
                success: false,
                message: "User not found"
            })
        }
        res.status(200).json({
            success: true,
            user: updateUser,
            message: "User update successfully"
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
})
//4 - delete

router.delete('/users/:id', async(req,res)=>{
    try {
        const {id} = req.params;
        const deleteUser = await User.findByIdAndDelete(id);

        if(!deleteUser) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }

        res.status(200).json({
            success: true,
            data: deleteUser,
            message: "User deleted successfully"
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
})

export default router;