const chai = {
    name: "Masala Chai",
    price: 20,
    isHot: true
}

let tea: {
    name: string,
    price: number,
    isHot: boolean
}

tea = {
    name: "Elaichi Tea",
    price: 25,
    isHot: true
}

// alias obj

type Tea = {
    name: string,
    price: number,
    ingredients: string[]
}

const adrakTea:Tea = {
    name: "Adrak Chai",
    price: 30,
    ingredients: ["ginger", "tea leaves"]
}

// duck typing
type Cup = {size: string}
let smallCup:Cup = {size: "200ml"}

let bigCup = {size: "500ml", material: "steel"};

smallCup = bigCup

// datatype splitout
type Item = {name:string, quantity:number}
type Address = {street:string, pin:number}

type Order = {id:string, items: Item[], address:Address}

type Chai = {
    name: string;
    price: number;
    isHot: boolean;
}

const updateChai = (updates: Partial<Chai>) =>{
    console.log("updating chai with", updates)
}

updateChai({price: 25})

type ChaiOrder = {
    name?: string;
    quantity?:number;
}

const placeOrder = (order: Required<ChaiOrder>) =>{
    console.log(order)
}

placeOrder({name: "Masala Chai", quantity: 2})

type Coffee = {
    name:string;
    price: number;
    isHot: boolean;
    ingredients:string[]
}

type BasicCoffeeInfo = Pick<Coffee, "name" | "price">;

const CoffeeInfo:BasicCoffeeInfo = {
    name: "black coffee",
    price: 60
}

type NewCoffee = {
    name:string;
    price: number;
    isHot: boolean;
    secretIngredients:string[]
}

type PublicCoffee = Omit<NewCoffee, "secretIngredients">;

const NewCoffee1:PublicCoffee = {
    name: "Cappuccino",
    price: 100,
    isHot: false
}