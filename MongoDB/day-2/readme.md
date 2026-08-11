# Combine both files into a single complete Markdown file

## MongoDB Complete Guide (Hinglish)

MongoDB ek popular NoSQL (Not Only SQL) database hai jiska use bade scale par unstructured data store karne ke liye hota hai. Yeh ek flexible aur schema-less format follow karta hai, jisse applications fast aur easily scale ho paati hain. MongoDB document-oriented hai aur apna data BSON (Binary JSON) naam ke format me store karta hai.

---

## MongoDB Ke Baare Me Thoda Aur

MongoDB ko high performance aur flexibility ke sath heavy data handle karne ke liye design kiya gaya hai. Iske kuch key features yeh hain:

* **Schema-less design:** Collections ke andar wale documents ko kisi strict schema ko follow nahi karna padta. Isse kaafi flexibility milti hai.
* **Horizontal scaling:** Data ko alag-alag machines par distribute karke MongoDB ko aasaani se scale out kiya ja sakta hai.
* **Replication:** High availability ke liye data ko multiple servers par replicate ya copy kiya ja sakta hai.
* **Indexing:** Query performance ko fast karne ke liye MongoDB indexing support karta hai.

---

## SQL aur MongoDB Me Difference

| Feature | SQL (Relational) | MongoDB (NoSQL) |
|---|---|---|
| **Data Storage** | Tables (Rows aur Columns) | Collections (Documents) |
| **Schema** | Fixed Schema | Dynamic / Flexible Schema |
| **Scaling** | Vertical Scaling | Horizontal Scaling |
| **Data Integrity** | Strong consistency aur ACID properties | Eventual consistency |
| **Queries** | SQL Queries | JavaScript-based queries (BSON format) |
| **Transactions** | Fully Supported | Limited (Recent versions me mature hua hai) |
| **Relationships** | Foreign Keys aur Joins support karta hai | Built-in joins nahi hote (Embedded documents ya references use hote hain) |
| **Data Type** | Fixed (Int, Char, Date, etc.) | Flexible (String, Number, Array, etc.) |

---

## MongoDB Ki Main Terminologies

### 1. Database
MongoDB database ke andar documents ke collections hote hain. Yeh bilkul SQL systems ke database ki tarah hi hota hai.

### 2. Collection
Collection, documents ka ek group hota hai, jaise SQL me table hoti hai. Collections me koi pehle se tay schema nahi hota, toh ek hi collection ke alag-alag documents ka structure alag ho sakta hai.

### 3. Document
Document key-value pairs ka ek set hota hai, jo SQL table ke ek row jaisa dikhta hai. Yeh BSON format me store hota hai. Isme arrays, nested documents, aur alag-alag data types ho sakte hain.

### 4. Field
Field ek document ke andar ki key-value pair hoti hai. Har document me alag-alag fields ho sakti hain.

**Example:**

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

## MongoDB Cheatsheet & Notes (Hinglish)

## 2. find() Examples

Sabhi items dhoondho jinka type **"fruit"** hai:
```javascript
db.collectionName.find({ type: "fruit" });
```

Sabhi items dhoondho jinki price **20 se zyada** hai:
```javascript
db.collectionName.find({ price: { $gt: 20 } });
```

Sabhi items dhoondho jinki rating **4** hai:
```javascript
db.collectionName.find({ rating: 4 });
```

Sabhi items dhoondho jinke title mein **"Strawberry"** word aata ho (case-insensitive):
```javascript
db.collectionName.find({ title: /Strawberry/i });
```

Sabhi items dhoondho jinka type **"dairy"** ho aur price **25 se kam** ho:
```javascript
db.collectionName.find({ type: "dairy", price: { $lt: 25 } });
```

---

## 2. findOne() Examples

"bakery" type ka pehla single item dhoondho:
```javascript
db.collectionName.findOne({ type: "bakery" });
```

Single item dhoondho jiski rating 5 hai:
```javascript
db.collectionName.findOne({ rating: 5 });
```

Single item dhoondho jiska title exact "Green smoothie" hai:
```javascript
db.collectionName.findOne({ title: "Green smoothie" });
```

Single item dhoondho jiski price exact 14.77 hai:
```javascript
db.collectionName.findOne({ price: 14.77 });
```

---

## Comparison Operators

### 1. `$eq` (Equals)
Ye operator un documents ko select karta hai jahan field ki value aapki di hui value ke barabar hoti hai.

