// interface

interface Chai {
    flavour: string;
    price: number;
    milk?: boolean
}

const masalaChai:Chai = {
    flavour: "Masala",
    price: 20
}

interface Shop {
    readonly id: number;
    name: string
}

const s:Shop = {
    id:1,
    name: "chaiCafe"
}

interface DiscountCalculator {
    (price:number):number
}

const apply50: DiscountCalculator = (p) => p * 0.5;

interface TeaMachine {
    start(): void;
    stop(): void;
}

const machine:TeaMachine = {
    start(){
        console.log("Start")
    },
    stop(){
        console.log("Stop")
    }
}

interface ChaiRating {
    [flavour:string]: number
}

const rating:ChaiRating = {
    masala: 4.5,
    ginger: 3.3
}

// merging interface
interface User {
    name: string
}
interface User {
    age:number
}

const u:User = {
    name: 'Chai',
    age: 22
}

interface A {a:string}
interface B {b:string}

interface c extends A,B {}

