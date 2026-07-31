const { Readable } = require("stream")

const readableStream = new Readable({
    read(){}
});

readableStream.on("data", (chunk)=>{
    console.log("chunk:", chunk.toString())
})

readableStream.push("Hello")