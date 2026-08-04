# ExpressJS — Day 2: Middleware & Routers

> **Learning Notes** — Middleware, Routers, aur unka real-world use samajhne ke liye ye notes banaaye gaye hain.

---

## 📌 Intro

Day 1 mein humne Express server setup kiya, basic routes banaye, aur `req` / `res` objects samjhe. **Day 2** ka focus hai:

1. **Middleware** — request aur response ke beech mein chalne wale functions
2. **Routers** — routes ko alag files mein organize karna
3. **Mini-Project** — logging, token-based auth, public vs private routes ka practical example

Express mein har request ek **middleware chain** se guzarati hai. Samajh lo jaise airport security check — pehle ID verify, phir boarding pass, phir gate — har step ek middleware hai. Agar koi step fail ho, aage nahi ja sakte.

---

## 📁 Folder Structure

```
Day-2/
├── index.js                 # Main server + router mount
├── middleware.js            # Middleware concepts (practice notes)
├── routers/
│   └── user.routes.js       # User-related routes (Router example)
├── Mini-Project/            # Complete mini app
│   ├── index.js
│   ├── middleware/
│   │   ├── auth.middleware.js
│   │   └── log.middleware.js
│   ├── routes/
│   │   ├── public.routes.js
│   │   └── private.routes.js
│   ├── utils/
│   │   └── token.utils.js
│   └── logs/
│       └── request.log
├── package.json
└── README.md
```

---

## 🧠 Middleware Kya Hai?

**Middleware** ek function hai jo `(req, res, next)` leta hai aur request ke beech mein kuch kaam karta hai — jaise logging, auth check, body parse karna, etc.

**Important rule:** Agar aage ka route ya middleware chalana hai, to **`next()`** call karna zaroori hai. Warna request wahi atak jayegi.

### Middleware ke 3 Types (Is folder mein)

| Type | Kahan use hota hai | Example |
|------|-------------------|---------|
| **Global** | Har request par | `app.use(logMiddleware)` |
| **Route-specific** | Sirf ek route par | `app.get('/', sayHi, handler)` |
| **Inbuilt** | Express ka ready-made | `app.use(express.json())` |

---

## 1️⃣ Global Middleware

Global middleware **sabhi routes** par lagta hai jab tum `app.use()` use karte ho.

```js
// middleware.js se concept
function sayHi(req, res, next) {
    console.log("Hi i am middleware");
    next(); // ⚠️ Bina next() ke request aage nahi badhegi
}

app.use(sayHi); // Har request par chalega
```

**Mini-Project mein real example — Request Logger:**

```js
// Mini-Project/middleware/log.middleware.js
const logMiddleware = (req, res, next) => {
    const log = `[${new Date().toString()}] ${req.method} ${req.url}\n`;
    const logFile = path.join(__dirname, "../logs/request.log");

    fs.appendFile(logFile, log, (error) => {
        if (error) console.log("failed log request", error);
    });
    next();
};

// Mini-Project/index.js
app.use(logMiddleware); // Har request log hogi
```

---

## 2️⃣ Route-Specific Middleware

Sirf **ek particular route** par middleware lagana ho to us route ke arguments mein pass karo.

```js
// Sirf "/" route par sayHi chalega
app.get('/', sayHi, (req, res) => {
    res.send("Hello World!");
});
```

**Mini-Project mein — Auth sirf dashboard par:**

```js
// Mini-Project/routes/private.routes.js
privateRouter.get("/dashboard", authMiddleware, (req, res) => {
    const userName = req.user.name;
    res.status(200).send({
        message: `Welcome To Dashboard 🏠 ${userName}`
    });
});
```

Yahan `authMiddleware` sirf `/private/dashboard` par chalega, baaki public routes par nahi.

---

## 3️⃣ Inbuilt Middleware — `express.json()`

Jab client **JSON body** bhejta hai (POST/PUT requests mein), Express ko batana padta hai ki body ko parse karna hai.

```js
app.use(express.json()); // req.body ab readable hota hai
```

**Real-life:** Form submit, login API, product create — sab jagah JSON body aati hai. Bina `express.json()` ke `req.body` undefined rahega.

---

## 🔀 Routers — Routes Ko Organize Karna

Bade apps mein saari routes `index.js` mein likhna messy ho jata hai. **`express.Router()`** se routes alag files mein split kar sakte ho.

### Basic Router Example

```js
// routers/user.routes.js
import { Router } from "express";

const userRouter = Router();

userRouter.get("/create-user", (req, res) => {
    res.send("User Page");
});

userRouter.get("/getAllUser", (req, res) => {
    res.send("Get users");
});

export default userRouter;
```

```js
// index.js — Router ko mount karna
import userRouter from './routers/user.routes.js';

app.use("/api/v1/users", userRouter);
```

**Final URLs:**
- `GET /api/v1/users/create-user`
- `GET /api/v1/users/getAllUser`

> **Tip:** Mount path (`/api/v1/users`) + router path (`/create-user`) = full URL

---

## 🚀 Mini-Project — Poora Flow

Mini-Project ek chhota sa app hai jisme **public routes**, **private routes**, **logging**, aur **token auth** combine kiye gaye hain.

