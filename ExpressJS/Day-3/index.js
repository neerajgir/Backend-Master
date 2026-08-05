import express from "express";
import cookieParser from "cookie-parser";
const app = express();
const PORT = 3000;

app.use(cookieParser());

app.get("/", (req, res) => {
    // ! set cookie
    res.cookie("name", "express", {maxAge: 1000 * 60 * 60 * 24})
  res.send("Hello World");
});

app.get("/product", (req,res)=>{
    // console.log(req.cookies) undefined
    // console.log(req.headers.cookie) name=express
    console.log("Cookies", req.cookies) //Cookies { name: 'express' }
    if(req.cookies.name && req.cookies.name === "express"){
        res.status(200).send({
            id: 1,
            name: "item-01",
            price: "$100"
        })
    }else {
        res.status(403).send("You are not authorized");
    }
    
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
