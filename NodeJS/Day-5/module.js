// OS- Modules
const { log } = require("console")
const os = require("os")

// get os platform and user info

console.log("OS PLATFORM:", os.platform)
console.log("USER INFO:", os.userInfo())

// get os cpu-core
console.log("CPU CORE: ", os.cpus().length)

// free memory get 
console.log("FREE MEMORY: ", os.freemem(), "bytes");

//total memory
console.log("Total Memory: ", os.totalmem(), "bytes");

// home directory
console.log("Home Dir:", os.homedir());

//arc 
console.log("Architecture: ", os.arch());

//hostname
console.log("HostName: ", os.hostname());

//network interface
console.log("Network Interface: ", os.networkInterfaces());

//release info 
console.log("Release info:", os.release());

//temp directory
console.log("Temp Dir: ", os.tmpdir());

//os uptime 
console.log("OS Uptime: ", os.uptime(), "seconds");





