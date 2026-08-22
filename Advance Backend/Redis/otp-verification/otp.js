// otp verification
function otpKey(phone) {
    return `otp${phone}`
}

app.post("/otp", async (req,res) => {
    const {phone} = req.body;
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await client.set(otpKey(phone), otp, 'EX', 30)
    res.json({message: 'OTP SENT', otp})
})

app.post("/otp/verify", async (req,res) => {
    const {phone, otp} = req.body;
    const savedOtp = await client.get(otpKey(phone))

    if(!savedOtp){
        return res.status(400).json({message: 'OTP expired or not found'})
    }
    if(savedOtp !== otp){
        return res.status(400).json({message: "Invalid OTP"})
    }

    client.del(otpKey(phone));

    res.json({message: "OTP verified successfully"})
})

app.get("/otp/:phone/ttl", async (req,res) => {
    const ttl = await client.ttl(otpKey(req.params.phone))
    res.json({ttl})
})