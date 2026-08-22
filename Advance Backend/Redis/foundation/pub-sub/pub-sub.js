//pub-sub

// subscriber
client.subscribe('notification', (err)=>{
    if(err){
        console.log('Failed to subscribe: %s', err.message)
        return;
    }
    console.log('Subscribed successfully')
})

client.on('message', (channel, message)=>{
    console.log("Received on ", channel, ":", JSON.parse(message))
})

// api 
app.post("/notifications", async(req,res)=>{
    const payload = {
        title: req.body.title || "Default Title",
        createdAt: new Date().toISOString(),
    }

    const receivers = await client.publish("notification", JSON.stringify(payload));
    res.json({message: `Notification sent to ${receivers} subscribers`})
})