### App Entry Point

```js
// Mini-Project/index.js
app.use(express.json());      // Inbuilt — JSON body parse
app.use(logMiddleware);       // Global — har request log

app.use("/public", publicRouter);
app.use("/private", privateRouter);
```

### Token Generate & Validate

```js
// Mini-Project/utils/token.utils.js
import crypto from "crypto";

const generateToken = () => {
    return crypto.randomBytes(16).toString("hex"); // 32 char hex string
};

const validateToken = (token) => {
    return token.length === 32;
};
```

### Public Route — Token Generate

```js
// GET /public/generate-token
publicRouter.get("/generate-token", (req, res) => {
    const token = generateToken();
    res.status(200).json({
        message: "Token Generated, Save it for future usage",
        token: token
    });
});
```

### Auth Middleware — Private Routes Protect Karna

```js
// Mini-Project/middleware/auth.middleware.js
const authMiddleware = (req, res, next) => {
    const token = req.headers['authorization'];

    if (token && validateToken(token)) {
        req.user = { name: "Neeraj", id: 1 }; // User info attach
        next();
    } else {
        res.status(401).send("Unauthorized User: Invalid Or Missing Token");
    }
};
```

### Request Flow Diagram

```
Client Request
     │
     ▼
┌─────────────────┐
│  logMiddleware  │  ← Har request log file mein
└────────┬────────┘
         │
    ┌────┴────┐
    ▼         ▼
 /public   /private
    │         │
    │         ▼
    │   authMiddleware  ← Token check
    │         │
    ▼         ▼
  Home    Dashboard
```

---

## 🌍 Real-Life Usage — Ye Concepts Kahan Lagte Hain?

### 1. Logging Middleware
**Kahan:** Production apps, APIs, e-commerce sites  
**Kyun:** Har request ka record rakhna — debugging, analytics, security audit ke liye  
**Example:** Amazon/Flipkart jab order place karte ho, server har API hit log karta hai (method, URL, timestamp, user IP)

### 2. Auth Middleware
**Kahan:** Instagram profile, Gmail inbox, bank app dashboard  
**Kyun:** Bina login ke private data expose nahi hona chahiye  
**Example:** `/private/dashboard` jaise routes par JWT ya session token check hota hai — bilkul is mini-project jaisa pattern

### 3. `express.json()`
**Kahan:** Har REST API jo POST/PUT accept karti hai  
**Kyun:** Client JSON bhejta hai, server ko parse karna padta hai  
**Example:** Login form `{ "email": "...", "password": "..." }` — bina is middleware ke server body read nahi kar payega

### 4. Routers
**Kahan:** Har bade Node/Express project  
**Kyun:** Code maintainable rehta hai — user routes alag, product routes alag, order routes alag  
**Example:**
```
/routes
  ├── user.routes.js      → /api/users/*
  ├── product.routes.js   → /api/products/*
  └── order.routes.js     → /api/orders/*
```

### 5. Public vs Private Route Split
**Kahan:** Almost har web app  
**Public:** Home page, login, signup, product listing  
**Private:** Profile, cart, admin panel, settings  

---

## ▶️ Kaise Run Karein?

### Day-2 Basic (Routers)

```bash
cd ExpressJS/Day-2
npm install
npm run dev
```

Server: `http://localhost:8080`  
Try: `http://localhost:8080/api/v1/users/getAllUser`

### Mini-Project

```bash
cd ExpressJS/Day-2/Mini-Project
npm install
npm run dev
```

Server: `http://localhost:3000`

| Step | Method | URL | Headers |
|------|--------|-----|---------|
| 1. Home | GET | `/public/` | — |
| 2. Token lo | GET | `/public/generate-token` | — |
| 3. Dashboard (✅) | GET | `/private/dashboard` | `Authorization: <token>` |
| 4. Dashboard (❌) | GET | `/private/dashboard` | Token mat bhejo → 401 |

**Postman / Thunder Client tip:**  
Headers tab mein `Authorization` key mein wahi token paste karo jo step 2 se mila.

---

## 📝 Summary

| Topic | Yaad Rakhne Wali Baat |
|-------|----------------------|
| **Middleware** | `(req, res, next)` wala function; `next()` call karna mat bhoolna |
| **Global middleware** | `app.use()` — sab routes par |
| **Route middleware** | Specific route ke beech mein pass karo |
| **Inbuilt middleware** | `express.json()`, `express.static()`, etc. |
| **Router** | Routes ko alag files mein split karo; `app.use(path, router)` se mount |
| **Auth pattern** | Token header se lo → validate karo → `req.user` set karo → `next()` |
| **Logging** | Har request ka record — production debugging ke liye useful |

**Ek line mein:** Middleware request ke beech ka **filter/checkpoint** hai, Router routes ka **organizer** hai, aur dono milkar clean, secure, scalable backend banate hain.

---

## 🔗 Agla Step (Day 3 ke liye socho)

- JWT library (`jsonwebtoken`) se proper token auth
- Error handling middleware
- Environment variables (`.env`) for secrets
- Database connect karke real user data

---

*Notes by Neeraj — ExpressJS Backend Master Series*
