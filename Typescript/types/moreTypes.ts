// type assertion
let response: any = "22";
let numericLength:number = (response as string).length

type Book = {
    name: string
}

let bookString = '{"name": "who move my cheese"}';

let bookObj = JSON.parse(bookString) as Book

console.log(bookObj.name);

// const inputElem = document.getElementById("username") as HTMLInputElement


// diff b/w any and unknown
let value:any;
value = 'chai';
value = 22;
value = [2,3,5];
value.toUpperCase();

let newValue:unknown;
newValue = 'chai';
newValue = 22;
newValue = [2,3,5];
if(typeof newValue === 'string'){
    newValue.toUpperCase();
}

// try catch 

try {
    
} catch (error) {
    if(error instanceof Error) console.log(error.message)
        console.log("Error:", error)
}

const data:unknown = 'chai aur code'
const strData:string = data as string

// never

type Role = "admin" | "user" | "superadmin";

function redirectBasedRole(role:Role):void {
    if(role === "admin") {
        console.log('redirecting to admin dashboard'); 
        return
    }
    role;
}

function neverReturn():never {
    while(true){}
}