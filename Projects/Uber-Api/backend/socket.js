import socketIO from "socket.io"
import userModel from "./src/models/user.model.js"
import captainModel from "./src/models/captain.model.js"

let io;

function initializeSocket(server) {
    io = socketIO(server,{
        cors:{
            origin: "*",
            methods: ["GET", "POST"]
        }
    })
    io.on("connection", (socket)=>{
        socket.on("join", async(data)=>{
            const {userId, userType} = data;
            if(userType === "user"){
                await userModel.findByIdAndUpdate(userId, {socketId: socket.id})
            }else if(userType === "captain"){
                await captainModel.findByIdAndUpdate(userId, {socketId: socket.id})
            }
        })
        socket.on("update-location-captain", async(data)=>{
            const {userId, location} = data;
            await captainModel.findByIdAndUpdate(userId, {location:{
                ltd: location.ltd,
                lng: location.lng
            }})
        })

        socket.on("disconnected", ()=>{
            console.log("User Disconnected")
        })
    })
}

const sendMessageToSocketId = (socketId, messageObj)=>{
    if(io){
        io.to(socketId).emit(messageObject.event , messageObject.data);
    }else{
        console.log("socket not initialized");
    }
} 

export {initializeSocket , sendMessageToSocketId};