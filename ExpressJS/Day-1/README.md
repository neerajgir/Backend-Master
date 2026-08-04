# ExpressJS — Day 1: Server Setup & CRUD APIs

> **Learning Notes** — Express server setup, HTTP methods, routes, aur basic CRUD APIs samajhne ke liye ye notes banaaye gaye hain.

---

## 📌 Intro

**Express.js** Node.js ka sabse popular web framework hai. Isse hum REST APIs banate hain — jo frontend (React, mobile app, etc.) ko data serve karti hain.

**Day 1** ka focus hai:

1. **Express server setup** — app create karna aur port par chalana
2. **Routes & HTTP Methods** — GET, POST, PUT, PATCH, DELETE
3. **Request/Response objects** — `req.params`, `req.body`, `res.status()`, `res.json()`
4. **CRUD API** — Create, Read, Update, Delete operations on users data

Socho Express ko ek **restaurant ka waiter** jaisa — customer (frontend) order deta hai (HTTP request), waiter kitchen (server logic) se baat karta hai, aur plate par khana serve karta hai (HTTP response).

---

## 📁 Folder Structure

```
Day-1/
├── index.js          # Main server + saari routes
├── data/
│   └── data.js       # Dummy users data (in-memory)
├── package.json
└── README.md
```

---

## 🚀 Project Setup

### Dependencies install karo

```bash
npm install
```

### Server start karo

```bash
npm run dev
```

Server **port 8080** par chalega. Browser ya Postman se test kar sakte ho.

```js
// package.json
{
  "type": "module",        // ES6 import/export use karne ke liye
  "scripts": {
    "dev": "nodemon index.js"  // File change par auto-restart
  }
}
```

---

## 🧠 Express Server — Basics

### App create karna

```js
import express from "express";

const app = express();
const PORT = 8080;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
```

| Cheez | Matlab |
|-------|--------|
| `express()` | Application instance banata hai |
| `app.listen(PORT)` | Server ko specified port par start karta hai |
| `nodemon` | Code change par server automatically restart hota hai |

### JSON body parse karna (Important!)

POST, PUT, PATCH requests mein client **JSON data** bhejta hai. Usse read karne ke liye ye middleware lagana padta hai:

```js
app.use(express.json());
```

**Bina iske** `req.body` undefined rahega aur tum user ka data receive nahi kar paoge.

---

## 1️⃣ GET — Data Read Karna

GET request se data **fetch** hota hai — kuch create ya change nahi hota.

### Basic route

```js
app.get("/", (req, res) => {
    res.status(200).send("Hello World");
});
```

- `req` → incoming request (client se aaya data)
- `res` → outgoing response (client ko bhejna hai)
- `res.status(200)` → success status code
- `res.send()` → plain text response

### Saare users fetch karna

```js
// Industry standard: API versioning use karo
app.get("/api/v1/users", (req, res) => {
    res.status(200).send(data);
});
```

**`/api/v1/`** kyun? Real apps mein jab API change hoti hai, purani version (`v1`) aur nayi version (`v2`) dono chal sakti hain — taaki purane clients break na hon.

### Single user — Route Params

URL mein dynamic value pass karne ke liye **`:paramName`** use hota hai:

```js
app.get("/api/v1/users/:id", (req, res) => {
    const { id } = req.params;       // URL se id nikalo
    const parseId = parseInt(id);    // string ko number mein convert

    const user = data.find((user) => user.id == parseId);

    res.status(200).json({
        message: "User Found:",
        Data: user
    });
});
```

**Example:** `GET /api/v1/users/3` → `req.params.id` = `"3"`

| Object | Kahan se aata hai | Example |
|--------|-------------------|---------|
| `req.params` | URL path se | `/users/:id` → `{ id: "3" }` |
| `req.query` | URL query string se | `/users?name=john` → `{ name: "john" }` |
| `req.body` | Request body se (POST/PUT) | `{ username, password }` |

---

## 2️⃣ POST — Naya Data Create Karna

POST se **naya resource** banate hain — jaise naya user register karna.

