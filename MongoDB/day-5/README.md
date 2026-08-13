# Day 5 — Mongoose & MongoDB

An Express + Mongoose REST API covering the basics of connecting to MongoDB through Mongoose, defining schemas, and running full CRUD operations.

## Table of Contents

- [What is MongoDB?](#what-is-mongodb)
- [What is Mongoose?](#what-is-mongoose)
- [ORM vs ODM](#orm-vs-odm)
- [Project Setup](#project-setup)
- [Connecting to the Database](#connecting-to-the-database)
- [Mongoose Schema](#mongoose-schema)
- [Schema Types](#schema-types)
- [Validations](#validations)
- [Mongoose Model](#mongoose-model)
- [CRUD with Mongoose](#crud-with-mongoose)
- [Project Structure](#project-structure)

---

## What is MongoDB?

MongoDB is a **NoSQL document database**. Instead of tables and rows, it stores data as **documents** (JSON-like objects) inside **collections**.

```js
// A MongoDB document (stored in the "users" collection)
{
  _id: ObjectId("64a7f3c1e4b0a1a2b3c4d5e6"),
  name: "Neeraj",
  age: 25,
  weight: 70,
  createdAt: "2025-01-01T10:00:00.000Z"
}
```

Key differences from SQL:

| SQL (relational) | MongoDB (NoSQL) |
|-------------------|-----------------|
| Table | Collection |
| Row | Document |
| Column | Field |
| Fixed schema | Flexible schema |

---

## What is Mongoose?

**Mongoose** is an ODM (Object Document Mapper) for Node.js that provides a schema-based solution to model your MongoDB data. It adds structure, validation, and a clean API on top of the raw MongoDB driver.

```js
import mongoose from "mongoose";

// Connect
mongoose.connect("mongodb+srv://user:pass@cluster.mongodb.net/UltimateBackend");
```

Why use Mongoose instead of the raw driver?

- **Schemas** — enforce structure on your documents
- **Validations** — built-in and custom validators
- **Middleware (hooks)** — run code before/after save, update, delete
- **Population** — easy referencing between collections
- **Query helpers** — expressive methods like `findByIdAndUpdate`

---

## ORM vs ODM

- **ORM (Object Relational Mapper)** — maps objects to **relational** databases (SQL). Examples: Sequelize, TypeORM, Prisma.
- **ODM (Object Document Mapper)** — maps objects to **document** databases (NoSQL). Examples: Mongoose for MongoDB.

```
ORM  → SQL  →  Tables / Rows
ODM  → NoSQL → Collections / Documents
```

Mongoose is an **ODM** because MongoDB is a document database.

---

## Project Setup

```bash
npm init -y
npm install express mongoose
```

`package.json` scripts:

```json
{
  "type": "module",
  "scripts": {
    "dev": "nodemon index.js"
  },
  "dependencies": {
    "express": "^5.2.1",
    "mongoose": "^9.9.2"
  }
}
```

Run the server:

```bash
npm run dev
```

---

## Connecting to the Database

`config/db.js` — connects to MongoDB Atlas using Mongoose.

```js
import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(
      "mongodb+srv://neeraj:neeraj@cluster0.vk19rqu.mongodb.net/UltimateBackend"
    );
    console.log(`DB is connected: ${connection.connection.host}`);
  } catch (error) {
    console.log(`Error:`, error.message);
    process.exit(1);
  }
};

export default connectDB;
```

- `mongodb+srv://` — connection string for Atlas (cloud MongoDB).
- `UltimateBackend` — database name (created automatically if it doesn't exist).
- `process.exit(1)` — stop the server if the DB connection fails.

Call it in `index.js` at startup:

```js
connectDB();
```

---

## Mongoose Schema

A **schema** defines the shape of documents within a collection. Every field is declared with a type and optional settings.

`models/user.model.js`:

```js
import { Schema, model } from "mongoose";

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
    maxLength: 50
  },
  age: {
    type: Number,
    required: true
  },
  weight: {
    type: Number
  },
  createdAt: {
    type: Date,
    default: Date.now()
  }
});

const userModel = model("User", userSchema);

export default userModel;
```

- `name` — required string, max 50 characters.
- `age` — required number.
- `weight` — optional number.
- `createdAt` — defaults to the current time.

---

## Schema Types

Mongoose supports these core types:

| Type | Description |
|------|-------------|
| `String` | Text |
| `Number` | Integer or float |
| `Boolean` | `true` / `false` |
| `Date` | JavaScript Date |
| `Buffer` | Binary data |
| `Mixed` | Any type |
| `ObjectId` | Reference to another document |
| `Array` | List of values |

```js
const exampleSchema = new Schema({
  title: String,
  price: Number,
  isActive: Boolean,
  publishedAt: Date,
  tags: [String],           // array of strings
  owner: { type: Schema.Types.ObjectId, ref: "User" } // reference
});
```

---

## Validations

Validation rules run when a document is saved or updated. Common built-in validators:

| Validator | Purpose |
|-----------|---------|
| `required` | Field must be present |
| `min` / `max` | Bounds for numbers |
| `minLength` / `maxLength` | Bounds for strings |
| `enum` | Value must be one of a list |
| `default` | Fallback value when missing |
| `match` | String must match a regex |

```js
const userSchema = new Schema({
  name: { type: String, required: true, maxLength: 50 },
  age: { type: Number, required: true, min: 1, max: 120 },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  email: { type: String, match: /^[^@]+@[^@]+\.[^@]+$/ }
});
```

Custom validators with `validate`:

```js
const userSchema = new Schema({
  age: {
    type: Number,
    validate: {
      validator: (value) => value >= 18,
      message: "Age must be at least 18"
    }
  }
});
```

> **Note:** `findByIdAndUpdate` does **not** run validators by default. Pass `runValidators: true` to enable them (see the update route below).

---

## Mongoose Model

A **model** is a compiled version of a schema. It is the interface you use to query and modify the collection.

```js
const userModel = model("User", userSchema);
```

Mongoose uses the model name `User` to create the collection name `users` (pluralized, lowercase). The model exposes methods like:

- `create()`
- `find()`, `findById()`
- `findByIdAndUpdate()`, `updateOne()`
- `findByIdAndDelete()`, `deleteOne()`
- `countDocuments()`

---

## CRUD with Mongoose

`routes/user.routes.js` implements all four CRUD operations.

### 1. Create — `POST /api/users`

```js
router.post("/users", async (req, res) => {
  try {
    const { name, age, weight } = req.body;
    const newUser = new User({ name, age, weight });
    await newUser.save();

    res.status(201).json({
      success: true,
      data: newUser,
      message: "Successfully User Created"
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
```

### 2. Read — `GET /api/users`

```js
router.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({
      success: true,
      data: users,
      message: "User Fetch Successfully"
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
```

### 3. Update — `PUT /api/update-users/:id`

```js
router.put("/update-users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, age, weight } = req.body;

    const updateUser = await User.findByIdAndUpdate(
      id,
      { name, age, weight },
      { new: true, runValidators: true }
    );

    if (!updateUser) {
      return res.status(401).json({ success: false, message: "User not found" });
    }
    res.status(200).json({
      success: true,
      user: updateUser,
      message: "User update successfully"
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
```

- `{ new: true }` — return the updated document (default returns the old one).
- `{ runValidators: true }` — enforce schema validators on update.

### 4. Delete — `DELETE /api/users/:id`

```js
router.delete("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleteUser = await User.findByIdAndDelete(id);

    if (!deleteUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.status(200).json({
      success: true,
      data: deleteUser,
      message: "User deleted successfully"
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
```

---

## Project Structure

```
day-5/
├── config/
│   └── db.js              # MongoDB connection
├── models/
│   └── user.model.js      # Mongoose schema + model
├── routes/
│   └── user.routes.js     # CRUD endpoints
├── index.js               # Express server entry point
├── package.json
└── .gitignore
```

### API Endpoints Summary

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST   | `/api/users` | Create a user |
| GET    | `/api/users` | Get all users |
| PUT    | `/api/update-users/:id` | Update a user by id |
| DELETE | `/api/users/:id` | Delete a user by id |