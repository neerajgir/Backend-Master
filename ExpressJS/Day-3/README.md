# Day 3 - Cookies, Headers & Status Codes

Is day mein hum Express.js ke **Cookies**, **Headers** aur **Status Codes** ka use seekhenge. Ye wahi topics hain jo kisi bhi real-world web app mein har jagah use hote hain - login/session management, authentication, aur HTTP communication ke andar.

<div align="center">
  <strong>Topics Covered:</strong> Cookies | Signed Cookies | HTTP Headers | Status Codes
</div>

---

## Table of Contents

1. [Setup & Project Structure](#setup--project-structure)
2. [Kya hai Cookie?](#kya-hai-cookie)
3. [cookie-parser middleware](#cookie-parser-middleware)
4. [Cookie Set Karna (res.cookie)](#cookie-set-karna-rescookie)
5. [Cookie Options (maxAge, httpOnly, secure, signed)](#cookie-options)
6. [Signed vs Unsigned Cookies](#signed-vs-unsigned-cookies)
7. [req.cookies vs req.signedCookies](#reqcookies-vs-reqsignedcookies)
8. [req.headers - Raw Headers Access](#reqheaders--raw-headers-access)
9. [HTTP Status Codes (200, 403, 500 ...)](#http-status-codes)
10. [Routing / Middleware Overview](#routing--middleware-overview)

---

## Intro / Project Structure

Sabse pehle, is project ka basic tailam-jhelam le lete hain.

```
Day-3/
│
├── index.js          <- Main server file, saara logic yahan rehta hai
├── package.json      <- Dependencies & scripts (express, cookie-parser)
├── package-lock.json <- Dependency versions ka lock record
└── .gitignore        <- Git se exclude hone wale files
```

**package.json** ka dependency part:

```json
"dependencies": {
  "cookie-parser": "^1.4.7",
  "express": "^5.2.1"
}
```

Yahan humne do libraries install ki hain:
- **express** - Web server banane ke liye
- **cookie-parser** - Browser se aayi hui cookies ko parse (samajh) karne ke liye

Server chalane ke liye:

```bash
npm install   # pehle dependencies install do
npm run dev   # phir server chalana (nodemon use hota hai, changes par auto-restart)
```

---

## Cookie Kya Hai

**Cookie** ek chota sa piece of data hota hai jo server **browser ke paas**(client side) bhejta hai. Browser usse save kar leta hai, aur agli baar jab tum usi server se request karte ho, toh wahi cookie server ke paas waapas bhejti hai.

> Basket analogy: So cho jao ki cookie ek "ID card" hai. Server use karta hai yeh confirm karne ke liye ki "kaun se user ki request aa rahi hai" - chahe wo kaafi requests ho.

Ek chota example:

```
User opens login → Server cookie set karta hai (jaise userId) → 
User ka current & agla request us cookie ko saath bhejta hai → 
Server cookie se user identity samajhta hai
```

---

## Intro & Setup — index.js

Header mein import + app + middleware:

```js
import express from "express";
import cookieParser from "cookie-parser";

const app = express();
const PORT = 3000;

// cookie-parser ko secret ke saath enable karo
app.use(cookieParser("secret"));
```

Yahan `app.use(cookieParser("secret"))` ek **middleware** hai jo har incoming request ke liye cookies ko parse karta hai. `"secret"` signing ke liye use hota hai.

---

## Setting a Cookie (`res.cookie`)

Kisi bhi route mein `res.cookie(name, value, options)` se cookie set karte hain.

```js
app.get("/", (req, res) => {
    res.cookie("userId", "7f626ae0-02a0-4887-91a1-7674c5ba06e7", {
        maxAge: 1000 * 60 * 60 * 24, // 1 din
        httpOnly: true,
        secure: false,
        signed: true
    });
    res.send("Hello World");
});
```

Yahan `/` route par humne `userId` set ki di ek cookie. Options ka matlab niche.

---

## Cookie Options

| Option      | Matlab                                                                 |
|-------------|-------------------------------------------------------------------------|
| `maxAge`    | Cookie kitni der tak valid rahegi (milliseconds mein). Yahan `1000 * 60 * 60 * 24` = 24 ghante. |
| `httpOnly`  | `true` karne par cookie browser ki JS ke through access nahi ho sakti. XSS attacks se protect karta hai. |
| `secure`    | `true` karne par cookie sirf HTTPS protocol par bheji jaaygi. |
| `signed`    | `true` hone par cookie par server sign karta hai, taaki usme tampering detect ho jaye. |

Jab `signed: true` use karte hain, express `s` ke prefix ke saath cookie ko sign karta hai.

---

## Signed vs Unsigned Cookies

Ek signed cookie par ek **signature** lagta hai jo secret key se banaya jata hai. Agar koi user cookie value ko modify kare to signature match nahi hoga aur server usse invalid maan lega.

- **Unsigned cookie** – `req.cookies` mein aa jaata hai (plain value).
- **Signed cookie** – `req.signedCookies` mein aata hai (verified value).

---

## `req.cookies` vs `req.signedCookies`

```js
app.get("/product", (req, res) => {
    console.log("Cookies", req.cookies);          // { name: 'express' }
    console.log("Sign-Cookie", req.signedCookies); // signed cookies ka object

    if (req.cookies.name && req.cookies.name === "express") {
        res.status(200).send({
            id: 1,
            name: "item-01",
            price: "$100"
        });
    } else {
        res.status(403).send("You are not authorized");
    }
});
```

- `req.cookies` – signed-parsing ko an-parse normal cookies (jaise `name=express`).
- `req.signedCookies` – sirf woh cookies jo signed hain.

Ye route ka **authorization** ka example hai: agar cookie `name` = `express`, tabhi product ka data /access milega, warna `403`.

---

## `req.headers` - Raw Headers Review

> Kya `req.cookies` dipick nahi hota ? Tab raw aur chaudhari adhar samajho. Har HTTP request mein `headers` ka object hota hai.

`req.headers.cookie` – browser se aayui raw cookie string.

```js
console.log(req.headers.cookie); // name=express
```

Isliye comment mein likha:

```js
// console.log(req.cookies) undefined   (agar cookie-parser miss hota)
// console.log(req.headers.cookie) name=express   (raw header)
```

Pehle `req.cookies` `undefined` aata ta kyoki cookie parser na tha; `req.headers.cookie` hamesha raw string deta hai (agar browser ne cookie bheja ho).

---

## HTTP Status Codes

Server ka response status code batatark hai - kya cheez acchi hui, kahan problem hui.

| Code | Meaning                                              | Use-Case |
|------|------------------------------------------------------|----------|
| `200` | OK - Sab kuch sahi | Jaise product found ho. |
| `201` | Created - Naya resource cne hai | Data create hua. |
| `202` | Accepted - Request accepted hui | Background processing. |
| `301` | Moved Permanently | Redirection. |
| `400` | Bad Request - Client ne galat bheja | Missing data. |
| `401` | Unauthorized - User authenticated nahi | Login required. |
| `403` | Forbidden - Aagya nahi hai | is example mein product denied. |
| `404` | Not Found - Resource nahi mila | Unknown route. |
| `500` | Internal Server Error | Server crash. |

Example mein `res.status(200)` success aur `res.status(403)` access deny ke liye — simple authorization flow.

---

## Routing & Middleware

Express `/` aur `/product` jaise routes define karte hain. `res.status(code).send()` se hum status code + body dono bhej sakte hain.

```js
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
```

Yahan server `PORT=3000` par start hota hai. Jab koi bhi change karte ho `nodemon` auto-restart karega.

---

## Summary (Ek Baar Mein)

1. **Cookie** ek chota session-id hai jo server-client ke beech transfer hota hai.
2. `cookie-parser` se `req.cookies` aur `req.signedCookies` milta.
3. `res.cookie(name, value, options)` se cookie set hoti hai.
4. Signed cookie tampering se security provide karti hai.
5. Headers raw HTTP data dete hain (`req.headers.cookie`).
6. Status codes response ka result batate hain (200 OK, 403 Denied, 500 Error).

```

Ab tum is understanding ko dene ke liye browser mein `http://localhost:3000/` kholo, phir `/product` route par request bhejo. Cookie browser ke DevTools > Application > Cookies mein check karo.
```