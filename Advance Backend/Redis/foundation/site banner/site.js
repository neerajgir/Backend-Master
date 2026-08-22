// site banner with redis
const BANNER_KEY = "app:banner";

app.post("/banner", async (req,res) => {
    await client.set(BANNER_KEY, req.body.message || "Welcome to Redis");
    res.json({success: true}) 
})

app.get("/banner", async(req,res)=>{
    const message = await client.get(BANNER_KEY);
    res.json({message})
})

app.delete("/banner", async (req,res) => {
    await client.del(BANNER_KEY);
    res.json({success: true});
})

app.get("/banner/exists", async (req , res) => {
    const exists = await client.exists(BANNER_KEY)
    res.json({exists: Boolean(exists)})    
})