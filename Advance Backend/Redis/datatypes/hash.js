import client from "./client.js"

async function hash() {
    try {
      //set field in hash 
       await client.hset("user:1", "name", "alice", "age", 30)

       // HGET: Get the value of a field
       const name  = await client.hget("user:1", "name");
       console.log(`Get name: ${name}`)

       // HGETALL: Get all field-value pairs

       const user = await client.hgetall("user:1")
       console.log(`Get all data: ${JSON.stringify(user)}`)

       // HDEL: Delete a field
       await client.hdel("user:1", "age")
    } catch (error) {
        console.error("Error: ", error)
    } finally {
        client.disconnect();
    }
}

hash()