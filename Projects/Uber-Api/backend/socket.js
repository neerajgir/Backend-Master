import { Server } from "socket.io"
import userModel from "./src/models/user.model.js"
import captainModel from "./src/models/captain.model.js"

let io;

function initializeSocket(server) {
    io = new Server(server,{
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
            if (!location || location.ltd == null || location.lng == null) return;
            await captainModel.findByIdAndUpdate(userId, {
                location: {
                    type: "Point",
                    coordinates: [location.lng, location.ltd]
                }
            })
        })

        socket.on("disconnect", ()=>{
            console.log("User Disconnected")
        })
    })
}

const sendMessageToSocketId = (socketId, messageObj)=>{
    if(io){
        io.to(socketId).emit(messageObj.event, messageObj.data);
    }else{
        console.log("socket not initialized");
    }
}

export { initializeSocket, sendMessageToSocketId };
