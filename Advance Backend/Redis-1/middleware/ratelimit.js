import client from "../configs/client.js";

export const rateLimit = async (req,res,next) => {
    const ip = req.ip
    const key = `rate_limit:${ip}`
    const requests = await client.incr(key)
    if(requests == 1) await client.expire(key, 60)
    if(requests > 5) return res.status(429).json({message: "Too many requests"})
    next();
}