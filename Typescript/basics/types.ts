// string

let name:string = "Neeraj";

// number
let age:number = 25;
let price:number = 9.99;

// boolean

let isAdmin:boolean = true

// array
let fruits:string[] = ["mango", "apple", "banana"]

//object

let user: {
    name:string;
    age:number;
} = {
    name: "Paras",
    age: 20
}

//this is invalid bcz age take num not str
// let user: {
//     name: string;
//     age: number;
// } = {
//     name: "Neeraj",
//     age: "25"
// };


//unions - a var have more than one possible type
let id: string | number
id= 1010;
id = "user-1"

// but this is not allowed
// id = true

// function 
function add(a:number, b:number): number {
    return a + b;
}

console.log(add(2,3));

function greet(name:string):string {
    return `Hello ${name}`
}

console.log(greet("Neeraj"));

// void mean nothing
function printMessage(message:string):void {
    console.log(message)
}

printMessage("Hello TS")

// optional params
function greetUser(name: string, age?: number): string {
    if (age) {
        return `Hello ${name}, you are ${age} years old`;
    }

    return `Hello ${name}`;
}
//both works
greetUser("Neeraj");
greetUser("Neeraj", 25);

//arrays sorting
let names: string[] = [
    "Neeraj",
    "Ali",
    "Ahmed"
];

names.push("ADI");
// names.push(111) - invalid bcz its number

