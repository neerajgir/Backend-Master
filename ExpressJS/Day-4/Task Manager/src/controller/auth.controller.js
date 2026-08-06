const login = (req,res)=>{
    res.send("Login Route")
}

const logout = (req,res) =>{
    res.send("Logout Route")
}

export  {login, logout};