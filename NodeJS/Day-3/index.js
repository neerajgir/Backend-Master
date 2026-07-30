//Tasks

const eventEmitter = require("events");
const emitter = new eventEmitter();

const fs = require("fs")

const eventsCounts = {
    login: 0,
    logout: 0,
    purchase: 0,
    profile_update: 0
}

const logFile = "eventlog.json"


function saveCounts() {
    fs.writeFileSync(logFile, JSON.stringify(eventsCounts, null, 2))
}

if(fs.existsSync(logFile)){
  const data = fs.readFileSync(logFile, "utf-8")
  Object.assign(eventsCounts, JSON.parse(data))   
}

emitter.on("login", (username)=>{
    eventsCounts.login++;
    console.log(`${username} loggedIn successfully!`)
    saveCounts()
})
emitter.on("logout", (username)=>{
    eventsCounts.logout++;
    console.log(`${username} loggedOut successfully!`)
    saveCounts()
})
emitter.on("purchase", (username, item)=>{
    eventsCounts.purchase++;
    console.log(`${username} purchased ${item}!`)
    saveCounts()
})
emitter.on("profile_update", (username, field)=>{
    eventsCounts.profile_update++;
    console.log(`${username} update their profile and ${field}!`)
    saveCounts()
})

emitter.on("summary", ()=>{
    console.log("\n Event Summary:")
    console.log(`Logins: ${eventsCounts.login}`)
    console.log(`Logouts: ${eventsCounts.logout}`)
    console.log(`Purchases: ${eventsCounts.purchase}`)
    console.log(`Profile_Updates: ${eventsCounts.profile_update}`)
})

emitter.emit("login", "Neeraj")
emitter.emit("logout", "Neeraj")
emitter.emit("purchase", "Neeraj", "Samsung S26 ultra")
emitter.emit("profile_update", "Neeraj", "DP and Password")
emitter.emit("summary")
