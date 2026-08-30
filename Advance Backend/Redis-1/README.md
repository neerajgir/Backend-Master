# 🔴 Redis-1 — My Learning Repo (Hinglish Guide)

> Ye mera personal learning repo hai jisme maine **Redis** ke core concepts hands-on seekhe — Caching, Rate Limiting, OTP with TTL, aur Background Job Queues (BullMQ). Is README mein main saare concepts **Hinglish** mein explain kar raha hoon with code snippets, diagrams aur real-life examples.

---

## 📚 Table of Contents

1. [Redis Kya Hai?](#1-redis-kya-hai)
2. [Redis vs MongoDB — Deep Comparison](#2-redis-vs-mongodb--deep-comparison)
3. [Redis Architecture (Diagram)](#3-redis-architecture-diagram)
4. [Core Data Structures](#4-core-data-structures)
5. [Important Redis Concepts (Deep Knowledge)](#5-important-redis-concepts-deep-knowledge)
6. [Repo Ke Real Implementations](#6-repo-ke-real-implementations)
7. [Diagrams — Concept Explanations](#7-diagrams--concept-explanations)
8. [Real-Life Usages](#8-real-life-usages)
9. [Setup & Run](#9-setup--run)
10. [Best Practices & Gotchas](#10-best-practices--gotchas)

---

## 1. Redis Kya Hai?

**Redis** = **RE**mote **DI**ctionary **S**erver

Simple bhasha mein: Redis ek **in-memory key-value database** hai. Matlab saara data **RAM mein store hota hai**, disk pe nahi (jaise MongoDB/MySQL mein hota hai).

### RAM vs Disk — Kyun Fast Hai?

```
Disk Read (MongoDB)   ≈ 10-100 ms   🐢
RAM Read (Redis)      ≈ 0.1-1 ms    🚀 (100x faster!)
```

Kyunki RAM access nanoseconds mein hoti hai, Redis ko **caching** ke liye use karte hain. Ye single-threaded hai lekin **event-driven + I/O multiplexing (epoll/kqueue)** ki wajah se ek second mein **1 lakh+ operations** handle kar leta hai.

### Ek Line MeinSamajh Lo
> MongoDB = "Data permanently rakhna hai" 📦
> Redis = "Data fast chahiye, thoda temporary hai" ⚡

---

## 2. Redis vs MongoDB — Deep Comparison

| Feature | Redis | MongoDB |
|---|---|---|
| Storage | In-memory (RAM) | Disk (BSON files) |
| Data Model | Key-Value + Data Structures | Document (JSON-like) |
| Speed | ~0.1ms (extremely fast) | ~5-50ms |
| Persistence | Optional (RDB/AOF snapshots) | Always persisted |
| Queries | Key-based (no complex queries) | Rich queries, aggregation |
| Use Case | Caching, sessions, queues, rate limiting | Main database, complex data |
| Data Size | Limited by RAM | Disk jitna bhi |
| Durability | Kam (by default) | High |

**Kab kya use karein?**
- User profile, orders, products → **MongoDB** (permanent data)
- Session, OTP, cache, rate counter, job queue → **Redis** (temporary/fast data)

> ⚡ **Real combo:** Dono saath use karo. MongoDB = source of truth, Redis = speed layer.

---

## 3. Redis Architecture (Diagram)

```
                        ┌─────────────────────────────┐
                        │         REDIS SERVER         │
                        │      (Single Threaded)       │
                        │                              │
  ┌──────────┐  GET/SET  │  ┌────────────────────────┐ │
  │ Node.js  │◄─────────►│  │      RAM (Memory)      │ │
  │  App     │  ioredis  │  │                        │ │
  └──────────┘  client   │  │  user:all     → [...]  │ │
                        │  │  otp:a@b.com  → 438201 │ │
  ┌──────────┐           │  │  rate_limit:1.2.3 → 3  │ │
  │ BullMQ   │◄─────────►│  │  bull:emailQueue → {}  │ │
  │  Worker  │           │  └────────────────────────┘ │
  └──────────┘           │                              │
                        │  Persistence (optional):    │
                        │  RDB snapshots / AOF logs   │
                        └─────────────────────────────┘
```

**Key points:**
- Sab kuch **RAM** mein rehta hai → isliye itna fast
- **Single-threaded** core hai (commands execute sequentially) → race conditions nahi, lekin blocking commands se bacho (`KEYS *` production mein kabhi mat chalao)
- Client (ioredis) **TCP connection** ke through baat karta hai — RESP protocol

---

## 4. Core Data Structures

Redis sirf string-value nahi hai — ye rich **data structures** deta hai:

### 4.1 String (sabse common)
```bash
SET name "Neeraj"        # set
GET name                 # "Neeraj"
SET otp:email "123456" EX 30   # 30 sec TTL ke saath
INCR views               # counter (atomic!) → 1, 2, 3...
```
📌 **Use:** Cache, OTP, counters, rate limiting, session tokens

### 4.2 Hash (object jaisa)
```bash
HSET user:1 name "Neeraj" age 22
HGET user:1 name         # "Neeraj"
HGETALL user:1           # poora object
```
📌 **Use:** User sessions, product details, object caching

### 4.3 List (doubly linked list)
```bash
LPUSH tasks "email1"     # left se push
RPUSH tasks "email2"     # right se push
LPOP tasks               # left se pop
LRANGE tasks 0 -1        # saare elements
```
📌 **Use:** Job queues, recent activity feeds, chat history

### 4.4 Set (unique values, unordered)
```bash
SADD followers:1 "user2" "user3"
SISMEMBER followers:1 "user2"   # true/false — O(1)!
SINTER followers:1 followers:2  # common followers
```
📌 **Use:** Likes, followers, tags, unique visitors

### 4.5 Sorted Set (ZSET — score ke saath sorted) ⭐
```bash
ZADD leaderboard 100 "neeraj"
ZADD leaderboard 250 "aman"
ZREVRANGE leaderboard 0 2       # top 3 players!
ZRANK leaderboard "neeraj"      # rank nikalo
```
📌 **Use:** Leaderboards, trending topics, priority queues, rate limiters (sliding window)

### 4.6 Streams (log jaisa append-only)
```bash
XADD orders * user_id 1 product "phone"
XRANGE orders - +        # saare events read karo
```
📌 **Use:** Event sourcing, activity logs, Kafka-jaisa messaging

---

## 5. Important Redis Concepts (Deep Knowledge)

### 5.1 TTL (Time To Live) — Data Ka Expiry 🕐

Har key pe expiry laga sakte ho:

```js
await client.set("otp:user@mail.com", "438201", "EX", 30);  // 30 seconds
await client.expire("session:abc", 3600);                    // 1 hour
await client.ttl("otp:user@mail.com");                       // bachi hui seconds
```

- TTL khatam → key **automatically delete** ho jaati hai
- **Use cases:** OTP, session tokens, password reset links, cache
- `PERSIST key` → TTL hata do (permanent bana do)

### 5.2 Cache-Aside Pattern (Lazy Loading) — Sabse Important! 🔥

Ye is repo ka core concept hai. Flow:

```
   Request aaya
        │
        ▼
┌───────────────┐
│ Redis check   │ ──► Cache HIT? ──► Yes ──► Return cached data ⚡ (0.1ms)
└───────────────┘                        No
        │                                 │
        ▼                                 ▼
   Cache MISS                    MongoDB se fetch 🐢
                                         │
                                         ▼
                                  Redis mein SET karo
                                         │
                                         ▼
                                  Return data
```

**Code (is repo se — `index.js`):**
```js
app.get("/redis-get", async (req, res) => {
    // Step 1: Pehle Redis se check karo
    const cached = await client.get("user:all")
    if (cached) {
        return res.json(JSON.parse(cached))   // CACHE HIT ⚡
    }

    // Step 2: MISS hua toh MongoDB se lao
    const user = await User.find({})

    // Step 3: Redis mein daal do (next time ke liye)
    await client.set("user:all", JSON.stringify(user))
    return res.json({ user })
})
```

### 5.3 Cache Invalidation — Sabse Bada Problem! 🗑️

Cache mein **stale (purana) data** aa jaye toh problem hai. Isliye jab bhi data update/delete hota hai, cache ko bhi clear karo:

```js
app.post("/create", async (req, res) => {
    await client.del("user:all")              // ⚡ CACHE INVALIDATE!
    const user = await User.create({...})     // DB update
    ...
})
```

**Golden Rule:**
> Data write hua? → Us se related cache **DELETE** karo. Next read pe fresh data load ho jayega.

**Strategies:**
| Strategy | Kaise | Kab Use Karein |
|---|---|---|
| **Cache-Aside** | Read pe load, write pe delete | Default choice ✅ |
| **Write-Through** | Write pe DB + Redis dono update | Strong consistency chahiye |
| **TTL-based** | Expiry pe auto-refresh | Kabhi kabhi stale data chalega |

### 5.4 Rate Limiting (Fixed Window) — API Ko Bachao 🚦

`INCR` + `EXPIRE` ka combo — atomic counter:

**Code (is repo se — `middleware/ratelimit.js`):**
```js
export const rateLimit = async (req, res, next) => {
    const ip = req.ip
    const key = `rate_limit:${ip}`
    
    const requests = await client.incr(key)          // counter badhao
    if (requests == 1) await client.expire(key, 60)  // pehli request pe timer start
    
    if (requests > 5)                                 // 60 sec mein max 5 requests
        return res.status(429).json({ message: "Too many requests" })
    next();
}
```

**Diagram:**
```
IP: 192.168.1.5
│
├─ Request 1 → INCR → 1 → EXPIRE(60s) set → ✅ Allow
├─ Request 2 → INCR → 2                    → ✅ Allow
├─ Request 3 → INCR → 3                    → ✅ Allow
├─ Request 4 → INCR → 4                    → ✅ Allow
├─ Request 5 → INCR → 5                    → ✅ Allow
├─ Request 6 → INCR → 6                    → ❌ 429 Too Many Requests
│
└─ 60 sec baad → key expire → counter reset → dobara allow
```

> ⚠️ **Gotcha:** `INCR` aur `EXPIRE` alag commands hain. Agar `EXPIRE` se pehle server crash ho gaya → key kabhi expire nahi hogi (memory leak!). Production mein **Lua script** ya `SET key val EX 60 NX` use karo atomicity ke liye.

### 5.5 Persistence — RAM Toh Volatile Hai! 💾

Server restart → RAM saaf. Data bachane ke liye 2 options:

| Method | Kya Karta Hai | Trade-off |
|---|---|---|
| **RDB** (snapshots) | Har 5 min pe poora data disk pe dump | Fast, lekin last snapshot ke baad ka data loss |
| **AOF** (Append Only File) | Har write command log hoti hai | Zyada durable, lekin file badi |

> Cache ke liye persistence ki zaroorat nahi — DB toh waise bhi MongoDB mein hai. Isliye cache-only Redis mein RDB/AOF off kar sakte ho.

### 5.6 Eviction Policies — RAM Full Ho Jaye Toh? 🧹

Jab Redis memory full ho jaye, kya delete kare? `maxmemory-policy` se decide hota hai:

```
allkeys-lru    → sabse purani (least recently used) key delete  ← cache ke liye BEST
volatile-lru   → sirf TTL wali keys mein se LRU delete
allkeys-random → koi bhi random key delete
noeviction     → kuch mat delete, error do (default)
```

### 5.7 Pub/Sub — Real-time Messaging 📢

```
   PUBLISHER ──publish("news")──► ┌─────────┐ ──► SUBSCRIBER 1
                                  │  Redis  │ ──► SUBSCRIBER 2
                                  │ Channel │ ──► SUBSCRIBER 3
```
- Message **store nahi hota** — sirf live subscribers ko milta hai
- **Use:** Live chat, notifications, real-time updates

---

## 6. Repo Ke Real Implementations

Is repo mein ye 4 real-world patterns implement kiye hain:

### 📁 File Structure
```
Redis-1/
├── index.js               → Express server (caching, OTP routes)
├── configs/client.js      → ioredis connection
├── configs/db.js          → MongoDB connection
├── middleware/ratelimit.js → Rate limiter (INCR + EXPIRE)
├── queue.js               → BullMQ Queue (producer)
├── worker.js              → BullMQ Worker (consumer)
├── libs/sendemail.js      → Email sending logic
└── models/user.model.js   → Mongoose User model
```

### 6.1 Redis Connection (`configs/client.js`)
```js
import Redis from "ioredis";

const client = new Redis({
    port: 6379,                        // default Redis port
    host: '127.0.0.1',                 // localhost
    db: 0,                             // database number (0-15)
    maxRetriesPerRequest: null         // retry karte raho, kabhi give up mat karo
})

export default client
```
> `maxRetriesPerRequest: null` — Redis down hone pe requests queue mein wait karengi, fail nahi hongi instantly.

### 6.2 API Caching + Invalidation (`index.js`)
Upar [section 5.2 & 5.3](#52-cache-aside-pattern-lazy-loading--sabse-important-) mein explained. Pattern:
- **GET** `/redis-get` → Cache check → MISS pe MongoDB → SET cache
- **POST** `/create` → DB write → `client.del("user:all")` cache invalidate

### 6.3 OTP System with TTL (`index.js`)
```js
// Generate + store with 30 sec expiry
const otp = Math.floor(100000 + Math.random() * 900000).toString();
await client.set(`otp:${email}`, otp, "EX", 30);

// Verify
const cachedOtp = await client.get(`otp:${email}`);
if (!cachedOtp) return res.json({ message: "otp expire" })  // TTL khatam
if (cachedOtp != otp) return res.status(400).json({ message: "Incorrect OTP" })
await client.del(`otp:${email}`)   // ✅ verified → ek baar hi use ho (single-use)
```

**Ye pattern perfect hai kyunki:**
- OTP auto-expire ho jata hai (30 sec) — manual cleanup ki zaroorat nahi
- Verify hone pe delete — **single-use OTP** (security ✅)
- RAM mein hai — MongoDB mein OTP store karna waste hai

### 6.4 Background Email Queue — BullMQ 📬

**Problem:** Email bhejna slow hota hai (2-5 sec). User ko wait kyu karwana?
**Solution:** Email ko queue mein daalo, worker background mein bhejega.

**Producer (`queue.js`):**
```js
import { Queue } from "bullmq";
import client from "./configs/client.js";

export const emailQueue = new Queue("emailQueue", { connection: client })
```

**Route mein (fast response):**
```js
app.post("/create", async (req, res) => {
    const user = await User.create({ name, email, password })
    await emailQueue.add("send-email", { email })   // ⚡ queue mein daala, bas!
    return res.status(200).json({ user })           // turant respond
})
```

**Consumer (`worker.js`):**
```js
import { Worker } from "bullmq";

export const worker = new Worker("emailQueue", async (job) => {
    console.log("Job started")
    await sendmail(job.data.email)    // background mein email gaya
    console.log("Job complete")
}, { connection: client })
```

**Flow Diagram:**
```
POST /create
     │
     ▼
┌──────────┐    add job     ┌──────────────┐
│ Express  │ ─────────────► │ Redis Queue  │
│  API     │  (instant)     │ (emailQueue) │
└──────────┘                └──────┬───────┘
     │                             │ pull jobs
     ▼                             ▼
  200 OK ✅                ┌──────────────┐
  (user ko wait            │   Worker     │ ──► sendmail() 📧
   nahi karna pada)        │ (separate    │
                           │  process)    │
                           └──────────────┘
```

> 💡 Worker ko `node worker.js` se **alag terminal/process** mein chalao. API aur email sending decoupled ho gaye — API fast rahegi chahe email service slow ho.

**BullMQ ke extra features:** retries, delayed jobs, job priorities, failed job tracking, repeatable jobs (cron jaisa).

---

## 7. Diagrams — Concept Explanations

### Caching — Pehli Request vs Baaki Requests
```
PEHLI REQUEST (Cache MISS):                BAAKI REQUESTS (Cache HIT):
                                          
Client ──► Redis ❌ miss                   Client ──► Redis ✅ hit
              │                                       │
              ▼                                       ▼
         MongoDB 🐢 (50ms)                       Client ⚡ (0.5ms)
              │                                  DONE! MongoDB
              ▼                                  tak gaya hi nahi
         Redis SET                                   
              │                                  
              ▼                                  
         Client (50ms)                           
```

### Rate Limiting Window
```
Timeline ─────────────────────────────────────►
│◄──────── 60 sec window ────────►│◄─────────►│
 Req1 Req2 Req3 Req4 Req5 Req6        
  ✅   ✅   ✅   ✅   ✅   ❌429
     
Window expire → naya counter → firse ✅
```

### OTP Lifecycle
```
Generate ──► SET otp:a@b.com 438201 EX 30
                    │
     ┌──────────────┴──────────────┐
     ▼                             ▼
30 sec ke andar verify          30 sec beet gaye
     │                             │
     ▼                             ▼
OTP match? ──► DEL key ✅      GET → nil
(single use)                   "otp expire" ❌
```

---

## 8. Real-Life Usages

Ye sab companies production mein Redis use karti hain:

| Use Case | Kaun Use Karta Hai | Kaise |
|---|---|---|
| **Caching** | Har badi company | DB results cache karo, DB load 90% kam |
| **Session Store** | Instagram, Netflix | Login sessions RAM mein → instant auth check |
| **Rate Limiting** | GitHub API, Twitter | "403 API rate limit exceeded" — ye Redis hi hai |
| **Leaderboards** | PUBG, Dream11 | Sorted Sets se real-time ranking |
| **OTP / Temp Codes** | WhatsApp, Paytm | TTL wali keys → auto-expiring OTP |
| **Job Queues** | Zomato, Swiggy | Order confirmation emails background mein |
| **Cart Storage** | Amazon, Flipkart | Hash mein cart items → fast add/remove |
| **Real-time Analytics** | YouTube | INCR se live view counters |
| **Pub/Sub** | Stock apps (Zerodha) | Live price updates sab clients ko |
| **Distributed Locks** | Microservices | `SET lock NX EX 10` — do servers same task na karein |
| **Location (GEO)** | Ola, Uber | GEO commands se "nearest driver" dhundo |

### Ek Real Scenario — Zomato Jaisa App 🍕
```
User "Order" click karta hai
   │
   ├─► Cart check          → Redis HASH (fast)
   ├─► Restaurant details  → Redis CACHE (miss pe MongoDB)
   ├─► Order create        → MongoDB (permanent)
   ├─► Email/SMS bhejo     → BullMQ QUEUE (background)
   └─► Delivery tracking   → Redis PUB/SUB (live updates)
```

---

## 9. Setup & Run

### Prerequisites
- Node.js
- Redis server chal raha ho (localhost:6379)
- MongoDB connection (`.env` mein `MONGO_URI`)

### Install & Start
```bash
# Install dependencies
npm install

# Terminal 1 — API server
npm run dev

# Terminal 2 — Email worker (separate process!)
node worker.js
```

### Redis CLI Se Testing
```bash
redis-cli
> KEYS *                        # saari keys dekho
> GET user:all                  # cached users
> TTL otp:user@mail.com         # OTP ki bachi hui life
> INCR rate_limit:::1           # rate counter manually badhao
> FLUSHALL                      # ⚠️ sab delete (sirf dev mein!)
```

### Test Endpoints
```bash
# Rate limit test — 6 baar jaldi jaldi hit karo
curl http://localhost:5000/get

# Cache test — dobara call karo, response time compare karo
curl http://localhost:5000/redis-get

# OTP flow
curl -X POST http://localhost:5000/send-otp -H "Content-Type: application/json" -d '{"email":"test@mail.com"}'
curl -X POST http://localhost:5000/verify-otp -H "Content-Type: application/json" -d '{"email":"test@mail.com","otp":"<otp>"}'
```

---

## 10. Best Practices & Gotchas ⚠️

1. **`KEYS *` production mein kabhi nahi** — poora Redis block kar deta hai. `SCAN` use karo.
2. **Hamesha TTL lagao cache keys pe** — warna stale data aur memory leak.
3. **Key naming convention follow karo** — `object:id:field` format (`user:101:cart`) readable aur organized.
4. **Bade values mat rakho** — single value ~500KB se zyada nahi honi chahiye.
5. **Cache stampede (thundering herd)** — hot key expire hote hi hazaaron requests DB pe aa jaati hain. Fix: lock ya early recomputation.
6. **`maxRetriesPerRequest: null`** — queue-based apps ke liye sahi, lekin API routes ke liye timeout set karo warna request hang.
7. **MongoDB = source of truth, Redis = speed** — Redis ko primary DB kabhi mat banao (persistence limited hai).

---

## 🎯 Summary — Ek Nazar Mein

| Concept | Redis Feature | Repo File |
|---|---|---|
| API Caching | `GET` / `SET` / `DEL` | `index.js` (`/redis-get`) |
| Cache Invalidation | `DEL` on write | `index.js` (`/create`) |
| Rate Limiting | `INCR` + `EXPIRE` | `middleware/ratelimit.js` |
| OTP with Expiry | `SET ... EX 30` | `index.js` (`/send-otp`) |
| Background Jobs | BullMQ Queue + Worker | `queue.js`, `worker.js` |

---

> **Next Learning Goals:** Redis Cluster & Replication, Sentinel (HA), Distributed Locks (Redlock), Lua Scripts, Sliding Window Rate Limiter with Sorted Sets, Redis Streams vs Kafka 🚀
