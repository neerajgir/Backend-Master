# MongoDB Notes: Projections aur Embedded Documents

MongoDB mein fields ko filter karne aur array/nested data ko sahi tarah se query karne ke liye projections aur embedded document operators bohot important hain.

---

## Projections in MongoDB

### Purpose
Query se jo result milta hai, usme kaunse fields dikhne chahiye aur kaunse nahi, ye control karna.

* Kisi field ko include karne ke liye uski projection value **`1`** set karo.
* Kisi field ko exclude karne ke liye uski projection value **`0`** set karo.
* **Note:** Ek hi query projection mein aap include (`1`) aur exclude (`0`) ek sath use nahi kar sakte (sivaye `_id` field ke).

### Example:
```javascript
db.collection.find({}, { title: 1, author: 1 });
```

**Explanation:** Ye query har document se sirf `title` aur `author` fields hi return karegi.

---

## Embedded Documents in MongoDB

Embedded documents ka use nested data structures (matlab object ke andar object ya arrays) ko store karne ke liye hota hai. Aap direct path (dot notation) use karke nested fields ko access kar sakte ho.

### Operators for Embedded Documents

#### 1. `$all`
Selects documents jahan ek array field mein saare specified elements maujood hon.

#### 2. `$elemMatch`
Matches documents jahan array ka kam se kam ek single element di gayi saari query conditions ko ek sath fulfill karta ho.

---

## `$all` vs `$elemMatch` ka Difference

In dono operators ke beech ka main fark ye hai ki ye array elements ko kaise match karte hain:

### 1. `$all`

* **Purpose:** Check karta hai ki array mein saari specified values hain ya nahi.
* **Behavior:** Ye document ko tab match karta hai jab saari values array mein kahin na kahin maujood hon (zaroori nahi ki ek hi element mein hon).

#### Example Usage:
```javascript
db.comments.find({
  "metadata.likes": { $all: [45, 78] }
});
```

**Explanation:** Ye query un documents ko khojti hai jahan `likes` array mein 45 aur 78 dono values exist karti hain (kisi bhi order ya position par).

---

### 2. `$elemMatch`

* **Purpose:** Check karta hai ki array ka koi **ek single element** di gayi saari conditions ko meet karta hai ya nahi.
* **Behavior:** Match tabhi hoga jab array ke kisi ek hi element par saari conditions ek sath fit baithen.

#### Example Usage:
```javascript
db.articles.find({
  "comments": {
    $elemMatch: { 
      user: "user5", 
      text: "Just what I needed to understand aggregations." 
    }
  }
});
```

**Explanation:** Ye query un documents ko dhundhti hai jahan `comments` array ke andar kam se kam ek aisa comment object ho jiska `user` "user5" ho **AUR** `text` "Just what I needed to understand aggregations." ho.

---

## Comparison Summary

| Feature | `$all` | `$elemMatch` |
|---|---|---|
| **Match Scope** | Array ke alag-alag elements ko check karta hai. | Array ke kisi ek single element par conditions check karta hai. |
| **Logical Nature** | Match tab hoga jab saari values array mein kahin bhi mil jayein. | Match tabhi hoga jab ek hi element saari conditions ek sath meet kare. |
| **Use Case** | Jab aapko sirf array mein values ki presence se matlab ho. | Jab aapko ek hi nested object/element par multiple conditions lagani hon. |

# MongoDB Update Made Easy: Notes with Coding Examples

**Collection Name:** `comments`

MongoDB mein documents ko update karne ke liye alag-alag methods hote hain. Aap chahe toh specific fields ko change kar sakte ho, poore document ko replace kar sakte ho, ya ek sath multiple documents ko update kar sakte ho.

---

## 1. Methods for Updating Documents

* **`updateOne()`**: Sirf pehle matching document ko update karta hai.
* **`updateMany()`**: Un sabhi documents ko update karta hai jo query se match hote hain.
* **`replaceOne()`**: Poore document ko naye document se replace kar deta hai.

---

## 2. Basic Syntax

### `updateOne()`
Filter condition ke hisab se jo sabse pehla document milta hai, ye sirf usse update karta hai.

```javascript
db.comments.updateOne(
  { user: "user1" }, // Filter condition
  { $set: { text: "Updated comment text!" } } // Update action
);
```

