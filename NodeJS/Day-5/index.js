const crypto = require("crypto");

//random bytes
const randomValues = crypto.randomBytes(100)

console.log(randomValues.toString("hex"));

//create hash

const hashValue = crypto.createHash("sha256").update("Neeraj").digest("hex");

const inputValue = "Neeraj";
const matchValue = crypto.createHash("sha256").update(inputValue).digest("hex");
console.log(hashValue === matchValue);
