# Day 3 — Path Module & EventEmitter

---

## Intro

Day 3 mein do powerful built-in modules cover kiye:
1. **`path`** — file/folder paths handle karna (Windows vs Linux compatible)
2. **`events` (EventEmitter)** — event-driven programming — "jab X ho, to Y karo"

EventEmitter Node.js ki **core philosophy** hai — almost sab kuch events pe based hai (streams, HTTP, etc.).

---

## Explanation

### 1. Path Module (`path.js`)

File paths manually string jodna risky hai — Windows `\` use karta hai, Linux `/`. `path` module cross-platform paths banata hai.

```javascript
const path = require("path");

console.log("Filename:", __filename);   // Current file ka full path
console.log("Dirname:", __dirname);     // Current folder ka path

// Safe path join — OS ke hisaab se separator
const filepath = path.join("folder", "students", "data.txt");
// Output: folder\students\data.txt (Windows) ya folder/students/data.txt (Linux)

// Useful methods
path.parse(filepath);    // { root, dir, base, ext, name }
path.resolve(filepath);  // Absolute path
path.extname(filepath);  // ".txt"
path.basename(filepath); // "data.txt"
path.dirname(filepath);  // "folder/students"
```

**Kyun important?**
```javascript
// ❌ Galat — OS depend karta hai
const bad = "folder" + "/" + "file.txt";

// ✅ Sahi — har OS pe kaam karega
const good = path.join("folder", "file.txt");
```

---

### 2. EventEmitter Basics (`event.js`)

EventEmitter = **Publisher-Subscriber pattern**. Ek jagah event fire karo, dusri jagah suno.

```javascript
const EventEmitter = require("events");
const emitter = new EventEmitter();

// on = listener register karna (subscribe)
emitter.on("Greet", (args) => {
    console.log(`Hello World! ${args.username} and the id is: ${args.id}`);
});

// emit = event fire karna (publish)
emitter.emit("Greet", {
    username: "Neeraj",
    id: "3223krkfksdjrj4jl4kl"
});
```

| Method | Kaam |
|--------|------|
| `on(event, listener)` | Event sunna — har baar chalega |
| `once(event, listener)` | Sirf ek baar chalega |
| `emit(event, ...args)` | Event trigger karna |
| `off(event, listener)` | Listener hataana |

---

### 3. EventEmitter + File Persistence (`index.js`)

Yeh practical project hai — user events track karna aur JSON file mein save karna.

```javascript
const EventEmitter = require("events");
const fs = require("fs");

const emitter = new EventEmitter();
const eventsCounts = { login: 0, logout: 0, purchase: 0, profile_update: 0 };
const logFile = "eventlog.json";

// Pehle se saved data load karo
if (fs.existsSync(logFile)) {
    const data = fs.readFileSync(logFile, "utf-8");
    Object.assign(eventsCounts, JSON.parse(data));
}

function saveCounts() {
    fs.writeFileSync(logFile, JSON.stringify(eventsCounts, null, 2));
}

emitter.on("login", (username) => {
    eventsCounts.login++;
    console.log(`${username} loggedIn successfully!`);
    saveCounts();
});

emitter.on("purchase", (username, item) => {
    eventsCounts.purchase++;
    console.log(`${username} purchased ${item}!`);
    saveCounts();
});

// Events fire karo
emitter.emit("login", "Neeraj");
emitter.emit("purchase", "Neeraj", "Samsung S26 ultra");
emitter.emit("summary");  // Custom summary event
```

**Flow:**
1. App start → purana `eventlog.json` load
2. Event fire → count badhao → file mein save
3. Restart ke baad bhi counts preserve rahenge

---

## Real-Life Usage

| Concept | Real Project Mein |
|---------|-------------------|
| `path.join` | Upload folder paths, static file serving, log file locations |
| `path.extname` | File upload validation — sirf `.jpg`, `.pdf` allow karna |
| `path.resolve` | Config files ka absolute path nikalna |
| `EventEmitter` | Custom event bus — order placed, payment done, email sent |
| Event + File save | Analytics counters, audit logs, user activity tracking |

**Example 1:** E-commerce — jab order complete hota hai:
```javascript
orderEmitter.emit("orderComplete", { userId, orderId, amount });
// Listeners: sendEmail, updateInventory, notifyWarehouse
```

**Example 2:** Chat app — `io.on("message")` internally EventEmitter hi use karta hai (Socket.io).

**Example 3:** `path.join(__dirname, "uploads", filename)` — user uploads hamesha sahi folder mein save honge, chahe server Windows pe ho ya Linux pe.

---

## Files Is Folder Mein

| File | Kaam |
|------|------|
| `path.js` | path module ke saare useful methods |
| `event.js` | EventEmitter basic on/emit |
| `index.js` | Event tracking + JSON persistence |
| `eventlog.json` | Saved event counts (auto-generated) |

---

## Run Kaise Karein

```bash
node path.js     # Path examples
node event.js    # Basic EventEmitter
npm start        # Event tracking project (index.js)
```

---

## Summary

- **`path` module** cross-platform file paths ke liye — kabhi manually `/` ya `\` mat jodo
- **`__dirname`** aur **`__filename`** current file/folder ki location dete hain
- **EventEmitter** = loose coupling — ek module event fire kare, dusri sun ke react kare
- **`on` + `emit`** pattern almost pure Node ecosystem mein hai (streams, HTTP, custom apps)
- Events ko **file mein persist** karna simple analytics / audit log ke liye kaafi hai
- Day 3 ke baad tum event-driven architecture ki base samajh gaye ho

**Agla step (Day 4):** Streams — bade files ko memory mein load kiye bina handle karna! 🌊
