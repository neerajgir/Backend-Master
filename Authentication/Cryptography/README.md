# 🔐 Cryptography in Node.js — Learning Repo

> **"Chaabi ke bina tala, tala nahi hota."** Isi ek line ke andar hai poora cryptography ka raaz.

Yeh ek **learning repository** hai jo samjhata hai ki **Cryptography** kya hai aur Node.js mein use kaise implement karte hain. Hum Node.js ka **built-in `crypto` module** use kar rahe hain (koi heavy third-party dependency nahi) taki aap **core concepts** ko deep mein samajh sako.

---

## 📌 Index

1. [Kya Hai Cryptography?](#kya-hai-cryptography)
2. [Yeh Repo Kaise Chalayein](#yeh-repo-kaise-chalayein)
3. [Cryptography in Node.js](#cryptography-in-nodejs)
4. [Types of Cryptography](#types-of-cryptography)
5. [Public Key vs Private Key](#public-key-vs-private-key)
6. [RSA — Deep Dive](#rsa--deep-dive)
7. [Code Explanation (index.js)](#code-explanation-indexjs)
8. [Real-Life Use Cases](#real-life-use-cases)
9. [Best Practices](#best-practices)
10. [Cheatsheet](#cheatsheet)

---

## Kya Hai Cryptography?

**Cryptography** ka matlab hai **secure communication** — jab aap kisi ko message bhejte ho, to chahte ho ki **sirf wahi insaan** use padh paye jo aap chahte ho. Cryptography data ko aise format mein badal deta hai jise **sirf sahi key (chaabi) wala** hi wapas samajh sakta hai.

```
Simple Message (Plaintext)
        │
        │  🔒 ENCRYPTION (key se)
        ▼
   Garbled Text (Ciphertext)  ←─ koi aur nahi padh sakta
        │
        │  🔓 DECRYPTION (key se)
        ▼
Simple Message (Plaintext)  ←─ sahi insaan ko wapas mila
```

**Do fundamental operations:**
- **Encryption**: plaintext → ciphertext (data ko lock karna)
- **Decryption**: ciphertext → plaintext (lock kholna)

Node.js mein yeh sab kuch ek hi built-in module se milta hai:

```js
import crypto from 'crypto';  // built-in, install karne ki zaroorat nahi
```

> 💡 **Fun fact:** Node.js ka `crypto` module internally **OpenSSL** engine use karta hai — duniya ke sabse trusted cryptography libraries mein se ek.

---

## Yeh Repo Kaise Chalayein

```bash
# 1. dependencies install karo
npm install

# 2. server start karo (nodemon se auto-restart hota hai)
npm run dev

# 3. browser mein check karo
http://localhost:3000
```

Jab server start hoga, to **automatically** `keys/` folder mein do files ban jaayengi:

```
📁 keys/
   ├── private.pem   ⬅️ sirf tumhare paas (secret)
   └── public.pem    ⬅️ sabko share kar sakte ho
```

---

## Cryptography in Node.js

Node.js mein cryptography ke liye **2 major modules** hain:

1. **`crypto`** — core module. RSA, AES, Hashing, HMAC — sab kuch.
2. **`crypto/tls`** — network-level encryption (HTTPS). Yeh wahi engine hai jo Express server ke `https` mein use hota.

Higher-level libraries (jaise `jsonwebtoken` for JWT, `bcrypt` for passwords) bhi hoti hain, lekin **yeh sab internally `crypto` ke upar** bane hote hain. Isliye pehle `crypto` samjho, baaki easy ho jayega.

### Crypto module ke 3 major use-cases:

```js
import crypto from 'crypto';

// 1️⃣ HASHING — sirf one-way (wapas nahi aata)
const hash = crypto.createHash('sha256').update('secret').digest('hex');
console.log(hash); // aapke "secret" ka fingerprint

// 2️⃣ SYMMETRIC KEYS — ek hi key se encrypt + decrypt (AES)
const data = 'Namaste India 🇮🇳';
const key = crypto.randomBytes(32);   // 32 bytes = 256-bit key
const iv  = crypto.randomBytes(16);   // AES-CBC ke liye IV

const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
const enc = Buffer.concat([cipher.update(data, 'utf8'), cipher.final()]);

const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
const dec = Buffer.concat([decipher.update(enc), decipher.final()]);

console.log(dec.toString('utf8')); // wapas 'Namaste India 🇮🇳' mil gaya

// 3️⃣ ASYMMETRIC KEYS — key pair (public + private). Yehi RSA!
const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
  modulusLength: 2048,
});
```

> Chromatic note: AES ke saath `iv` ko bhi share karna padta hai kyunki decrypt karne ke liye wahi `iv` chahiye hota hai.

---

## Types of Cryptography

Cryptography **teen types** mein divide hota hai:

### 1. Symmetric Cryptography (Secret Key / AES)
- **Ek hi key** — encrypt **aur** decrypt dono ke liye.
- Example: AES (Advanced Encryption Standard), DES.
- Analogy: **same tala jismein chaabi aage-piche dono taraf lagti hai**.
- ✅ **Fast** aur strong — bade data ke liye ideal.
- ❌ Problem: key ko dono parties tak safely pahunchana hardest hai.

```js
// Pure Node.js — built-in crypto hi kaafi hai
import crypto from 'crypto';
const key = crypto.randomBytes(32); // secret shared key
// aes-256-cbc, aes-256-gcm use karo
```

### 2. Asymmetric Cryptography (Public Key)
- Do alag **keys**: ek `public` (sabko do) + ek `private` (sirf apne paas).
- Example: **RSA**.
- Analogy: **lock lagao (public key se), kholo sirf private key se**.
- ✅ Secure key exchange — koi secret share nahi karna padta.
- ❌ **Slow** compared to symmetric — isliye bade data ke liye direct use nahi.

**Mostly symmetric key ko safely exchange karne ke liye use hota hai** (hybrid).

### 3. Hashing (Data Integrity)
- **One-way** — koi key nahi, data ka fingerprint bana deta hai.
- Kisi bhi size ka data → same fixed-size hash.
- Input thoda bhi badlo → hash **bilkul badal** jaata hai (fabrication detect ho jaati hai).

```js
const h = crypto.createHash('sha256').update('Hello').digest('hex');
// "Hello" ka hash: 185f8db32271fe25f561a6fc938b2e264306ec304eda518007d1764826381969
```

> 🧠 **Golden rule:** Hashing data ko **encrypt** nahi karta — lookup **verify** karne ke liye use hota hai. Passwords store/verify karne ke liye hashing use hota hai, usess decrypt nahi karna hota.

---

## Public Key vs Private Key

| | **Public Key** | **Private Key** |
|---|---|---|
| Kiske paas | **Sabko** de sakte ho | **Sirf aapke** paas |
| 🤲 Sharing | Duniya ke saath share karo | Kabhi mat share karo |
| Kaam | **Encrypt** + **Verify signature** | **Decrypt** + **Sign** |
| Safety | Leak hojaye toh becha nahi | Chhupake rakho (critical) |
| Example | `public.pem` 📢 | `private.pem` 🤫 |

### Ek dam simple Analogy 🏠

- 🌍 **Public key** = ek **public mailbox** — duniya ka koi bhi usme chitthi daal sakta hai (encrypt).
- 🔑 **Private key** = sirf mere paas us mailbox ki chaabi — sirf main padh sakta hoon (decrypt).

Kisi ko bhi mujhe message dena hai, wo **public lock** se lock kar dega, aur chaabi **sirf mere** paas hai — isliye **sirf main** dekhte hoon. 😎

### 🪪 Digital Signature (private se sign, public se verify)
Yahan opposite hota hai:
- Main data ko **private key se sign** karta hoon.
- Koi bhi **public key se verify** kar sakta hai ki yeh **sach mein mera** message hai (aur tampered nahi hai).

```js
// SIGN (private key — sirf owner hi kar sakta hai)
const signer = crypto.createSign('sha256');
signer.update(message);
const signature = signer.sign(privateKey, 'base64');

// VERIFY (kisi ke paas bhi public key ho)
const verifier = crypto.createVerify('sha256');
verifier.update(message);
const isValid = verifier.verify(publicKey, signature, 'base64'); // true/false
```

---

## RSA — Deep Dive

**RSA** = **R**ivest-**S**hamir-**A**dleman — 3 scientists ke naam par, 1977. Yehi **pehla practical public-key crypto system** tha aur aaj bhi internet ki dher (HTTPS/TLS) isi par chalti hai.

### RSA kaise kaam karta hai (concept-level math)

1. **Do bade prime numbers** `p` aur `q` chuno (kaafi bade, hundreds of digits).
2. `n = p × q` — yeh **modulus** hai, public key ka hissa.
3. **Public key** = `(e, n)` — sabke saath share karo.
4. **Private key** = `d` — yeh `p` aur `q` se derive hota hai, secret.
5. **Encrypt:** `ciphertext = message^e mod n`
6. **Decrypt:** `plaintext = ciphertext^d mod n`

💡 **Security ka raaz:** `n` se `p` aur `q` nikalna = **factorization** karna — kaafi hard/slow. 2048-bit `n` ke liye modern machines ko practically **saalon** lag jaate. Isliye RSA secure hai — factorization hi uski strength hai.

### Node.js mein RSA

```js
import crypto from 'crypto';

// 🔐 Key pair generate — 2048-bit (industry minimum standard)
const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
  modulusLength: 2048,
  publicKeyEncoding: { type: 'pkcs1', format: 'pem' },
  privateKeyEncoding: { type: 'pkcs1', format: 'pem' },
});

// 🔒 Encrypt (public key — koi bhi kar sakta hai)
const encrypted = crypto.publicEncrypt(publicKey, Buffer.from('secret msg'));

// 🔓 Decrypt (private key — sirf owner)
const decrypted = crypto.privateDecrypt(privateKey, encrypted);
console.log(decrypted.toString()); // 'secret msg'
```

> ⚠️ **RSA sirf chhoti cheez encrypt kar sakta hai:** 2048-bit key ke saath max ~245 bytes encrypt ho sakte hain. Isliye real systems **hybrid encryption** use karte hain — RSA se symmetric key (AES) safely exchange karo, phir AES se saara bada data encrypt karo.

---

## Code Explanation (index.js)

Yeh hai repo ki **main file** — server startup par **RSA key pair generate karke `/keys` folder mein save** karti hai. Step by step:

```js
import express from 'express';
import crypto from 'crypto';     // ⭐ cryptography engine
import fs from 'fs';             // file system (keys save karne ke liye)
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
app.use(express.json());
```

**Line 1-5:** Express (web server) + crypto (encryption) + fs (files) import kar rahe hain.

```js
// ES Modules mein __dirname fix
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
```

**Line 11-12:** ES Modules (`package.json` mein `"type": "module"`) mein `__dirname` CommonJS ki tarah directly nahi milta — isliye `fileURLToPath()` se manually nikalte hain. `keys` folder ka path isi se banega.

```js
const generateAndSaveKeys = () => {
    // Step 1: RSA key pair generate karo
    const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
        modulusLength: 2048,     // 🔐 2048 bits (secure)
        publicKeyEncoding: { type: "pkcs1", format: "pem" },
        privateKeyEncoding: { type: "pkcs1", format: "pem" },
    });
```

**Step 1 — Key Generation:**
- `generateKeyPairSync()` — synchronous version hai; async version `generateKeyPair()` hai.
- `modulusLength: 2048` — key ki size in bits. **2048 modern industry minimum** hai (3072/4096 high-security).
- `type: "pkcs1"` — kya structure. Yehi workable hai `public.pem` (`-----BEGIN RSA PUBLIC KEY-----` ke saath). Production ke liye **`pkcs8` recommended** hai (niche Best Practices).
- `format: "pem"` — **PEM** = base64 encoded, human-readable (`-----BEGIN KEY-----` wala familiar format). Binary format ko `"der"` kehte hain.

```js
    // Step 2: keys folder ka path
    const keysDir = path.join(__dirname, 'keys');

    // Step 3: agar folder nahi hai, to bana do
    if (!fs.existsSync(keysDir)) {
        fs.mkdirSync(keysDir, { recursive: true });
    }

    // Step 4: keys ko files mein save karo
    fs.writeFileSync(path.join(keysDir, 'public.pem'), publicKey);
    fs.writeFileSync(path.join(keysDir, 'private.pem'), privateKey);

    console.log("✅ Keys successfully saved to the /keys folder!");
    return { publicKey, privateKey };
}

// Server start hote hi keys generate + save
const keys = generateAndSaveKeys();
```

**Line 29-42:** Folder exist karta hai ya nahi check karo, nahi toh banao, phir dono files `keys/public.pem` aur `keys/private.pem` mein save karo.

**Line 45:** **Yehi learning ke liye perfectly iska create hua issue** — jaise hi server start hota hai, **immediately** key pair generate hota hai. (Production mein keys ko **persist** karte hain — niche dekho.)

### Output
```
Keys successfully saved to the /keys folder!
Server is running on port 3000
```

### 🚨 NOTE — Danger Zone
Har server restart par **nayi keys create ho jaati hain**. Agar aapne pehle koi data **public.pem** se encrypt kiya, aur server restart hua, to **nayi private key purana data decrypt nahi kar sakti**. Production mein keys ko **disk par ek baar generate** karke reuse karna chahiye.

---

## Real-Life Use Cases

| Scenario | Kaunsa crypto use hota hai |
|---|---|
| 🔐 **HTTPS / SSL** | RSA/Elliptic-Curve key exchange + AES symmetric (TLS handshake) |
| 🛒 **E-commerce payment** | Payment info public key se encrypt → server tak safely |
| 🔑 **Passwords** | **Hash** hota hai (bcrypt/argon2) — store & compare waqt |
| 🎫 **Login tokens (JWT)** | Payload par **digital signature** (HMAC-SHA256 ya RSA) |
| 🎮 **Software licenses** | Vendor private key se sign; software public key se verify |
| 🧾 **Blockchain** | public/private key = accounts + digital signatures |
| 🗳️ **Digital signatures / UPI** | Private se sign, public se verify — proof-backed |
| 🔒 **Encrypted chats** | Hybrid: RSA share symmetric key → AES fast encrypt |

---

## Best Practices ✅

1. **Minimum 2048-bit RSA** use karo (high-security ke liye 3072/4096). **1024-bit ab insecure** hai.

2. **Keys generate karke persist karo**, har restart par nayi mat banao (production):
   ```js
   // production pattern: pehle se existing key check karo
   if (!fs.existsSync(privatePath)) {
       generateAndSaveKeys(); // sirf pehli baar
   } else {
       privateKey = fs.readFileSync(privatePath, 'utf8');
   }
   ```

3. **Private key ko NEVER code/disk/Git mein.** Production mein **Secret Manager** (AWS KMS, Azure Key Vault) ya env vars use karo. `private.pem` ko `.gitignore` mein zaroor add karo.

4. **File permissions:** private.pem ki file permission **600** (sirf owner) model me rakho.

5. **Algorithms ke selection:**
   - AES **`aes-256-gcm`** prefer karo (authenticated mode), CBC ke liye **HMAC** jarari hai.
   - **IV kabhi repeat na karo** (reset na ho).
   - hashing ke liye `sha1`/`md5` never use — **sha256/sha512** use karo.

6. **Passwords:** plain `createHash` use mat karo. Salted + slow-hash **bcrypt/argon2** use karo (`bcryptjs`, `argon2` in Node).

7. **JWT:** `HS256` (shared secret) se `RS256/ES256` (asymmetric) jyada use hota hai — public key verify, private sign.

8. **Hamesh verify karo:** jahan sign hai wahan verify mandatory hai.

9. **Apna crypto mat likho:** "roll-your-own" cryptography mat banao — yeh sabse badi galti hai. Standards + audited libraries use karo.

10. **Key rotation:** time-to-time keys rotate/expire karo, taaki compromise honege bhi impact limited rahe.

---

## Cheatsheet

```js
import crypto from 'crypto';

// 🔐 Generate RSA key pair
const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
  modulusLength: 2048,
});

// 🔒 Encrypt with public key
const ciphertext = crypto.publicEncrypt(publicKey, Buffer.from('data'));

// 🔓 Decrypt with private key
const plaintext  = crypto.privateDecrypt(privateKey, ciphertext);

// 🖊 Sign (private)
const sig = crypto.sign('sha256', Buffer.from('data'), privateKey);

// ✔️ Verify (public)
const ok  = crypto.verify('sha256', Buffer.from('data'), publicKey, sig);

// 🏗 Hash (one-way)
const h = crypto.createHash('sha256').update('data').digest('hex');

// 🔑 Random secure bytes (keys/nonce)
crypto.randomBytes(32);
```

---

## 🎉 Summary

- **Encryption** = data ki "tala-chaabi". Sirf sahi key baal sahi insaan ko message.
- **Symmetric (AES)** = ek key, **fast**, bada data.
- **Asymmetric (RSA)** = public/private pair, **slow** but secure sharing.
- **Hashing** = one-way fingerprint, integrity verify karna.
- **Real life** mein hybrid hota hai — RSA symmetric key exchange, phir AES fast data.
- Node.js **built-in `crypto`** hi kaafi hai standards ke liye — koi heavy dependency nahi chahiye.

> *"Encryption matlab — jaise lock sabke liye ho, waise chaabi sirf hamari."* 🔐

--- 

Made with ❤️ by **Neeraj** — for learning & fun. 🚀