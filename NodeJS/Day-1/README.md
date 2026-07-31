# Day 1 — Node.js Basics, Modules & File System

---

## Intro

Day 1 mein humne Node.js ki **foundation** seekhi — kaise ek file dusri file se code import karti hai (`require` / `module.exports`), aur kaise **File System (`fs`)** aur **Operating System (`os`)** modules se system ke saath interact karte hain.

Yeh sabse pehla step hai backend development ka — bina iske aage kuch bhi nahi chalega!

---

## Explanation

### 1. Custom Module Banana (`math.js` + `hello.js`)

Node.js mein har file ek **module** hoti hai. Tum apna code export karke dusri files mein use kar sakte ho.

**math.js** — functions export karna:
```javascript
function add(a, b) {
    return a + b;
}

function sub(a, b) {
    return a - b;
}

module.exports = { add, sub };
```

**hello.js** — dusri file se import karna:
```javascript
const math = require("./math");

console.log(math.add(4, 4));   // 8
console.log(math.sub(4, 5));   // -1
```

> `require("./math")` — same folder ki file  
> `require("fs")` — built-in Node module

---

### 2. File System Module (`fs`) — `file.js`

`fs` module se tum files **read, write, update, delete** kar sakte ho.

#### Sync vs Async — Sabse Important Concept!

| Type | Method | Behavior |
|------|--------|----------|
| **Sync** | `readFileSync`, `writeFileSync` | **Blocking** — code ruk jata hai jab tak kaam complete na ho |
| **Async** | `readFile`, `writeFile` | **Non-blocking** — callback ke baad aage badhta hai |

**Read File:**
```javascript
// Sync — blocking
const res = fs.readFileSync("./sync.txt", "utf-8");
console.log(res);

// Async — non-blocking
fs.readFile("./async.txt", "utf-8", (error, response) => {
    if (error) console.log(error);
    else console.log(response);
});
```

**Write File:**
```javascript
fs.writeFileSync("./sync.txt", "Hello from sync writing");

fs.writeFile("./async.txt", "Hello from async writing", (err) => {
    console.log(err);
});
```

**Append (Update):**
```javascript
fs.appendFileSync("./sync.txt", new Date().toDateString());
```

**Delete:**
```javascript
fs.unlink("./sync.txt", (err) => {
    if (err) console.log(err);
    else console.log("File Delete");
});
```

---

### 3. OS Module (`os`) — System Info

```javascript
const os = require("os");

console.log(os.cpus().length);  // Kitne CPU cores hain
```

`os` se tum machine ki info nikal sakte ho — CPU cores, free memory, platform, etc.

---

## Real-Life Usage

| Concept | Real Project Mein Kahan Use Hota Hai |
|---------|--------------------------------------|
| `module.exports` / `require` | Apna utility folder banana — `utils/`, `helpers/`, `services/` |
| `fs.readFile` (async) | User ki uploaded file read karna, config files load karna |
| `fs.writeFile` | Logs likhna, JSON data save karna |
| `fs.appendFile` | Request logs maintain karna (har API hit ka record) |
| `fs.unlink` | Purani temp files delete karna |
| `os.cpus().length` | Worker threads decide karna — kitne parallel tasks chalane hain |

**Example:** E-commerce app mein jab user invoice download karta hai, backend `fs.readFile` se PDF read karke response bhejta hai.

---

## Files Is Folder Mein

| File | Kaam |
|------|------|
| `math.js` | Custom module — add/sub functions export |
| `hello.js` | math module import karke use karna |
| `file.js` | fs aur os module ke examples |
| `package.json` | Project config — `npm start` se `hello.js` chalega |

---

## Run Kaise Karein

```bash
npm start          # hello.js chalega
node file.js       # fs/os examples
```

---

## Summary

- Node.js mein **har file ek module** hai — `module.exports` se export, `require()` se import
- **`fs` module** files handle karta hai — read, write, append, delete
- **Sync = blocking**, **Async = non-blocking** — production mein hamesha async prefer karo
- **`os` module** system ki info deta hai — CPU, memory, platform
- Day 1 ka goal: samajhna ki Node.js file system ke saath kaise kaam karta hai aur code kaise organize hota hai modules mein

**Agla step (Day 2):** HTTP server banana aur Event Loop samajhna! 🔥
