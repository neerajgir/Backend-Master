## MongoDB Kya Hai?

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