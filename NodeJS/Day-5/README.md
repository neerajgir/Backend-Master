# Day 5 — Crypto Module & OS Module

---

## Intro

Day 5 mein do important built-in modules cover kiye:
1. **`crypto`** — security: random values, password hashing, encryption
2. **`os`** — server/machine ki info: CPU, memory, platform, network

Backend developer ke liye **crypto** must-know hai (passwords, tokens), aur **os** useful hai jab tum server health ya deployment environment check karna chahte ho.

---

## Explanation

### 1. Crypto Module (`index.js`)

Node.js ka built-in `crypto` module bcrypt ki tarah heavy dependencies ke bina basic security deta hai.

#### Random Bytes — Tokens & Session IDs
```javascript
const crypto = require("crypto");

const randomValues = crypto.randomBytes(100);
console.log(randomValues.toString("hex"));
// Output: 200 character hex string — unpredictable, secure
```

**Use:** JWT secret, session ID, OTP, API keys generate karna.

#### Hashing — Passwords & Data Integrity
```javascript
const hashValue = crypto
    .createHash("sha256")
    .update("Neeraj")
    .digest("hex");

const inputValue = "Neeraj";
const matchValue = crypto
    .createHash("sha256")
    .update(inputValue)
    .digest("hex");

console.log(hashValue === matchValue);  // true — same input = same hash
```

**Hash properties:**
- Same input → hamesha same output
- Thoda sa change → completely different hash
- Reverse nahi kar sakte (one-way)

> **Note:** Production passwords ke liye `sha256` alone kaafi nahi — **`bcrypt`** ya **`crypto.pbkdf2`** (Day 2 mein dekha) with salt use karo. SHA256 fast hai, isliye attackers ke liye bhi fast — passwords ke liye slow algorithms better hain.

---

### 2. OS Module (`module.js`)

Server ki **health aur environment** samajhne ke liye:

```javascript
const os = require("os");

console.log("OS Platform:", os.platform());      // win32, linux, darwin
console.log("User Info:", os.userInfo());        // username, homedir, shell
console.log("CPU Cores:", os.cpus().length);     // Parallel processing decide karne ke liye
console.log("Free Memory:", os.freemem(), "bytes");
console.log("Total Memory:", os.totalmem(), "bytes");
console.log("Home Dir:", os.homedir());
console.log("Architecture:", os.arch());         // x64, arm64
console.log("Hostname:", os.hostname());
console.log("Network Interfaces:", os.networkInterfaces());
console.log("Release:", os.release());           // OS version
console.log("Temp Dir:", os.tmpdir());           // Temp files ke liye
console.log("OS Uptime:", os.uptime(), "seconds");
```

**Useful conversions:**
```javascript
const freeGB = (os.freemem() / 1024 / 1024 / 1024).toFixed(2);
console.log(`Free RAM: ${freeGB} GB`);
```

---

## Real-Life Usage

### Crypto

| Feature | Real Use |
|---------|----------|
| `randomBytes` | Session tokens, CSRF tokens, file upload unique names |
| `createHash('sha256')` | File integrity check — download corrupt to nahi hua? |
| `createHash('md5')` | Legacy systems (avoid for security) |
| `pbkdf2` / bcrypt | User password store karna — **kabhi plain text mat rakho** |
| `createCipheriv` / `createDecipheriv` | Sensitive data encrypt (API keys in DB) |

**Password flow (real app):**
```
User enters "mypassword123"
    → bcrypt.hash(password, 10) → store in DB
Login pe:
    → bcrypt.compare(entered, storedHash) → true/false
```

**File upload integrity:**
```javascript
const fileHash = crypto.createHash("sha256").update(fileBuffer).digest("hex");
// Client hash bheje, server compare kare — tampering detect
```

### OS Module

| Info | Real Use |
|------|----------|
| `cpus().length` | Worker threads / cluster mode — `cluster.fork()` kitni baar |
| `freemem()` / `totalmem()` | Health check endpoint — "server memory 90% full" alert |
| `platform()` | Windows vs Linux specific paths/commands |
| `tmpdir()` | Temporary upload processing |
| `uptime()` | Server kitne time se chal raha hai — monitoring dashboards |
| `networkInterfaces()` | Server ka IP nikalna — Docker/K8s mein useful |

**Health check API example:**
```javascript
app.get("/health", (req, res) => {
    res.json({
        uptime: os.uptime(),
        freeMemory: os.freemem(),
        load: os.loadavg()
    });
});
```

---

## Files Is Folder Mein

| File | Kaam |
|------|------|
| `index.js` | crypto — randomBytes, createHash |
| `module.js` | os — system info saari properties |
| `package.json` | `npm start` → index.js |

---

## Run Kaise Karein

```bash
npm start          # Crypto examples
node module.js     # OS module info
```

---

## Summary

- **`crypto.randomBytes`** — secure random values; tokens aur secrets ke liye
- **`crypto.createHash`** — one-way hashing; integrity check aur (limited) password use
- Passwords ke liye **slow hash + salt** (`bcrypt`, `pbkdf2`) — plain SHA256 avoid karo passwords pe
- **`os` module** server machine ki snapshot deta hai — monitoring aur scaling decisions
- **`os.cpus().length`** se decide karo kitne parallel workers chalane hain
- **`os.freemem()`** health checks aur alerts ke liye
- Day 5 complete — tumhare paas ab Node.js core modules ka solid base hai!

---

## Poori Series Ka Quick Recap

| Day | Topic |
|-----|-------|
| Day 1 | Modules, fs, sync/async |
| Day 2 | HTTP server, Event Loop |
| Day 3 | path, EventEmitter |
| Day 4 | Streams, pipe, Transform |
| Day 5 | crypto, os |

**Agle topics suggest:** Express.js, MongoDB/Mongoose, JWT Auth, REST API design, Docker deploy! 🚀
