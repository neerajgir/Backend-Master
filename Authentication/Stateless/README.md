# 🔐 Stateless Authentication — JWT + bcrypt Deep Dive

> **"All about JWT authentication"** — ek learning repo jisme humne **Stateless Authentication** ko zero se build kiya hai using **Node.js, Express, MongoDB (Mongoose), JWT aur bcrypt**.

---

## 📖 Intro — Ye Repo Kya Hai?

Yeh ek **learning project** hai jisme maine samjha hai ki real-world applications mein **user authentication** kaise kaam karti hai. Jab hum kisi app mein **login / signup** karte hain, toh backend ko yeh decide karna hota hai:

> ❓ **"Yeh request karne wala user asli hai ya nahi? Aur agar hai, toh kya usko yeh cheez access karne ki permission hai?"**

Is repo mein humne backbone banaya hai:

```
POST /auth/signup   →  User register karo (password hash karke save karo)
POST /auth/login    →  Login karo → JWT token do
GET  /private/      →  Protected route — sirf valid token wale ko access milega
```

**Tech Stack:**

| Cheez | Technology | Kyun? |
|-------|-----------|-------|
| Runtime | Node.js | JavaScript server-side chalane ke liye |
| Framework | Express | Routes / middleware handling asaan banata hai |
| Database | MongoDB (Mongoose) | Schema-based user data store |
| Hashing | bcrypt | Password kabhi plain nahi rakhte |
| Token | jsonwebtoken (JWT) | Stateless session ke liye |

---

## 🗂️ Project Structure

```
Stateless/
├── index.js                    # Main server — sab kuch yahan se start hota hai
├── config/
│   └── db.js                   # MongoDB connection
├── models/
│   └── user.model.js           # User Schema + bcrypt hooks + comparePassword
├── routes/
│   ├── auth.routes.js          # /signup and /login
│   └── private.routes.js       # Protected route (JWT chahiye)
├── middlewares/
│   └── auth.middleware.js      # JWT verify karne wala middleware
├── .env                         # PORT, MONGO_URI, JWT_SECRET
└── package.json
```

---

## 🚀 Kaise Chalayein?

```bash
# 1. Dependencies install karo
npm install

# 2. .env file mein apni values daalo
PORT=3000
MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/YourDB
JWT_SECRET=kuch-bhi-random-56-character-secret

# 3. Dev server start karo (nodemon)
npm run dev
```

**Test karo — Postman / curl se:**

```bash
# Signup
curl -X POST http://localhost:3000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"username": "neeraj", "password": "mysecret123"}'

# Login (yahan se token milega)
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "neeraj", "password": "mysecret123"}'

# Protected route (token header mein bhejo)
curl http://localhost:3000/private/ \
  -H "Authorization: <YOUR_TOKEN>"
```

---

## 🧠 Topic #1 — Authentication Do Types Ki Hoti Hai

Har developer ke liye sabse pehle yeh samajhna zaroori hai — **stateful vs stateless**. Is repo ka naam hi **Stateless** hai, isliye yeh topic samjho aaram se:

### 1️⃣ Stateful Authentication (Session-based)

- Login ke baad server **session store** mein user ki data store karta hai (RAM ya Redis).
- Client ko ek **session ID cookie** milti hai.
- Har request pe server DB/session-store se user dhoondta hai.
- **Problem:** Server ko state yaad rakhni padti hai → har server ka **same store share** karna padta hai (sticky sessions ya central Redis), scaling hard hai.

### 2️⃣ Stateless Authentication (JWT-based) ✅ — hamari repo mein yeh hai

- Login par server ek **JWT token** deta hai, client usko store karta hai.
- Ab **har request** mein client token bhejta hai (`Authorization` header).
- Server ko kuch **yaad rakhne ki zaroorat nahi** — token khud hi authenticated user ka pura data verify karta hai.
- **Scaling asaan:** koi bhi server request handle kar sakta hai, kyunki state token mein hi hai. 

```
Stateful:   Login → server ko yaad rehta hai → cookie check
Stateless:  Login → token milta hai → har request mein token verify
```

> 💡 **Stateless ka matlab hai:** Server ki koi session memory nahi. Token mein hi sab kuch. Isliye yeh scale hota hai.

---

## 🧠 Topic 2 — JWT (JSON Web Token)

### JWT dikhta kya hai?

