# Day 2 — HTTP Server, Globals & Event Loop

---

## Intro

Day 2 mein humne seekha ki Node.js se **web server** kaise banate hain (`http` module), **global objects** kya hain (`setTimeout`, `setInterval`), aur sabse important — **Event Loop** kaise kaam karta hai (sync vs async code ka execution order).

Yeh day samajhne ke baad tumhe pata chalega ki Node.js "single-threaded" hote hue bhi kaise fast hai!

---

## Explanation

### 1. HTTP Server Banana (`index.js`)

```javascript
const http = require("http");
const fs = require("fs");

const myServer = http.createServer((req, res) => {
    const log = `${Date.now()}: From ${req.url} New Request Received\n`;

    fs.appendFile("log.txt", log, (err) => {
        if (err) {
            console.log(err);
            res.statusCode = 500;
            res.end("Internal Server Error");
            return;
        }
        res.end("Hello From Server");
    });
});

myServer.listen(3000, () => {
    console.log("Server is running on port 3000");
});
```

**Kya ho raha hai:**
1. `http.createServer()` ek server banata hai
2. Har request pe callback chalta hai — `req` (request), `res` (response)
3. Har request ka log `log.txt` mein append hota hai
4. User ko `"Hello From Server"` response milta hai
5. Server port `3000` pe sun raha hai

Browser mein jao: `http://localhost:3000`

---

### 2. Global Objects & Module Scope (`main.js`)

```javascript
// Global object
console.log(global);

// setTimeout — ek baar chalega delay ke baad
setTimeout(() => {
    console.log("Hello From Global");
}, 2000);

// setInterval — baar baar chalega
let count = 0;
const interval = setInterval(() => {
    console.log(`Interval Count: ${++count}`);
    if (count === 4) clearInterval(interval);
}, 1000);
```

**CommonJS mein har file ko ye milta hai (global nahi, module-scoped):**
- `__dirname` — current folder ka path
- `__filename` — current file ka full path
- `exports`, `module`, `require()`

> Ye sab **CommonJS** ka part hai, ES Modules (`import/export`) mein alag syntax hoti hai.

---

### 3. Event Loop — Execution Order (`node.js`)

Yeh Node.js ka **dil** hai. Dekho code ka order:

```javascript
const crypto = require("crypto");

let start = Date.now();

crypto.pbkdf2("password", "salt", 100000, 1024, "sha512", () => {
    console.log(`${Date.now() - start}ms Done`);
});

setImmediate(() => { console.log("Hello from immediate"); });

console.log("Hello world - 1");

setTimeout(() => {
    console.log("Hello from setTimeout - 1");
}, 0);
```

**Output order:**
```
Hello world - 1          ← Sync code pehle (Call Stack)
Hello from setTimeout - 1 ← Timers phase
Hello from immediate      ← Check phase
~XXXms Done               ← Thread Pool (crypto heavy task)
```

**Event Loop Phases (simple):**
1. **Sync code** — pehle sab synchronous code
2. **Timers** — `setTimeout`, `setInterval`
3. **I/O callbacks** — file/network callbacks
4. **Check** — `setImmediate`
5. **Close callbacks** — `socket.on('close')`

**Thread Pool:** Heavy tasks jaise `crypto`, `fs` (kuch cases), `dns.lookup` — ye main thread block nahi karte, alag workers mein chalte hain.

---

## Real-Life Usage

| Concept | Real Project Mein |
|---------|-------------------|
| `http.createServer` | Simple APIs, webhooks, health-check endpoints |
| Request logging (`appendFile`) | Har API hit track karna — debugging aur analytics ke liye |
| `setTimeout` / `setInterval` | Retry logic, polling, scheduled cleanup jobs |
| Event Loop samajhna | Performance bugs fix karna — "kyun pehle ye chala, baad mein wo?" |
| `crypto.pbkdf2` | Password hashing — login systems mein |

**Example:** Payment gateway webhook — jab payment success hoti hai, gateway tumhare `http.createServer` wale endpoint pe POST request bhejta hai. Tum log file mein save karte ho aur order update karte ho.

**Example 2:** Rate limiter — `setInterval` se har minute request count reset karna.

---

## Files Is Folder Mein

| File | Kaam |
|------|------|
| `index.js` | HTTP server + request logging |
| `main.js` | Globals, setTimeout, setInterval |
| `node.js` | Event Loop execution order demo |
| `log.txt` | Server ke request logs (auto-generated) |

---

## Run Kaise Karein

```bash
npm start          # HTTP server — port 3000
node main.js       # Globals & intervals
node node.js       # Event loop order
```

Server chalane ke baad browser ya Postman se `http://localhost:3000` hit karo — `log.txt` update hogi.

---

## Summary

- **`http` module** se basic web server bana sakte ho — bina Express ke bhi!
- Har request ko **log karna** production apps mein standard practice hai
- **Sync code hamesha pehle** chalta hai, phir Event Loop phases
- **`setTimeout(fn, 0)`** bhi immediately nahi chalta — Timers queue mein jata hai
- **Thread Pool** heavy async tasks handle karta hai — isliye Node "non-blocking" feel hota hai
- `__dirname`, `require` — CommonJS module system ki building blocks

**Agla step (Day 3):** Path module aur Event-driven programming (EventEmitter)! 🎯
