import { Queue } from "bullmq";
import client from "./configs/client.js";

export const emailQueue = new Queue("emailQueue", {connection:client}, )