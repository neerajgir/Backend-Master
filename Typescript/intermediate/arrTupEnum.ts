//array
const chaiFlavours:string[] = ["Masala", "Ginger"]
const chaiPrices:number[] = [20, 40]
const rating: Array<number> = [4.4, 5.0]

type Chai = {
    name: string;
    price: number;
}

const menu:Chai[] = [
    {name: "Masala", price:20},
    {name: "Ginger", price: 30}
]

//readonly array - not modified

const cities:readonly string[] = ["delhi", "karachi" , "mumbai", "lahore"]


const table:number [] [] = [
    [1,2,3],
    [4,5,6]
]

//tuples
let chaiTuple:[string, number];
chaiTuple = ["masala", 20]
// chaiTuple = [20, "Ginger"] not allowed

let userInfo: [string, number, boolean?]
userInfo = ["neeraj", 100]
userInfo = ["neeraj", 100, true]

//not changeable
const location: readonly [number, number] = [22.44, 33.44]

//named tuple
const chaiItems: [name:string, price:number] = ["masala", 26]

//enums

enum CupsSize {
    SMALL,
    MEDIUM,
    LARGE
}

const size = CupsSize.MEDIUM

enum Status {
    PENDING = 200,
    SERVED,
    CANCELLED
}

enum ChaiType {
    MASALA = "Masala",
    GINGER = "Ginger"
}

function makeChia(type:ChaiType) {
    console.log(`Making: ${type}`);
}

makeChia(ChaiType.GINGER)