**Explanation:** Ye sabse pehle us document ko dhundhta hai jahan `user` "user1" ho, aur uske `text` field ko update kar deta hai.

### `updateMany()`
Filter condition se match hone wale saare documents ko ek sath update karta hai.

```javascript
db.comments.updateMany(
  { likes: { $lt: 10 } }, // Filter condition
  { $set: { priority: "low" } } // Update action
);
```

**Explanation:** Ye un sabhi documents ko update kar deta hai jinhone `likes` 10 se kam (`$lt: 10`) rakhe hain, aur unme `priority` field ko "low" set kar deta hai.

### `replaceOne()`
`_id` field ko chhod kar poore ke poore document ko nayi value se replace kar deta hai.

```javascript
db.comments.replaceOne(
  { user: "user2" }, // Filter condition
  { user: "user2", text: "Completely new comment!", likes: 0 } // New document
);
```

**Explanation:** Ye "user2" wale document ko hatakar uski jagah bilkul naya document rakh deta hai.

---

## 3. Update Operators

MongoDB mein documents modify karne ke liye alag-alag update operators use hote hain:

| Operator | Description | Example |
|---|---|---|
| **`$set`** | Kisi specific field ko update ya set karta hai. | `{ $set: { field: value } }` |
| **`$inc`** | Numeric value ko increase/decrease (increment) karta hai. | `{ $inc: { likes: 1 } }` |
| **`$push`** | Array ke andar koi nayi value add karta hai. | `{ $push: { tags: "important" } }` |
| **`$pull`** | Array se kisi specific value ko remove karta hai. | `{ $pull: { tags: "spam" } }` |
| **`$unset`** | Document se kisi field ko poori tarah se hata deta hai. | `{ $unset: { field: "" } }` |

---

## 4. Examples of Update Operators

### Updating a Specific Field
```javascript
db.comments.updateOne(
  { user: "user3" },
  { $set: { text: "Updated again!", edited: true } }
);
```
**Explanation:** `text` field ko update karta hai aur ek naya field `edited: true` add karta hai.

### Incrementing a Value
```javascript
db.comments.updateOne(
  { user: "user3" },
  { $inc: { likes: 5 } }
);
```
**Explanation:** `likes` field ki value ko 5 se bada (increase kar) deta hai.

### Adding to an Array
```javascript
db.comments.updateOne(
  { user: "user4" },
  { $push: { tags: "favorite" } }
);
```
**Explanation:** `tags` array ke andar `"favorite"` ko add kar deta hai.

### Removing from an Array
```javascript
db.comments.updateOne(
  { user: "user4" },
  { $pull: { tags: "spam" } }
);
```
**Explanation:** `tags` array se `"spam"` ko nikal deta hai.

### Removing a Field
```javascript
db.comments.updateOne(
  { user: "user4" },
  { $unset: { edited: "" } }
);
```
**Explanation:** Document se `edited` field ko poori tarah delete/remove kar deta hai.

---

## 5. Upsert Option

Upsert option ye ensure karta hai ki agar filter se koi document match nahi hota, toh ek naya document create ho jaye.

```javascript
db.comments.updateOne(
  { user: "newUser" }, // Filter
  { $set: { text: "This is a new comment!" } }, // Update
  { upsert: true } // Upsert option
);
```

**Explanation:** Agar `user: "newUser"` wala koi document pehle se nahi milta, toh MongoDB isse ek naye document ke roop mein insert kar dega.

---

## 6. Updating Multiple Documents

```javascript
db.comments.updateMany(
  { likes: { $gte: 100 } },
  { $set: { priority: "high" } }
);
```

**Explanation:** Un sabhi comments ko update karega jahan `likes` 100 ya usse zyada (`$gte: 100`) hain, aur unki `priority` ko "high" set kar dega.

---

## Summary Cheat Sheet

| Method | Updates | Creates New Document (Upsert) | Notes |
|---|---|---|---|
| **`updateOne`** | 1 doc | Optional | Sirf pehle match hone wale document ko update karta hai. |
| **`updateMany`** | Many docs | Optional | Saare matching documents ko update karta hai. |
| **`replaceOne`** | 1 doc | Optional | Poore document ko replace kar deta hai (`_id` ko chhod kar). |