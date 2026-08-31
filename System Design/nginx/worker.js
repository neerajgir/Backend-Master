import { Worker } from "bullmq";
import client from "./configs/client.js";
import { sendmail } from "./libs/sendemail.js";

export const worker = new Worker("emailQueue", async (job)=>{
    console.log("Job started")
    const email = job.data.email
    await sendmail(email)
    console.log("Job complete")
},{connection: client})