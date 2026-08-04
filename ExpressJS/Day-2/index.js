import express from 'express';
const app = express();

const PORT = 8080;

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
app.get('/', (req,res)=>{
    res.send("Hello World!")
})

app.listen(PORT, ()=>{
    console.log(`Server is running on ${PORT}`)
});