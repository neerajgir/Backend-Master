import express from "express";
import cookieParser from "cookie-parser";
const app = express();
const PORT = 3000;

app.use(cookieParser("secret"));

app.get("/", (req, res) => {
    // ! set cookie
    res.cookie("userId", "7f626ae0-02a0-4887-91a1-7674c5ba06e7", {
        maxAge: 1000 * 60 * 60 * 24, 
        httpOnly: true, 
        secure:false,
        signed:true
    })
  res.send("Hello World");
});

app.get("/product", (req,res)=>{
    // console.log(req.cookies) undefined
    // console.log(req.headers.cookie) name=express
    console.log("Cookies", req.cookies) //Cookies { name: 'express' }
    console.log("Sign-Cookie", req.signedCookies);
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
