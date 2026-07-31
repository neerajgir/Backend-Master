const http = require("http");
const fs = require("fs")
const {Transform, pipeline} = require("stream")
const server = http.createServer((req,res)=>{
    //? Downloading file in bad way.
    // const read = fs.readFileSync("text.txt");
    //?Downloading file in good way.
    // const readableStreams = fs.createReadStream("text.txt")
    // readableStreams.pipe(res)
    // res.end()

    // ? in copy paste way - bad-way
    // const file = fs.readFileSync("text.txt")
    // fs.writeFileSync("output.txt", file)
    // res.end()

    // ? in copy paste way - good-way
    // const readStream = fs.createReadStream("text.txt")
    // const writeStream = fs.createWriteStream("output.txt")
    // readStream.on("data", (chunk)=>{
    //     console.log("data: ", chunk)
    //     writeStream.write(chunk)
    // })

    // ? Stream Processing
    //uppercase - whole file
    //ipsum - neeraj
    const readStream = fs.createReadStream("text.txt")
    const writeStream = fs.createWriteStream("output.txt")
    const transformStream = new Transform({
        // transformStream - readable and writable 
        transform(chunk, encoding, callback){
            const modifyWord = chunk.toString().toUpperCase().replaceAll(/ipsum/gi, "Neeraj")
            callback(null, modifyWord)
        }
    })
    //Bad way
    // readStream.on("data", (chunk)=>{
    //     const modifyWord = chunk.toString().toUpperCase().replaceAll(/ipsum/gi, "Neeraj")
    //     writeStream.write(modifyWord);
    // })
    // res.end()

    //good way
    // readStream.pipe(transformStream).pipe(writeStream);
    // pipeline(readStream, transformStream, pipeline, (err)=>{
    //     console.log(err)
    // })
    // res.end()
})

server.listen(8080, ()=>{
    console.log("Server is running on 8080.")
})

