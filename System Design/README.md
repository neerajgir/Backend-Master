# 🏗️ System Design — Complete Learning Notes (Hinglish)

> Ye mera personal System Design learning repo hai. Yahan main sab kuch **Hinglish** mein notes karta hoon — taaki concepts easily samajh aayein aur kabhi na bhoolein. Har topic mein **diagram + code snippet + real-life example** sab kuch hai.

---

## 📚 Table of Contents

1. [System Design Kya Hota Hai?](#1-system-design-kya-hota-hai)
2. [Scaling and Its Types](#2-scaling-and-its-types-vertical-vs-horizontal)
3. [Nginx & Its Types (Docker Examples ke saath)](#3-nginx--its-types-with-docker-examples)
4. [Load Balancer](#4-load-balancer)
5. [Different Services on Different Servers + API Gateway](#5-different-services-on-different-servers--api-gateway)
6. [Monolith vs Microservices](#6-monolith-vs-microservices)
7. [Data Replication](#7-data-replication)
8. [Data Sharding](#8-data-sharding)
9. [Data Scaling (Database Scaling)](#9-data-scaling)
10. [Diagram Explanations](#10-diagram-explanations)
11. [Real-Life Usages](#11-real-life-usages)
12. [Interview Cheat Sheet](#12-interview-cheat-sheet)

---

## 1. System Design Kya Hota Hai?

**Simple bhasha mein:** System Design matlab ek aisa software architecture banana jo **scale** kare, **reliable** ho, aur **fast** ho — chahe 100 users hon ya 100 million.

Jab tum ek chhota project banate ho (jaise college project), to tumhare paas 1 server, 1 database hota hai. Lekin jab **Zomato jaisa app** banata hai jispe Diwali pe ek second mein **50,000 orders** aate hain — to ek server fail ho jayega. Yahi problem solve karne ke liye **System Design** seekhte hain.

### 🎯 System Design ke Core Goals

| Goal | Matlab | Example |
|------|--------|---------|
| **Scalability** | Zyada load handle karna | Instagram pe 1M likes ek saath |
| **Reliability** | System kabhi down na ho | Google 99.99% uptime |
| **Availability** | Hamesha accessible rahe | ATM kabhi bhi chale |
| **Maintainability** | Code easily update ho | Naya feature jaldi add ho |
| **Latency** | Response time kam ho | Amazon page 100ms mein load |
| **Consistency** | Sab jagah same data | Bank balance har jagah same |

### 🧩 Basic Building Blocks

```
   Client (Browser/App)
        │
        ▼
   Load Balancer  ←── traffic distribute karta hai
        │
   ┌────┴────┐
   ▼         ▼
Server 1   Server 2   ←── Application layer
   │         │
   └────┬────┘
        ▼
   Database (Primary + Replica)
        │
        ▼
   Cache (Redis) ←── fast data
```

### Deep Point 💡
Jab bhi koi system design karo, 3 sawal hamesha poochho:
1. **Kitne users?** (10K ya 10M?)
2. **Read-heavy ya write-heavy?** (Netflix = read-heavy, Twitter posting = write-heavy)
3. **Consistency chahiye ya availability?** (Bank = consistency, Instagram likes = availability)

---

## 2. Scaling and Its Types (Vertical vs Horizontal)

**Scaling** = jab traffic badh jaye to apne system ki capacity badhana.

### 🔼 Vertical Scaling (Scale UP)

**Matlab:** Same server ko **powerful** bana do. Chhota machine → Bada machine.

```
  BEFORE (4GB RAM, 2 CPU)          AFTER (64GB RAM, 16 CPU)
  ┌──────────────┐                 ┌──────────────────────┐
  │   SERVER     │                 │      SERVER          │
  │   💪 weak    │    ──────►      │      💪💪💪 strong   │
  └──────────────┘                 └──────────────────────┘
```

**Code example — Node.js app ko bigger server pe deploy:**

```bash
# Chhoti machine pe (2GB RAM) — app slow hai
# AWS pe t3.small → t3.2xlarge le lo. Bas!
# Koi code change nahi. Sirf machine upgrade.
```

**Pros:**
- Simple hai, code change nahi karna padta
- No data distribution complexity

**Cons:**
- **Single Point of Failure** — server gaya to sab gaya 💀
- Limited hai — kitna bhi bada server le lo, ek limit hoti hai (AWS max ~128 vCPU)
- Expensive hota jata hai (exponential cost)

### ↔️ Horizontal Scaling (Scale OUT)

**Matlab:** Same weak servers **zyada** add kar do. 1 server → 5 servers.

```
  BEFORE                 AFTER
  ┌──────┐               ┌──────┐  ┌──────┐  ┌──────┐
  │ Srv1 │   ──────►     │ Srv1 │  │ Srv2 │  │ Srv3 │
  └──────┘               └──────┘  └──────┘  └──────┘
                              ▲          ▲          ▲
                              └──────────┴──────────┘
                                   │
                             Load Balancer
```

**Code example — Node.js cluster mode (multiple processes):**

```javascript
// server.js — cluster module se horizontal scaling ek machine pe
const cluster = require("cluster");
const http = require("http");
const os = require("os");

const numCPUs = os.cpus().length;

if (cluster.isPrimary) {
  console.log(`Primary process ${process.pid} running`);

  // CPU cores jitne workers spawn karo
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  // Agar koi worker mar jaye, naya bana do
  cluster.on("exit", (worker) => {
    console.log(`Worker ${worker.process.pid} died. Restarting...`);
    cluster.fork();
  });
} else {
  // Har worker apna HTTP server chalayega (same port pe)
  http
    .createServer((req, res) => {
      res.writeHead(200);
      res.end(`Handled by process ${process.pid}\n`);
    })
    .listen(3000);

  console.log(`Worker ${process.pid} started`);
}
```

```bash
# Run karo aur dekho — har request alag process handle karta hai
node server.js

# curl se test:
# curl localhost:3000   → Handled by process 12345
# curl localhost:3000   → Handled by process 12346  (round-robin by OS)
```

**Docker Compose se real horizontal scaling:**

```yaml
# docker-compose.yml
services:
  app:
    build: ./my-app
    ports:
      - "3000-3005:3000"   # 6 instances alag-alag ports pe
    deploy:
      replicas: 6          # 6 copies of same app
  nginx:                   # load balancer bhi chahiye
    image: nginx:latest
    ports:
      - "80:80"
    depends_on:
      - app
```

```bash
docker compose up --scale app=6 -d
# Ab 6 servers chal rahe hain! 🎉
```

**Pros:**
- **Fault tolerant** — 1 server mara, baaki chalte rahenge
- Practically **unlimited** scaling (jitne servers chahiye add karo)
- Cost-effective (sasti machines + load balancer)

**Cons:**
- Complexity badhti hai (load balancer chahiye, statelessness chahiye)
- Data consistency ka dhyan rakhna padta hai

### ⚖️ Kab Kya Use Karein?

| Situation | Scaling Type |
|-----------|-------------|
| Startup, traffic kam, fast launch | Vertical |
| Traffic unpredictable hai | Horizontal |
| Budget kam hai | Vertical (initially) |
| Zero downtime chahiye | Horizontal |
| Legacy app (refactor nahi kar sakte) | Vertical |

---

## 3. Nginx & Its Types (with Docker Examples)

### Nginx Kya Hai?

**Nginx** (engine-x) ek **web server + reverse proxy + load balancer** hai. 2012 mein isko use karne wale websites: Netflix, Dropbox, Zynga...

**Nginx ka main kaam:**
1. **Web Server** — static files serve karna (HTML, CSS, images)
2. **Reverse Proxy** — client aur server ke beech chhupa baithna
3. **Load Balancer** — traffic multiple servers mein baantna
4. **API Gateway** — routing, rate limiting, auth check

### 🔄 Forward Proxy vs Reverse Proxy (Ye Confuse Karta Hai!)

```
FORWARD PROXY (Client ke taraf ka agent)
Client → [Proxy] → Internet → Server
(Tumhara college WiFi blocker, VPN — SERVER ko nahi pata kaun hai client)

REVERSE PROXY (Server ke taraf ka agent)
Client → Internet → [Nginx] → Backend Servers
(SERVER ko chhupa ke rakhta hai — client ko nahi pata kaunsa server handle kar raha hai)
```

**Yaad rakhne ka trick:**
- Forward proxy = **Clients ke liye** kaam karta hai
- Reverse proxy = **Servers ke liye** kaam karta hai

### 📦 Types of Nginx Usage

#### Type 1: Static Web Server

```nginx
# nginx.conf — sirf static files serve karna
server {
    listen 80;
    server_name mysite.com;

    location / {
        root /usr/share/nginx/html;   # container ke andar ye path
        index index.html;
    }

    # Images/videos ke liye caching headers
    location ~* \.(jpg|jpeg|png|gif|mp4)$ {
        expires 30d;
        add_header Cache-Control "public, no-transform";
    }
}
```

#### Type 2: Reverse Proxy (Sabse Common)

```nginx
# Frontend requests ko backend Node.js pe bhejo
server {
    listen 80;

    # /api/ wali requests → Node server pe
    location /api/ {
        proxy_pass http://backend:3000;   # Docker service name!
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    # Baaki sab → React static build
    location / {
        root /usr/share/nginx/html;
        try_files $uri /index.html;
    }
}
```

#### Type 3: Load Balancer

```nginx
# 3 backend servers ke beech traffic baanto
upstream backend_servers {
    least_conn;                       # algorithm (neeche section 4 mein)
    server backend1:3000;
    server backend2:3000;
    server backend3:3000;
}

server {
    listen 80;

    location / {
        proxy_pass http://backend_servers;
    }
}
```

#### Type 4: Rate Limiting (Security)

```nginx
# DDoS protection — ek IP se 10 req/sec se zyada nahi
limit_req_zone $binary_remote_addr zone=mylimit:10m rate=10r/s;

server {
    listen 80;

    location /api/ {
        limit_req zone=mylimit burst=20 nodelay;
        proxy_pass http://backend:3000;
    }
}
```

### 🐳 Complete Docker Example (Nginx + Node + Redis)

**Project structure:**
```
nginx-docker-demo/
├── docker-compose.yml
├── nginx/
│   └── nginx.conf
└── app/
    ├── Dockerfile
    ├── package.json
    └── server.js
```

**`app/server.js`:**
```javascript
const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.json({
    message: "Hello from backend!",
    instance: process.env.HOSTNAME, // container ID — kaunsa instance serve kar raha hai
  });
});

app.listen(3000, () => console.log("Server on 3000"));
```

**`app/Dockerfile`:**
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["node", "server.js"]
```

**`nginx/nginx.conf`:**
```nginx
upstream my_backend {
    # Docker Compose ka DNS automatically instances resolve karega
    server app:3000;
}

server {
    listen 80;

    location / {
        proxy_pass http://my_backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

**`docker-compose.yml`:**
```yaml
services:
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/conf.d/default.conf:ro
    depends_on:
      - app
    restart: unless-stopped

  app:
    build: ./app
    expose:
      - "3000"     # sirf internal network pe accessible
    deploy:
      replicas: 3  # 3 instances — Nginx round-robin karega
    restart: unless-stopped
```

**Chalao aur test karo:**
```bash
docker compose up -d --build --scale app=3

# Test — har baar ALAG container ID dikhegi:
curl http://localhost
# {"message":"Hello from backend!","instance":"a1b2c3d4e5f6"}
curl http://localhost
# {"message":"Hello from backend!","instance":"f6e5d4c3b2a1"}  ← different!

# Logs dekho:
docker compose logs -f nginx
```

### 💡 Nginx vs Apache (Interview Favourite)

| Feature | Nginx | Apache |
|---------|-------|--------|
| Architecture | Event-driven, async | Thread/process-based |
| High concurrency | ⭐⭐⭐⭐⭐ Best | ⭐⭐⭐ OK |
| Static files | Super fast | Normal |
| Memory usage | Kam | Zyada |
| .htaccess support | Nahi | Haan |

---

## 4. Load Balancer

### Kya Hai?

**Load Balancer** ek traffic police hai 🚦 — sabhi requests ko multiple servers mein **evenly baantta** hai, taaki koi ek server overload na ho.

```
                    ┌─────────────────┐
   1000 requests →  │  LOAD BALANCER  │
                    └────────┬────────┘
                             │ smart distribution
              ┌──────────────┼──────────────┐
              ▼              ▼              ▼
         ┌────────┐    ┌────────┐    ┌────────┐
         │ Srv 1  │    │ Srv 2  │    │ Srv 3  │
         │ ~333r  │    │ ~333r  │    │ ~333r  │
         └────────┘    └────────┘    └────────┘
```

### 🔄 Load Balancing Algorithms (Deep Knowledge)

#### 1. Round Robin (Default)
Har request **order se** next server ko jati hai. 1→2→3→1→2→3...

```nginx
upstream backend {
    server srv1:3000;
    server srv2:3000;
    server srv3:3000;
}
# Simple, lekin dhyan nahi rakhta ki server kitna busy hai
```

#### 2. Least Connections
Request usi server ko jati hai jispe **sabse kam active connections** hain.

```nginx
upstream backend {
    least_conn;
    server srv1:3000;
    server srv2:3000;
}
# Best jab: kuch requests heavy ho (jaise video upload)
```

#### 3. IP Hash (Sticky Sessions)
Same client ka IP → **hamesha same server**. Session data server pe hai to ye zaroori hai.

```nginx
upstream backend {
    ip_hash;          # session stickiness
    server srv1:3000;
    server srv2:3000;
}
# Problem: ye load skew kar sakta hai (NAT ke peeche bahut users = same IP)
```

#### 4. Weighted Round Robin
Strong server ko zyada traffic do.

```nginx
upstream backend {
    server srv1:3000 weight=5;   # 5x traffic (16GB RAM wala)
    server srv2:3000 weight=1;   # 1x traffic (2GB RAM wala)
    server srv3:3000 weight=2;
}
```

#### 5. Least Response Time
Jis server ka **response time sabse kam**, usko request do. (Nginx Plus feature)

#### 6. Random + Two Choices
Random do servers chuno, unme se jiska kam load hai usko bhejo. (Academic research kehti hai ye surprisingly well perform karta hai!)

### 🩺 Health Checks

Load balancer check karta hai ki server **zinda hai ya nahi**:

```nginx
upstream backend {
    server srv1:3000 max_fails=3 fail_timeout=30s;
    server srv2:3000 max_fails=3 fail_timeout=30s;
    # 30 sec ke andar 3 baar fail → server ko 30 sec ke liye nikal do
}

server {
    location /health {
        proxy_pass http://backend;
    }
}
```

**Active vs Passive Health Check:**
- **Passive** (Nginx free version): Jaise-jaise requests fail hongi, server ko mark kar do
- **Active** (Nginx Plus / HAProxy): Har 2 sec mein ek test request bhejo

### 🌐 Layer 4 vs Layer 7 Load Balancing (OSI Model)

```
LAYER 4 (Transport - TCP/UDP)
  → Sirf IP + Port dekhta hai. Paket khol ke nahi dekhta.
  → Fast hai, kam intelligence
  → Ex: HAProxy TCP mode, AWS NLB

LAYER 7 (Application - HTTP)
  → URL, headers, cookies sab dekh sakta hai
  → /api/* wali requests Node pe, /images/* CDN pe
  → Smart hai, thoda slow
  → Ex: Nginx, AWS ALB, Traefik
```

```nginx
# L7 example — URL-based routing
server {
    listen 80;

    location /api/ {
        proxy_pass http://node_backend;      # API servers
    }

    location /images/ {
        proxy_pass http://image_servers;     # Image servers
    }

    location / {
        proxy_pass http://frontend_servers;  # Frontend servers
    }
}
```

---

## 5. Different Services on Different Servers + API Gateway

### Problem Kya Hai?

Chhoti app mein sab kuch ek hi server pe hota hai:
```
┌─────────────────────────────────┐
│          EK SERVER              │
│  Auth + Payment + Order + SMS   │
│         (sab ek jagah)          │
└─────────────────────────────────┘
```
**Problem:** Payment service leak ho gayi? Poora app down. Order service slow hai? Auth bhi slow.

### Solution: Service Separation

Har service ko apna dedicated server:

```
                        ┌──────────────────┐
   Client ──────────►  │   API GATEWAY    │  ← Ek hi entry point!
                        └────────┬─────────┘
                                 │
         ┌───────────┬───────────┼───────────┬───────────┐
         ▼           ▼           ▼           ▼           ▼
    ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐
    │  Auth   │ │ Payment │ │  Order  │ │  Email  │ │ Product │
    │  :4001  │ │  :4002  │ │  :4003  │ │  :4004  │ │  :4005  │
    └────┬────┘ └────┬────┘ └────┬────┘ └────┬────┘ └────┬────┘
         │           │           │           │           │
      Auth DB   Payment DB   Order DB    Queue     Product DB
```

### API Gateway Kya Hai?

**API Gateway** = System ka **receptionist**. Sab clients isi se baat karte hain, aur ye decide karta hai kis service ko request bhejni hai.

**Kaam:**
1. **Routing** — `/auth/*` → Auth service, `/pay/*` → Payment service
2. **Authentication** — JWT verify karke hi aage bhejna
3. **Rate Limiting** — 1 user se max 100 req/min
4. **Logging & Monitoring** — Sab requests ka record
5. **Response Caching** — Same request ki cached response
6. **SSL Termination** — HTTPS handle karna
7. **Request Aggregation** — Multiple services ka data ek response mein combine

### 🛠️ Full Example — Node.js API Gateway

**`gateway.js`:**
```javascript
const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const jwt = require("jsonwebtoken");
const rateLimit = require("express-rate-limit");

const app = express();

// 1. Rate limiting — DDoS se bachao
const limiter = rateLimit({
  windowMs: 60 * 1000,      // 1 minute
  max: 100,                  // max 100 requests
  message: { error: "Too many requests, thoda ruk jao!" },
});
app.use(limiter);

// 2. Auth middleware — protected routes ke liye JWT check
const authCheck = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Token bhejo bhai!" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;   // user info aage pass karo
    next();
  } catch {
    return res.status(403).json({ error: "Invalid/expired token" });
  }
};

// 3. Routing — har service alag server pe hai
// Public routes (no auth needed)
app.use(
  "/api/auth",
  createProxyMiddleware({
    target: "http://auth-service:4001",
    changeOrigin: true,
  })
);

app.use(
  "/api/products",
  createProxyMiddleware({
    target: "http://product-service:4002",
    changeOrigin: true,
  })
);

// Protected routes (auth needed)
app.use(
  "/api/orders",
  authCheck,   // pehle verify
  createProxyMiddleware({
    target: "http://order-service:4003",
    changeOrigin: true,
  })
);

app.use(
  "/api/payments",
  authCheck,
  createProxyMiddleware({
    target: "http://payment-service:4004",
    changeOrigin: true,
  })
);

app.listen(4000, () => console.log("API Gateway on :4000"));
```

**`docker-compose.yml` — poora multi-server setup:**
```yaml
services:
  gateway:
    build: ./gateway
    ports:
      - "4000:4000"
    depends_on:
      - auth-service
      - product-service
      - order-service

  auth-service:
    build: ./services/auth        # Alag server/container
    expose: ["4001"]

  product-service:
    build: ./services/product
    expose: ["4002"]

  order-service:
    build: ./services/order
    expose: ["4003"]
    depends_on:
      - order-db

  order-db:
    image: mongo:7
    volumes:
      - order-data:/data/db       # Har service ka apna DB!

volumes:
  order-data:
```

### 💡 Real-Life Comparison

**Amazon Flipkart jaise apps mein:**
- `amazon.com/checkout` → Checkout service (different AWS cluster)
- `amazon.com/recommendations` → ML service (GPU servers)
- `amazon.com/search` → Search service (Elasticsearch cluster)

**API Gateway examples (production mein):**
- AWS API Gateway (managed)
- Kong (open source, Nginx-based)
- Express Gateway / custom Nginx

---

## 6. Monolith vs Microservices

### Monolith — Ek Bada Pack

Poora application **ek hi codebase + ek hi deploy unit** mein.

```
┌─────────────────────────────────────────┐
│           MONOLITHIC APP                │
│  ┌────────┐ ┌────────┐ ┌────────┐      │
│  │  Auth  │ │ Orders │ │ Payment│      │
│  └────────┘ └────────┘ └────────┘      │
│  ┌────────┐ ┌────────┐                 │
│  │ Email  │ │ Search │  ← sab ek hi    │
│  └────────┘ └────────┘    codebase     │
└─────────────────────────────────────────┘
        │
        ▼
   Ek hi Database
```

**Code structure (Monolith):**
```
my-app/
├── routes/
│   ├── auth.js
│   ├── orders.js
│   └── payments.js
├── models/
│   ├── User.js
│   ├── Order.js
│   └── Payment.js
├── app.js           ← sab kuch ek process
└── server.js
```

```javascript
// Monolith mein functions directly call hote hain
// orders.js
const User = require("../models/User");        // direct DB access
const Payment = require("../models/Payment");
const { sendEmail } = require("../utils/email");

async function createOrder(req, res) {
  const user = await User.findById(req.body.userId);     // same process
  const order = await Order.create(req.body);
  await Payment.charge(user, order);                     // same process
  sendEmail(user.email, "Order confirmed!");             // same process
  res.json(order);
}
```

**Pros:**
- Development simple (ek hi repo, ek hi deploy)
- Testing easy
- No network calls between services = fast
- Small team ke liye perfect

**Cons:**
- Ek bug → poora app down
- Scale karna mushkil (agar sirf search service pe load hai, poora app scale karo)
- Tech stack ek hi hai (sab kuch Node/JS ya kuch aur)
- Codebase bada ho jata hai, naye developer ka confusion

### Microservices — Chhote Chhote Alag Apps

Har feature/service ek **independent app** hai with apna DB, apna deployment.

```
┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐
│   AUTH   │  │  ORDERS  │  │ PAYMENTS │  │  SEARCH  │
│  Node.js │  │  Python  │  │   Java   │  │   Go     │
└────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘
     │             │             │             │
  MongoDB      PostgreSQL     MySQL      Elasticsearch
```

**Code structure (Microservices):**
```
ecommerce/
├── auth-service/          ← apna repo, apna deploy
│   ├── Dockerfile
│   └── src/
├── order-service/         ← alag language bhi ho sakti hai
│   ├── Dockerfile
│   └── main.py
├── payment-service/
│   ├── Dockerfile
│   └── Main.java
└── api-gateway/
    └── src/
```

```javascript
// Microservices mein HTTP/message queue se baat hoti hai
// order-service
const axios = require("axios");

async function createOrder(req, res) {
  // Auth service se user fetch (network call!)
  const user = await axios.get(
    `http://auth-service:4001/api/users/${req.body.userId}`
  );

  const order = await Order.create(req.body);

  // Payment service ko message queue se bolo (async)
  await publishToQueue("payment-events", {
    orderId: order._id,
    amount: order.total,
    userId: user.data._id,
  });

  // Email service ko fire-and-forget event
  await publishToQueue("email-events", {
    to: user.data.email,
    template: "order-confirmed",
  });

  res.json(order);
}
```

**Pros:**
- Independent scaling — sirf search service ke 10 instances chalao
- Independent deployment — search team deploy kare, orders ko affect nahi
- Tech freedom — ML Python mein, API Go mein
- Fault isolation — payment down ho to order bhi accept ho sakta hai

**Cons:**
- **Distributed system ki complexity** — network failures, retries, timeouts
- Data consistency mushkil (Saga pattern chahiye)
- DevOps heavy — Docker, K8s, service mesh sab chahiye
- Debugging pain — request 5 services se guzarti hai (tracing setup needed)

### 📊 Head-to-Head Comparison

| Aspect | Monolith | Microservices |
|--------|----------|---------------|
| Team size | 1–10 devs | 10–100+ devs |
| Deployment | Ek baar poora app | Service-by-service |
| Scaling | Poora app | Sirf required service |
| Database | Ek shared DB | DB per service |
| Failure | Sab down | Sirf ek service down |
| Initial speed | Fast | Slow (setup) |
| Long-term | Painful | Flexible |
| Debugging | Easy | Hard (need tracing) |

### 💡 Golden Advice

> **"Start with a Monolith. Jab pain aaye tab Microservices mein jao."**
> Amazon, Netflix, Uber — sab ne monolith se shuru kiya tha. Uber ka original code ek giant Python monolith tha!

---

## 7. Data Replication

### Kya Hai?

**Replication** = same data **multiple machines** pe copy karna. Ek machine down ho jaye, data safe aur available rahe.

```
                 REPLICATION
                    │
        ┌───────────┴───────────┐
        ▼                       ▼
┌──────────────┐        ┌──────────────┐
│  PRIMARY     │───────►│  REPLICA 1   │
│  (Writes)    │  sync  │  (Reads)     │
└──────────────┘        └──────────────┘
        │
        └──────────────►┌──────────────┐
                        │  REPLICA 2   │
                        │  (Reads)     │
                        └──────────────┘
```

**Main benefits:**
1. **High Availability** — Primary down? Replica promote kar do
2. **Read Scaling** — Reads replicas pe, writes primary pe (95% traffic reads hota hai!)
3. **Disaster Recovery** — Data center udd gaya? Backup zinda hai dusre region mein
4. **Reduced Latency** — Mumbai user Mumbai replica se padhega, US server se nahi

### Types of Replication

#### 1. Synchronous Replication
Primary **wait karta hai** jab tak saare replicas confirm na karein.

```
Client → Primary → Replica → (ack) → Primary → Client
                    (data guarantee hai, but slow)
```
**Use case:** Bank transactions — data lose nahi ho sakta, chahe response slow ho.

#### 2. Asynchronous Replication
Primary turant respond karta hai, replicas baad mein update hote hain.

```
Client → Primary → Client  (instant!)
             │
             └── async ──► Replica (thoda delayed)
```
**Use case:** Social media feeds — 2 sec purana data chal jayega.

#### 3. Semi-Synchronous
Primary sirf **1 replica** ka wait karta hai. Balance between both.

### MongoDB Replication Code Example

**Replica Set setup (docker-compose):**
```yaml
services:
  mongo-primary:
    image: mongo:7
    command: ["mongod", "--replSet", "rs0"]
    ports: ["27017:27017"]

  mongo-replica1:
    image: mongo:7
    command: ["mongod", "--replSet", "rs0"]

  mongo-replica2:
    image: mongo:7
    command: ["mongod", "--replSet", "rs0"]
```

```javascript
// Connection string mein replicaSet batana zaroori hai
const mongoose = require("mongoose");

mongoose.connect(
  "mongodb://localhost:27017,replica1:27017,replica2:27017/mydb?replicaSet=rs0",
  {
    readPreference: "secondaryPreferred",  // pehle replica se padho
    writeConcern: { w: "majority", wtimeout: 5000 },  // majority confirm hone tak wait
  }
);

// Read/Write preferences:
// - primary: sirf primary se read (strong consistency)
// - secondaryPreferred: pehle replicas, load kam karo
// - writeConcern w:1 → 1 node confirm, w:"majority" → majority confirm
```

### Replication Models (Topology)

```
MASTER-SLAVE (traditional)          MULTI-MASTER
┌──────┐     ┌────────┐            ┌──────┐◄───┐
│Master│────►│ Slave  │            │ M 1  │    │
└──┬───┘  ┌─►└────────┘            └──┬───┘    │
   │      │                           ▼        │
   │      └─►┌────────┐            ┌──────┐    │
   └────────►│ Slave  │            │ M 2  ├────┘
             └────────┘            └──────┘
(1 writer, N readers)              (N writers — conflict risk!)

CHAIN:  M → S1 → S2   (S2, S1 se replicate karta hai — kam network load on M)
```

### ⚠️ Replication Lag Problem

Async mein data thoda late sync hota hai. Example:
1. User ne tweet post kiya → Primary pe save hua ✅
2. User apni profile dekhta hai → Request **replica** pe gaya
3. Replica abhi update hua nahi → **Tweet dikhta nahi!** 😱

**Solutions:**
- **Read-your-writes:** Us user ki next requests kuch seconds ke liye primary pe bhejo
- **Session stickiness:** User ko primary se hi serve karo jab tak sync complete
- **Monotonic reads:** Ek user ko hamesha same replica se padhao

---

## 8. Data Sharding

### Kya Hai?

**Sharding** = bade database ko **chhote-chhote pieces (shards)** mein todna, aur har piece alag machine pe rakhna.

**Replication** = same data ki copies (safety ke liye)
**Sharding** = data ka batwara (capacity ke liye) — dono alag cheezein hain!

```
              BEFORE (1 Giant DB — 500GB, slow queries)
              ┌─────────────────────────────┐
              │  ALL USERS (100M records)   │
              └─────────────────────────────┘

              AFTER (3 Shards — har pe ~33GB, fast!)
              ┌──────────────┐
              │   SHARD 1    │  Users A–F
              └──────────────┘
              ┌──────────────┐
              │   SHARD 2    │  Users G–N
              └──────────────┘
              ┌──────────────┐
              │   SHARD 3    │  Users O–Z
              └──────────────┘
```

### Sharding Strategies (Deep Knowledge)

#### 1. Range-Based Sharding
Data ranges mein batwao.

```
Shard 1: user_id 1–1M
Shard 2: user_id 1M–2M
Shard 3: user_id 2M–3M
```
```javascript
function getShard(userId) {
  if (userId <= 1_000_000) return "shard1";
  if (userId <= 2_000_000) return "shard2";
  return "shard3";
}
```
**Problem:** "Hot shard" — naye users mostly Shard 3 pe aayenge (id high hai), wo overload! A–F wale users agar zyada ho to Shard 1 bhar jayega.

#### 2. Hash-Based Sharding (Sabse Popular)
ID ko hash karo, mod le lo.

```javascript
function getShard(userId, totalShards = 4) {
  return hash(userId) % totalShards;   // 0,1,2,3
}
// hash(123) % 4 = 2  → Shard 2 pe jayega
// hash(456) % 4 = 0  → Shard 0 pe jayega
```
**Pros:** Data evenly distribute hota hai
**Problem:** Shard add/remove karna pain (re-hashing sab data ka!) — isliye **Consistent Hashing** use hota hai

#### 3. Directory-Based Sharding
Ek alag **lookup service** maintain karo jo bataye kaunsa data kahan hai.

```
Client → Directory Service → "user 123? Shard 2 pe hai" → Shard 2
```
**Pros:** Flexible (koi bhi sharding logic)
**Cons:** Directory ek SPOF hai + har query mein extra lookup

#### 4. Geographic Sharding
Location ke basis pe — India ka data Mumbai server pe, US ka Virginia pe.

```
Shard India  🇮🇳: Mumbai DC   → user_location = "IN"
Shard US     🇺🇸: Virginia DC → user_location = "US"
Shard EU     🇪🇺: Frankfurt DC → user_location = "EU"
```

### MongoDB Sharding Example

```javascript
// 1. Sharding enable karo
sh.enableSharding("ecommerce");

// 2. Collection shard karo (hashed shard key)
sh.shardCollection("ecommerce.orders", { userId: "hashed" });

// Range-based shard key:
sh.shardCollection("ecommerce.orders", { createdAt: 1 });

// 3. Shard key selection — SABSE IMPORTANT DECISION!
// GOOD shard key: high cardinality, even distribution, query-friendly
// BAD shard key: { country: 1 }  ← sirf 3-4 values, skew hoga!
```

**Node.js mein shard-aware query:**
```javascript
// Query mein SHARD KEY include karo → targeted query (fast, 1 shard)
db.orders.find({ userId: 12345, status: "pending" });

// Shard key missing → SCATTER-GATHER query (slow, sab shards pe)
db.orders.find({ status: "pending" });  // har shard pe jayega! 😢
```

### ⚠️ Sharding Problems

1. **Cross-shard joins impossible** — User Shard 1 pe, uske Orders Shard 2 pe. Join nahi hoga!
2. **Cross-shard transactions** — Complex (2-phase commit / Saga pattern)
3. **Rebalancing pain** — Naya shard add karo → data move karna padta hai
4. **Hot spots** — Virat Kohli ka data ek hi shard pe — wo shard overload!

**Solution: Consistent Hashing** (DynamoDB, Cassandra use karte hain)
```
Traditional:  hash(key) % N        → N badla to SAB remap
Consistent:   Hash ring pe nodes   → sirf ~1/N keys move hoti hain
```

---

## 9. Data Scaling (Database Scaling)

Jab database slow ho jaye, ye **progressive ladder** follow karo:

### Step 1: Indexes (Pehle yahi karo — FREE speed!)

```javascript
// BINA index: 10M records scan → 2 sec 😴
db.orders.find({ userId: 12345 });

// Index banao: B-tree lookup → 2 ms ⚡
db.orders.createIndex({ userId: 1 });
db.orders.createIndex({ userId: 1, createdAt: -1 });  // compound

// Index kaise kaam karta hai:
// No index:  [1][2][3]...[9999999] ← linear scan (O(n))
// With index:       [12345]        ← B-tree (O(log n))
```

**Index trade-off:** Read fast ✅, but write slow (har insert pe index update) + extra storage.

### Step 2: Query Optimization

```javascript
// BAD — n+1 problem: 100 orders = 101 queries! 😱
const orders = await Order.find();
for (const o of orders) {
  o.user = await User.findById(o.userId);  // 100 extra queries!
}

// GOOD — single populate/join
const orders = await Order.find().populate("user");  // 2 queries total
```

### Step 3: Caching (Redis)

```javascript
const redis = require("redis");
const client = redis.createClient();

async function getProduct(id) {
  // 1. Pehle cache check karo
  const cached = await client.get(`product:${id}`);
  if (cached) return JSON.parse(cached);   // ~1ms ⚡

  // 2. Cache miss → DB se lao
  const product = await Product.findById(id);   // ~50ms

  // 3. Cache mein daalo (TTL ke saath)
  await client.setEx(`product:${id}`, 3600, JSON.stringify(product));
  return product;
}
```

**Cache Patterns:**
- **Cache-Aside (Lazy):** Pehle cache, miss pe DB, then cache fill (sabse common)
- **Write-Through:** Har write pe cache + DB dono update
- **Write-Behind:** Cache mein write, DB mein async baad mein (risky but fast)

### Step 4: Read Replicas

```
         ┌────────────┐
Writes → │  PRIMARY   │
         └─────┬──────┘
               │ replicate
     ┌─────────┼─────────┐
     ▼         ▼         ▼
┌────────┐ ┌────────┐ ┌────────┐
│Repl 1  │ │Repl 2  │ │Repl 3  │  ← Reads yahan
└────────┘ └────────┘ └────────┘
```

```javascript
// Mongoose example
const readConn = mongoose.createConnecti0n("mongodb://replica1:27017/mydb");
const Report = readConn.model("Report", reportSchema);  // heavy reads replicas pe
```

### Step 5: Vertical Scaling (DB machine upgrade)

Simple, but limited. 2GB → 64GB RAM. (Section 2 dekho)

### Step 6: Sharding (Last Resort — Sabse Complex)

Section 8 mein detail hai. Jab tak na lage, mat karo!

### 🪜 Scaling Decision Ladder

```
Slow queries?
   │
   ├─► Index lagaya? ──► Query optimize ki? ──► Cache lagaya?
   │                                                      │
   │                                        Ab bhi slow hai?
   │                                                      │
   ├─► Read-heavy? ──► READ REPLICAS lagao
   │
   ├─► Write-heavy + Data huge? ──► SHARDING
   │
   └─► Single server saturated? ──► Vertical scale, phir shard
```

---

## 10. Diagram Explanations

### 🖼️ Diagram 1: Complete Production Architecture (Zomato jaisi app)

```
   Users (Mobile/Web)
        │
        ▼
   ┌─────────┐
   │   DNS   │  domain.com → IP address
   └────┬────┘
        │
        ▼
   ┌─────────────┐     ┌──────────────┐
   │ CDN (Cloud- │     │ WAF (Fire-   │  ← malicious requests block
   │ front)      │     │ wall)        │
   └──────┬──────┘     └──────┬───────┘
          │                   │
          ▼                   ▼
   ┌──────────────────────────────────┐
   │      LOAD BALANCER (L7)          │
   └──────────────┬───────────────────┘
                  │
        ┌─────────┼─────────┐
        ▼         ▼         ▼
   ┌────────┐ ┌────────┐ ┌────────┐
   │ App 1  │ │ App 2  │ │ App 3  │   Stateless servers
   └───┬────┘ └───┬────┘ └───┬────┘
       └──────────┼──────────┘
                  ▼
   ┌──────────────────────────────────┐
   │  Cache Layer (Redis Cluster)     │  ← 80% reads yahin solve
   └──────────────┬───────────────────┘
                  ▼
   ┌──────────────────────────────────┐
   │  DB Primary + Replicas           │
   │  (with sharding if needed)       │
   └──────────────────────────────────┘
                  │
                  ▼
   ┌──────────────────────────────────┐
   │  Message Queue (Kafka/RabbitMQ)  │  ← async tasks
   └──────┬──────────────┬────────────┘
          ▼              ▼
   ┌──────────┐   ┌──────────┐
   │ Email    │   │ Notif    │   Worker services
   │ Worker   │   │ Worker   │
   └──────────┘   └──────────┘
```

**Line-by-line explanation:**
1. **DNS** — browser ko server ka IP deta hai
2. **CDN** — static content (images/CSS) user ke paas wale edge se serve karta hai
3. **WAF** — SQL injection, XSS jaisi malicious requests ko block karta hai
4. **Load Balancer** — traffic ko healthy servers pe baantta hai
5. **App Servers (stateless)** — koi session store nahi karte (Redis mein hai), isliye kabhi bhi add/remove kar sakte ho
6. **Redis** — hot data memory mein (session, frequent queries)
7. **DB** — single source of truth
8. **Queue** — heavy/async kaam (email, notification) alag workers pe — app server turant free ho jata hai

### 🖼️ Diagram 2: Request Flow — Order Placement

```
User clicks "Buy Now"
     │
     ▼
[1] API Gateway → JWT verify karo
     │
     ▼
[2] Order Service → order create karo (DB write)
     │
     ▼
[3] Kafka publish: "ORDER_CREATED" event
     │
     ├────────────────────────────┐
     ▼                            ▼
[4] Payment Service           [5] Inventory Service
    payment initiate             stock kam karo
     │                            │
     ▼                            ▼
[6] Notification Worker → "Order confirmed! 📦" (SMS/Email)
     │
     ▼
User ko response: "Order placed!" (step 2-3 ke baad hi!)
```

**Key insight:** User ko turant response mil jata hai. Payment/Notification **async** chalte hain. Ye **Event-Driven Architecture** hai.

### 🖼️ Diagram 3: Cache Miss vs Hit Flow

```
   REQUEST                    REDIS           DATABASE
      │                        │                 │
      ├──(1) GET product:42 ──►│                 │
      │                        │                 │
      │         HIT ───────────┤                 │
      │◄── data (0.5ms) ───────┘                 │
      │                                          │
      │         MISS ──────────►│                │
      │                         ├──(2) query ──►│
      │                         │◄── data ──────┘
      │◄── data (50ms) ─────────┤
      │                         └──(3) SET + TTL
```

**Hit rate** = cache se milne wali requests / total requests. Achha hit rate: **90%+**.

### 🖼️ Diagram 4: Sharding + Replication Combined (Netflix style)

```
                    ┌─────────────────┐
                    │  Shard Router   │
                    └────────┬────────┘
           ┌─────────────────┼─────────────────┐
           ▼                 ▼                 ▼
    ┌─────────────┐   ┌─────────────┐   ┌─────────────┐
    │  SHARD 1    │   │  SHARD 2    │   │  SHARD 3    │
    │ ┌─────────┐ │   │ ┌─────────┐ │   │ ┌─────────┐ │
    │ │Primary  │ │   │ │Primary  │ │   │ │Primary  │ │
    │ └────┬────┘ │   │ └────┬────┘ │   │ └────┬────┘ │
    │   ┌──┴──┐   │   │   ┌──┴──┐   │   │   ┌──┴──┐   │
    │   ▼     ▼   │   │   ▼     ▼   │   │   ▼     ▼   │
    │ [R1]  [R2]  │   │ [R1]  [R2]  │   │ [R1]  [R2]  │
    └─────────────┘   └─────────────┘   └─────────────┘
     Users A-H         Users I-P         Users Q-Z
```

**Har shard ke andar replication** = Availability + Scale dono mil gaye! 🔥

---

## 11. Real-Life Usages

### 🎬 Netflix

| Concept | Netflix mein kahan |
|---------|-------------------|
| CDN | **Open Connect** — apna CDN! Videos edge servers se |
| Microservices | **700+ microservices** (billing, recommendations, playback...) |
| Sharding | User data Cassandra mein globally sharded |
| Replication | 3 regions — us-east, eu-west, ap-southeast |
| Rate Limiting | API gateway (Zuul) pe |
| Chaos Engineering | **Chaos Monkey** — randomly servers kill karta hai, resilience test karne ke liye! |

### 🛒 Amazon / Flipkart (Big Billion Days)

| Concept | Usage |
|---------|-------|
| Horizontal Scaling | Diwali sale se pehle servers 10x scale |
| Auto-scaling | Traffic based automatic scale up/down |
| Sharding | Orders by region/customer ID |
| Queue | Orders SQS/Kafka mein — stock check async |
| Caching | Product pages ElastiCache (Redis) mein |
| Eventual Consistency | Cart items thoda delay chalega, but site kabhi down nahi hogi |

### 📱 WhatsApp (2 Billion+ users)

| Concept | Usage |
|---------|-------|
| Vertical Scaling | Erlang! Ek server pe **2M+ connections** 😱 |
| Data Sharding | Messages user phone number pe sharded |
| Store & Forward | Message deliver hone tak sirf store (privacy) |
| Erasure Coding | Media files efficient storage |

### 🏦 Banking (HDFC/SBI/UPI)

| Concept | Usage |
|---------|-------|
| Strong Consistency | Paise kabhi galat nahi dikhne chahiye — synchronous replication |
| ACID Transactions | DB transactions, no eventual consistency |
| Vertical Scaling | Predictable hai, sharding ka jhanjhat nahi |
| Disaster Recovery | Active-passive data centers (Mumbai + Hyderabad) |

### 🐦 Twitter (X)

| Concept | Usage |
|---------|-------|
| Fan-out on Write | Tweet post karo → sab followers ki timeline mein push (celebrities ke liye fan-out on read!) |
| Redis Timeline Cache | Home timeline Redis mein pre-computed |
| Sharding | Tweets by tweet ID (Snowflake IDs) |
| Message Queue | Kafka for event streaming |

### 🚗 Uber

| Concept | Usage |
|---------|-------|
| Geo-sharding | Trips by city — Mumbai ki trips Mumbai cluster mein |
| Microservices | **4000+ microservices!** |
| Real-time | Surge pricing — streaming data (Apache Kafka + Flink) |
| Consistent Hashing | Driver matching |

### 📊 Summary Table

```
┌────────────────┬────────────┬────────────┬────────────┬────────────┐
│ Concept        │ Netflix    │ Amazon     │ WhatsApp   │ Bank       │
├────────────────┼────────────┼────────────┼────────────┼────────────┤
│ Scaling        │ Horizontal │ Horizontal │ Vertical+  │ Vertical   │
│ Replication    │ Async      │ Async      │ Async      │ SYNC       │
│ Sharding       │ Yes        │ Yes        │ Yes        │ Rarely     │
│ Consistency    │ Eventual   │ Eventual   │ Eventual   │ Strong     │
│ Caching        │ Heavy      │ Heavy      │ Medium     │ Light      │
│ Microservices  │ 700+       │ 1000s      │ Erlang apps│ Monolith+  │
└────────────────┴────────────┴────────────┴────────────┴────────────┘
```

---

## 12. Interview Cheat Sheet

### Ye Numbers Yaad Rakho (Back-of-Envelope)

```
1 sec          = 1000 ms
Memory read    = ~100 ns        ⚡ fastest
SSD read       = ~100 μs
Network (LAN)  = ~0.5 ms
Disk seek      = ~10 ms         🐢 slowest
Single server  = ~10K concurrent connections (practically)
1M users/day   = ~12 requests/sec average (1M / 86400)
Peak = 3-5x average
80/20 rule: 80% traffic reads, 20% writes
```

### Design Interview Framework

```
1. REQUIREMENTS clear karo (5 min)
   - Functional: kya karna hai?
   - Non-functional: kitne users? latency? consistency?

2. ESTIMATION (5 min)
   - QPS, storage, bandwidth calculate karo

3. HIGH-LEVEL DESIGN (10 min)
   - Boxes banao: Client → LB → App → DB → Cache

4. DEEP DIVE (15 min)
   - Database schema, sharding, caching, bottlenecks

5. BOTTLENECKS & TRADE-OFFS (10 min)
   - "Is design mein X problem hogi, main Y use karunga kyunki Z"
```

### One-Liners (Ye bolega to impressed 😎)

- **Scaling:** "Vertical = bigger machine, Horizontal = more machines. Production mein hamesha horizontal + LB."
- **Nginx:** "Reverse proxy + LB + static serving — event-driven architecture se C10K problem solve."
- **Load Balancer:** "L4 = IP/port level fast routing, L7 = content-aware smart routing."
- **API Gateway:** "Single entry point for auth, rate-limit, routing — microservices ka receptionist."
- **Monolith vs Micro:** "Start monolith, scale jo system ki demand. Netflix ne 2008 mein monolith hi tha."
- **Replication:** "Same data, multiple machines — HA ke liye. Sync = safe slow, Async = fast riskier."
- **Sharding:** "Data ka batwara across machines — capacity ke liye. Shard key selection = sabse critical decision."
- **CAP Theorem:** "Network partition mein consistency YA availability — dono nahi. CP = banks, AP = Instagram."

---

## 🔗 Further Learning

- **Books:** "Designing Data-Intensive Applications" (Martin Kleppmann) — Bible hai ye
- **YouTube:** Gaurav Sen, ByteByteGo, System Design Interview (Alex Xu)
- **Practice:** Grokking the System Design Interview
- **Hands-on:** Docker + Nginx + Redis locally khelo — theory se zyada samajh aayega!

---

> **Golden Rule:** System design mein koi "correct answer" nahi hota — sirf **trade-offs** hote hain. Interview mein "it depends" bolke sahi trade-off explain karo, tum pass ho jaoge! 🚀
