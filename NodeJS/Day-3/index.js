const eventEmitter = require("events");

const emitter = new eventEmitter();


//? on(eventname, listen) = create
//? emit(eventname, [args]) = execute

emitter.on("Greet", ()=>{
    console.log("Hello Word!")
})

emitter.emit("Greet")