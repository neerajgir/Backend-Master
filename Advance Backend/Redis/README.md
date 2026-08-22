# 🚀 Redis — Complete Learning Guide (Hinglish)

> **"Redis sirf ek database nahi hai, yeh ek in-memory data structure server hai jo aapke apps ko lightning-fast banata hai!"**

---

## 📑 Table of Contents

1. [Redis Kya Hai?](#-redis-kya-hai)
2. [Redis Kyun Use Karte Hain?](#-redis-kyun-use-karte-hain)
3. [Installation & Setup](#-installation--setup)
4. [Connection with Node.js (ioredis)](#-connection-with-nodejs-ioredis)
5. [Redis Data Types](#-redis-data-types)
   - [Strings](#1-strings)
   - [Hashes](#2-hashes)
   - [Lists](#3-lists)
   - [Sets](#4-sets)
   - [Sorted Sets](#5-sorted-sets)
   - [Streams](#6-streams)
   - [Bitmaps](#7-bitmaps)
   - [HyperLogLog](#8-hyperloglog)
   - [Geospatial](#9-geospatial-geo)
6. [Redis Core Concepts](#-redis-core-concepts)
7. [Real-Life Usages & Projects](#-real-life-usages--projects)
8. [Caching Strategies](#-caching-strategies)
9. [Redis vs Other Databases](#-redis-vs-other-databases)
10. [Tips & Best Practices](#-tips--best-practices)

---

## 🔰 Redis Kya Hai?

**Redis** ka full form hai **"REmote DIctionary Server"**. Yeh ek **open-source, in-memory data structure store** hai jo bahut zyada fast hai kyunki yeh data ko **RAM** mein store karta hai, disk pe nahi.

### Simple Bhasha Mein Samjho:

```
Traditional Database (MongoDB/MySQL):
  Request → Disk Read → Process → Response  (Slow ⏳)

Redis:
  Request → RAM Read → Response  (Lightning Fast ⚡)
```

### Key Points:
- **In-Memory**: Data RAM mein hota hai, isliye access super fast hai
- **Data Structures**: Sirf key-value nahi, bahut saare data structures support karta hai
- **Persistence**: Agar chaaho toh disk pe bhi save kar sakte ho (RDB/AOF)
- **Single Threaded**: Ek hi thread pe kaam karta hai but bahut efficient hai
- **Pub/Sub**: Real-time messaging support karta hai
- **TTL (Time To Live)**: Keys ko auto-expire kar sakte ho

---

## 🤔 Redis Kyun Use Karte Hain?

| Use Case | Description | Speed Gain |
|----------|-------------|------------|
| **Caching** | Frequently accessed data cache karo | 100x faster |
| **Session Store** | User sessions store karo | 50x faster |
| **Real-time Chat** | Pub/Sub se messages bhejo | Real-time |
| **Leaderboards** | Gaming leaderboards maintain karo | O(log N) |
| **Rate Limiting** | API calls limit karo | Milliseconds |
| **Queue System** | Background jobs process karo | Reliable |
| **Geospatial** | Location-based queries karo | Fast |

---

## 🛠️ Installation & Setup

### 1. Redis Install Karo

```bash
# Windows ke liye (WSL ya Docker use karo)
docker run -d --name redis -p 6379:6379 redis:latest

# Mac ke liye
brew install redis

# Linux ke liye
sudo apt install redis-server
```

### 2. Redis Start Karo

```bash
# Server start karo
redis-server

# Client open karo (test karne ke liye)
redis-cli
```

### 3. Test Karo

```bash
127.0.0.1:6379> PING
PONG
```

### 4. Node.js Project Setup

```bash
# Package.json mein dependency add karo
npm install ioredis

# Agar BullMQ use karna hai (queues ke liye)
npm install bullmq
```

---

## 🔗 Connection with Node.js (ioredis)

```javascript
// client.js — Redis connection file
import Redis from "ioredis";

const client = new Redis({
    port: 6379,      // Default Redis port
    host: '127.0.0.1', // Localhost
    db: 0             // Database number (0-15 available)
});

export default client;
```

```javascript
// index.js — Connection test
import client from "./client.js";

async function testConnection() {
    const reply = await client.ping();
    console.log(`Redis says: ${reply}`); // PONG
    client.disconnect();
}

testConnection();
```

---

## 📦 Redis Data Types

Redis mein 9 major data types hain. Har ek ka apna use case hai:

```
┌─────────────────────────────────────────────────────┐
│                  REDIS DATA TYPES                    │
├──────────────┬──────────────────────────────────────┤
│  Strings     │  Simple key-value, numbers, JSON     │
│  Hashes      │  Object-like structures (field-val)  │
│  Lists       │  Ordered collection (stack/queue)    │
│  Sets        │  Unique unordered elements           │
│  Sorted Sets │  Unique elements with scores         │
│  Streams     │  Log-like append-only structure      │
│  Bitmaps     │  Bit-level operations                │
│  HyperLogLog │  Approximate cardinality counting    │
│  Geo         │  Location-based data                 │
└──────────────┴──────────────────────────────────────┘
```

---

### 1. Strings

**Sabse basic data type.** Text, numbers, ya JSON store kar sakte ho.

```
┌──────────┐     ┌──────────┐
│   Key    │────▶│  Value   │
│ "msg:1"  │     │ "Hello"  │
└──────────┘     └──────────┘
```

#### Commands & Code:

```javascript
import client from "./client.js";

async function strings() {
    // SET: Key mein value store karo
    await client.set("msg:1", "Hey Redis, from node");
    console.log("Message saved!");

    // GET: Value retrieve karo
    const result = await client.get("msg:1");
    console.log(result); // "Hey Redis, from node"

    // Non-existent key returns null
    const missing = await client.get("msg:999");
    console.log(missing); // null

    // SET with expiry (seconds)
    await client.set("session:abc", "user123", "EX", 3600); // 1 hour

    // INCR / DECR: Numbers ko increment/decrement karo
    await client.set("page:views", 100);
    await client.incr("page:views");    // 101
    await client.decr("page:views");    // 100
    await client.incrBy("page:views", 5); // 105

    // MSET / MGET: Multiple values ek saath
    await client.mset({ "user:1:name": "Alice", "user:1:age": "25" });
    const [name, age] = await client.mget("user:1:name", "user:1:age");
    console.log(name, age); // Alice 25

    // APPEND: String mein text jodo
    await client.set("greeting", "Hello");
    await client.append("greeting", " World");
    console.log(await client.get("greeting")); // "Hello World"

    // STRLEN: String ki length
    const len = await client.strlen("greeting");
    console.log(len); // 11

    client.disconnect();
}

strings();
```

#### Real-Life Use:
- **Session tokens** store karna
- **API rate limiting** (`INCR` se counter badhana)
- **Simple caching** (JSON string mein store karna)
- **Feature flags** on/off rakhna

---

### 2. Hashes

**Objects store karne ke liye perfect.** Ek key ke andar multiple field-value pairs hote hain.

```
┌─────────────────────────────────────┐
│           Hash: user:1              │
├───────────────┬─────────────────────┤
│    Field      │      Value          │
├───────────────┼─────────────────────┤
│    name       │      "Alice"        │
│    age        │      "30"           │
│    email      │      "a@b.com"     │
└───────────────┴─────────────────────┘
```

#### Commands & Code:

```javascript
import client from "./client.js";

async function hash() {
    // HSET: Multiple fields set karo ek baar mein
    await client.hset("user:1", "name", "alice", "age", 30);

    // HGET: Single field retrieve karo
    const name = await client.hget("user:1", "name");
    console.log(`Get name: ${name}`); // alice

    // HGETALL: Saare fields retrieve karo
    const user = await client.hgetall("user:1");
    console.log(user); // { name: "alice", age: "30" }

    // HDEL: Field delete karo
    await client.hdel("user:1", "age");

    // HEXIST: Check karo field exist karta hai ya nahi
    const exists = await client.hexists("user:1", "name");
    console.log(exists); // 1 (true)

    // HINCRBY: Number field ko increment karo
    await client.hset("user:1", "loginCount", 0);
    await client.hincrby("user:1", "loginCount", 1);
    console.log(await client.hget("user:1", "loginCount")); // 1

    // HKEYS / HVALS: Sirf keys ya sirf values
    const fields = await client.hkeys("user:1");
    const values = await client.hvals("user:1");
    console.log(fields, values);

    client.disconnect();
}

hash();
```

#### Hash vs String (JSON) — Kaun Better Hai?

```
┌──────────────────────┬───────────────────────┐
│    String (JSON)     │       Hash            │
├──────────────────────┼───────────────────────┤
│ Pura object ek saath │ Individual fields     │
│ read/write hota hai  │ access kar sakte ho   │
│                      │                       │
│ GET user:1 → pura    │ HGET user:1 name →    │
│ JSON parse karo      │ sirf name milta hai   │
│                      │                       │
│ Memory: Zyada        │ Memory: Kam           │
│ Speed: Slow (partial)│ Speed: Fast (partial) │
└──────────────────────┴───────────────────────┘
```

**Verdict**: Agar aapko partial updates chahiye (sirf name change karna hai), toh **Hash** use karo. Agar pura object ek saath chahiye, toh **String (JSON)** bhi theek hai.

---

### 3. Lists

**Ordered collection** — LIFO (Stack) ya FIFO (Queue) dono ban sakte ho.

```
LPUSH → [3, 2, 1] ← RPUSH

LPUSH (Left Push):  [new, 3, 2, 1]
RPUSH (Right Push): [1, 2, 3, new]

LPOP: [2, 1]  (1 nikla)
RPOP: [2]     (2 nikla)
```

#### Commands & Code:

```javascript
import client from "./client.js";

async function lists() {
    // RPUSH: Right side pe add karo
    await client.rpush("tasks", "task1", "task2", "task3");

    // LPUSH: Left side pe add karo
    await client.lpush("tasks", "task0");

    // LRANGE: Range mein elements lo
    const allTasks = await client.lrange("tasks", 0, -1);
    console.log(allTasks); // ["task0", "task1", "task2", "task3"]

    // LPOP / RPOP: Ek side se nikalo
    const first = await client.lpop("tasks"); // "task0"
    const last = await client.rpop("tasks");  // "task3"

    // LLEN: List ki length
    const len = await client.llen("tasks");
    console.log(len); // 2

    // LINDEX: Specific index pe value
    const item = await client.lindex("tasks", 0);
    console.log(item); // "task1"

    // LSET: Specific index pe value set karo
    await client.lset("tasks", 0, "updated-task");

    // BRPOP: Blocking pop (Queue pattern ke liye)
    // Jab tak queue mein data nahi aata, wait karta hai
    // const job = await client.brpop("email:queue", 30); // 30 sec timeout

    client.disconnect();
}

lists();
```

#### Real-Life Use:
- **Message queues** banana (LPUSH + BRPOP)
- **Recent activity feeds** maintain karna
- **Task queues** for background jobs

---

### 4. Sets

**Unique elements ka collection** — Order matter nahi karta, duplicates nahi hote.

```
┌─────────────────────────────┐
│         Set: fruits         │
├─────────────────────────────┤
│  apple  ✓                   │
│  banana ✓                   │
│  cherry ✓                   │
│  mango  ✓                   │
│  (apple duplicate nahi!)    │
└─────────────────────────────┘
```

#### Commands & Code:

```javascript
import client from "./client.js";

async function sets() {
    // SADD: Members add karo
    await client.sadd("fruits", "apple", "banana", "cherry", "mango");

    // SMEMBERS: Saare members lo
    const fruits = await client.smembers("fruits");
    console.log(fruits); // ["apple", "banana", "cherry", "mango"]

    // SISMEMBER: Check karo member hai ya nahi
    const hasBanana = await client.sismember("fruits", "banana");
    console.log(hasBanana); // 1 (true)

    // SREM: Member remove karo
    await client.srem("fruits", "apple");

    // SCARD: Set ki size
    const size = await client.scard("fruits");
    console.log(size); // 3

    // --- SET OPERATIONS ---

    // SINTER: Common elements (Intersection)
    await client.sadd("set1", "a", "b", "c");
    await client.sadd("set2", "b", "c", "d");
    const intersection = await client.sinter("set1", "set2");
    console.log(intersection); // ["b", "c"]

    // SUNION: Saare elements (Union)
    const union = await client.sunion("set1", "set2");
    console.log(union); // ["a", "b", "c", "d"]

    // SDIFF: Difference (Pehle set mein jo dusre mein nahi)
    const difference = await client.sdiff("set1", "set2");
    console.log(difference); // ["a"]

    client.disconnect();
}

sets();
```

#### Real-Life Use:
- **Unique user tracking** (jo users online hain)
- **Tags system** (blog post ke tags)
- **Friend suggestions** (mutual friends = intersection)
- **Coupon codes** (unique codes track karna)

---

### 5. Sorted Sets (ZSets)

**Har element ka ek score hota hai** — score ke basis pe order hota hai. Leaderboards ke liye PERFECT!

```
┌─────────────────────────────────────────┐
│       Sorted Set: leaderboard           │
├──────────┬──────────────────────────────┤
│  Score   │  Member                      │
├──────────┼──────────────────────────────┤
│   200    │  Bob                          │
│   150    │  Charlie                      │
│   100    │  Alice                        │
└──────────┴──────────────────────────────┘
       (Highest score = Rank 1)
```

#### Commands & Code:

```javascript
import client from './client.js';

async function sortsets() {
    // ZADD: Members with scores add karo
    await client.zadd("leaderboard:1", 100, "Alice");
    await client.zadd("leaderboard:1", 200, "Bob", 150, "Charlie");

    // ZRANGE: Range mein members lo (ascending order)
    const leaderboard = await client.zrange("leaderboard:1", 0, -1, "WITHSCORES");
    console.log(leaderboard);
    // ["Alice", "100", "Charlie", "150", "Bob", "200"]

    // ZREVRANGE: Reverse order (descending — highest first)
    const topPlayers = await client.zrevrange("leaderboard:1", 0, 2, "WITHSCORES");
    console.log(topPlayers); // ["Bob", "200", "Charlie", "150", "Alice", "100"]

    // ZSCORE: Specific member ka score
    const bobScore = await client.zscore("leaderboard:1", "Bob");
    console.log(`Bob score: ${bobScore}`); // 200

    // ZRANK: Member ka rank (lowest score = rank 0)
    const charlieRank = await client.zrank("leaderboard:1", "Charlie");
    console.log(`Charlie Rank: ${charlieRank}`); // 1

    // ZINCRBY: Score increment karo
    await client.zincrby("leaderboard:1", 50, "Alice");
    console.log(await client.zscore("leaderboard:1", "Alice")); // 150

    // ZREM: Member remove karo
    await client.zrem("leaderboard:1", "Alice");

    // ZRANGEBYSCORE: Score range mein members lo
    const midRange = await client.zrangebyscore("leaderboard:1", 100, 200);

    client.disconnect();
}

sortsets();
```

#### Real-Life Use:
- **Gaming leaderboards** (scores ke basis pe rank)
- **Priority queues** (priority score = score)
- **Time-series data** (timestamp as score)
- **Rate limiting** (timestamp-based sliding window)

---

### 6. Streams

**Append-only log structure** — Messages/events store karne ke liye. Kafka jaisa but simpler.

```
┌─────────────────────────────────────────────────────────┐
│  Stream: mystream                                       │
├──────────┬──────────────────────────────────────────────┤
│  ID      │  Data                                        │
├──────────┼──────────────────────────────────────────────┤
│ 1234-0   │ { sensor-id: 1234, temperature: 25 }        │
│ 1235-0   │ { sensor-id: 1234, temperature: 26 }        │
│ 1236-0   │ { sensor-id: 1234, temperature: 24 }        │
└──────────┴──────────────────────────────────────────────┘
```

#### Commands & Code:

```javascript
import client from "./client.js";

async function stream() {
    // XADD: Stream mein entry add karo
    await client.xadd("mystream", "*",
        "sensor-id", 1234,
        "temperature", 25
    );
    // "*" auto-generate karta hai unique ID (timestamp-sequence)

    // Add another entry
    await client.xadd("mystream", "*",
        "sensor-id", 1234,
        "temperature", 26
    );

    // XRANGE: Entries retrieve karo (oldest first)
    const entries = await client.xrange("mystream", "-", "+");
    console.log(entries);

    // XREVRANGE: Entries retrieve karo (newest first)
    const recent = await client.xrevrange("mystream", "+", "-");

    // XLEN: Stream ki length
    const len = await client.xlen("mystream");
    console.log(`Total entries: ${len}`);

    // XREAD: Naya data stream karo (blocking)
    // const newEntries = await client.xread(
    //     "COUNT", 10,
    //     "BLOCK", 5000,  // 5 sec wait
    //     "STREAMS", "mystream", "0"
    // );

    client.disconnect();
}

stream();
```

#### Real-Life Use:
- **Event sourcing** (audit logs)
- **IoT sensor data** store karna
- **Activity feeds** (user actions track karna)
- **Message queues** with persistence

---

### 7. Bitmaps

**Bit-level operations** — Extremely memory efficient! Har user ke liye sirf 1 bit use hota hai.

```
┌──────┬──────┬──────┬──────┬──────┬──────┐
│User 1│User 2│User 3│User 4│User 5│User 6│
│  1   │  0   │  1   │  1   │  0   │  1   │
└──────┴──────┴──────┴──────┴──────┴──────┘
  ON   OFF    ON    ON    OFF    ON
```

#### Commands & Code:

```javascript
import client from "./client.js";

async function bitmaps() {
    // SETBIT: Specific offset pe bit set karo
    await client.setbit("daily:login:2024-01-15", 0, 1); // User 0 logged in
    await client.setbit("daily:login:2024-01-15", 2, 1); // User 2 logged in
    await client.setbit("daily:login:2024-01-15", 3, 1); // User 3 logged in
    await client.setbit("daily:login:2024-01-15", 5, 1); // User 5 logged in

    // GETBIT: Bit ki value lo
    const bit = await client.getbit("daily:login:2024-01-15", 0);
    console.log(bit); // 1 (User 0 logged in)

    // BITCOUNT: Kitne bits set hain (kitne users ne login kiya)
    const totalLogins = await client.bitcount("daily:login:2024-01-15");
    console.log(`Total logins today: ${totalLogins}`); // 4

    // BITOP: Bitmap operations
    // AND — Dono din login karne wale users
    await client.setbit("daily:login:2024-01-16", 0, 1);
    await client.setbit("daily:login:2024-01-16", 2, 1);
    await client.bitop("AND", "both-days",
        "daily:login:2024-01-15",
        "daily:login:2024-01-16"
    );
    const bothDays = await client.bitcount("both-days");
    console.log(`Users active both days: ${bothDays}`); // 2

    client.disconnect();
}

bitmaps();
```

#### Real-Life Use:
- **Daily active users** track karna (sirf 1 bit per user!)
- **Feature flags** (1 million users ke liye sirf 125KB!)
- **User permissions** (bit 1 = permission granted)
- **Weekly/monthly login tracking**

**Memory Magic:**
```
1 Million users track karne ke liye:
  Traditional: 1,000,000 × 8 bytes = 8 MB
  Bitmap:      1,000,000 bits = 125 KB  🤯
```

---

### 8. HyperLogLog

**Approximate counting** — Crores of unique elements count karo sirf **12 KB memory** mein! Exact nahi hota but 0.81% error rate hai.

```
┌─────────────────────────────────────────┐
│     HyperLogLog: unique:visitors        │
├─────────────────────────────────────────┤
│  PFADD → item1, item2, item3...        │
│  PFCOUNT → ~approximate unique count    │
│                                         │
│  Memory: Sirf 12 KB (fixed!)            │
│  Accuracy: ~99.19%                      │
└─────────────────────────────────────────┘
```

#### Commands & Code:

```javascript
import client from "./client.js";

async function hll() {
    // PFADD: Elements add karo
    await client.pfadd("hll", "item1", "item2");
    console.log("PFADD hll: Added items");

    // PFCOUNT: Approximate unique count
    const count = await client.pfcount("hll");
    console.log(`PFCOUNT hll: ${count}`); // ~2

    // PFMERGE: Do HyperLogLogs merge karo
    await client.pfadd("hll:day1", "user1", "user2", "user3");
    await client.pfadd("hll:day2", "user2", "user3", "user4");
    await client.pfmerge("hll:week", "hll:day1", "hll:day2");

    const weeklyUnique = await client.pfcount("hll:week");
    console.log(`Weekly unique visitors: ${weeklyUnique}`); // ~4

    client.disconnect();
}

hll();
```

#### Real-Life Use:
- **Unique website visitors** count karna (billions of users!)
- **Unique search queries** track karna
- **Social media unique reach** calculate karna
- **Real-time analytics** with minimal memory

---

### 9. Geospatial (Geo)

**Location data store karo aur distance-based queries karo.**

```
┌─────────────────────────────────────────┐
│         GEO: cities                     │
├─────────────────────────────────────────┤
│  San Francisco  → (37.77, -122.42)      │
│  New York       → (40.71, -74.00)       │
│  London         → (51.50, -0.12)        │
│                                         │
│  GEODIST → Distance calculate karo      │
│  GEORADIUS → Nearby locations dhundho   │
└─────────────────────────────────────────┘
```

#### Commands & Code:

```javascript
import client from "./client.js";

async function geo() {
    // GEOADD: Locations add karo (longitude, latitude, name)
    await client.geoadd("cities",
        -122.4235, 37.7763, "San Francisco",
        -74.0060, 40.7128, "New York",
        -0.1276, 51.5074, "London"
    );
    console.log("Locations added!");

    // GEODIST: Do locations ke beech distance
    const distance = await client.geodist("cities",
        "San Francisco", "New York", "km"
    );
    console.log(`Distance: ${distance} km`); // ~4139 km

    // GEODIST in miles
    const distMiles = await client.geodist("cities",
        "San Francisco", "New York", "mi"
    );
    console.log(`Distance: ${distMiles} miles`);

    // GEORADIUS: Specific point ke aas paas locations dhundho
    const nearby = await client.georadius("cities",
        -122.4235, 37.7763,  // San Francisco coordinates
        5000, "km",          // 5000 km radius
        "WITHCOORD",         // Coordinates bhi do
        "ASC"                // Nearest pehle
    );
    console.log(nearby);

    client.disconnect();
}

geo();
```

#### Real-Life Use:
- **Food delivery apps** (nearest restaurant dhundho)
- **Uber/Ola** (nearest driver find karo)
- **Store locator** (aaspaas ki dukaan dikhao)
- **Pokemon Go** (nearby Pokemon show karo)

---

## 🧠 Redis Core Concepts

### 1. TTL (Time To Live) — Auto Expiry

Kisi bhi key ko time-based expire kar sakte ho:

```javascript
// Set with expiry (seconds)
await client.set("session:abc", "user123", "EX", 3600); // 1 hour

// Set with expiry (milliseconds)
await client.set("token:xyz", "data", "PX", 60000); // 1 min

// TTL check karo
const ttl = await client.ttl("session:abc");
console.log(`Expires in: ${ttl} seconds`);

// Expiry add/change karo existing key pe
await client.expire("mykey", 300); // 5 minutes

// Expiry remove karo
await client.persist("mykey");
```

### 2. Pub/Sub — Real-Time Messaging

```
┌──────────┐                    ┌──────────────┐
│ Publisher │ ── PUBLISH ──▶    │   Channel    │
│  (API)   │                    │ "notification"│
└──────────┘                    └──────┬───────┘
                                       │
                            ┌──────────┼──────────┐
                            ▼          ▼          ▼
                     ┌──────────┐ ┌──────────┐ ┌──────────┐
                     │Subscriber│ │Subscriber│ │Subscriber│
                     │  (App 1) │ │  (App 2) │ │  (App 3) │
                     └──────────┘ └──────────┘ └──────────┘
```

```javascript
// ========== SUBSCRIBER ==========
client.subscribe('notification', (err) => {
    if (err) {
        console.log('Failed to subscribe:', err.message);
        return;
    }
    console.log('Subscribed successfully');
});

client.on('message', (channel, message) => {
    console.log("Received on", channel, ":", JSON.parse(message));
});

// ========== PUBLISHER (API) ==========
app.post("/notifications", async (req, res) => {
    const payload = {
        title: req.body.title || "Default Title",
        createdAt: new Date().toISOString(),
    };

    const receivers = await client.publish("notification", JSON.stringify(payload));
    res.json({ message: `Notification sent to ${receivers} subscribers` });
});
```

### 3. Simple Queue (List-based)

```
┌───────────────────────────────────────────┐
│  LPUSH (Producer)    BRPOP (Consumer)     │
│       ┌───┐                              │
│  ──▶  │ J1 │──▶  [J1, J2, J3]  ──▶  │ J3 │
│       │ J2 │                             │
│       │ J3 │     Queue (FIFO)            │
│       └───┘                              │
└───────────────────────────────────────────┘
```

```javascript
const QUEUE_KEY = 'email:queue';

// Producer: Job add karo
app.post("/emails", async (req, res) => {
    const job = {
        to: req.body.to,
        subject: req.body.subject || 'No subject',
        body: req.body.body || 'No content',
        createdAt: new Date().toISOString()
    };

    await client.lpush(QUEUE_KEY, JSON.stringify(job));
    res.json({ queued: true, job });
});

// Consumer: Job process karo
app.get("/emails/process-one", async (req, res) => {
    const rawJob = await client.rpop(QUEUE_KEY);
    if (!rawJob) {
        return res.json({ message: "No jobs in the queue" });
    }
    const job = JSON.parse(rawJob);
    res.json({ message: "Email sent", job });
});
```

---

## 🏗️ Real-Life Usages & Projects

### Project 1: OTP Verification System

```
┌──────────┐     ┌──────────┐     ┌──────────┐
│  User    │────▶│  Server  │────▶│  Redis   │
│ Requests │     │ Generates│     │ Stores   │
│ OTP      │     │ 6-digit  │     │ OTP +    │
│          │     │ OTP      │     │ TTL: 30s │
└──────────┘     └──────────┘     └──────────┘
```

```javascript
// OTP generate aur store karo (30 second expiry)
function otpKey(phone) {
    return `otp:${phone}`;
}

app.post("/otp", async (req, res) => {
    const { phone } = req.body;
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // 30 second mein expire ho jayega
    await client.set(otpKey(phone), otp, 'EX', 30);
    res.json({ message: 'OTP SENT', otp }); // Production mein SMS bhejo
});

// OTP verify karo
app.post("/otp/verify", async (req, res) => {
    const { phone, otp } = req.body;
    const savedOtp = await client.get(otpKey(phone));

    if (!savedOtp) {
        return res.status(400).json({ message: 'OTP expired or not found' });
    }
    if (savedOtp !== otp) {
        return res.status(400).json({ message: "Invalid OTP" });
    }

    // Verify ho gaya, delete karo
    client.del(otpKey(phone));
    res.json({ message: "OTP verified successfully" });
});

// TTL check karo
app.get("/otp/:phone/ttl", async (req, res) => {
    const ttl = await client.ttl(otpKey(req.params.phone));
    res.json({ ttl });
});
```

### Project 2: Site Banner (Dynamic Content)

```javascript
const BANNER_KEY = "app:banner";

// Banner set karo (admin se)
app.post("/banner", async (req, res) => {
    await client.set(BANNER_KEY, req.body.message || "Welcome to Redis");
    res.json({ success: true });
});

// Banner lo (frontend se)
app.get("/banner", async (req, res) => {
    const message = await client.get(BANNER_KEY);
    res.json({ message });
});

// Banner delete karo
app.delete("/banner", async (req, res) => {
    await client.del(BANNER_KEY);
    res.json({ success: true });
});

// Banner exist karta hai?
app.get("/banner/exists", async (req, res) => {
    const exists = await client.exists(BANNER_KEY);
    res.json({ exists: Boolean(exists) });
});
```

### Project 3: User Profile Cache (JSON vs Hash)

```javascript
// JSON method — pura object ek saath
app.post("/user/:id/json", async (req, res) => {
    await client.set(`user:${req.params.id}:json`, JSON.stringify(req.body));
    res.json({ savedAt: "json" });
});

app.get("/user/:id/json", async (req, res) => {
    const raw = await client.get(`user:${req.params.id}:json`);
    res.json({ user: raw ? JSON.parse(raw) : null });
});

// Hash method — individual fields access kar sakte ho
app.post("/user/:id/hash", async (req, res) => {
    await client.hset(`user:${req.params.id}:hash`, req.body);
    res.json({ savedAt: "hash" });
});

app.get("/user/:id/hash", async (req, res) => {
    const user = await client.hgetall(`user:${req.params.id}:hash`);
    res.json({ user });
});
```

### Project 4: Global Leaderboard System

```javascript
const LEADERBOARD_KEY = 'leaderboard:global';

// Player ka score update karo
async function updatePlayerScore(playerId, points, username) {
    await client.zincrby(LEADERBOARD_KEY, points, playerId);
    await client.hset(`user:${playerId}`, {
        username: username,
        updatedAt: Date.now().toString()
    });
}

// Top 10 players lo
async function getTopLeaderboard(limit = 10) {
    const topPlayers = await client.zrevrange(
        LEADERBOARD_KEY, 0, limit - 1, 'WITHSCORES'
    );

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

// "Mere around" players dikhaao
async function getPlayersAroundMe(playerId, windowSize = 2) {
    const rank = await client.zrevrank(LEADERBOARD_KEY, playerId);
    if (rank === null) return [];

    const start = Math.max(0, rank - windowSize);
    const end = rank + windowSize;
    const nearPlayers = await client.zrange(
        LEADERBOARD_KEY, start, end, 'WITHSCORES'
    );

    const results = [];
    for (let i = 0; i < nearPlayers.length; i += 2) {
        results.push({
            value: nearPlayers[i],
            score: parseFloat(nearPlayers[i + 1])
        });
    }
    return results;
}
```

### Project 5: BullMQ — Production Queue System

```javascript
import { Queue, Worker } from "bullmq";

const emailQueue = new Queue('emails', { connection: client });

// Worker: Background mein jobs process karo
const worker = new Worker('emails', async (job) => {
    console.log("Processing email job", job.id, job.name, job.data);

    // Simulate email sending (2 second lag)
    await new Promise((resolve) => setTimeout(resolve, 1500));

    console.log("Complete email job", job.id);
    return { success: true };
}, { connection: client });

worker.on("completed", (job) => {
    console.log("✅ Job completed:", job.id);
});

worker.on("failed", (job, err) => {
    console.log("❌ Job failed:", job.id, err);
});

// API: Welcome email queue mein dalo
app.post("/welcome-email", async (req, res) => {
    const job = emailQueue.add("send-welcome-email",
        {
            to: req.body.to,
            name: req.body.name || "learner",
        },
        {
            attempts: 3,                    // 3 baar retry karo
            backoff: {
                type: "exponential",         // Har retry pe double wait
                delay: 1000                  // 1s → 2s → 4s
            },
        }
    );
    res.json({
        message: "Welcome email job added to queue",
        jobId: (await job).id
    });
});
```

### Project 6: API Caching with Expiry

```javascript
import express from "express";
import client from "./client.js";
import axios from "axios";

const app = express();

// External API call + Redis caching
app.get("/", async (req, res) => {
    // Pehle cache check karo
    const cachedData = await client.get("todoList");

    if (cachedData) {
        console.log("📦 Serving from cache");
        return res.json(JSON.parse(cachedData));
    }

    // Cache miss → API call karo
    console.log("🌐 Fetching from API");
    const { data } = await axios.get("https://jsonplaceholder.typicode.com/todos");

    // Cache mein save karo (30 second ke liye)
    await client.set("todoList", JSON.stringify(data));
    await client.expire("todoList", 30);

    res.json(data);
});

app.listen(3000, () => {
    console.log("Server is up on 3000");
});
```

---

## 💡 Caching Strategies

### Strategy 1: Cache-Aside (Lazy Loading)

```
┌──────┐    1. Check Cache    ┌───────┐
│ App  │ ──────────────────▶  │ Redis │
│      │ ◀──────────────────  │       │
│      │    2a. Cache Hit?    └───────┘
│      │    Return data ✅
│      │
│      │    2b. Cache Miss ❌
│      │ ──────────────────▶  ┌───────┐
│      │    3. Fetch from DB  │  DB   │
│      │ ◀──────────────────  │       │
│      │    4. Store in cache └───────┘
└──────┘
```

```javascript
async function getData(key) {
    // Step 1: Cache check
    let data = await client.get(key);
    if (data) return JSON.parse(data);

    // Step 2: Database se lo
    data = await db.collection.find({ key });

    // Step 3: Cache mein save (TTL ke saath)
    await client.set(key, JSON.stringify(data), "EX", 300);

    return data;
}
```

### Strategy 2: Write-Through

```
App → Write to Cache + DB simultaneously
```

```javascript
async function updateUser(id, data) {
    // DB mein write
    await db.collection.updateOne({ _id: id }, { $set: data });

    // Cache mein bhi write
    await client.set(`user:${id}`, JSON.stringify(data), "EX", 3600);
}
```

### Strategy 3: Write-Behind (Write-Back)

```
App → Write to Cache → Async batch write to DB
```

```javascript
async function logEvent(event) {
    // Cache mein turant likho
    await client.lpush("events:buffer", JSON.stringify(event));

    // Background mein batch mein DB mein write karo
    // (Scheduled job ya BullMQ worker use karo)
}
```

---

## ⚔️ Redis vs Other Databases

```
┌──────────────┬──────────────┬──────────────┬──────────────┐
│   Feature    │    Redis     │   MongoDB    │   MySQL      │
├──────────────┼──────────────┼──────────────┼──────────────┤
│ Speed        │ ⚡ 100K+ ops │ 🐢 10K ops   │ 🐢 5K ops    │
│ Storage      │ RAM (125GB+) │ Disk (TBs)   │ Disk (TBs)   │
│ Data Model   │ Structures   │ Documents    │ Tables       │
│ Persistence  │ Optional     │ Yes          │ Yes          │
│ Query        │ Key-based    │ Flexible SQL │ SQL          │
│ Use Case     │ Cache/Queue  │ Primary DB   │ Primary DB   │
│ Memory       │ High         │ Medium       │ Low          │
│ ACID         │ Partial      │ Yes          │ Yes          │
└──────────────┴──────────────┴──────────────┴──────────────┘
```

---

## ⚡ Tips & Best Practices

### ✅ Do's

```javascript
// 1. Connection pool use karo
const client = new Redis({ /* ... */ });

// 2. Pipeline se batch operations karo (network calls bachao)
const pipeline = client.pipeline();
pipeline.set("key1", "val1");
pipeline.set("key2", "val2");
pipeline.set("key3", "val3");
await pipeline.exec(); // Ek saath execute

// 3. TTL zaroor lagao (memory bachegi)
await client.set("temp:data", value, "EX", 3600);

// 4. Key naming convention follow karo
// ✅ Good:  "user:123:profile", "session:abc:token"
// ❌ Bad:   "u123", "data1", "temp"

// 5. Disconnect karo jab kaam ho jaye
client.disconnect();
```

### ❌ Don'ts

```javascript
// 1. Keys command mat use karo production mein (BLOCKS everything!)
// ❌ const keys = await client.keys("*");  // VERY SLOW!

// 2. Large values mat store karo (>100KB avoid karo)
// ❌ await client.set("huge", "1MB data..."); // Memory waste

// 3. Single key mein bahut zyada data mat dalo
// ❌ client.lpush("list", ...1_million_items);

// 4. Blocking operations main thread pe mat karo
// ❌ await client.brpop("queue", 0); // Infinite block!

// 5. Password hardcode mat karo
// ❌ const client = new Redis({ password: "12345" });
```

### 🔑 Key Naming Best Practices

```
✅ user:{id}:profile        → User profile data
✅ session:{token}          → Session data
✅ cache:{service}:{id}     → Cached API responses
✅ queue:{name}             → Queue jobs
✅ leaderboard:{scope}      → Sorted set scores
✅ otp:{phone}              → OTP verification
✅ rate:{ip}:{endpoint}     → Rate limiting counter
✅ token:{user}:refresh     → Refresh tokens
```

---

## 📚 Quick Reference — All Commands

```
┌─────────────────────────────────────────────────────────────────┐
│                    REDIS CHEAT SHEET                             │
├──────────┬──────────────────────────────────────────────────────┤
│ STRINGS  │ SET, GET, MSET, MGET, INCR, DECR, APPEND, STRLEN   │
│ HASHES   │ HSET, HGET, HGETALL, HDEL, HEXISTS, HINCRBY        │
│ LISTS    │ LPUSH, RPUSH, LPOP, RPOP, LRANGE, LLEN, BRPOP      │
│ SETS     │ SADD, SMEMBERS, SREM, SISMEMBER, SINTER, SUNION     │
│ SORTED   │ ZADD, ZRANGE, ZREVRANGE, ZSCORE, ZRANK, ZINCRBY    │
│ STREAMS  │ XADD, XRANGE, XREVRANGE, XLEN, XREAD               │
│ BITMAPS  │ SETBIT, GETBIT, BITCOUNT, BITOP                     │
│ HLL      │ PFADD, PFCOUNT, PFMERGE                             │
│ GEO      │ GEOADD, GEODIST, GEORADIUS, GEODIST                 │
│ GENERAL  │ DEL, EXISTS, EXPIRE, TTL, PERSIST, KEYS, RENAME     │
│ SERVER   │ PING, DBSIZE, FLUSHDB, INFO, AUTH                   │
└──────────┴──────────────────────────────────────────────────────┘
```

---

## 🎯 Summary

| Data Type | Memory | Speed | Best For |
|-----------|--------|-------|----------|
| **Strings** | Low | ⚡⚡⚡ | Simple KV, counters, JSON |
| **Hashes** | Low | ⚡⚡⚡ | Objects, user profiles |
| **Lists** | Medium | ⚡⚡⚡ | Queues, activity feeds |
| **Sets** | Medium | ⚡⚡⚡ | Unique items, tags |
| **Sorted Sets** | Medium | ⚡⚡⚡ | Leaderboards, priorities |
| **Streams** | Medium | ⚡⚡ | Event logs, messaging |
| **Bitmaps** | Very Low | ⚡⚡⚡ | User tracking, flags |
| **HLL** | Fixed 12KB | ⚡⚡⚡ | Approximate counting |
| **Geo** | Medium | ⚡⚡⚡ | Location services |

---

> **"Redis seekhna = Backend performance samajhna. Jab tum Redis achhe se samajh loge, tumhare apps 10x faster ho jayenge!"** 🚀

---

*Made with ❤️ for learning Redis from scratch in Hinglish!*
