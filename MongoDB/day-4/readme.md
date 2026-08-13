# MongoDB Aggregation Overview

MongoDB mein aggregation ek aisa tarika hai jisse hum data records ko process karke computed (calculated) results nikalte hain. Isme operations ki ek **pipeline** hoti hai jahan ek stage ka output agle stage ke liye input ban jata hai.

Isme mainly filtering, grouping, aur data ko transform karne jaise kaam hote hain.

---

## Key Concepts

* **Pipeline:** Stages ka ek sequence jahan har stage data ko stepwise transform karta hai.
* **Stages:** Aggregation pipeline ka har stage data par ek specific operation perform karta hai.
* **Operators:** MongoDB alag-alag operators provide karta hai jaise `$match`, `$group`, `$sort`, `$project`, wagerah.

---

## Common Aggregation Stages

* **`$match`**: Documents ko filter karta hai taaki sirf wahi documents aage pass hon jo specified condition meet karte hain.
* **`$group`**: Documents ko kisi specific field ke basis par group karta hai aur sum, average jaise operations perform kar sakta hai.
* **`$sort`**: Documents ko kisi field ke basis par ascending ya descending order mein sort karta hai.
* **`$project`**: Data stream ke har document ko reshape karta hai (e.g. fields add karna, remove karna ya rename karna).

---

## Coding Examples

### Example 1: Basic Aggregation (`$match` aur `$group`)

```javascript
db.collection.aggregate([
  { $match: { gender: "male" } }, // Un documents ko filter karta hai jahan gender male ho
  { $group: { _id: "$age", count: { $sum: 1 } } } // Age ke hisab se group karke count karta hai
]);
```

### Example 2: `$sort` ka Use

```javascript
db.collection.aggregate([
  { $match: { gender: "male" } },
  { $group: { _id: "$age", count: { $sum: 1 } } },
  { $sort: { count: -1 } } // Result ko count ke basis par descending order mein sort karta hai
]);
```

### Example 3: Average Calculate Karna

```javascript
db.collection.aggregate([
  { $group: { _id: null, averageAge: { $avg: "$age" } } } // Sabhi documents ki average age nikalta hai
]);
```

### Example 4: `$unwind` aur `$push` ka Use

```javascript
db.collection.aggregate([
  { $unwind: "$hobbies" }, // Hobbies array field ko deconstruct (break down) karta hai
  { $group: { _id: "$age", hobbies: { $push: "$hobbies" } } } // Age wise group karke hobbies ki list banata hai
]);
```

### Example 5: `$filter` ka Use

```javascript
db.collection.aggregate([
  {
    $project: {
      scores: {
        $filter: {
          input: "$scores",
          as: "score",
          cond: { $gt: ["$$score", 20] } // Sirf 20 se badi score values ko filter karta hai
        }
      }
    }
  }
]);
```