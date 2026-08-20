import client from "./client.js";


async function fruits() {
    try {
         //add elem
        await client.sadd("fruits", "apple", "banana", "cherry", "mango")
        console.log('SADD fruits: ["apple", "banana", "cherry", "mango"]');

        //retrieve elem
        const fruits = await client.smembers("fruits");
        console.log(`Retrieve fruits: ${fruits}`);

        //remove member
        await client.srem("fruits", "apple");
        console.log('SREM fruits: Removed "apple"');

        //check if member exist
        const hasBanana = await client.sismember("fruits", "banana");
        console.log(`SISMEMBER fruits banana: ${hasBanana ? "Yes" : "No"}`);
    

        // SINTER: Find the intersection of multiple sets
        await client.sadd("set1", "a", "b", "c");
        await client.sadd("set2", "b", "c", "d");
        const intersection = await client.sinter("set1", "set2");
        console.log(`SINTER set1 set2: ${intersection}`);

        // SUNION: Find the union of multiple sets
        const union = await client.sunion("set1", "set2");
        console.log(`SUNION set1 set2: ${union}`);

        // SDIFF: Find the difference between sets
        const difference = await client.sdiff("set1", "set2");
        console.log(`SDIFF set1 set2: ${difference}`);

    } catch (error) {
        console.error("Error:", error)
    }finally{
        client.disconnect();
    }
}

fruits();