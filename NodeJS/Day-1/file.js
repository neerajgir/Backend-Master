const fs = require("fs");

//sync- blocking, async- non-blocking

//*read
// const res = fs.readFileSync("./sync.txt", "utf-8") 
// console.log(res)
// fs.readFile("./async.txt", "utf-8",(error, response)=> {
//     if (error) {
//         console.log(error)
//     }else {
//         console.log(response)
//     }
// })

//*write
//?fs.writeFileSync("./sync.txt", "Hello from sync writing")
//? fs.writeFile("./async.txt", "Hello from async writing", (err)=>{
//     console.log(err)
// })

//*update -  append
// fs.appendFileSync("./sync.txt", new Date().toDateString())
// fs.appendFile("./async.txt", new Date().toDateString(), (err, res)=> {
//     if(err) {
//         console.log(err)
//     }else {
//         console.log(res)
//     }
// })

//*delete
// fs.unlink("./sync.txt", (err)=>{
//     if (err) {
//         console.log(err)
//     }else {
//         console.log("File Delete")
//     }
// })

// fs.unlinkSync("./async.txt")