```js
app.post("/api/v1/users", (req, res) => {
    const { username, password } = req.body;

    const userData = {
        id: data.length + 1,
        username,
        password
    };

    data.push(userData);

    res.status(201).json({
        message: "User added successfully",
        data: userData
    });
});
```

| Status Code | Kab use karo |
|-------------|--------------|
| `200` | Success (GET, PUT, PATCH, DELETE) |
| `201` | **Created** — naya resource successfully bana |
| `400` | Bad Request — galat input |
| `404` | Not Found — resource exist nahi karta |

**Postman test:**
- Method: `POST`
- URL: `http://localhost:8080/api/v1/users`
- Body → raw → JSON:
```json
{
    "username": "neeraj",
    "password": "123456"
}
```

---

## 3️⃣ PUT — Poora Resource Update Karna

PUT se **saare fields** ek saath replace hote hain — poora object update.

```js
app.put("/api/v1/users/:id", (req, res) => {
    const { body, params: { id } } = req;
    const parseId = parseInt(id);

    const userIndex = data.findIndex((user) => user.id == parseId);

    if (userIndex === -1) {
        return res.status(404).send("User Not Found!");
    }

    data[userIndex] = {
        id: parseId,
        ...body    // body ke saare fields user mein daal do
    };

    res.status(200).json({
        message: "User Updated!",
        data: data[userIndex]
    });
});
```

**PUT vs PATCH:**

| Method | Kya karta hai | Example |
|--------|---------------|---------|
| **PUT** | Poora object replace | `{ name, email, age, city }` — sab update |
| **PATCH** | Sirf specific fields update | Sirf `{ email }` change karna |

---

## 4️⃣ PATCH — Partial Update Karna

PATCH se sirf **jo fields bheje** wahi update hote hain — baaki same rehte hain.

```js
app.patch("/api/v1/users/:id", (req, res) => {
    const { id } = req.params;
    const { name, email } = req.body;
    const parseId = parseInt(id);

    if (isNaN(parseId)) {
        return res.status(400).send("Invalid User ID");
    }

    const userIndex = data.findIndex((user) => user.id == parseId);

    if (userIndex === -1) {
        return res.status(404).send("User Not Found!");
    }

    data[userIndex] = {
        ...data[userIndex],           // purana data rakho
        ...(name && { name }),         // sirf agar name bheja ho
        ...(email && { email })        // sirf agar email bheja ho
    };

    res.status(200).json({
        message: "User Updated!",
        data: data[userIndex]
    });
});
```

**Real-life example:** Instagram profile mein sirf bio change karna — poora profile nahi, sirf ek field. Ye PATCH ka use case hai.

---

## 5️⃣ DELETE — Resource Hataana

```js
app.delete("/api/v1/users/:id", (req, res) => {
    const { id } = req.params;
    const parseId = parseInt(id);

    if (isNaN(parseId)) {
        return res.status(400).send("Invalid User ID");
    }

    const userIndex = data.findIndex((user) => user.id == parseId);

    if (userIndex === -1) {
        return res.status(404).send("User Not Found!");
    }

    const [deletedUser] = data.splice(userIndex, 1);

    res.status(200).json({
        message: "User Deleted Successfully",
        data: deletedUser
    });
});
```

`splice(index, 1)` array se ek element nikal deta hai aur deleted item return karta hai.

---

## 📊 HTTP Methods — Quick Reference

```
┌──────────┬─────────────────────┬──────────────────────────────┐
│ Method   │ Action              │ Example URL                  │
├──────────┼─────────────────────┼──────────────────────────────┤
│ GET      │ Read / Fetch        │ GET /api/v1/users            │
│ GET      │ Read one            │ GET /api/v1/users/5          │
│ POST     │ Create new          │ POST /api/v1/users           │
│ PUT      │ Full update         │ PUT /api/v1/users/5          │
│ PATCH    │ Partial update      │ PATCH /api/v1/users/5        │
│ DELETE   │ Remove              │ DELETE /api/v1/users/5       │
└──────────┴─────────────────────┴──────────────────────────────┘
```

