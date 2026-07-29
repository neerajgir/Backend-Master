//? how nodejs works in advance?

const fs = require("fs")
const crypto = require("crypto")

let start = Date.now();
crypto.pbkdf2("password", "salt", 100000, 1024, "sha512", ()=>{
    console.log(`${Date.now() - start}ms Done`)
})

setImmediate(()=>{console.log("Hello from immediate")},0)

console.log("Hello world -1")

setTimeout(() => {
    console.log("Hello from setTimeout - 1");
}, 0);

//1 - console 
//Hello from setTimeout - 1
//2- setImmediate