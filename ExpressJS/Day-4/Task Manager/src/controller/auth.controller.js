const login = (req,res)=>{
    const {username} = req.body;
    if(!username){
        return res.status(400).json({error: "Username is required"});
    }
    res.session.user = {username};
    res.cookie("username", username, {httpOnly: true, maxAge: 1000*60*60*24})
    res.json({message: "Login Successful", username})
}

const logout = (req,res) =>{
    res.clearCookie("username");
    res.session.destroy((error)=>{
        if(error){
            res.status(500).json({error: "Something went wrong"})
        }
        res.json({message: "Logout successful"})
    })
}

export  {login, logout};