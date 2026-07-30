const eventEmitter = require("events");

const emitter = new eventEmitter();


//? on(eventname, listen) = create
//? emit(eventname, [args]) = execute

emitter.on("Greet", (args)=>{
    console.log(`Hello Word! ${args.username} and the id is: ${args.id}`)
})

emitter.emit("Greet", {
    username: "Neeraj",
    id: "3223krkfksdjrj4jl4kl"
})