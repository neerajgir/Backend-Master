const eventEmitter = require("events");

const emitter = new eventEmitter();

emitter.on("login", (username)=>{
    console.log(`${username} loggedIn successfully!`)
})
emitter.on("logout", (username)=>{
    console.log(`${username} loggedOut successfully!`)
})
emitter.on("purchase", (username, item)=>{
    console.log(`${username} purchased ${item}!`)
})
emitter.on("profile_update", (username, field)=>{
    console.log(`${username} update their profile and ${field}!`)
})


emitter.emit("login", "Neeraj")
emitter.emit("logout", "Neeraj")
emitter.emit("purchase", "Neeraj", "Samsung S26 ultra")
emitter.emit("profile_update", "Neeraj", "DP and Password")