import client from "./client.js"

async function hll() {
    try {
        // PFADD: Add elements to a HyperLogLog
        await client.pfadd("hll", "item1", "item2")
        console.log('PFADD hll: Added items');

        // PFCOUNT: Estimate the cardinality
        const count = await client.pfcount("hll");
        console.log(`PFCOUNT hll: ${count}`)
    } catch (error) {
        console.error("Error: ", error)
    } finally {
        client.disconnect()
    }
}

hll();