---

## 🌍 Real-Life Usage

### 1. E-commerce App (Amazon, Flipkart)

| API | Method | Real use |
|-----|--------|----------|
| `/api/v1/products` | GET | Products list dikhana |
| `/api/v1/products/:id` | GET | Single product detail page |
| `/api/v1/cart` | POST | Cart mein item add karna |
| `/api/v1/cart/:id` | PATCH | Quantity change karna |
| `/api/v1/cart/:id` | DELETE | Cart se item hataana |

### 2. Social Media (Instagram, Twitter)

| API | Method | Real use |
|-----|--------|----------|
| `/api/v1/posts` | GET | Feed load karna |
| `/api/v1/posts` | POST | Naya post create karna |
| `/api/v1/posts/:id` | PATCH | Caption edit karna |
| `/api/v1/posts/:id` | DELETE | Post delete karna |

### 3. User Management (Is project jaisa)

| API | Method | Real use |
|-----|--------|----------|
| `/api/v1/users` | GET | Admin panel mein users list |
| `/api/v1/users/:id` | GET | User profile page |
| `/api/v1/users` | POST | Sign up / Register |
| `/api/v1/users/:id` | PUT/PATCH | Profile update |
| `/api/v1/users/:id` | DELETE | Account delete |

### 4. In-memory vs Real Database

Is project mein data **`data.js`** array mein hai — server restart par **sab reset** ho jata hai.

Real apps mein:
- **MongoDB** — NoSQL, flexible documents
- **PostgreSQL / MySQL** — relational data
- **Redis** — caching ke liye

Day 1 sirf **logic samajhne** ke liye in-memory data use kiya hai. Database connection baad ke days mein aayega.

---

## 🧪 Postman se Test Kaise Karein

1. Postman install karo
2. Server chalao: `npm run dev`
3. Naya request banao:

```
GET    http://localhost:8080/
GET    http://localhost:8080/api/v1/users
GET    http://localhost:8080/api/v1/users/1
POST   http://localhost:8080/api/v1/users     (Body → JSON)
PUT    http://localhost:8080/api/v1/users/1    (Body → JSON)
PATCH  http://localhost:8080/api/v1/users/1    (Body → JSON)
DELETE http://localhost:8080/api/v1/users/1
```

---

## ⚠️ Common Mistakes (Yaad Rakho)

1. **`express.json()` bhool jaana** → `req.body` undefined aayega
2. **`return` miss karna error cases mein** → code aage bhi chalega aur double response bhej sakta hai
3. **String vs Number** — URL se `id` hamesha string aati hai, `parseInt()` zaroori hai
4. **`find` vs `findIndex`** — update/delete ke liye index chahiye hota hai (`findIndex`)
5. **Status codes sahi use karo** — 201 for create, 404 for not found, 400 for bad input

---

## 📝 Summary

| Topic | Key Takeaway |
|-------|--------------|
| **Express Setup** | `express()`, `app.listen()`, `express.json()` |
| **GET** | Data read — `req.params` se URL values |
| **POST** | Naya data — `req.body` se client ka data |
| **PUT** | Poora object replace |
| **PATCH** | Sirf specific fields update |
| **DELETE** | Resource remove — `splice()` use karo |
| **Status Codes** | 200 OK, 201 Created, 400 Bad Request, 404 Not Found |
| **API Versioning** | `/api/v1/` — future changes ke liye safe |
| **CRUD** | Create + Read + Update + Delete = har backend app ka base |

**Day 1 complete!** Ab tum Express server chala sakte ho aur basic REST APIs bana sakte ho. **Day 2** mein hum **Middleware** aur **Routers** seekhenge — code ko organize aur powerful banane ke liye.

---

## 🔗 Next Steps

- [Day 2 — Middleware & Routers](../Day-2/README.md)
- Postman collection banao apne saare endpoints ke liye
- `req.query` se search/filter add karke try karo (e.g. `/users?city=Boston`)