**Example:**
```javascript
db.products.find({ "price": { $eq: 100 } });
```
> **Explanation:** Ye query un documents ko nikalegi jahan "price" field ki value exact 100 ho.

### 2. `$ne` (Not Equals)
Ye operator un documents ko select karta hai jahan field ki value di hui value ke barabar nahi hoti.

**Example:**
```javascript
db.products.find({ price: { $ne: 100 } });
```
> **Explanation:** Ye query un documents ko layegi jahan "price" 100 ke barabar nahi hai.

### 3. `$gt` (Greater Than)
Ye operator un documents ko select karta hai jahan field ki value di hui value se badi hoti hai.

**Example:**
```javascript
db.products.find({ price: { $gt: 100 } });
```
> **Explanation:** Ye query un documents ko chunegi jahan "price" 100 se zyada hai.

### 4. `$gte` (Greater Than or Equal To)
Ye operator un documents ko select karta hai jahan value di hui value se badi ya uske barabar hoti hai.

**Example:**
```javascript
db.products.find({ price: { $gte: 100 } });
```
> **Explanation:** Ye query un documents ko layegi jahan "price" 100 ya usse zyada hai.

### 5. `$lt` (Less Than)
Ye operator un documents ko select karta hai jahan field ki value di hui value se kam hoti hai.

**Example:**
```javascript
db.products.find({ price: { $lt: 100 } });
```
> **Explanation:** Ye query un documents ko legi jahan "price" 100 se kam hai.

### 6. `$lte` (Less Than or Equal To)
Ye operator un documents ko select karta hai jahan value di hui value se kam ya uske barabar hoti hai.

**Example:**
```javascript
db.products.find({ price: { $lte: 100 } });
```
> **Explanation:** Ye query un documents ko nikalegi jahan "price" 100 ya usse kam hai.

### 7. `$in` (In)
Ye operator un documents ko select karta hai jahan field ki value aapki di hui array list mein se kisi ek se match kar jaye.

**Example:**
```javascript
db.products.find({ category: { $in: ["Electronics", "Clothing"] } });
```
> **Explanation:** Ye query un documents ko layegi jahan "category" ya toh "Electronics" ho ya "Clothing".

### 8. `$nin` (Not In)
Ye operator un documents ko select karta hai jahan field ki value di hui array list mein kisi se bhi match nahi karti.

**Example:**
```javascript
db.products.find({ category: { $nin: ["Electronics", "Clothing"] } });
```
> **Explanation:** Ye query un documents ko chunegi jahan "category" "Electronics" ya "Clothing" dono me se kuch bhi na ho.

---

## MongoDB mein Cursors ka Introduction

Jab aap MongoDB mein `find()` method use karte ho, toh ye ek **cursor** return karta hai. Cursor basically result set ka ek pointer hota hai. Iski madad se aap collection ke documents par ek-ek karke efficiently loop kar sakte ho.

MongoDB data ko process aur manipulate karne ke liye kuch cursor methods deta hai, jaise `count()`, `limit()`, `skip()`, aur `sort()`.

---

## Cursor Methods with Examples

### 1. `count()`
Ye method query criteria se match hone wale documents ka total count return karta hai.

```javascript
// "fruit" type ke documents ka count nikalo
const count = db.collectionName.find({ type: "fruit" }).count();
console.log("Number of fruits:", count);
```
> **Explanation:** `find()` cursor lata hai jahan type "fruit" ho, aur `count()` un matching documents ki ginti bata deta hai.

### 2. `limit()`
Ye method query se milne wale total documents ke number ko control (limit) karta hai.

```javascript
// "dairy" type ke pehle 3 documents fetch karo
const result = db.collectionName.find({ type: "dairy" }).limit(3);
result.forEach(doc => console.log(doc));
```
> **Explanation:** `find()` "dairy" type wale documents dhoondhta hai, aur `limit(3)` ye pakka karta hai ki sirf pehle 3 matching documents hi return hon.

### 3. `skip()`
Ye method result set mein se shuruat ke kuch documents ko chhod (skip kar) deta hai.

```javascript
// Pehle 2 documents skip karo aur agle 3 fetch karo
const result = db.collectionName.find({ type: "bakery" }).skip(2).limit(3);
result.forEach(doc => console.log(doc));
```
> **Explanation:** `find()` saare "bakery" documents dhoondhta hai. `skip(2)` pehle 2 matching documents ko chhod deta hai, aur `limit(3)` agle 3 documents return karta hai.

