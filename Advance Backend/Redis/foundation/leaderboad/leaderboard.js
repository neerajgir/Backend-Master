const LEADERBOARD_KEY = 'leaderboard:global';

// 1. Submit or increment a score
async function updatePlayerScore(playerId, points, username) {
    await client.zincrby(LEADERBOARD_KEY, points, playerId);
    await client.hset(`user:${playerId}`, {
        username: username,
        updatedAt: Date.now().toString()
    });
}

// 2. Fetch Top N global players with metadata
async function getTopLeaderboard(limit = 10) {
    // Use zrevrange to get top N by rank (highest score first) with scores
    const topPlayers = await client.zrevrange(LEADERBOARD_KEY, 0, limit - 1, 'WITHSCORES');

    // zrevrange with WITHSCORES returns flat array: [member1, score1, member2, score2, ...]
    const fullLeaderboard = [];
    for (let i = 0; i < topPlayers.length; i += 2) {
        const playerId = topPlayers[i];
        const score = parseFloat(topPlayers[i + 1]);
        const profile = await client.hgetall(`user:${playerId}`);
        fullLeaderboard.push({
            rank: (i / 2) + 1,
            id: playerId,
            score: score,
            username: profile.username || 'Anonymous'
        });
    }
    return fullLeaderboard;
}

// 3. Get "Around Me" relative positioning
async function getPlayersAroundMe(playerId, windowSize = 2) {
    const rank = await client.zrevrank(LEADERBOARD_KEY, playerId);
    if (rank === null) return [];

    const start = Math.max(0, rank - windowSize);
    const end = rank + windowSize;

    // Use zrange with WITHSCORES to get players by rank range
    const nearPlayers = await client.zrange(LEADERBOARD_KEY, start, end, 'WITHSCORES');
    
    // Convert flat array to objects
    const results = [];
    for (let i = 0; i < nearPlayers.length; i += 2) {
        const playerId = nearPlayers[i];
        const score = parseFloat(nearPlayers[i + 1]);
        results.push({ value: playerId, score: score });
    }
    
    return results;
}

// apis
//1. POST /api/score
 // Submit or increment a user's score

app.post('/api/score', async (req, res) => {
    const { playerId, points, username } = req.body;

    if (!playerId || typeof points !== 'number' || !username) {
        return res.status(400).json({ error: 'Missing or invalid fields: playerId, points, username' });
    }

    try {
        // Increment score in Sorted Set
        const currentScore = await client.zincrby(LEADERBOARD_KEY, points, playerId);
        
        // Cache user metadata in a Hash Map
        await client.hset(`user:${playerId}`, {
            username: username,
            updatedAt: Date.now().toString()
        });

        return res.status(200).json({ 
            message: 'Score updated successfully', 
            playerId, 
            newScore: currentScore 
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});


 //2. GET /api/leaderboard
 // Fetch top N global players

app.get('/api/leaderboard', async (req, res) => {
    // Parse query parameter or default to top 10
    const limit = parseInt(req.query.limit) || 10;

    try {
        // Use zrevrange to get top N by rank (highest score first) with scores
        const topPlayers = await client.zrevrange(LEADERBOARD_KEY, 0, limit - 1, 'WITHSCORES');

        // zrevrange with WITHSCORES returns flat array: [member1, score1, member2, score2, ...]
        // Hydrate player profiles using Redis Pipeline for speed
        const pipeline = client.multi();
        for (let i = 0; i < topPlayers.length; i += 2) {
            pipeline.hgetall(`user:${topPlayers[i]}`);
        }
        const profiles = await pipeline.exec();

        // Format response array
        const results = [];
        for (let i = 0; i < topPlayers.length; i += 2) {
            const playerId = topPlayers[i];
            const score = parseFloat(topPlayers[i + 1]);
            const profileIndex = i / 2;
            results.push({
                rank: profileIndex + 1,
                playerId: playerId,
                score: score,
                username: profiles[profileIndex]?.username || 'Anonymous'
            });
        }

        return res.status(200).json({ leaderboard: results });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});


 //3. GET /api/leaderboard/around/:playerId
//Get a tailored rank window relative to a specific player
app.get('/api/leaderboard/around/:playerId', async (req, res) => {
    const { playerId } = req.params;
    const windowSize = parseInt(req.query.window) || 2; // Default 2 above & 2 below

    try {
        // Find user's exact 0-indexed ranking
        const rank = await client.zrevrank(LEADERBOARD_KEY, playerId);
        if (rank === null) {
            return res.status(404).json({ error: 'Player not found on the leaderboard' });
        }

        // Calculate boundary offsets
        const start = Math.max(0, rank - windowSize);
        const end = rank + windowSize;

        // Use zrange with WITHSCORES to get players by rank range
        const nearPlayers = await client.zrange(LEADERBOARD_KEY, start, end, 'WITHSCORES');

        // Hydrate adjacent player metadata
        const pipeline = client.multi();
        for (let i = 0; i < nearPlayers.length; i += 2) {
            pipeline.hgetall(`user:${nearPlayers[i]}`);
        }
        const profiles = await pipeline.exec();

        const results = [];
        for (let i = 0; i < nearPlayers.length; i += 2) {
            const pId = nearPlayers[i];
            const score = parseFloat(nearPlayers[i + 1]);
            const profileIndex = i / 2;
            results.push({
                rank: start + profileIndex + 1, // Calculate correct display rank
                playerId: pId,
                score: score,
                username: profiles[profileIndex]?.username || 'Anonymous',
                isCurrentUser: pId === playerId
            });
        }

        return res.status(200).json({ aroundMe: results });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
