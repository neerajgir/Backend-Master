//interface
type chaiOrder = {
    type: string; 
    sugar:number; 
    strong:boolean
}

function makeChai(order: chaiOrder){
    console.log(order)
}

function serverChai(order:chaiOrder) {
    console.log(order)
}

type teaRecipe = {
    water: number;
    milk: number;
}

class MasalaChai implements teaRecipe {
    water = 100;
    milk = 50
}

interface CupSize { 
    size : 'small' | 'large'
}

class Chai implements CupSize {
    size: 'small' | 'large' = 'large' 
}

// intersection
type BaseChai = {teaLeaves: number}
type Extra = {masala: number}

type MasalaChais = BaseChai & Extra

const cup: MasalaChais = {
    teaLeaves: 2,
    masala: 1
}

type User = {
    username: string;
    bio?: string
}

const u1: User = {username: "Neeraj"}
const u2: User = {username: "Neeraj G", bio: "Dev"}

// readonly

type Config = {
    readonly appName: string
    version: number
}

const config:Config = {
    appName: "Google",
    version: 1
}

// config.appName = ''

// type literals
type TeaType = 'masala' | 'ginger' | 'lemon'
function orderChais(t: TeaType){
    console.log(t)
}