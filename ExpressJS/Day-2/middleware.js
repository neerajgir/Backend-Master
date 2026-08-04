// global-middleware
function sayHi(req,res,next){
    console.log("Hi i am middleware");
    next();
}
// app.use(sayHi)


// specific routes
app.get('/', sayHi, (req,res)=>{
    res.send("Hello World!")
})

// inbuilt middleware
// app.use(express.json())

app.get('/', (req,res)=>{
    res.send("Hello World!")
})