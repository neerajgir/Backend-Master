const http = require("http")
const fs = require("fs")
const myServer = http.createServer((req,res)=>{
    // res.end("Hello From NodeJs")
    const log = `${Date.now()}: & From ${req.url} New Request Receive\n`
    fs.appendFile("log.txt", log, (err)=>{
        if (err) {
            console.log(err);
            res.statusCode = 500;
            res.end("Internal Server Error")
            return;
        }
        res.end("Hello From Server")
    })
})

myServer.listen(3000, ()=>{
    console.log("Server is running on port 300")
})