# MongoDB Learning Repository

Ek complete learning journey MongoDB ka — basic concepts se lekar Mongoose + Express CRUD tak. Ye repo 5 din (day-1 se day-5) mein divide hai, har din ek specific topic cover karta hai.

---

## Table of Contents

1. [Repo Overview](#repo-overview)
2. [Day 1 - MongoDB Basics](#day-1---mongodb-basics)
3. [Day 2 - Queries, Operators & Cursors](#day-2---queries-operators--cursors)
4. [Day 3 - Projections, Embedded Docs & Updates](#day-3---projections-embedded-docs--updates)
5. [Day 4 - Aggregation Pipeline](#day-4---aggregation-pipeline)
6. [Day 5 - Mongoose + Express CRUD](#day-5---mongoose--express-crud)
7. [Learning Summary](#learning-summary)

---

## Repo Overview

```
MongoDB/
├── day-1/          # MongoDB kya hai, SQL vs NoSQL, terminologies
├── day-2/          # find/findOne, comparison & logical operators, cursors
├── day-3/          # Projections, embedded documents, update operators
├── day-4/          # Aggregation pipeline
└── day-5/          # Mongoose ODM + Express REST API (CRUD)
```

**Journey ka flow:**
1. **Day 1**: Theory — MongoDB kya hai, kaise data store karta hai
2. **Day 2**: Queries — data ko kaise dhoondhte hain (operators + cursors)
3. **Day 3**: Updates — data ko kaise modify karte hain
4. **Day 4**: Aggregation — data ko kaise process/transform karte hain
5. **Day 5**: Application — Node.js/Express ke saath real-world integration

---

## Day 1 - MongoDB Basics

### MongoDB Kya Hai?

MongoDB ek **NoSQL (Not Only SQL)** document database hai jo bade scale par unstructured data store karne ke liye design kiya gaya hai. Ye flexible aur schema-less format follow karta hai aur apna data **BSON (Binary JSON)** naam ke format mein store karta hai.

### Key Features

- **Schema-less design:** Collections ke documents ko koi strict schema follow nahi karna padta
- **Horizontal scaling:** Data ko alag-alag machines par distribute karke scale out kiya ja sakta hai
- **Replication:** High availability ke liye data multiple servers par copy kiya ja sakta hai
- **Indexing:** Query performance ke liye indexing support

### SQL vs MongoDB

| Feature | SQL (Relational) | MongoDB (NoSQL) |
|---|---|---|
| **Data Storage** | Tables (Rows + Columns) | Collections (Documents) |
| **Schema** | Fixed Schema | Dynamic / Flexible |
| **Scaling** | Vertical | Horizontal |
| **Data Integrity** | Strong (ACID) | Eventual consistency |
| **Queries** | SQL Queries | JavaScript-based (BSON) |
| **Transactions** | Fully Supported | Recent versions mein mature |
| **Relationships** | Foreign Keys + Joins | Embedded docs ya references |
| **Data Type** | Fixed (Int, Char, Date) | Flexible (String, Number, Array) |

### Main Terminologies

```json
{
   "_id": ObjectId("60b8d795f3b1b8283454d6fa"),
   "name": "John Doe",
   "age": 30,
   "address": {
     "street": "123 Main St",
     "city": "New York"
   }
}
```

- **Database:** Documents ke collections ka group (SQL ke database jaisa)
- **Collection:** Documents ka group (SQL ke table jaisa) — koi fixed schema nahi
- **Document:** Key-value pairs ka set (SQL ke row jaisa) — BSON format mein
- **Field:** Document ke andar ki key-value pair

---

## Day 2 - Queries, Operators & Cursors

> **Practice data:** `day-2/json/product.json` (products with type, price, rating) aur `day-2/json/data.json` (e-commerce products)

### find() Examples

```javascript
// "fruit" type ke saare items
db.collectionName.find({ type: "fruit" });

// price 20 se zyada
db.collectionName.find({ price: { $gt: 20 } });

// rating 4 wale
db.collectionName.find({ rating: 4 });

// title mein "Strawberry" (case-insensitive)
db.collectionName.find({ title: /Strawberry/i });

// type "dairy" HO AUR price 25 se kam
db.collectionName.find({ type: "dairy", price: { $lt: 25 } });
```

### findOne() Examples

```javascript
// "bakery" type ka pehla item
db.collectionName.findOne({ type: "bakery" });

// exact title match
db.collectionName.findOne({ title: "Green smoothie" });

// exact price match
db.collectionName.findOne({ price: 14.77 });
```

### Comparison Operators

| Operator | Matlab | Example |
|---|---|---|
| `$eq` | Equal (barabar) | `find({ price: { $eq: 100 } })` |
| `$ne` | Not equal | `find({ price: { $ne: 100 } })` |
| `$gt` | Greater than | `find({ price: { $gt: 100 } })` |
| `$gte` | Greater or equal | `find({ price: { $gte: 100 } })` |
| `$lt` | Less than | `find({ price: { $lt: 100 } })` |
| `$lte` | Less or equal | `find({ price: { $lte: 100 } })` |
| `$in` | List mein se koi ek | `find({ category: { $in: ["Electronics", "Clothing"] } })` |
| `$nin` | List mein se koi nahi | `find({ category: { $nin: ["Electronics", "Clothing"] } })` |

### Cursor Methods

`find()` ek **cursor** return karta hai — result set ka pointer, jisse aap documents par efficiently loop kar sakte ho.

```javascript
// count() - matching documents ki ginti
db.collectionName.find({ type: "fruit" }).count();

// limit() - sirf pehle 3 documents
db.collectionName.find({ type: "dairy" }).limit(3);

// skip() - pehle 2 chhod ke agle 3
db.collectionName.find({ type: "bakery" }).skip(2).limit(3);

// sort() - ascending (1) ya descending (-1)
db.collectionName.find({ type: "fruit" }).sort({ price: 1 });

// Sab combine karke
// Top rated fruits mein se pehle 2 chhod ke agle 5
db.collectionName
  .find({ type: "fruit" })
  .sort({ rating: -1 })
  .skip(2)
  .limit(5);
```

### Logical Operators

```javascript
// $and - SAARI conditions true honi chahiye
db.collectionName.find({
  $and: [
    { category: "electronics" },
    { price: { $gt: 1000 } }
  ]
});

// $or - kam se kam EK condition true ho
db.collectionName.find({
  $or: [
    { category: "furniture" },
    { price: { $lt: 500 } }
  ]
});

// $not - condition ka result ulta
db.collectionName.find({
  price: { $not: { $gt: 1000 } }  // price 1000 se badi nahi
});

// $nor - koi bhi condition satisfy na ho
db.collectionName.find({
  $nor: [
    { category: "books" },
    { price: { $gt: 200 } }
  ]
});
```

**Nested example** (dono ko combine karna):

```javascript
// Category "clothing" YA price 1000 se badi, AUR rating >= 4
db.collectionName.find({
  $and: [
    {
      $or: [
        { category: "clothing" },
        { price: { $gt: 1000 } }
      ]
    },
    { rating: { $gte: 4 } }
  ]
});
```

### Complex Expressions: `$expr`, `$exists`, `$type`

```javascript
// $expr - do fields ko compare karo (aggregation expressions in queries)
// jahan spent budget se zyada hai
db.monthlyBudget.insertMany([
  { _id: 1, category: "food", budget: 400, spent: 450 },
  { _id: 2, category: "drinks", budget: 100, spent: 150 },
  { _id: 3, category: "clothes", budget: 100, spent: 50 }
]);

db.monthlyBudget.find({
  $expr: { $gt: ["$spent", "$budget"] }
});

// $exists - field maujood hai ya nahi
db.collectionName.find({ description: { $exists: true } });
db.collectionName.find({ discount: { $exists: false } });

// $type - BSON data type se filter
db.collectionName.find({ age: { $type: "number" } });
db.collectionName.find({ tags: { $type: "array" } });

// Combine: field ho BHI aur type number ho
db.collectionName.find({
  age: { $exists: true, $type: "number" }
});
```

---

## Day 3 - Projections, Embedded Docs & Updates

### Projections - Fields Filter Karna

Result mein kaunse fields dikhne chahiye, ye control karta hai:
- Include karne ke liye value **`1`**
- Exclude karne ke liye value **`0`**
- **Note:** Ek hi query mein include (`1`) aur exclude (`0`) ek sath nahi use kar sakte (sivaye `_id` ke)

```javascript
// Sirf title aur author fields return honge
db.collection.find({}, { title: 1, author: 1 });
```

### Embedded Documents - `$all` vs `$elemMatch`

> **Practice data:** `day-3/json/video.json` (videos with nested `comments` array aur `metadata` object)

| Feature | `$all` | `$elemMatch` |
|---|---|---|
| **Match Scope** | Array ke alag-alag elements | Ek single element |
| **Logical Nature** | Saari values kahin bhi mil jayein | Ek hi element saari conditions meet kare |
| **Use Case** | Array mein values ki presence check | Ek nested object par multiple conditions |

```javascript
// $all - likes array mein 45 AUR 78 dono hoon (kahin bhi)
db.comments.find({
  "metadata.likes": { $all: [45, 78] }
});

// $elemMatch - ek HI comment object ho jiska user "user5" HO AUR text match kare
db.articles.find({
  "comments": {
    $elemMatch: {
      user: "user5",
      text: "Just what I needed to understand aggregations."
    }
  }
});
```

### Update Methods

| Method | Kya Karta Hai |
|---|---|
| `updateOne()` | Sirf pehla matching document |
| `updateMany()` | Saare matching documents |
| `replaceOne()` | Poora document replace (`_id` chhod kar) |

```javascript
// updateOne - sirf pehla match
db.comments.updateOne(
  { user: "user1" },
  { $set: { text: "Updated comment text!" } }
);

// updateMany - saare matches
db.comments.updateMany(
  { likes: { $lt: 10 } },
  { $set: { priority: "low" } }
);

// replaceOne - poori document badal do
db.comments.replaceOne(
  { user: "user2" },
  { user: "user2", text: "Completely new comment!", likes: 0 }
);
```

### Update Operators

| Operator | Kya Karta Hai | Example |
|---|---|---|
| `$set` | Field set/update karo | `{ $set: { field: value } }` |
| `$inc` | Number increase/decrease | `{ $inc: { likes: 5 } }` |
| `$push` | Array mein value add | `{ $push: { tags: "favorite" } }` |
| `$pull` | Array se value remove | `{ $pull: { tags: "spam" } }` |
| `$unset` | Field delete karo | `{ $unset: { edited: "" } }` |

```javascript
// $set
db.comments.updateOne({ user: "user3" }, { $set: { text: "Updated again!", edited: true } });

// $inc
db.comments.updateOne({ user: "user3" }, { $inc: { likes: 5 } });

// $push
db.comments.updateOne({ user: "user4" }, { $push: { tags: "favorite" } });

// $pull
db.comments.updateOne({ user: "user4" }, { $pull: { tags: "spam" } });

// $unset
db.comments.updateOne({ user: "user4" }, { $unset: { edited: "" } });
```

### Upsert - Agar Match Nahi Mila Toh Insert Karo

```javascript
// "newUser" exist nahi karta toh naya document ban jayega
db.comments.updateOne(
  { user: "newUser" },
  { $set: { text: "This is a new comment!" } },
  { upsert: true }
);
```

---

## Day 4 - Aggregation Pipeline

Aggregation mein data records ko process karke computed results nikalte hain. Isme ek **pipeline** hoti hai — ek stage ka output agle stage ka input ban jata hai.

**Key Concepts:**
- **Pipeline:** Stages ka sequence jo data ko stepwise transform karta hai
- **Stages:** Har stage ek specific operation (filter, group, sort, etc.)
- **Operators:** `$match`, `$group`, `$sort`, `$project`, `$unwind`...

### Common Aggregation Stages

| Stage | Kya Karta Hai |
|---|---|
| `$match` | Documents filter karta hai |
| `$group` | Field ke basis par group + sum/avg jaisi operations |
| `$sort` | Ascending/descending sort |
| `$project` | Har document ko reshape (add/remove/rename fields) |
| `$unwind` | Array ko deconstruct karke har element ko alag document banata hai |

### Coding Examples

```javascript
// Example 1: $match + $group - male users ko age ke hisab se count karo
db.collection.aggregate([
  { $match: { gender: "male" } },
  { $group: { _id: "$age", count: { $sum: 1 } } }
]);

// Example 2: $sort add karo - count descending order mein
db.collection.aggregate([
  { $match: { gender: "male" } },
  { $group: { _id: "$age", count: { $sum: 1 } } },
  { $sort: { count: -1 } }
]);

// Example 3: Average - sabhi documents ki average age
db.collection.aggregate([
  { $group: { _id: null, averageAge: { $avg: "$age" } } }
]);

// Example 4: $unwind + $push - hobbies array ko break karke age wise list
db.collection.aggregate([
  { $unwind: "$hobbies" },
  { $group: { _id: "$age", hobbies: { $push: "$hobbies" } } }
]);

// Example 5: $filter - array ke andar 20 se badi score values
db.collection.aggregate([
  {
    $project: {
      scores: {
        $filter: {
          input: "$scores",
          as: "score",
          cond: { $gt: ["$$score", 20] }
        }
      }
    }
  }
]);
```

---

## Day 5 - Mongoose + Express CRUD

Ab tak humne raw MongoDB queries seekhi. Day 5 mein hamare paas **Mongoose ODM** hai jo Node.js mein structured way se MongoDB se baat karta hai — ek complete Express REST API ke saath.

### MongoDB vs Mongoose

- **MongoDB**: NoSQL document database (data store karta hai)
- **Mongoose**: ODM (Object Document Mapper) jo schemas, validations, aur clean API deta hai raw driver ke upar

### ORM vs ODM

```
ORM  → SQL  →  Tables / Rows    (Sequelize, TypeORM, Prisma)
ODM  → NoSQL → Collections / Documents  (Mongoose)
```

### Project Setup

```bash
npm init -y
npm install express mongoose
```

### Connecting to Database (`config/db.js`)

```javascript
import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const connection = await mongoose.connect("mongodb+srv://.../UltimateBackend");
        console.log(`DB is connected: ${connection.connection.host}`);
    } catch (error) {
        console.log(`Error:`, error.message);
        process.exit(1);
    }
};

export default connectDB;
```

- `mongodb+srv://` — Atlas (cloud MongoDB) connection string
- DB name (`UltimateBackend`) automatically create ho jata hai agar exist nahi karta
- `process.exit(1)` — DB fail ho toh server band karo

### Mongoose Schema (`models/user.model.js`)

Schema collection ke documents ki shape define karta hai:

```javascript
import { Schema, model } from 'mongoose';

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
        type: Number   // optional
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
});

const userModel = model("User", userSchema);
export default userModel;
```

### Schema Types

| Type | Description |
|---|---|
| `String` | Text |
| `Number` | Integer or float |
| `Boolean` | `true` / `false` |
| `Date` | JavaScript Date |
| `Buffer` | Binary data |
| `Mixed` | Any type |
| `ObjectId` | Kisi aur document ka reference |
| `Array` | List of values |

### Validations

| Validator | Purpose |
|---|---|
| `required` | Field present hona chahiye |
| `min` / `max` | Numbers ke bounds |
| `minLength` / `maxLength` | Strings ke bounds |
| `enum` | Value ek list se honi chahiye |
| `default` | Missing hone par fallback value |
| `match` | String ko regex match karna chahiye |

```javascript
const userSchema = new Schema({
    name: { type: String, required: true, maxLength: 50 },
    age: { type: Number, required: true, min: 1, max: 120 },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    email: { type: String, match: /^[^@]+@[^@]+\.[^@]+$/ }
});

// Custom validator
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

> **Note:** `findByIdAndUpdate` validators default **run nahi karta**. Update ke liye `runValidators: true` pass karna padta hai.

### Mongoose Model

Model schema ka compiled version hai — collection ko query/modify karne ka interface.

- Model name `User` → collection `users` (pluralized, lowercase)
- Methods: `create()`, `find()`, `findById()`, `findByIdAndUpdate()`, `updateOne()`, `findByIdAndDelete()`, `countDocuments()`

### Full CRUD API (`routes/user.routes.js`)

```javascript
import express from 'express';
import User from '../models/user.model.js';
const router = express.Router();

// 1. CREATE - POST /api/users
router.post('/users', async (req, res) => {
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

// 2. READ - GET /api/users
router.get('/users', async (req, res) => {
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

// 3. UPDATE - PUT /api/update-users/:id
router.put('/update-users/:id', async (req, res) => {
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

// 4. DELETE - DELETE /api/users/:id
router.delete('/users/:id', async (req, res) => {
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

export default router;
```

**Key points:**
- `{ new: true }` — update hone ke BAAD wala document return karo (default old deta hai)
- `{ runValidators: true }` — update par bhi schema validators enforce karo

### Server Entry Point (`index.js`)

```javascript
import express from 'express';
import connectDB from './config/db.js';
import userRoute from './routes/user.routes.js';

const app = express();
connectDB();
app.use(express.json());

const PORT = 3000;

app.get('/', (req, res) => {
    res.send("Hello From Mongoose");
});

app.use("/api/", userRoute);

app.listen(PORT, () => {
    console.log(`Server is running on Port ${PORT}`);
});
```

### API Endpoints Summary

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/users` | User create karo |
| GET | `/api/users` | Saare users lo |
| PUT | `/api/update-users/:id` | User update by id |
| DELETE | `/api/users/:id` | User delete by id |

---

## Learning Summary

| Day | Topic | Aap Kya Seekhenge |
|---|---|---|
| Day 1 | MongoDB Basics | NoSQL concepts, terminologies, SQL vs NoSQL |
| Day 2 | Queries & Operators | `find`, comparison/logical operators, cursors, `$expr` |
| Day 3 | Projections & Updates | Fields filtering, embedded docs, update operators, upsert |
| Day 4 | Aggregation | Pipeline, `$match`, `$group`, `$sort`, `$unwind` |
| Day 5 | Mongoose + Express | ODM, schemas, validations, full CRUD API |

### Next Steps (Aage Kya Seekhein)

1. **Relationships** - `ref` + `populate()` se multiple collections jodo
2. **Indexes** - Query performance ke liye `createIndex()`
3. **Transactions** - Multi-document atomic operations
4. **Aggregation Advanced** - `$lookup` (joins), `$facet`, `$bucket`
5. **Security** - Connection string ko `.env` mein rakho, `mongosh` se injection attacks se bacho
6. **Production Setup** - Mongoose + authentication, rate limiting, error handling

---

*Ye repo learning ke liye hai. Real production systems mein credentials ko `.env` file mein rakho aur kabhi commit mat karo (see `day-5/.gitignore`).*