Ek JWT 3 parts ka hota hai, dots (`.`) se alag:

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.     ← Header
eyJpZCI6IjY0...IiwidXNlcm5hbWUiOiJuZWVyYWoifQ.  ← Payload
SpL5dlX...zGvFCw                              ← Signature
```

```
[Header].[Payload].[Signature]
```

- **Header** → Algorithm info (`HS256`, type `JWT`)
- **Payload** → Data (id, username, exp, etc.) — *base64, encrypted nahi!*
- **Signature** → `HMACSHA256(base64(header) + "." + base64(payload), JWT_SECRET)`

**🔥 Important:** Payload base64-encoded hota hai, **encrypted nahi**! Matlab koi bhi token decode karke payload padh sakta hai. Signature sirf **tamper-proof** hota hai — data change karoge toh signature mismatch ho jayega. **Isliye secret data (password) kabhi payload mein mat dalo!**

### Token kahan hai hamare code mein?

**Login route mein token generate hota hai** (`routes/auth.routes.js`):

```javascript
const token = jwt.sign(
    { id: user._id, username: user.username }, // payload
    process.env.JWT_SECRET,                     // secret
    { expiresIn: "1h" }                          // expiry
);

res.status(200).json({ success: true, message: "User login successfully.", token });
```

### Token kaise verify hota hai? (`middlewares/auth.middleware.js`)

```javascript
import jwt from 'jsonwebtoken';

export const authenticationToken = (req, res, next) => {
    const token = req.header("Authorization");
    if (!token) return res.status(401).json({ message: "Access denied: No token Provided" });

    try {
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decode;   // ab route yeh jaan sakta hai user kaun hai
        next();
    } catch (error) {
        res.status(500).json({ message: "something went wrong", error: error.message });
    }
};
```

Aur phir route par:

```js
app.use("/auth", authRoutes);        // public routes — koi bhi call kar sakta hai
app.use("/private", privateRoutes);  // private routes — inpe middleware lagta hai
```

```js
// routes/private.routes.js
router.get("/", authenticationToken, (req, res) => {
    res.status(200).json({ message: "Welcome to private router", user: req.user });
});
```

**Yahan next() kya karti hai?**
Express ka **middleware chain** — `authenticationToken` pehle check karta hai. Agar token valid hai toh `next()` se request aage server ko jati hai, nahi toh error return karta hai.

### 🔎 JWT real-life usages

| Use-case | Kaise use hota hai |
|---|---|
| **Web apps (React/Angular)** | Login ke baad JWT localStorage / memory mein, har API call ke `Authorization: Bearer <token>` header mein bhejte hain |
| **Mobile apps** | `JsonWebToken` native store me save, har API call pe send |
| **Microservices** | Service-to-service communication — internal microservices ek token se identity verify karte hain |
| **SSO (Single Sign-On)** | OAuth2/OpenID Connect kai places par JWT access tokens dete hain |
| **Password Reset links** | Expiry wala token email mein, 10-min ke liye valid |
| **Email verification** | Same — time-bound token |
| **Server-to-Server / CLI** | Machine-to-machine APIs ke liye bhi JWT standard hai |

---

## 🧠 Topic 3 — bcrypt (Password Hashing)

### Pehle samjho: password plain kyu nahi rakhte?

Agar aapke DB ka password plain hai aur server hack ho gaya → **har user ki password public** → data leak. Isliye **hash** karte hai — one-way function, reverse kar kar nahi sakte.

bcrypt kya khaas karta hai:

- **Salt automatically add** — har password ke saath ek alag random salt lagta hai. Do log ek hi password rakhein, tab bhi unke hashes alag hote hain (rainbow table attack fail).
- **Slow by design** — bcrypt deliberately CPU-expensive hai taaki brute-force / dictionary attacks slow ho.
- **Multiplatform** — Node.js mein readily available hai (`bcrypt` package).

### Hamari code mein bcrypt:

**1. Save hone se pehle hi bcrypt ka pre-save hook** (`models/user.model.js`):

```js
import mongoose from "mongoose";
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

