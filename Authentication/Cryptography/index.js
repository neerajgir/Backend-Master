import express from 'express';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
app.use(express.json());

// Set up __dirname equivalent for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const generateAndSaveKeys = () => {
    // 1. Generate the RSA key pairs
    const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
        modulusLength: 2048, 
        publicKeyEncoding: {
            type: "pkcs1",
            format: "pem"
        },
        privateKeyEncoding: {
            type: "pkcs1",
            format: "pem"
        }
    });

    // 2. Define the keys folder path
    const keysDir = path.join(__dirname, 'keys');

    // 3. Create the 'keys' directory if it does not exist
    if (!fs.existsSync(keysDir)) {
        fs.mkdirSync(keysDir, { recursive: true });
    }

    // 4. Save files synchronously into the keys folder
    fs.writeFileSync(path.join(keysDir, 'public.pem'), publicKey);
    fs.writeFileSync(path.join(keysDir, 'private.pem'), privateKey);

    console.log(" Keys successfully saved to the /keys folder!");
    return { publicKey, privateKey };
}

// Generate and save keys on server startup
const keys = generateAndSaveKeys();

app.get("/", (req, res) => {
    res.send("Hello World");
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
