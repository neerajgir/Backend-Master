const path = require("path")


console.log("Filename:", __filename)
console.log("Dirname:", __dirname)

//* folders/students/data.txt

const filepath = path.join("folder", "students", "data.txt");

console.log(filepath)