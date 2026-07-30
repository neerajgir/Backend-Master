const path = require("path")


console.log("Filename:", __filename)
console.log("Dirname:", __dirname)

//* folders/students/data.txt

const filepath = path.join("folder", "students", "data.txt");

console.log(filepath)

const parsedDataPath = path.parse(filepath)
const resolvePath = path.resolve(filepath)
const extname = path.extname(filepath)
const basename = path.basename(filepath)
const dirname = path.dirname(filepath)

console.log({
    resolvePath,
    extname,
    basename,
    dirname,
    parsedDataPath
})