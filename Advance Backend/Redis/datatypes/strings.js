// import client from "./client.js";

// async function init() {
//     // 1. Fetching non-existent key "msg:1" returns null initially
//     const result = await client.get("msg:1");
//     console.log("Initial Result (msg:1) -->", result);

//     // 2. Set the key for future executions
//     await client.set("msg:1", "Hey Redis, from node");

//     // 3. Fetching non-existent key "msg:6" returns null
//     const msg = await client.get("msg:6");
//     console.log("Message (msg:6) -->", msg);

//     // 4. Gracefully close the connection loop
//     client.disconnect();
// }

// init();
