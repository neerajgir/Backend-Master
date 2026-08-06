const login = (req,res)=>{
    const {username} = req.body;
    if(!username){
        return res.status(400).json({error: "Username is required"});
    }
    req.session.user = { username: "Neeraj" };
    req.session.user.username = username; 
    req.session.save((err) => {
        if (err) {
            console.error("Session saving error:", err);
            return res.status(500).json({ error: "Login failed on server" });
        }
        return res.json({ message: "Login Successful", username });
    });
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