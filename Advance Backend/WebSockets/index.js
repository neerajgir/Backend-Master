import http from 'http';
import WebSocket, {WebSocketServer} from "ws";

const server = http.createServer((req,res)=>{
    console.log((new Date()) + "received req for" + req.url)
    res.end("Hi there")
})

// step-1
const wss = new WebSocketServer({server})

// step-2

wss.on("connection", function connection(ws){
    ws.on("error", console.error)

    ws.on("message", function message(data, isBinary){
        wss.clients.forEach(function each(client){
            if(client.readyState === WebSocket.OPEN){
                client.send(data, {binary: isBinary})
            }
        })
    })

    ws.send("Hello connection message from ws server")
})




server.listen(3000, ()=>{
    console.log("Server is running on 3000 Port");
})