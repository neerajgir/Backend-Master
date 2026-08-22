//queue
const emailQueue = new Queue('emails', {connection: client});
//worker
const worker = new Worker('emails', async (job) => {
    console.log("Processing email job", job.id, job.name, job.data);
    
    // Simulate some async work
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    console.log("Complete email job", job.id, job.name, job.data);
    return { success: true };
}, { connection: client });

worker.on("completed", (job)=>{
    console.log("completed job", job.id, job.name, job.data);
})

worker.off("failed", (job, err)=>{
    console.log("failed job", job.id, job.name, job.data, err);
})

//api's

app.post("/welcome-email", async (req,res) => {
    const job = emailQueue.add("send-welcome-email", 
        {
        to: req.body.to,
        name: req.body.name || "learner",
        },
        {
            attempts: 3,
            backoff: {
                type: "exponential",
                delay: 1000
            },
        }
    )
    res.json({message: "Welcome email job added to queue", jobId: (await job).id})
})