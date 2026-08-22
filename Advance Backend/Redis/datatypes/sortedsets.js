import client from './client.js';

async function sortsets() {
        try {
            // ZADD: Add members with scores to a sorted set
            await client.zadd("leaderboard:1", 100, "Alice")
            await client.zadd("leaderboard:1", 200,"Bob", 150, "Charlie")
            
            // ZRANGE: Retrieve members in a range by index
            const leaderboard = await client.zrange("leaderboard", 0, -1, "WITHSCORES");
            console.log(`ZRANGE leaderboard: ${leaderboard}`);

            // ZREM: Remove a member from a sorted set
            await client.zrem("leaderboard:1", "Alice")

            // ZSCORE: Get the score of a member
            const bobScore = await client.zscore("leaderboard:1", "Bob");
            console.log(`Bob score: ${bobScore}`);

            // ZRANK: Get the rank of a member
            const CharlieRank = await client.zrank("leaderboard:1", "Charlie")
            console.log(`Charlie Rank: ${CharlieRank}`);
            
        } catch (error) {
            console.error("Error: ", error)
        } finally{
            client.disconnect();
        }
}

sortsets();