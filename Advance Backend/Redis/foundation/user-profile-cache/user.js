// json
app.post("/user/:id/json", async (req, res) => {
    await client.set(`user:${req.params.id}:json`, JSON.stringify(req.body))
    res.json({savedAt: "json"})
})

app.get("/user/:id/json", async (req,res) => {
    const raw =  await client.get(`user:${req.params.id}:json`);
    res.json({user: raw ? JSON.parse(raw): null}) 
})
// hash
app.post("/user/:id/hash", async (req,res) => {
    await client.hset(`user:${req.params.id}:hash`, req.body)
    res.json({savedAt: "hash"});
})

app.get("/user/:id/hash", async (req,res) => {
    const user = await client.hgetall(`user:${req.params.id}:hash`);
    res.json({user})
})