// 🔥 Pre-save hook — password save se pehle hash ho jata hai
userSchema.pre("save", async function () {
    if (!this.isModified("password")) return;  // sirf password badla ho toh hi hash karo
    this.password = await bcrypt.hash(this.password, 10); // salt rounds = 10
});
```

**2. Compare karna login par**:

```js
userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};
```

**3. Login route mein compare ka use** (`routes/auth.routes.js`):

```js
const isMatch = await user.comparePassword(password);
if (!isMatch) return res.status(400).json({ success: false, message: "Invalid username or password" });
```

### `salt rounds` kya hai? (Important)

```js
bcrypt.hash(password, 10)
```

- `10` matlab **cost factor** — internal hashing ko **2^10 = 1024 baar** karna padega.
- Zyada rounds = zyada secure, but slow bhi.
- Recommendation: **10-12** standard hai. Production mein 12 use karo.

### 🛡️ bcrypt real-life usages

| Use-case | Details |
|---|---|
| **User password storage** | Har website jisme signup/login hota hai — password kabhi plain store nahi |
| **Admin/payment systems** | Sensitive credentials protection |
| **ETL/HR systems** | PII (personally identifiable info) hash hota hai even at rest |
| **Legacy system migration** | Purana plain-store password → bcrypt hash migrate |
| **2FA backup codes** | Short-lived codes bhi hash karke store |

---

## ⚠️ Common Mistakes + Improvements (Deep Learning)

Review karte waqt is repo code mein mujhe kuch cheezein dikhin jo **learning ke liye perfect hain, lekin production ke liye improve karni chahiye** — inhi se asli gyaan milta hai.

### 1. `Authorization` header mein `Bearer ` prefix 🔥
Standard practice hai header mein `Bearer <token>` bhejna. Hamara code poora raw string le raha hai (`req.header("Authorization")`). Production mein prefix strip karna chahiye:

```js
const token = req.header("Authorization")?.replace("Bearer ", "");
```

### 2. Error status codes — 401 vs 500

Invalid token hai toh **401 Unauthorized** return karo, na ki 500 Internal Server Error:

```js
} catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
}
```

### 3. Password ko kabhi bhi print/log mat karo:red_circle:

Hash storage toh ho hi jata hai. Lekin debugging ke naam par aisa kuch:

```js
console.log("User password:", req.body.password); // 🔴 KABHI NAHI!
```

Logs mein password aaya toh woh log file / log aggregator mein seedha stored ho jata hai — aur ek bar log leak ho to sab kuch leak.

### 4. Input validation — should not only check "exists"

Abhi hum signup mein sirf yeh check karte hain ki user already exist toh nahi karta. Password ki length, valid username format — yeh sab validate karna chahiye:

```bash
npm install zod
```

```ts
import { z } from "zod";

const loginSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(8),
});

// Har request par:
const parsed = loginSchema.safeParse(req.body);
if (!parsed.success) return res.status(400).json(parsed.error);
```

Invalid input par `400` milta hai, aur internal error khul ke 500 nahi aata.

### 5. Login rate limiting 🚫

Login route ke against brute-force attack hota hai — attacker har possible password try karega. Production mein:

```bash
npm install express-rate-limit
```

```js
import rateLimit from "express-rate-limit";

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10,                   // max 10 attempts per IP
});

router.post("/login", limiter, loginHandler);
```

### 6. `.env` ko kabhi commit mat karo 🔐

Tumhare `.env` mein **real MongoDB password** aur **JWT secret** hai. `.gitignore` mein add rakhna bhai (repo mein yeh pehle se present hai — good). JWT_SECRET ko **32+ character random** rakho, aise banao:

```bash
openssl rand -hex 32
```

### 7. Unique username — edge case

`unique: true` schema par hai, lekin duplicate key error (MongoDB code `11000`) ko bhi handle karna chahiye — abhi signup mein pahle se user-exists wala check hai ✓

### 8. JWT expiry + refresh tokens 🔄

JWT ka backend side se revoke ho nahi paata (kyunki woh stateless hai). Isliye production mein **short-lived access token + refresh token** ka pattern use hota hai:

```
Access token  → 15 min   → har request par use hota hai
Refresh token → 7 din    → access token expire hone par isse naya token milta hai
```

### 9. Logout / blacklist

JWT sirf expiry ke baad hi destroy hota hai. Real logout ke liye `redis` blacklist ya `jti`-based revoke list use hoti hai.

---

## ✅ Best Practices Checklist

```
✅ Hashing: bcrypt / argon2 — plain password kabhi nahi
✅ Secret: 32+ character, .env mein, kabhi hardcode commit mat karo
✅ Token expiry: hamesha expiresIn lagao (1h, 15m etc.)
✅ Sensitive data JWT payload mein kabhi nahi (password etc.)
✅ HTTPS use karo — insecure channel kabhi nahi (MITM risk)
✅ Send password in response: kabhi user object return mat karo
✅ Input validation (zod/joi) — DO it
✅ Rate limit login endpoints
✅ 'Authorization' header handling: Bearer prefix
✅ Error messages: "Invalid username or password" (don't leak existence)
✅ Never log secrets/tokens
```

---

## 📌 API Reference

| Method | Endpoint | Layer | Body | Response |
|--------|----------|------|------|-----------|
| `POST` | `/auth/signup` | Public | `{username, password}` | `201 user registered` |
| `POST` | `/auth/login` | Public | `{username, password}` | `200 {token}` |
| `GET` | `/private/` | Protected (JWT) | — | `200 {user, message}` |

---

## 🎯 Takeaways (Chhoti-si wise words)

1. **Stateless authentication** ka power hai — scaling easy, no server memory.
2. **JWT** verify karta hai identity — signature matlab tamper-proof.
3. **bcrypt + salt** password ki real-world safety.

**Poora flow ek line mein:**

```
signup  → password = bcrypt.hash(password, 10)   → DB mein save
login   → bcrypt.compare(password) → match? → jwt.sign({id, username}, SECRET, {expiresIn: "1h"})
request → middleware: jwt.verify(token) → req.user = decode → protected route
```

---

**Made with ❤️ by Neeraj** — Learning ke liye bana hai, padhte raho! 🚀