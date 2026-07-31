# Day 4 — Streams in Node.js

---

## Intro

Day 4 **Streams** pe focus karta hai — data ko **chunks (tukdon)** mein process karna instead of poori file ek saath memory mein load karna.

Jab file 1GB ki ho aur RAM 512MB — tab streams bachate hain. Video streaming, file download, log processing — sab streams pe based hai.

---

## Explanation

### 1. Readable & Writable Streams (`stream.js`)

Streams chaar types ki hoti hain:
- **Readable** — data padhna (source)
- **Writable** — data likhna (destination)
- **Duplex** — dono (e.g. TCP socket)
- **Transform** — beech mein modify karna

```javascript
const { Readable, Writable } = require("stream");

const readableStream = new Readable({
    highWaterMark: 6,  // Internal buffer size (bytes)
    read() {}          // _read implementation (optional for push-based)
});

const writableStream = new Writable({
    write(streamData) {
        console.log("Writing:", streamData.toString());
    }
});

readableStream.on("data", (chunk) => {
    console.log("chunk:", chunk.toString());
    writableStream.write(chunk);
});

readableStream.push("Hello");
```

**`highWaterMark`** — kitna data buffer mein rakha jaye before pausing. Chhota = kam memory, zyada backpressure control.

---

### 2. File Streams — Bad vs Good Way (`index.js`)

#### ❌ Bad Way — Poori file memory mein
```javascript
const file = fs.readFileSync("text.txt");  // 1GB file = 1GB RAM!
fs.writeFileSync("output.txt", file);
res.end();
```

#### ✅ Good Way — Stream se chunk-by-chunk
```javascript
const readStream = fs.createReadStream("text.txt");
const writeStream = fs.createWriteStream("output.txt");

readStream.pipe(writeStream);  // Automatic piping — memory efficient
```

**HTTP pe file download:**
```javascript
const readableStreams = fs.createReadStream("text.txt");
readableStreams.pipe(res);  // User ko file stream hoke milti hai
```

---

### 3. Transform Stream — Data Modify Karte Hue

Beech mein data change karna — uppercase, replace words, compress, encrypt:

```javascript
const { Transform, pipeline } = require("stream");

const readStream = fs.createReadStream("text.txt");
const writeStream = fs.createWriteStream("output.txt");

const transformStream = new Transform({
    transform(chunk, encoding, callback) {
        const modifyWord = chunk
            .toString()
            .toUpperCase()
            .replaceAll(/ipsum/gi, "Neeraj");
        callback(null, modifyWord);  // null = no error, modified data pass karo
    }
});

// Good way — pipe chain
readStream.pipe(transformStream).pipe(writeStream);

// Best way — error handling ke saath
pipeline(readStream, transformStream, writeStream, (err) => {
    if (err) console.log(err);
});
```

**`pipeline()` vs manual `pipe()`:**  
`pipeline` automatically errors handle karta hai aur streams cleanup karta hai — production mein prefer karo.

---

### Stream Flow Diagram

```
[File/text.txt] → ReadStream → TransformStream → WriteStream → [output.txt]
                      ↓              ↓
                   chunk 1      UPPERCASE + replace
                   chunk 2      ...
                   chunk n
```

Memory mein ek time pe sirf **ek chunk** hota hai — poori file nahi!

---

## Real-Life Usage

| Use Case | Stream Type |
|----------|-------------|
| Video/audio streaming (YouTube, Spotify) | Readable → HTTP response |
| Large CSV/JSON processing | ReadStream + Transform |
| File upload (multipart) | Writable stream |
| Gzip compression | Transform (zlib) |
| Log tailing (`tail -f`) | Readable continuous |
| Database dump export | ReadStream → WriteStream |

**Example 1:** Netflix — video file poori download nahi hoti; chunks stream hoke player mein chalti hain.

**Example 2:** 10 million rows ka CSV — `readFileSync` se server crash; `createReadStream` + line-by-line parser se safely process.

**Example 3:** Image resize on upload — `Transform` stream mein sharp/jimp se resize karke S3 pe pipe karna.

---

## Files Is Folder Mein

| File | Kaam |
|------|------|
| `stream.js` | Custom Readable/Writable streams |
| `index.js` | File streams, Transform, pipe, pipeline |
| `text.txt` | Source file (transform ke liye) |
| `output.txt` | Transformed output (auto-generated) |

---

## Run Kaise Karein

```bash
node stream.js     # Basic stream demo
npm start          # HTTP server on port 8080 (index.js)
```

`index.js` mein kuch code commented hai — ek ek uncomment karke try karo!

---

## Summary

- **Streams** data ko chunks mein process karti hain — memory efficient
- **`readFileSync`** chhoti files ke liye OK; **badi files ke liye streams mandatory**
- **`pipe()`** ReadStream ko WriteStream se connect karta hai
- **`Transform`** beech mein data modify karta hai — filter, map, encrypt
- **`pipeline()`** error-safe version hai — leaks aur crashes kam
- Node.js ki HTTP request/response bhi streams hain — isliye `req.pipe()` / `res` pe pipe kaam karta hai
- Day 4 ke baad tum samajh gaye: **scalable file handling = streams**

**Agla step (Day 5):** Crypto module (hashing, security) aur OS module (system monitoring)! 🔐