### 4. `sort()`
Ye method documents ko kisi field ke hisab se ascending (`1`) ya descending (`-1`) order mein set karta hai.

```javascript
// "fruit" type documents ko price ke hisab se ascending order mein sort karo
const result = db.collectionName.find({ type: "fruit" }).sort({ price: 1 });
result.forEach(doc => console.log(doc));
```
> **Explanation:** `find()` "fruit" type documents dhoondhta hai, aur `sort({ price: 1 })` unhe saste se mehenge (low to high price) ke order mein set kar deta hai.

---

## Cursor Methods ko Combine Karna

Aap in methods ko ek ke saath ek chain karke complex logic bana sakte ho.

```javascript
// Top rated fruits mein se pehle 2 chhod kar agle 5 fetch karo
const result = db.collectionName
  .find({ type: "fruit" })
  .sort({ rating: -1 })
  .skip(2)
  .limit(5);

result.forEach(doc => console.log(doc));
```

> **Explanation:**
> - `find({ type: "fruit" })`: Sirf "fruit" wale items filter karta hai.
> - `sort({ rating: -1 })`: Unhe rating ke hisab se descending order (high to low) mein lagata hai.
> - `skip(2)`: Top 2 best-rated fruits ko chhod deta hai.
> - `limit(5)`: Agle 5 documents return kar deta hai.

### Cursor Summary
- **`count()`**: Matching documents ka number deta hai.
- **`limit(n)`**: Max `n` documents hi return karta hai.
- **`skip(n)`**: Pehle `n` documents ko chhod deta hai.
- **`sort({ field: order })`**: Field ke basis par ascending (`1`) ya descending (`-1`) order mein arrange karta hai.

---

## Logical Operators in MongoDB

MongoDB ke logical operators (`$and`, `$or`, `$not`, aur `$nor`) alag-alag conditions ko aapas mein jodne ke kaam aate hain.

### 1. `$and`
Ye operator tabhi match karta hai jab saari di hui conditions true hon.

**Example:**
Find karo woh documents jahan category "electronics" ho **AUR** price 1000 se zyada ho.

```javascript
db.collectionName.find({
  $and: [
    { category: "electronics" },
    { price: { $gt: 1000 } }
  ]
});
```
> **Explanation:** Document tabhi select hoga jab category "electronics" bhi ho aur price 1000 se zyada bhi ho. Both conditions must be true.

### 2. `$or`
Ye operator tab match karta hai jab di hui conditions mein se kam se kam ek condition true ho.

**Example:**
Find karo woh documents jahan category "furniture" ho **YA** price 500 se kam ho.

```javascript
db.collectionName.find({
  $or: [
    { category: "furniture" },
    { price: { $lt: 500 } }
  ]
});
```
> **Explanation:** Dono me se koi bhi ek condition sahi nikli toh document pick ho jayega.

### 3. `$not`
Ye kisi condition ke result ko ulta kar deta hai. Yani ye un documents ko pakadta hai jo condition ko satisfy nahi karte.

**Example:**
Find karo woh documents jahan price 1000 se zyada na ho.

```javascript
db.collectionName.find({
  price: { $not: { $gt: 1000 } }
});
```
> **Explanation:** Un documents ko nikalega jahan price 1000 se badi nahi hai (yani price 1000 ya usse kam hai).

### 4. `$nor`
Ye un documents ko match karta hai jo di gayi kisi bhi condition ko fulfill nahi karte.

**Example:**
Find karo woh documents jahan category na toh "books" ho aur na price 200 se zyada ho.

```javascript
db.collectionName.find({
  $nor: [
    { category: "books" },
    { price: { $gt: 200 } }
  ]
});
```
> **Explanation:** Ye sirf unhi ko chunega jo dono me se kisi bhi condition mein fit nahi baithte.

---

## Logical Operators ko Combine Karna

Aap intricate logic ke liye in operators ko aapas mein nest kar sakte ho.

**Example:**
Find karo jahan:
- Category "clothing" ho **YA** price 1000 se badi ho, **AUR**
- Rating kam se kam 4 honi chahiye.

