# Authentication Learning Repository

Ek comprehensive learning project jo demonstrate karta hai **session-based (stateful) authentication** ko Express.js, MongoDB, aur bcrypt ke saath. Ye repository aapko authentication concepts samajhne, implementation patterns dekhne, aur stateful vs stateless approaches ke beech ka difference practical tarike se sikhane ke liye hai.

---

## Table of Contents

1. [Introduction (Parichay)](#introduction)
2. [Authentication vs Authorization](#authentication-vs-authorization)
3. [Stateful vs Stateless Authentication](#stateful-vs-stateless-authentication)
4. [Project Architecture](#project-architecture)
5. [Code Walkthrough](#code-walkthrough)
6. [Real-World Usage (Real Life Use Cases)](#real-world-usage)
7. [Security Best Practices](#security-best-practices)
8. [Running the Project (Project Chalana)](#running-the-project)

---

## Introduction

Authentication matlab **verify karna ki user kaun hai**. Ye answer deta hai: "Kya aap sach mein wahi ho jo aap hone ka daava karte ho?"

Ye project implement karta hai **session-based authentication** (jise stateful authentication bhi kehte hain), jisme server har authenticated user ka session state maintain karta hai.

### Core Concepts

| Concept | Description |
|---------|-------------|
| **Identity** | User kaun hai (username, email, user ID) |
| **Credential** | Identity ka proof (password, token, biometric) |
| **Session** | Server-side authenticated state ka record |
| **Cookie** | Client-side session identifier ka storage |

### Tech Stack

- **Runtime**: Node.js (ES Modules)
- **Framework**: Express.js 5.x
- **Database**: MongoDB with Mongoose
- **Password Hashing**: bcrypt (cost factor 10)
- **Session Management**: express-session
- **Environment Config**: dotenv

---

## Authentication vs Authorization

Ye do concepts aksar confuse ho jaate hain lekin inke kaam bilkul alag hain:

### Authentication (AuthN) - "Aap kaun ho?"

```javascript
// User credentials deta hai
POST /api/user/login
{
  "username": "john_doe",
  "password": "securePassword123"
}

// Server verify karta hai aur session banata hai
req.session.userId = user._id;  // Server user ko yaad rakhta hai
```

**Key characteristics:**
- Identity verify karta hai
- Sabse pehle hota hai (authorization se pehle)
- Credentials use karta hai: passwords, tokens, biometrics, MFA
- Result: Authenticated session/user context

### Authorization (AuthZ) - "Aap kya kar sakte ho?"

```javascript
// Authentication ke baad permissions check karne wala middleware
export const requireAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
    }
    next();
};

// Protected route
router.delete('/users/:id', validateSession, requireAdmin, deleteUser);
```

**Key characteristics:**
- Permissions/access rights decide karta hai
- Authentication ke baad hota hai
- Roles, permissions, policies, ACLs use karta hai
- Result: Allow/deny access to resources

### Visual Comparison

```
┌─────────────────────────────────────────────────────────────┐
│                    REQUEST FLOW                              │
├─────────────────────────────────────────────────────────────┤
│  1. Client credentials bhejta hai                            │
│  2. ──► AUTHENTICATION (AuthN) ──► "Valid user?"            │
│  3. ──► Session create / Token issue hota hai               │
│  4. ──► AUTHORIZATION (AuthZ) ──► "Allowed to do X?"        │
│  5. ──► Access granted ya 403 Forbidden                     │
└─────────────────────────────────────────────────────────────┘
```

**Yaad rakhne ka asaan tarika:**
- **AuthN** = Login (kaun ho tum?)
- **AuthZ** = Permission (kya kar sakte ho?)

---

## Stateful vs Stateless Authentication

Ye auth systems mein **sabse important architectural decision** hai.

### Stateful (Session-Based) - Ye Project Kya Use Karta Hai

```
┌─────────────┐     Login      ┌─────────────┐     Request      ┌─────────────┐
│   Client    │ ─────────────► │   Server    │ ──────────────►  │   Server    │
│             │                │  (Creates    │  (Sends Cookie)  │  (Reads     │
│  Browser    │                │   Session)  │                  │   Session)  │
└─────────────┘                └─────────────┘                  └─────────────┘
       ▲                                                          │
       │                     ┌────────────────────────────────────┘
       │                     │
       │         Session ID in Cookie (connect.sid)
       │
       ▼
┌─────────────┐
│   Cookie    │  ◄── HttpOnly, Secure, SameSite
│  Storage    │
└─────────────┘
```

**Is project mein kaise kaam karta hai:**

```javascript
// index.js - Session configuration
app.use(session({
    secret: process.env.SESSION_SECRET,    // Session ID cookie sign karta hai
    resave: false,                          // Unmodified sessions save nahi hoti
    saveUninitialized: true,                // Naye sessions save hoti hain
    cookie: { 
        maxAge: 600000,                     // 10 minutes
        httpOnly: true,                     // XSS se bachao
        secure: process.env.NODE_ENV === 'production', // Production mein sirf HTTPS
        sameSite: 'lax'                     // CSRF protection
    }
}));

// controllers/user.controller.js - Login session banata hai
export const login = async (req, res) => {
    const user = await LoginUser(username, password);
    
    // Server userId ko session store mein rakhta hai (memory/Redis/DB)
    req.session.userId = user._id;  
    
    // Response cookie set karta hai: connect.sid=<session-id>
    res.status(200).json({ success: true, message: "Login Successfully." });
};

// middlewares/session.middleware.js - Session validate karta hai
export const validateSession = (req, res, next) => {
    if (req.session && req.session.userId) {
        return next();  // Session valid hai, user authenticated hai
    }
    return res.status(401).json({ message: "Unauthorized. Please log in." });
};
```

**Session Store Options:**

| Store | Use Case | Pros | Cons |
|-------|----------|------|------|
| **Memory (default)** | Dev/single instance | Zero config | Production-ready nahi, restart par lost |
| **Redis** | Production, scaled apps | Fast, distributed, TTL support | Extra infrastructure |
| **MongoDB** | Already using Mongo | Unified stack | Redis se slower |
| **Database (SQL)** | Traditional apps | ACID, familiar | Latency |

### Stateless (Token-Based - JWT)

```
┌─────────────┐     Login      ┌─────────────┐     Request      ┌─────────────┐
│   Client    │ ─────────────► │   Server    │ ──────────────►  │   Server    │
│             │                │ (Issues JWT)│  (Sends Token)   │ (Verifies    │
│  Browser    │                │             │                  │  Signature) │
└─────────────┘                └─────────────┘                  └─────────────┘
       ▲                                                          │
       │                     ┌────────────────────────────────────┘
       │                     │
       │         JWT in Header: Authorization: Bearer <token>
       │
       ▼
┌─────────────┐
│  Local/     │
│  Cookie     │
│  Storage    │
└─────────────┘
```

**JWT Implementation Example:**

```javascript
import jwt from 'jsonwebtoken';

// Login - Token issue karta hai (server session nahi banata)
export const login = async (req, res) => {
    const user = await LoginUser(username, password);
    
    const token = jwt.sign(
        { userId: user._id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );
    
    // Token client ko bhejta hai (body mein ya HttpOnly cookie mein)
    res.json({ success: true, token });
};

// Middleware - Token verify karta hai (stateless, session ke liye DB lookup nahi)
export const validateToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ message: "No token provided" });
    }
    
    const token = authHeader.split(' ')[1];
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;  // User info request mein attach karta hai
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};
```

### Detailed Comparison

| Aspect | Stateful (Sessions) | Stateless (JWT) |
|--------|---------------------|-----------------|
| **Server Storage** | Required (session store) | None (self-contained) |
| **Scalability** | Shared store (Redis) chahiye | Naturally horizontal |
| **Token Size** | Chhota (sirf session ID) | Bada (claims contain karta hai) |
| **Revocation** | Immediate (session delete) | Difficult (blocklist/short expiry) |
| **Security** | Secure cookies, CSRF risk | XSS risk agar localStorage mein |
| **Offline/Expiry** | Server control karta hai | Sirf token expiry |
| **Mobile/Native** | Cookie handling complex | Native header support |
| **Debugging** | Opaque session ID | Readable payload (base64) |

### When to Use Which? (Kab Kya Use Karein?)

**Stateful (Sessions) tab use karein:**
- Traditional web apps with server-rendered pages
- Immediate revocation chahiye (logout everywhere)
- Strict security requirements (banking, healthcare)
- Simple deployment (single server ya sticky sessions)
- Team session patterns se familiar hai

**Stateless (JWT) tab use karein:**
- Microservices / distributed systems
- Mobile apps / SPAs with separate backend
- High scale, multiple regions
- Cross-domain / third-party API access
- Session store infrastructure avoid karna hai

**Hybrid Approach (Practice mein common):**
- Short-lived JWT (15-30 min) access ke liye
- Long-lived refresh token (DB mein stored, revocable) session persistence ke liye
- Dono ka best of both worlds

---

## Project Architecture

```
Authentication/Stateless/
├── index.js                 # App entry point, Express setup, session config
├── package.json             # Dependencies and scripts
├── .env                     # Environment variables (commit nahi hota)
├── configs/
│   └── db.js               # MongoDB connection
├── models/
│   ├── user.model.js       # User schema (username, hashed password)
│   └── tasks.model.js      # Example protected resource
├── controllers/
│   ├── user.controller.js  # Auth endpoints (signup, login, logout)
│   └── task.controller.js  # Protected resource endpoints
├── routes/
│   ├── user.routes.js      # Public auth routes
│   └── task.routes.js      # Protected routes
├── middlewares/
│   └── session.middleware.js # Session validation middleware
└── services/
    ├── user.service.js     # Business logic: register, login, logout
    └── task.service.js     # Task CRUD operations
```

### Request Flow

```
┌──────────────┐
│   Client     │
│  (Browser)   │
└──────┬───────┘
       │ POST /api/user/login {username, password}
       ▼
┌──────────────┐
│  Express     │
│  Router      │
└──────┬───────┘
       │
       ▼
┌─────────────────────────────────────┐
│  user.controller.js → login()       │
│  1. user.service.LoginUser() call  │
│  2. bcrypt.compare(password, hash)  │
│  3. req.session.userId = user._id   │  ◄── Session created
│  4. Set-Cookie: connect.sid=...     │
└─────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│  Client cookie receive karta hai    │
│  Baad wale requests auto-send       │
└─────────────────────────────────────┘
       │
       │ GET /api/task (cookie ke saath)
       ▼
┌─────────────────────────────────────┐
│  session.middleware.js              │
│  validateSession()                  │
│  1. req.session.userId check        │
│  2. Hai toh → next()                │
│  3. Nahi → 401 Unauthorized         │
└─────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│  task.controller.js → getTasks()    │
│  req.session.userId access karo      │
│  Is user ke tasks query karo         │
└─────────────────────────────────────┘
```

---

## Code Walkthrough (Code Ki Samajh)

### 1. Database Connection (`configs/db.js`)

```javascript
import mongoose from "mongoose";

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("DB connected");
    } catch (error) {
        console.log("Database connection failed", error.message);
        throw error;
    }
};

export default connectDB;
```

### 2. User Model (`models/user.model.js`)

```javascript
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    }
}, { timestamps: true });

const User = mongoose.model("User", userSchema);
export default User;
```

**Key Points:**
- Password **hash** ke roop mein stored hota hai, kabhi plain text nahi
- `timestamps: true` se `createdAt` aur `updatedAt` auto-add hote hain
- Username par unique index duplicates rokta hai

### 3. User Service (`services/user.service.js`)

```javascript
import bcrypt from 'bcrypt';
import User from '../models/user.model.js';

export const registerUser = async (username, password) => {
    // Cost factor 10 = ~100ms per hash (achha balance)
    const hashPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashPassword });
    return await user.save();
};

export const LoginUser = async (username, password) => {
    const user = await User.findOne({ username });
    
    // Timing-safe comparison username enumeration rokta hai
    if (!user || !(await bcrypt.compare(password, user.password))) {
        throw new Error("Invalid Username Or Password");
    }
    return user;
};

export const logoutUser = async (userId) => {
    // Optional: Online status track karne ke liye
    await User.findByIdAndUpdate(userId, { isOnline: false });
    return { success: true };
};
```

**Security Notes:**
- `bcrypt.hash(password, 10)` - Salt rounds = 10 (hardware ke hisaab se adjust karein)
- `bcrypt.compare()` - Constant-time comparison
- "User not found" aur "wrong password" ke liye same error message (enumeration rokta hai)

### 4. Session Middleware (`middlewares/session.middleware.js`)

```javascript
export const validateSession = (req, res, next) => {
    // Session object aur userId property dono check karo
    if (req.session && req.session.userId) {
        return next();  // Authenticated hai - controller par aage badho
    }

    // Fail fast - request ko hang mat karo
    return res.status(401).json({
        success: false,
        message: "Unauthorized access. Please log in first."
    });
};
```

### 5. User Controller (`controllers/user.controller.js`)

```javascript
import { LoginUser, logoutUser, registerUser } from "../services/user.service.js";

export const signup = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await registerUser(username, password);
        
        res.status(201).json({
            success: true,
            message: "User registered successfully!",
            data: { id: user._id, username: user.username }  // Password hash kabhi return mat karo
        });
    } catch (error) {
        // Duplicate key error handle karo (code 11000)
        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: "Username already exists"
            });
        }
        res.status(500).json({ success: false, message: "Error in signup!", error: error.message });
    }
};

export const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await LoginUser(username, password);

        // Session banate hain - server userId store karta hai, client cookie deta hai
        req.session.userId = user._id;
        
        res.status(200).json({
            success: true,
            message: "Login Successful."
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error in login!", error: error.message });
    }
};

export const logout = async (req, res) => {
    try {
        // Active session check karo
        if (!req.session || !req.session.userId) {
            return res.status(400).json({
                success: false,
                message: "No active session found. You are already logged out."
            });
        }

        const userId = req.session.userId;
        await logoutUser(userId);

        // Server-side session destroy karo
        req.session.destroy((err) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: "Failed to clear session during logout.",
                    error: err.message
                });
            }

            // Client-side cookie clear karo
            res.clearCookie('connect.sid'); 

            return res.status(200).json({
                success: true,
                message: "Logged out successfully."
            });
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error during logout process.",
            error: error.message
        });
    }
};
```

### 6. Routes (`routes/user.routes.js`)

```javascript
import express from "express";
import { signup, login, logout } from "../controllers/user.controller.js";

const router = express.Router();

// Public routes - authentication ki zaroorat nahi
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);  // Session chahiye (controller mein validated)

export default router;
```

### 7. Protected Routes Example (`routes/task.routes.js`)

```javascript
import express from "express";
import { validateSession } from "../middlewares/session.middleware.js";
import { createTask, getTasks, updateTask, deleteTask } from "../controllers/task.controller.js";

const router = express.Router();

// Saare task routes valid session maangte hain
router.use(validateSession);

router.post("/", createTask);
router.get("/", getTasks);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);

export default router;
```

---

## Real-World Usage (Real Life Use Cases)

### 1. Traditional Web Applications (Server-Rendered)

```
Use Case: E-commerce, CMS, Admin Panels, Banking Portals
Auth Type: Stateful Sessions + Secure Cookies
```

```javascript
// Production session config
app.use(session({
    secret: process.env.SESSION_SECRET,  // 32+ char random string
    resave: false,
    saveUninitialized: false,            // Empty sessions mat banao
    store: new RedisStore({ client: redisClient }),  // Shared store
    cookie: {
        httpOnly: true,                  // JS access nahi (XSS protection)
        secure: true,                    // HTTPS only
        sameSite: 'strict',              // CSRF protection
        maxAge: 1000 * 60 * 30,          // 30 minutes
        domain: '.yourdomain.com'        // Subdomain sharing
    },
    name: 'app.sid'                      // Custom cookie name (obscurity)
}));
```

### 2. Single Page Applications (React, Vue, Svelte)

```
Use Case: Dashboards, Social Media, Productivity Apps
Auth Type: JWT in HttpOnly Cookie (Best) ya Memory + Refresh Token
```

```javascript
// Option A: JWT in HttpOnly Cookie (Recommended)
res.cookie('access_token', accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    maxAge: 15 * 60 * 1000  // 15 min
});

res.cookie('refresh_token', refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000  // 7 days
});

// Option B: Short-lived JWT + Refresh Token Rotation
// Access token memory mein, refresh token HttpOnly cookie mein
// Refresh par: refresh token rotate karo, old wala invalidate karo
```

### 3. Mobile Applications (React Native, Flutter, Swift, Kotlin)

```
Use Case: iOS/Android Apps
Auth Type: JWT (Access + Refresh Tokens)
```

```javascript
// Mobile cookies ko handle karke nahi kar pata - Authorization header use karo
// Login response:
{
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "dGhpcyBpcyBhIHJlZnJl...",
    "expiresIn": 900,      // 15 minutes
    "tokenType": "Bearer",
    "user": { "id": "123", "username": "john" }
}

// Client Secure Storage mein store karta hai (Keychain/Keystore)
// Requests mein include: Authorization: Bearer <accessToken>
```

### 4. Microservices / API Gateway

```
Use Case: Distributed Systems, Multiple Services
Auth Type: JWT (Stateless) + API Gateway Validation
```

```javascript
// API Gateway JWT validate karta hai, user info headers ke through forward karta hai
// Services gateway par trust karti hain (mTLS ya internal network)

app.use((req, res, next) => {
    // Gateway ye headers validation ke baad add karta hai
    req.user = {
        id: req.headers['x-user-id'],
        roles: req.headers['x-user-roles']?.split(','),
        permissions: req.headers['x-user-permissions']?.split(',')
    };
    next();
});
```

### 5. Third-Party API Access (OAuth 2.0 / OIDC)

```
Use Case: "Login with Google/GitHub", API Integrations
Auth Type: OAuth 2.0 Authorization Code Flow + PKCE
```

```javascript
// OAuth 2.0 Flow (simplified)
app.get('/auth/google', (req, res) => {
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
        `client_id=${GOOGLE_CLIENT_ID}&` +
        `redirect_uri=${REDIRECT_URI}&` +
        `response_type=code&` +
        `scope=openid email profile&` +
        `state=${generateState()}&` +        // CSRF protection
        `code_challenge=${pkceChallenge}&`   // PKCE for public clients
        `code_challenge_method=S256`;
    res.redirect(authUrl);
});

app.get('/auth/google/callback', async (req, res) => {
    const { code, state } = req.query;
    verifyState(state);  // CSRF state validate karo
    
    const tokens = await exchangeCodeForTokens(code);
    const userInfo = await fetchUserInfo(tokens.access_token);
    
    // Local session banao ya JWT issue karo
    req.session.userId = userInfo.sub;  // Ya DB mein user banao
    res.redirect('/dashboard');
});
```

---

## Security Best Practices

### 1. Password Security

```javascript
// ✅ KARO: bcrypt with appropriate cost
const hash = await bcrypt.hash(password, 12);  // 2024+ ke liye 12 rounds

// ✅ KARO: Constant-time comparison use karo
const valid = await bcrypt.compare(password, hash);

// ❌ NAHI: Plain text, MD5/SHA1, custom crypto store mat karo
// ❌ NAHI: Passwords ya hashes log mat karo
```

### 2. Session Security

```javascript
app.use(session({
    secret: process.env.SESSION_SECRET,  // Periodically rotate karo
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,           // XSS theft se bachao
        secure: true,             // HTTPS only
        sameSite: 'strict',       // CSRF protection
        maxAge: 30 * 60 * 1000,   // 30 min idle timeout
        domain: '.example.com'    // Domain restrict karo
    },
    genid: () => crypto.randomBytes(32).toString('hex'),  // Custom ID generator
    rolling: true  // Activity par expiry reset karo
}));
```

### 3. CSRF Protection

```javascript
// Stateful sessions with forms ke liye
import csrf from 'csurf';

app.use(csrf({ cookie: true }));

// Forms mein include karo
// <input type="hidden" name="_csrf" value="{{csrfToken}}">

// Ya APIs ke liye double-submit cookie pattern
```

### 4. Rate Limiting

```javascript
import rateLimit from 'express-rate-limit';

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,  // 15 minutes
    max: 5,                    // Har window mein 5 attempts
    message: { error: "Too many login attempts, try again later" },
    standardHeaders: true,
    legacyHeaders: false
});

app.post('/api/user/login', authLimiter, login);
app.post('/api/user/signup', authLimiter, signup);
```

### 5. Security Headers

```javascript
import helmet from 'helmet';

app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", "data:", "https:"],
            connectSrc: ["'self'"],
            frameAncestors: ["'none'"]
        }
    },
    hsts: { maxAge: 31536000, includeSubDomains: true, preload: true }
}));
```

### 6. Input Validation

```javascript
import { body, validationResult } from 'express-validator';

const validateSignup = [
    body('username')
        .isLength({ min: 3, max: 30 })
        .matches(/^[a-zA-Z0-9_]+$/)
        .withMessage('Username must be alphanumeric, 3-30 chars'),
    body('password')
        .isLength({ min: 12 })
        .matches(/[A-Z]/).withMessage('Must contain uppercase')
        .matches(/[a-z]/).withMessage('Must contain lowercase')
        .matches(/[0-9]/).withMessage('Must contain number')
        .matches(/[^A-Za-z0-9]/).withMessage('Must contain special char'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

router.post('/signup', validateSignup, signup);
```

---

## Running the Project (Project Chalana)

### Prerequisites

- Node.js 18+
- MongoDB (local ya Atlas)
- npm/yarn

### Setup

```bash
# Clone aur navigate karo
cd Authentication/Stateless

# Dependencies install karo
npm install

# .env file banao
cp .env.example .env  # Ya manually banao
```

### Environment Variables (`.env`)

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/auth-learning
SESSION_SECRET=your-super-secret-random-string-at-least-32-chars
```

Secure secret generate karo:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Development Server Start Karo

```bash
npm run dev
# Server http://localhost:5000 par chalega
```

### API Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/user/signup` | Register new user | No |
| POST | `/api/user/login` | Login, session banao | No |
| POST | `/api/user/logout` | Session destroy karo | Yes (session) |
| POST | `/api/task` | Create task | Yes (session) |
| GET | `/api/task` | List user tasks | Yes (session) |
| PUT | `/api/task/:id` | Update task | Yes (session) |
| DELETE | `/api/task/:id` | Delete task | Yes (session) |

### Testing with curl

```bash
# Signup
curl -X POST http://localhost:5000/api/user/signup \
  -H "Content-Type: application/json" \
  -d '{"username": "john", "password": "SecurePass123!"}' \
  -c cookies.txt

# Login (session cookie save karta hai)
curl -X POST http://localhost:5000/api/user/login \
  -H "Content-Type: application/json" \
  -d '{"username": "john", "password": "SecurePass123!"}' \
  -c cookies.txt

# Protected route access karo (saved cookie use hota hai)
curl -X GET http://localhost:5000/api/task \
  -b cookies.txt

# Logout
curl -X POST http://localhost:5000/api/user/logout \
  -b cookies.txt -c cookies.txt
```

---

## Learning Path Extensions (Sikhte Raho)

### Beginner → Intermediate

1. **JWT Implementation add karo** - Tokens ke saath parallel auth system banao
2. **Refresh Tokens implement karo** - Rotation, revocation, storage
3. **Email Verification add karo** - Token-based, expiry, resend logic
4. **Password Reset Flow** - Secure tokens, rate limiting, expiry
5. **Two-Factor Auth (2FA)** - TOTP (Google Authenticator), backup codes

### Intermediate → Advanced

1. **OAuth 2.0 / OIDC Provider** - Authorization server implementation
2. **Session Clustering** - Redis adapter, sticky sessions vs shared store
3. **Distributed Tracing** - Auth boundaries ke paar correlation IDs
4. **Audit Logging** - Immutable auth event log (login, logout, failures)
5. **Adaptive Authentication** - Risk-based (device, location, behavior)

### Production Hardening

1. **Secrets Management** - HashiCorp Vault, AWS Secrets Manager, Doppler
2. **Key Rotation** - Automated JWT secret / session secret rotation
3. **Security Monitoring** - Failed login alerts, anomaly detection
4. **Compliance** - GDPR (right to erasure), SOC2, HIPAA considerations
5. **Load Testing** - Auth bottleneck identification (bcrypt is CPU-intensive)

---

## Resources & References

### Specifications & Standards
- [RFC 7519 - JWT](https://tools.ietf.org/html/rfc7519)
- [RFC 6749 - OAuth 2.0](https://tools.ietf.org/html/rfc6749)
- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
- [OWASP Session Management](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html)

### Security Guides
- [NIST SP 800-63B - Digital Identity Guidelines](https://pages.nist.gov/800-63-3/sp800-63b.html)
- [Mozilla Web Security Guidelines](https://infosec.mozilla.org/guidelines/web_security)
- [bcrypt Documentation](https://www.npmjs.com/package/bcrypt)

### Tools
- [jwt.io](https://jwt.io) - JWT debugger
- [bcrypt-generator](https://bcrypt-generator.com) - Hash generator
- [OWASP ZAP](https://www.zaproxy.org/) - Security scanner

---

## License

ISC License - Learning aur reference ke liye freely use karo.

---

*Ye repository educational purposes ke liye designed hai. Production systems mein security audits karo aur organizational compliance requirements follow karo.*