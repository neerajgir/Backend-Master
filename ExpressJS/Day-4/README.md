# Day 4 - Sessions (Express Session) + Mini Project (Task Manager)

Is day ka main topic **Sessions** hai - `express-session` ki madad se. Cookies ke baad yeh sabse important cheez hai agar aap real login/session-based apps banate ho. Saath mein ek **mini project (Task Manager)** bhi hai, jo pura MVC-style architecture use karta hai - routes, controllers, middlewares, utils, file-based data storage.

<div align="center">
  <strong>Topics:</strong> express-session | Session create/destroy | Auth Middleware | MVC Structure | File-based CRUD (Task Manager)
</div>

---

## Table of Contents

1. [Kya hai Session?](#session-kya-hai)
2. [Cookie vs Session](#cookie-vs-session)
3. [express-session Setup](#express-session-setup)
4. [Session Create, Read, Destroy](#session-create--read--destroy)
5. [Session ka Data - req.session & req.session.id](#session-ka-data)
6. [Part 2 - Task Manager Mini Project](#part-2--task-manager-mini-project)
   - [Project Structure](#project-structure)
   - [File-based Storage (utils)](#file-based-storage-utils)
   - [Auth Controller (login/logout)](#auth-controller)
   - [Task Controller (CRUD)](#task-controller-crud)
   - [Auth Middleware (Route Protection)](#auth-middleware)
7. [API Testing Cheatsheet](#api-testing-cheatsheet)
8. [Summary](#summary)

---

## Session Kya Hai

**Session** ek temporary data storage hai jo **server-side** rehta hai (cookie browser mein rehti hai, session server ke paas). Jab user login karta hai, server ek session banata hai, ek unique **session id** deta hai (jo browser ki cookie mein save hoti hai), aur baaki user-ka data server ke paas object mein rakhta hai.

```
User login karta hai
    ↓
Server ek session banata hai (req.session.user = {...})
    ↓
Session ID cookie ke through browser ke paas jaati hai
    ↓
User ka agla har request us session id ko bhejta hai
    ↓
Server session id se data utha leta hai (req.session)
```

> Ye cookie se kaafi zyada secure hai kyunki sensitive data browser ke paas nahi jaata - sirf ek random session id jaati hai.

---

## Cookie vs Session

| Feature | Cookie | Session |
|---------|--------|---------|
| Data kahan hai | Client (browser) par | Server par |
| Size | Bahut limit (chhota) | Zyada data store kar sakte |
| Security | Dikhyi de sakta, tamper ho sakta | Server side, reference id hi client ko jaati |
| Package | cookie-parser | express-session |

Ye project mein dono use hote hain - cookie session id carry karta hai, session server par data rakhta hai.

---

## express-session Setup

Pehle install karo:

```bash
npm install express-session
```

Phir server mein middleware ke roop mein use karo:

```js
import session from "express-session";

app.use(session({
    secret: "OT/8/pn7PakW4mKEVeQIuDtV7VhvKxnp",   // signing ke liye
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24   // 1 din
    }
}));
```

**Options ka matlab:**

| Option | Matlab |
|--------|--------|
| `secret` | Session id sign karne ke liye secret key. Hamesha secret rakhna. |
| `saveUninitialized` | `false` = uninitialized sessions store nahi honge (optimization). |
| `resave` | `false` = har request par session forcibly re-save nahi hoga. |
| `cookie` | Session cookie ke options (maxAge, httpOnly, secure). |
| `maxAge` | Session kitni der tak valid rahega. |

Day-4 ke `index.js` mein `cookie-parser` bhi path ke saath client-side cookies ke liye use karta hai:

```js
app.use(cookieParser("secret"));
```

---

## Session Create, Read, Destroy

### 1. Read check karna

```js
app.get("/", (req, res) => {
    console.log(req.session);    // poori session data object
    console.log(req.session.id); // unique session identifier
    res.send("Hello World");
});
```

- `req.session` – server-side session data ka object
- `req.session.id` – yehi id cookie mein hoti hai jo browser ko bheji jaati hai

### 2. Session create (login)

```js
app.get("/login", (req, res) => {
    req.session.user = {
        name: "Neeraj",
        email: "neeraj@example.com",
        age: 25
    };
    res.send("User LoggedIn");
});
```

`req.session.user` set karte hi session create ho jaata hai. Ab tak user ka data session mein hai.

### 3. Session destroy (logout)

```js
app.get("/logout", (req, res) => {
    req.session.destroy();
    res.send("User Logout");
});
```

`req.session.destroy()` server-side data mitata hai aur agar chaho toh cookie bhi clear ho sakti hai.

---

## Part 2 - Task Manager Mini Project

Ab aate hain **Task Manager** par - pura structure jisme CRUD + sessions + file-based database.

### Project Structure

```
Task Manager/
│
├── index.js                           <- Main app (entry point)
├── middlewares/
│   └── auth.middleware.js             <- Route protection (401 check)
└── src/
    ├── controller/
    │   ├── auth.controller.js         <- login, logout logic
    │   └── task.controller.js         <- CRUD logic (get/create/update/delete)
    ├── routes/
    │   ├── auth.route.js              <- /auth (login, logout)
    │   └── task.route.js              <- /task (protected CRUD)
    ├── utils/
    │   ├── data/tasks.json            <- Database (file-based)
    │   └── file.utils.js              <- read/write helpers for JSON
    └── (common express-session + cookie-parser config in index.js)
```

Ye structure **MVC pattern** follow karta hai (Model → here file-based data, View → skipped, Controller → logic, Route → endpoint aliasing).

---

### Main App - index.js

```js
import express from "express";
import session from "express-session";
import cookieParser from "cookie-parser";
import authRoute from "./src/routes/auth.route.js"
import taskRoute from "./src/routes/task.route.js"

const app = express();
const PORT = 3000;

// global middleware
app.use(express.json());      // JSON body parse (req.body)
app.use(session({
    secret: "taskmanager",
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true, secure: false, maxAge: 1000*60*60*24 }
}));
app.use(cookieParser());

// routes
app.get("/", (req,res)=> res.send("Hello World"));

app.use('/auth', authRoute);   // login/logout - no auth protection
app.use("/task", taskRoute);   // protected routes

app.listen(PORT, ()=> console.log(`Server is running on Port ${PORT}`));
```

Key points:
- `express.json()` – POST/PUT ke body (JSON) ko parse karta hai.
- `auth` router - login/logout (unprotected)
- `task` router - protected (authMiddleware sab routes par)

---

### Routes aur Controllers

**auth.route.js:**

```js
const router = Router();

router.post("/login", login);
router.get("/logout", logout);

export default router;
```

**task.route.js (With authMiddleware protect):**

```js
const router = Router();

router.get("/", authMiddleware, getAllTask);
router.post("/", authMiddleware, createTask);
router.put("/:id", authMiddleware, updateTask);
router.delete("/:id", authMiddleware, deleteTask);

export default router;
```

Har task route pehle `authMiddleware` se pass hoti hai, phir controller tak jaati hai.

---

### Auth Middleware (Route Protection)

```js
const authMiddleware = (req, res, next) => {
    if (req.session && req.session.user) {
        return next();           // session hai, aage badh jao
    }
    res.status(401).json({ message: "Unauthorized" });
};
```

- Agar session mein `user` exists hai → `next()` (controller tak pass).
- Warna → `401` Unauthorized response.

Ye pattern kehta hai: "Pehle check lo ki user ne login kiya ya nahi, phir task route allow do."

---

### File-Based Storage (utils/file.utils.js)

Database ki jagah ek JSON file use hota hai:

```js
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const filePath = path.join(__dirname, "data", "tasks.json");

const ensureFileExists = () => {
    if (!fs.existsSync(filePath)) {
        fs.mkdirSync(path.dirname(filePath), { recursive: true });
        fs.writeFileSync(filePath, "[]", "utf-8");
    }
};

const readTask = () => {
    ensureFileExists();
    const data = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(data || "[]");
};

const writeTask = (tasks) => {
    fs.writeFileSync(filePath, JSON.stringify(tasks, null, 2), "utf-8");
};

export { readTask, writeTask };
```

- `readTask()` file padhkar tasks array return karta hai.
- `writeTask(tasks)` new array ko file mein save karta hai.
- `ensureFileExists()` agar file/dir nahi hai toh banata hai.

**`data/tasks.json` sample:**

```json
[
  {
    "id": 1786046052134,
    "title": "Nodejs",
    "description": "Nodejs is runtime env",
    "createdBy": "Neeraj goswami"
  }
]
```

---

### Auth Controller (login/logout)

```js
const login = (req, res) => {
    const { username } = req.body;
    if (!username) {
        return res.status(400).json({ error: "Username is required" });
    }
    req.session.user = { username: "Neeraj" };
    req.session.user.username = username;
    req.session.save((err) => {
        if (err) {
            return res.status(500).json({ error: "Login failed on server" });
        }
        return res.json({ message: "Login Successful", username });
    });
};

const logout = (req, res) => {
    res.clearCookie("username");
    req.session.destroy((error) => {
        if (error) {
            return res.status(500).json({ error: "Something went wrong" });
        }
        res.json({ message: "Logout successful" });
    });
};
```

- login: body se username liya, session mein save kiya, callback mein success bheja.
- logout: cookie clear + session destroy (yeha `res.session` ki jagah `req.session.destroy()` chahie tha - syntax mistake deliberately noted).
- Bug note: `res.clearCookie("username")` mein actual cookie/session-id nahi, kyunki session cookie naam `connect.sid` hota hai.

---

### Task Controller (CRUD)

```js
const getAllTask = (req, res) => {
    const tasks = readTask();
    return res.status(200).json(tasks);
};

const createTask = (req, res) => {
    const loggedInUser = req.session.user.username;
    const { title, description } = req.body;
    const tasks = readTask();
    const newTask = {
        id: Date.now(),
        title,
        description: description || "",
        createdBy: loggedInUser
    };
    tasks.push(newTask);
    writeTask(tasks);
    return res.status(201).json({ message: "Task created successfully!", newTask });
};
```

**updateTask** — task ko user ke createdBy se match kar update karta hai:

```js
const id = Number(req.params.id);
const { username } = req.session?.user?.username;
const targetTask = allTask.find(t => t && t.id === id && t.createdBy === username);
```

**deleteTask** — same idea, filter karke data file se nikaal deta hai.

> Important: `req.params.id` string aata hai isliye `Number()` use karo. `createdBy` check ka matlab user sirf apne hi tasks update/delete kar sakta hai (ownership check).

---

### Auth Middleware Recap

Saare task routes par `authMiddleware` lagaya hai, taaki bina login ko task data access na ho. Bina session → `401 Unauthorized`.

---

## API Testing Cheatsheet

Installed dependencies:

```bash
npm install express express-session cookie-parser uuid
```

**Test flow using curl or Postman:**

```bash
# 1. Login (session banane ke liye) — POST body mein username
curl -X POST http://localhost:3000/auth/login \
     -H "Content-Type: application/json" \
     -d "{\"username\": \"Neeraj goswami\"}"

# 2. Get all tasks (protected, cookie path needed)
curl http://localhost:3000/task

# 3. Create a task
curl -X POST http://localhost:3000/task \
     -H "Content-Type: application/json" \
     -d "{\"title\": \"Milestone\", \"description\": \"Finish Day 4\"}"

# 4. Update task (id = task id)
curl -X PUT http://localhost:3000/task/1786046052134 \
     -H "Content-Type: application/json" \
     -d "{\"title\": \"Updated Nodejs\"}"

# 5. Delete task
curl -X DELETE http://localhost:3000/task/1786046052134

# 6. Logout
curl http://localhost:3000/auth/logout
```

(Cookies save karne ke liye curl mein `-c cookies.txt` aur `-b cookies.txt` use karo.)

---

## Summary

1. **Session** server-side data hai, cookie session id carry karta hai.
2. `express-session` middleware se sessions bilao.
3. `req.session.user` set karo = login; `req.session.destroy()` = logout.
4. **Middleware** (authMiddleware) protected routes ke liye auth check karta hai.
5. **File-based storage** (readTask/writeTask) JSON file ko database ki tarah use karta hai.
6. **Task Manager** mein MVC-like structure: routes, controllers, utils, middleware.

**Important:** Is code mein kuch deliberate mistakes hain jo aapko code review mein shayad milengi - especially `res` vs `req.session.destroy` aur `res.clearCookie`. Ye samajhna zaroori hai kyunki real projects mein bhi aise micro-bugs aa sakte hain.

---

## Common Bug Fix (Recap from code)

Errors jo is code mein dikhte hain aur aap aage fix kar sakte hain:

- `res.session.destroy()` → `req.session.destroy()` hona chahiye.
- `res.clearCookie("username")` → cookie ka actual name `username` nahi hai; session cookie ka naam `connect.sid` hota.
- `const { username } = req.session?.user?.username` → ye poora object nahi, property ko access karna chahiye: `const user = req.session?.user`.

Yahan sabse jaruri hai - invalid/unauthorized condition par saaf reject (401/404) dena, kabhi crash nahi hona chahiye.