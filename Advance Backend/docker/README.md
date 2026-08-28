# Docker - Complete Learning Repository (Hinglish Guide)

> Ye mera personal learning repo hai jisme main Docker ko deep me samajh raha hoon — basics se le kar networking, volumes, compose, aur real-life production usage tak. Sab kuch Hinglish me notes kiya hai taaki concepts easily yaad rahein.

---

## Table of Contents

1. [Docker Kya Hai? (Intro)](#1-docker-kya-hai-intro)
2. [Docker vs Virtual Machine](#2-docker-vs-virtual-machine)
3. [Core Concepts (Image, Container, Dockerfile, Registry)](#3-core-concepts)
4. [Docker Commands (Deep)](#4-docker-commands-deep)
5. [Dockerfile Deep-Dive + Optimization](#5-dockerfile-deep-dive--optimization)
6. [Docker Compose + Commands](#6-docker-compose--commands)
7. [Docker Networking + Commands](#7-docker-networking--commands)
8. [Docker Volumes + Commands](#8-docker-volumes--commands)
9. [Diagram Explanations](#9-diagram-explanations)
10. [Real-Life Usages](#10-real-life-usages)
11. [Quick Cheatsheet](#11-quick-cheatsheet)

---

## 1. Docker Kya Hai? (Intro)

### The Real Problem: "Ye code mere machine pe chal raha hai, teri machine pe kyu nahi?"

Socho ek scenario:
- Tumne ek Node.js app banayi, tumhare laptop pe Node v20 hai, chal rahi hai.
- Tumhari friend ke laptop pe Node v14 hai — app crash ho gayi.
- Production server pe alag OS hai, alag dependencies hain — phir crash.

**Yahi problem Docker solve karta hai.**

Docker ek **containerization platform** hai. Simple bhasha me:

> Docker aapke application ko uski **saari dependencies ke saath** ek package (container) me bandh deta hai. Ye container **har jagah same behave karega** — chahe tumhara laptop ho, dost ka laptop, ya AWS ka server.

### Ek Simple Analogy (Shipping Containers)

Jaise samudri shipping me cargo containers hote hain:
- Container ka size/shape **standard** hai.
- Andar kuch bhi ho — kapde, electronics, khana — ship, truck, train sab pe easily carry hota hai.

Docker bhi wahi karta hai:
- App + dependencies + runtime = ek standard "container"
- Ye container **kisi bhi machine pe** chalega jahan Docker hai.

### Docker Under-the-Hood (Deep Knowledge)

Docker Linux ke in kernel features ka use karta hai:

| Feature | Matlab |
|---------|--------|
| **Namespaces** | Process ko ek isolated world deta hai — apna PID, network, filesystem. Container ko lagta hai wo akela hai system pe. |
| **Cgroups (Control Groups)** | CPU, RAM, disk limits set karta hai per container. (Jaise: "is container ko max 512MB RAM hi milegi") |
| **Union File System (Layers)** | Images ko layers me store karta hai — read-only layers share hoti hain, disk save hota hai. |

```bash
# Windows/Mac pe Docker actually ek lightweight Linux VM ke andar containers chalata hai
# (Docker Desktop behind the scenes WSL2 use karta hai Windows pe)
docker version
```

---

## 2. Docker vs Virtual Machine

Ye interview ka classic question hai. Samjho deeply:

```
┌─────────────────────────────────────┬─────────────────────────────────────┐
│          VIRTUAL MACHINE            │          DOCKER CONTAINER           │
├─────────────────────────────────────┼─────────────────────────────────────┤
│  App A        App B                 │  App A        App B                 │
│  ┌──────┐    ┌──────┐               │  ┌──────┐    ┌──────┐               │
│  │ Bins │    │ Bins │               │  │ Bins │    │ Bins │               │
│  │ Libs │    │ Libs │               │  │ Libs │    │ Libs │               │
│  ├──────┤    ├──────┤               │  ├──────┤    ├──────┤               │
│  │GUEST │    │GUEST │               │  │CONTAINER ENGINE                │
│  │ OS   │    │ OS   │               │  │ (Docker)                       │
│  ├──────┤    ├──────┤               │  ├───────────────────────────────┤ │
│  │Hypervisor (VMware, VirtualBox)   │  │ Host OS (Shared Kernel)       │
│  ├─────────────────────────────────┤  │                               │
│  │ Host OS                         │  │                               │
│  ├─────────────────────────────────┤  │                               │
│  │ Physical Hardware               │  │ Physical Hardware             │
└─────────────────────────────────────┴─────────────────────────────────────┘
```

**Key differences:**

| Point | VM | Docker |
|-------|----|--------|
| OS | Har VM me full Guest OS hota hai (GBs me) | Host OS ka kernel **share** hota hai (MBs me) |
| Boot time | 1-5 minutes | **Milliseconds/Seconds** |
| Size | GBs | MBs |
| Performance | Slow (extra OS layer) | Near-native |
| Isolation | Strong (hardware level) | Process-level (sufficient for most cases) |
| RAM | Each VM apni dedicated RAM leti hai | Containers lightweight hote hain |

> **One-liner:** VM me pura OS virtualize hota hai, Docker me sirf app ka environment.

---

## 3. Core Concepts

### 3.1 Image (Recipe/Blueprint)

- Image ek **read-only template** hai — app ka code, runtime, libraries, config sab kuch.
- Image khud chal nahi sakti, ye sirf ek **blueprint** hai (jaise class in OOPs).
- Images **layers** se banti hain. Har `Dockerfile` instruction ek layer hai.

### 3.2 Container (Running Instance)

- Container = image ka **running instance** (jaise object of a class).
- Isolated process hai apni filesystem, network, aur process space ke saath.
- Container **ephemeral** hota hai — delete karo toh andar ka data bhi gaya (isliye Volumes chahiye — section 8 me dekho).

### 3.3 Dockerfile (Recipe likhne ki file)

- Ek text file jisme step-by-step instructions hote hain ki image kaise banegi.
- Isse image **reproducible** banti hai — koi bhi, kahin bhi same image bana sakta hai.

### 3.4 Registry (Image Store)

- Jahan images store/retrieve hoti hain.
- **Docker Hub** (public) — jaise npm registry hai JS ke liye, waise Docker Hub images ke liye.
- **ECR (AWS), GCR (Google), ACR (Azure)** — private registries.

### 3.5 Flow (Kaise sab judta hai)

```
Dockerfile --(docker build)--> Image --(docker run)--> Container
                                   ↑
                            docker push / docker pull
                                   |
                              Registry (Docker Hub)
```

---

## 4. Docker Commands (Deep)

### 4.1 Image Commands

```bash
# Image pull karo (download from Docker Hub)
docker pull node
docker pull node:20-alpine        # specific tag (alpine = chhota size ~50MB vs ~1GB)
docker pull mongo:7               # MongoDB image with version

# Local images ki list
docker images                     # ya
docker image ls

# Image ka detailed inspection (JSON output)
docker inspect node

# Image ko tag karo (naming convention: username/repo:tag)
docker tag myapp:latest neeraj/myapp:v1

# Image ko delete karo
docker rmi node                   # ya
docker image rm node

# Unguarded/dangling images remove (cleanup)
docker image prune                # unused images hatao
docker image prune -a             # saare unused (koi container use nahi kar raha)

# Image build karna (Dockerfile se)
docker build -t myapp .
docker build -t myapp:v1 -f Dockerfile.dev .   # custom dockerfile + tag
docker build --no-cache -t myapp .             # cache ignore karke fresh build
```

> **Deep note:** `docker build` ke time Docker har layer ko **cache** karta hai. Agar tumhare code me sirf `index.js` badla hai aur `package.json` same hai, toh `npm install` wali layer dobara run nahi hogi — build seconds me ho jayega. Isliye hi hum `package.json` pehle copy karte hain (Dockerfile section me detail hai).

### 4.2 Container Commands

```bash
# Simple run (foreground)
docker run node

# Detached mode (background me chalao)
docker run -d node

# Named container
docker run -d --name my-node-app node

# Port mapping (host:container)
docker run -d -p 3000:3000 myapp
docker run -d -p 127.0.0.1:3000:3000 myapp    # sirf localhost pe expose

# Environment variables pass karna
docker run -d -e PORT=5000 -e DB_URL=mongodb://... myapp

# Interactive mode (container ke andar shell)
docker run -it node bash
docker run -it ubuntu sh

# Container remove after exit (temporary containers ke liye best)
docker run --rm -it node bash

# Running containers ki list
docker ps                          # sirf running
docker ps -a                       # saare (stopped bhi)

# Container stop/start/restart
docker stop my-node-app            # graceful shutdown (SIGTERM phir SIGKILL)
docker start my-node-app           # stopped container wapas start
docker restart my-node-app

# Logs dekho (bohot important for debugging!)
docker logs my-node-app
docker logs -f my-node-app         # follow mode (live logs, jaise tail -f)
docker logs --tail 100 my-node-app # last 100 lines

# Container ke andar command execute karo
docker exec -it my-node-app bash   # running container me shell kholo
docker exec my-node-app node -v    # single command run karo

# Container ki details (JSON)
docker inspect my-node-app

# Resource usage live (jaise htop for containers)
docker stats

# Container delete
docker rm my-node-app              # stopped container delete
docker rm -f my-node-app           # force delete (running bhi ho toh)
docker rm $(docker ps -aq)         # saare containers delete (careful!)

# Rename container
docker rename my-node-app new-name
```

> **Deep note: `-it` ka matlab**
> - `-i` (interactive) → stdin (input) open rakhta hai
> - `-t` (tty) → terminal allocate karta hai (nice prompt ke liye)
> Dono saath = container ke andar proper interactive shell.

> **Deep note: `docker run` vs `docker exec`**
> - `run` → **naya** container banata hai image se
> - `exec` → **already running** container ke andar command chalata hai

### 4.3 System/Cleanup Commands

```bash
# Docker disk usage (images, containers, volumes kitni space le rahe)
docker system df

# Sab kuch cleanup — dangles images, stopped containers, unused networks
docker system prune

# Nuclear option — unused images bhi hatao (volumes safe rahenge)
docker system prune -a

# Volumes bhi delete karne hain (DANGER: data loss!)
docker system prune -a --volumes
```

---

## 5. Dockerfile Deep-Dive + Optimization

Ye mera actual `Dockerfile` hai is repo me — isko line-by-line samjhte hain:

```dockerfile
FROM Node

WORKDIR /app

COPY package*.json .
RUN npm install

COPY . .

CMD [ "node", "index.js" ]
```

### Instructions Explanation (Hinglish)

| Instruction | Kya karta hai |
|-------------|---------------|
| `FROM Node` | Base image set karta hai — humari image Node wali image ke **upar** layers banegi. |
| `WORKDIR /app` | Container ke andar working directory set karta hai. Ab saare commands `/app` me run honge. (Directory exist nahi karti toh Docker bana dega) |
| `COPY package*.json .` | Sirf package files copy karta hai host se container me. |
| `RUN npm install` | **Build time** pe dependencies install karta hai — ye layer image me **permanent** ho jaati hai. |
| `COPY . .` | Baaki saari files copy karta hai. |
| `CMD [ "node", "index.js" ]` | **Run time** pe kya command chalegi. Ye default command hai — `docker run` pe execute hoti hai. |

### `RUN` vs `CMD` vs `ENTRYPOINT` (Interview Favorite!)

```
RUN    → Build time pe chalta hai. Image ki layer banata hai. (npm install, apt-get)
CMD    → Run time ka default command. Override ho sakta hai: docker run image bash
ENTRYPOINT → Fixed command. Override mushkil hai. CMD uske arguments ban jaata hai.
```

```dockerfile
# CMD override ho jata hai easily:
# docker run myapp sh   → CMD ignore hoke `sh` chal jayega

# ENTRYPOINT pattern (best practice):
ENTRYPOINT [ "node" ]
CMD [ "index.js" ]
# docker run myapp           → node index.js
# docker run myapp server.js → node server.js (CMD replace hua, ENTRYPOINT fixed)
```

### Optimization Journey (Mere Dockerfile ki kahani)

**Version 1 — Naive (slow rebuilds):**
```dockerfile
FROM Node
WORKDIR /app
COPY index.js index.js
COPY package.json package.json
COPY package-lock.json package-lock.json
RUN npm install
CMD [ "node", "index.js" ]
```
Problem: Har code change pe **npm install dubara** hota hai (kyunki COPY pehle hua aur code change hua toh cache invalid). Node_modules install hone me 30-60 sec lagte hain.

**Version 2 — Layer Caching (SMART!):**
```dockerfile
FROM Node
WORKDIR /app
COPY package*.json .
RUN npm install        # ye layer cache ho jaati hai jab tak package.json same hai!

COPY . .               # code baad me copy karo
CMD [ "node", "index.js" ]
```
Trick: Jo cheez **kam badalti hai use pehle** copy karo. Code roj badalta hai, `package.json` kabhi-kabhi. Isse `npm install` ka cache reuse hota hai → rebuild **seconds** me.

**Version 3 — Smaller Base Image (alpine):**
```dockerfile
FROM node:20-alpine    # ~1GB se ~180MB tak!
WORKDIR /app
COPY package*.json .
RUN npm install --omit=dev    # production deps only (npm ci bhi use kar sakte ho)
COPY . .
CMD [ "node", "index.js" ]
```

### .dockerignore (Bohot Zaroori!)

`.gitignore` jaise hi — jo files image me **nahi** jaani chahiye:

```
node_modules
.git
.env
*.log
Dockerfile
.dockerignore
README.md
```

> Kyun? (1) Image size chhota, (2) `.env` jaise **secrets** image me leak nahi honge, (3) Build context chhota = fast build.

### Multi-Stage Builds (Pro Level)

```dockerfile
# Stage 1: Build karne wala (heavy tools ke saath)
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json .
RUN npm install
COPY . .
RUN npm run build          # TypeScript compile / React build

# Stage 2: Sirf final output (lightweight!)
FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY package*.json .
RUN npm install --omit=dev
CMD [ "node", "dist/index.js" ]
```

> Final image me build tools (typescript, webpack etc.) nahi honge — sirf output. Image size 70-80% kam ho sakta hai!

---

## 6. Docker Compose + Commands

### Compose Kyu?

Problem: Multi-container app (backend + frontend + database + redis) ke liye alag-alag `docker run` commands yaad rakhna pain hai:

```bash
# Ye sab yaad karna?? Nightmare!
docker network create mynet
docker run -d --name mongo --network mynet mongo
docker run -d --name redis --network mynet redis
docker run -d -p 8000:5000 --network mynet -e DB_URL=... my-backend
docker run -d -p 5173:5173 --network mynet my-frontend
```

Solution: Sab kuch ek **`docker-compose.yml`** file me declare karo, aur sirf ek command: `docker compose up`

### Mera docker-compose.yml (is repo me)

```yaml
services:
  backend:
    build: ./backend          # Dockerfile se build hoga
    env_file:
      - ./backend/.env        # .env file se secrets
    ports:
      - "8000:5000"           # host:container port mapping

  frontend:
    build: ./frontend
    ports:
      - "5173:5173"

  redis:
    image: redis              # Docker Hub se direct pull
    ports:
      - "6379:6379"
```

> **Note:** Is repo ke compose file me `6379:6379` ke aage space missing hai (`-6379:6379`) — YAML me `-` ke baad space zaroori hai: `- "6379:6379"`. Warna parse error aayega.

### Compose Concepts (Deep)

**1. Services** — har container ek service hai (backend, frontend, db, redis).

**2. Automatic Networking** — Compose khud ek network banata hai aur saari services usme daal deta hai. Services apne **service name se** ek dusre ko access kar sakti hain!

```js
// Backend code me localhost:6379 nahi, "redis":6379 likho!
const redis = require("redis").createClient({ url: "redis://redis:6379" });
//                                                    ^^^^^ service name = hostname
```

**3. env_file vs environment**
```yaml
environment:          # direct values yahi file me
  - PORT=5000
env_file:             # separate .env file se values
  - ./backend/.env
```

**4. depends_on** — startup order control:
```yaml
  backend:
    build: ./backend
    depends_on:
      - redis        # pehle redis start hoga, phir backend
```

### Compose Commands

```bash
# Saari services start karo (build + create network + run)
docker compose up
docker compose up -d                    # background me
docker compose up --build               # images ko rebuild karke start
docker compose up -d backend            # sirf ek service start

# Sab kuch stop + remove (containers, network; volumes by default safe)
docker compose down
docker compose down -v                  # volumes bhi delete (DB data ud jayega!)

# Logs
docker compose logs
docker compose logs -f backend          # live logs of one service

# Service rebuild (code change ke baad)
docker compose build
docker compose build backend

# Running services ki list
docker compose ps

# Service ke andar shell
docker compose exec backend bash

# Ek service ko restart
docker compose restart backend

# Scale karna (ek service ke multiple instances!)
docker compose up -d --scale backend=3
```

---

## 7. Docker Networking + Commands

### Networking Kyu Samajhna Zaroori?

Jab backend container se MongoDB container talk karna ho, toh connection **localhost pe nahi hoga**! Har container apna isolated network space rakhta hai. Networking hi containers ko connect karti hai.

### Network Types (Drivers)

**1. Bridge (Default)** — Same host pe containers ka private network.
```
                    Host Machine
┌────────────────────────────────────────────────┐
│  ┌───────────────┐        ┌───────────────┐    │
│  │   Backend     │        │    MongoDB    │    │
│  │ (172.18.0.2)  │◄──────►│  (172.18.0.3) │    │
│  └───────┬───────┘        └───────────────┘    │
│          │                                     │
│    ┌─────┴──────────────────────────┐          │
│    │  Bridge Network (docker0)      │          │
│    │  172.18.0.0/16                 │          │
│    └─────┬──────────────────────────┘          │
│          │                                     │
│    ┌─────┴─────┐                               │
│    │ Host NIC  │◄──── Internet                 │
│    └───────────┘                               │
└────────────────────────────────────────────────┘
```

**2. Host** — Container host ke network ko **directly share** karta hai (network isolation hat jaati hai, performance best).
```bash
docker run -d --network host nginx
# Ab nginx host ke port 80 pe directly hai — koi -p mapping ki zaroorat nahi!
```

**3. None** — Network **disable**. Container bilkul isolated (offline mode). Security-critical jobs ke liye.

**4. Overlay** — **Multiple machines** pe containers connect (Docker Swarm / distributed apps ke liye).

### Custom Network Kyu Banayein?

Default `bridge` pe containers sirf **IP se** baat kar sakte hain, but custom network pe **container name se** bhi (automatic DNS)!

```bash
# Default bridge pe: ❌ ping mongo nahi hoga, IP chahiye
# Custom network pe: ✅ container name = hostname
```

### Network Commands

```bash
# Saare networks dekho
docker network ls

# Naya custom network banao
docker network create mynet
docker network create --driver bridge mynet      # explicit bridge
docker network create --subnet=172.20.0.0/16 mynet   # custom IP range

# Container ko specific network pe run karo
docker run -d --name mongo --network mynet mongo
docker run -d --name backend --network mynet myapp

# Ab backend ke andar se 'mongo' hostname kaam karega:
docker exec -it backend sh
/ # ping mongo        # ✅ custom network pe DNS resolution!

# Network ki details inspect karo (kaun se containers connected hain)
docker network inspect mynet

# Running container ko network me connect/disconnect karo
docker network connect mynet my-container
docker network disconnect mynet my-container

# Network delete
docker network rm mynet
docker network prune          # unused networks cleanup
```

### Port Mapping vs Container-to-Container

```
┌─────────────────────────────────────────────────────┐
│ HOST (Tumhara Laptop/Server)                        │
│                                                     │
│  Browser ──:8000──► [docker port map] ──► Backend   │
│  (Tum)         -p 8000:5000            (:5000)      │
│                                                     │
│  Backend ──:27017──► MongoDB                        │
│  (Container)  hostname 'mongo'      (NO -p needed!) │
│                                                     │
│  KEY POINT: Jo containers SIRF andar baat karte     │
│  hain (DB, Redis) unke ports expose karne ki        │
│  zaroorat NAHI hai — security best practice!        │
└─────────────────────────────────────────────────────┘
```

> **Security Tip:** Database ko `-p 27017:27017` mat karo! Wo sirf same network ke containers ke liye accessible hona chahiye. Sirf public-facing services (backend, frontend, nginx) ke ports map karo.

---

## 8. Docker Volumes + Commands

### Problem: Container Data Loss

```bash
docker run -d --name mongo mongo
docker stop mongo && docker rm mongo     # container delete
docker run -d --name mongo mongo
# 💀 Saara DB data GAYA! Container ephemeral hai.
```

Containers are **ephemeral** (temporary). Data persist karne ke liye **Volumes** chahiye.

### Volume Kyu? (3 Reasons)

1. **Data Persistence** — container delete ho, data rahe.
2. **Host-Container Sharing** — code editing live sync (dev ke liye mazaak hai).
3. **Performance** — container's writable layer slow hai; volumes fast hain.

### Volume Types (Deep)

**Type 1: Named Volumes (Docker-managed, BEST for production data)**
```bash
docker volume create mydata
docker run -d -v mydata:/data/db --name mongo mongo
#              ↑↑↑↑↑↑ ↑↑↑↑↑↑↑
#         volume-name : container-path
# Docker khud data store karta hai apne area me (Linux: /var/lib/docker/volumes/)
```

**Type 2: Bind Mounts (Host ki specific directory, BEST for dev)**
```bash
docker run -d -v "$(pwd):/app" -w /app node npm run dev
#              ↑↑↑↑↑↑↑↑
#         host-path (absolute!) : container-path

# Windows example:
docker run -d -v "C:\Users\Neeraj\myproject:/app" myapp
# Host pe code edit karo → container me instant reflect → nodemailer dev server live!
```

**Type 3: Anonymous Volumes**
```bash
docker run -d -v /data/db mongo
# Docker random name deta hai (hash). Mostly node_modules avoid karne ke liye:
docker run -d -v "C:\project:/app" -v /app/node_modules myapp
# ^ Ye trick: host mount node_modules ko overwrite nahi kar payega!
```

### Volume Commands

```bash
# Volumes list
docker volume ls

# Naya volume
docker volume create mydata

# Volume details (mountpoint, driver)
docker volume inspect mydata

# Volume delete
docker volume rm mydata

# Saare unused volumes cleanup
docker volume prune

# Check karo container me kya mounted hai
docker inspect my-container --format='{{json .Mounts}}'
```

### Compose me Volumes

```yaml
services:
  backend:
    build: ./backend
    volumes:
      - ./backend:/app              # bind mount: live code sync (dev)
      - /app/node_modules           # anonymous: node_modules protect
      - db-data:/data/db            # named volume

volumes:            # top-level me declare karna zaroori
  db-data:
```

### Diagram: Data Flow

```
┌──────────── HOST MACHINE ──────────────────────────────┐
│                                                        │
│   ./project-code (Bind Mount)                          │
│        │  (live sync, dono taraf)                      │
│        ▼                                               │
│   ┌──────────────────┐     ┌─────────────────────┐     │
│   │    CONTAINER     │     │   NAMED VOLUME      │     │
│   │                  │────►│   "db-data"         │────►│  /var/lib/docker/
│   │   /app (code)    │     │   (data persists!)  │     │  volumes/ (safe zone)
│   └──────────────────┘     └─────────────────────┘     │
│        │                                               │
│        ▼                                               │
│   Container delete hone pe:                            │
│   ✗ /app changes GAYE                                  │
│   ✓ "db-data" ka data SURVIVE karta hai                │
└────────────────────────────────────────────────────────┘
```

> **Rule of thumb:**
> - **Dev me** → Bind mount for code (live reload)
> - **Data (DB, uploads) ke liye** → Named volumes
> - **Production me** → Named volumes / managed storage

---

## 9. Diagram Explanations

### 9.1 Full Docker Architecture (Image se Container tak)

```
   TUMHARA LAPTOP
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  ┌──────────┐    docker build     ┌─────────┐   docker run      │
│  │Dockerfile├────────────────────►│  IMAGE  ├────────────────┐  │
│  └──────────┘   (layers banti    └────┬────┘                │  │
│                 hain, cached)         │                     ▼  │
│                                       │              ┌───────────┐
│                                       │ pull/push    │ CONTAINER │
│                                       ▼              │ (running) │
│                              ┌──────────────┐        └───────────┘
│                              │   REGISTRY   │               ▲
│                              │ (Docker Hub) │               │
│                              └──────────────┘               │
│                                                                 │
│  ┌─────────────────── DOCKER DAEMON (dockerd) ───────────────┐  │
│  │  - Images manage karta hai                                │  │
│  │  - Containers run karta hai                               │  │
│  │  - Networks + Volumes handle karta hai                    │  │
│  └───────────────────────────────────────────────────────────┘  │
│                              ▲                                  │
│                    docker CLI ──REST API──► dockerd            │
└─────────────────────────────────────────────────────────────────┘
```

**Flow samjho:**
1. `Dockerfile` likho → `docker build` → **Image** bani (layers ke saath)
2. Image ko `docker run` → **Container** chalega
3. Image `docker push` se **Docker Hub** pe ja sakti hai, `docker pull` se aa sakti hai
4. Saara kaam **Docker Daemon** (dockerd) karta hai — CLI sirf usse baat karta hai

### 9.2 Layer Architecture (Image ki andar ki baat)

```
docker build ke baad:

┌─────────────────────────────┐
│  CMD ["node","index.js"]    │  ← Layer 5 (thin, metadata)
├─────────────────────────────┤
│  COPY . .                   │  ← Layer 4 (tumhara code)
├─────────────────────────────┤
│  RUN npm install            │  ← Layer 3 (node_modules, HEAVY)
├─────────────────────────────┤
│  COPY package*.json .       │  ← Layer 2 (sirf package files)
├─────────────────────────────┤
│  WORKDIR /app               │  ← Layer 1 (metadata)
├─────────────────────────────┤
│  FROM node:20-alpine        │  ← Base Layer (shared, read-only)
└─────────────────────────────┘
        ▼
Container start hone pe upar ek:
┌─────────────────────────────┐
│  Thin R/W Layer (writable)  │  ← Container-specific changes yahan
└─────────────────────────────┘

KEY: Saari images READ-ONLY hain. Naya build:
- Agar package*.json unchanged → Layer 2,3 CACHE se aayenge (fast!)
- Sirf badli hui layers ke baad wali layers rebuild hoti hain
```

### 9.3 Multi-Container App (Compose Setup)

```
┌─────────────────── docker compose up ────────────────────────┐
│                                                              │
│   Network: "docker_default" (auto-created bridge)            │
│   ┌─────────────────────────────────────────────────────┐    │
│   │                                                     │    │
│   │  ┌──────────┐  ┌──────────┐  ┌──────────┐           │    │
│   │  │ frontend │  │ backend  │  │  redis   │           │    │
│   │  │ :5173    │─►│ :5000    │─►│  :6379   │           │    │
│   │  └────┬─────┘  └────┬─────┘  └──────────┘           │    │
│   │       │             │                               │    │
│   └───────┼─────────────┼───────────────────────────────┘    │
│           │             │                                    │
│     -p 5173:5173    -p 8000:5000    (redis: NO port map       │
│           ▼             ▼           needed — internal!)      │
│   ┌─────────────────────────────┐                             │
│   │   HOST: localhost           │                             │
│   │   http://localhost:8000  ──► backend API                 │
│   │   http://localhost:5173  ──► frontend                    │
│   └─────────────────────────────┘                             │
└──────────────────────────────────────────────────────────────┘

Inter-container communication: service NAME use karo
  frontend → fetch("http://backend:5000/api")   ✅
  backend  → redis://redis:6379                 ✅
  (localhost NAHI use karna! wo container ka apna localhost hai ❌)
```

---

## 10. Real-Life Usages

### 10.1 Local Development (Sabse Common)

**Problem:** Team ke har dev ka environment alag. "Mere paas chal raha hai" wali problem.

**Solution:**
```yaml
# Ek compose file — poora dev environment ek command me
docker compose up
# Node app + MongoDB + Redis + RabbitMQ sab ready, har machine pe SAME.
```
New dev onboard? Git clone + `docker compose up` → 5 min me ready. 2 din ki setup manual khatam!

### 10.2 CI/CD Pipeline

```yaml
# GitHub Actions me:
- name: Build & Test
  run: |
    docker build -t myapp:${{ github.sha }} .
    docker run myapp npm test

- name: Deploy
  run: |
    docker push registry/myapp:${{ github.sha }}
    ssh server "docker pull registry/myapp && docker compose up -d"
```
Build machine pe bhi wahi environment — flaky tests ki wajah se environment mismatch nahi.

### 10.3 Microservices Architecture

Har service apna container: API Gateway, Auth Service, Order Service, Payment Service — sab independently scale ho sakte hain:
```bash
docker compose up -d --scale order-service=5
# Order service ke 5 instances chal rahe — load handle!
```

### 10.4 Databases ka Clean Testing

```bash
# Fresh DB ke saath integration test chalao, phir sab delete:
docker run -d --name test-db mongo:7
npm test
docker rm -f test-db
# Test data se tumhara local DB kharab nahi hoga!
```

### 10.5 Tools ko Bina Install Kiye Chalana (My Favorite!)

```bash
# Redis try karna hai? Install mat karo:
docker run -d -p 6379:6379 redis

# PostgreSQL chahiye 10 min ke liye:
docker run -d -p 5432:5432 -e POSTGRES_PASSWORD=secret postgres

# Koi random tool:
docker run --rm -it alpine sh    # fresh Linux shell, exit karte hi gayab!
```
Laptop pe unnecessary installations nahi — chahiye toh container, kaam ho toh `docker rm`.

### 10.6 Kubernetes / Cloud Deployment

- Production me containers **Kubernetes** ke andar chalte hain (orchestration).
- AWS ECS, Google Cloud Run, Azure Container Instances — sab container-based.
- Docker seekhna = cloud-native career ka **foundation**.

### 10.7 Legacy App Migration

Purani app jo 2019 ke Ubuntu pe chalti thi? Us purane OS ko base image bana do — app chalegi bina code change kiye, modern infra pe.

---

## 11. Quick Cheatsheet

```bash
# ============ IMAGES ============
docker pull <image>              # download
docker images                    # list
docker build -t name .           # build
docker rmi <image>               # delete
docker image prune -a            # cleanup

# ============ CONTAINERS ============
docker run -d --name n -p 8000:5000 <img>   # run detached + port
docker run -it node bash                      # interactive shell
docker ps / ps -a                             # list running / all
docker stop / start / restart <c>             # lifecycle
docker logs -f <c>                            # live logs
docker exec -it <c> bash                      # shell inside
docker rm -f <c>                              # delete
docker stats                                  # resource monitor

# ============ COMPOSE ============
docker compose up -d --build      # start (rebuild)
docker compose down               # stop + cleanup
docker compose logs -f <svc>      # logs
docker compose ps                 # status
docker compose exec <svc> bash    # shell

# ============ NETWORKS ============
docker network ls                 # list
docker network create mynet       # create
docker run --network mynet <img>  # use
docker network inspect mynet      # details
docker network prune              # cleanup

# ============ VOLUMES ============
docker volume create mydata       # create
docker volume ls                  # list
docker run -v mydata:/data <img>  # named volume
docker run -v "$(pwd):/app" <img> # bind mount (dev)
docker volume prune               # cleanup

# ============ SYSTEM ============
docker system df                  # disk usage
docker system prune -a            # big cleanup
docker version / info             # info
```

---

## Mere Learning Notes (Key Takeaways)

1. **Image = blueprint, Container = running instance** — yahi core hai.
2. **Dockerfile me order matters** — pehle `package.json` copy + `npm install`, phir code copy. Layer caching ka pura fayda.
3. **`.dockerignore` likhna mat bhoolna** — especially `.env` (secrets!).
4. **`localhost` container me kaam nahi karega** dusre container tak pahunchne ke liye — **service name** use karo (custom network/compose me).
5. **Data persist karna hai toh Volumes** — container ephemeral hota hai.
6. **DB ports host pe expose mat karo** — sirf backend/frontend ke ports map karo.
7. **Dev me bind mounts, data ke liye named volumes, prod me multi-stage builds + alpine images.**
8. **`docker compose down -v` DANGER** — volumes delete karta hai, DB data ud jayega!

---

## Is Repo Ki Files

| File | Description |
|------|-------------|
| `Dockerfile` | Node.js app ka build process — 3 versions (naive → optimized → best practice) |
| `docker-compose.yml` | Backend + Frontend + Redis ka multi-container setup |
| `README.md` | Ye guide — Docker ka complete Hinglish handbook |

---

*Happy Dockering!containerize everything!* 🐳
