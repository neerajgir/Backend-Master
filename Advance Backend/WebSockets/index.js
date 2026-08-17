import http from 'http';

const server = http.createServer((req,res)=>{
    console.log((new Date()) + "received req for" + req.url)
    req.end("Hi there")
})

server.listen(3000, ()=>{
    console.log("Server is running on 3000 Port");
})