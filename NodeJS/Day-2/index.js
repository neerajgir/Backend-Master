const http = require("http")

const myServer = http.createServer((req,res)=>{
    res.end("Hello From NodeJs")
})

myServer.listen(3000, ()=>{
    console.log("Server is running on port 300")
})