```javascript
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
> **Explanation:** Pehle `$or` check karega ki item clothing ka ho ya price 1000 se upar ho. Phir `$and` ye confirm karega ki is condition ke saath-saath rating bhi 4 ya usse zyada honi chahiye.

---

## Summary of Logical Operators

| Operator | Description |
| :--- | :--- |
| **`$and`** | Un documents ko match karta hai jo saari conditions ko satisfy karein. |
| **`$or`** | Un documents ko match karta hai jo kam se kam ek condition ko satisfy karein. |
| **`$not`** | Condition ko ulta kar deta hai (jo satisfy na ho unhe chunega). |
| **`$nor`** | Un documents ko match karta hai jo kisi bhi condition ko satisfy na karein. |

# Complex Expressions in MongoDB: `$expr`, `$exists`, aur `$type`

MongoDB mein jab hume thode complex conditions handling ki zaroorat padti hai, tab ye teen operators bohot kaam aate hain.

---

## 1. `$expr`

`$expr` operator aapko normal queries ke andar **aggregation expressions** use karne ki permission deta hai. Iski madad se aap ek hi document ke do alag fields ko aapas mein compare ya calculate kar sakte ho.

### Example:
Aise documents dhundho jahan `price` field ki value `cost` field se badi ho:

```javascript
db.collectionName.find({
  $expr: { $gt: ["$price", "$cost"] }
});
```

Agar hum is `monthlyBudget` data set par kaam kar rahe hain:

```javascript
db.monthlyBudget.insertMany([
  { _id: 1, category: "food", budget: 400, spent: 450 },
  { _id: 2, category: "drinks", budget: 100, spent: 150 },
  { _id: 3, category: "clothes", budget: 100, spent: 50 },
  { _id: 4, category: "misc", budget: 500, spent: 300 },
  { _id: 5, category: "travel", budget: 200, spent: 650 }
]);
```

Toh jin documents mein `spent` budget se zyada hai, unhe hum `$expr` se aasani se filter kar sakte hain.

### Explanation:
* `$gt`: Check karta hai ki pehli value (e.g. price) doosri value (e.g. cost) se badi hai ya nahi.
* `$expr`: Normal find query ke andar `$gt`, `$lt`, `$add`, `$subtract` jaise aggregation operators use karne ki freedom deta hai.

---

## 2. `$exists`

`$exists` operator ka use tab hota hai jab aapko ye check karna ho ki kisi document mein koi specific field maujood hai ya nahi.

### Example 1:
Aise documents dhundho jahan `description` field maujood ho:

```javascript
db.collectionName.find({
  description: { $exists: true }
});
```

### Example 2:
Aise documents dhundho jahan `discount` field nahi ho:

```javascript
db.collectionName.find({
  discount: { $exists: false }
});
```

### Explanation:
* `$exists: true`: Un documents ko match karega jahan field hai (bhale hi uski value `null` kyon na ho).
* `$exists: false`: Un documents ko match karega jahan wo field poori tarah se missing hai.

---

## 3. `$type`

`$type` operator se aap kisi field ki BSON data type ke basis par filter kar sakte ho.

### Example 1:
Aise documents filter karo jahan `age` field ek number ho:

```javascript
db.collectionName.find({
  age: { $type: "number" }
});
```

### Example 2:
Aise documents filter karo jahan `tags` field ek array ho:

```javascript
db.collectionName.find({
  tags: { $type: "array" }
});
```

### BSON Types aur unke Numbers:

| BSON Type | Alias | Number |
|---|---|---|
| Double | `"double"` | 1 |
| String | `"string"` | 2 |
| Object | `"object"` | 3 |
| Array | `"array"` | 4 |
| Binary Data | `"binData"` | 5 |
| Undefined (deprecated) | `"undefined"` | 6 |
| ObjectId | `"objectId"` | 7 |
| Boolean | `"bool"` | 8 |
| Date | `"date"` | 9 |
| Null | `"null"` | 10 |
| Regular Expression | `"regex"` | 11 |
| JavaScript | `"javascript"` | 13 |
| Symbol (deprecated) | `"symbol"` | 14 |
| JavaScript (with scope) | `"javascriptWithScope"` | 15 |
| 32-bit Integer | `"int"` | 16 |
| Timestamp | `"timestamp"` | 17 |
| 64-bit Integer | `"long"` | 18 |
| Decimal128 | `"decimal"` | 19 |
| Min Key | `"minKey"` | -1 |
| Max Key | `"maxKey"` | 127 |

---

## `$exists` aur `$type` ko Combine Karna

Aap dono operators ko ek sath jod kar aur ziada specific search query bana sakte ho.

### Example:
Aise documents dhundho jahan `age` field maujood bhi ho aur uska type `number` ho:

```javascript
db.collectionName.find({
  age: { $exists: true, $type: "number" }
});
```