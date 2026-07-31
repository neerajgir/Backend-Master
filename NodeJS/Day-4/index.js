const http = require("http");
const fs = require("fs")
const server = http.createServer((req,res)=>{
    //? Downloading file in bad way.
    // const read = fs.readFileSync("text.txt");
    //?Downloading file in good way.
    const readableStreams = fs.createReadStream("text.txt")
    readableStreams.pipe(res)
    // res.end()
})

server.listen(3000, ()=>{
    console.log("Server is running on 3000.")
})

