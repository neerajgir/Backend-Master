const QUEUE_KEY = 'email:queue';

app.post("/emails", async (req,res) => {
    const job = {
        to: req.body.to,
        subject: req.body.subject || 'No subject',
        body: req.body.body || 'No content',
        createdAt: new Date().toISOString()
    }

    await client.lpush(QUEUE_KEY, JSON.stringify(job))
    res.json({queued: true, job})
})

app.get("/emails/process-one", async (req,res) => {
    const rawJob = await client.rpop(QUEUE_KEY)
    if(!rawJob){
        return res.json({message: "No jobs in the queue"})
    }
    const job = JSON.parse(rawJob)
    res.json({message: "Email sent", job})
})