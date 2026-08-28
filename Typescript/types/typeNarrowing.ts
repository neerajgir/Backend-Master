// type narrowing

function getChai(kind:string | number){
    if(typeof kind === "string") return `Making ${kind} chai...`
    return `Chai order: ${kind}`
}

// truthiness
function serveChai(msg?: string){
    if(msg) return `Serving ${msg}`
    return `Serving default masala chai.`
}

//exhaustive check
function orderCoffee(size: 'small' | 'medium' | 'large' | number){
    if(size === 'small') return `small coffee`
    if(size === 'medium' || size === 'large') return `make extra coffee`
    return `coffee order: ${size}`
}

class KulhadChai{
    serve(){
        return `Serving Kulhad Chai`
    }
}
class CuttingChai{
    serve(){
        return `Serving cutting Chai`
    }
}

function serve(chai: KulhadChai | CuttingChai){
    if(chai instanceof KulhadChai) return chai.serve();
}

//custom types
type ChaiOrder = {
    type: string,
    sugar: number
}

function isChaiOrder(obj:any):obj is ChaiOrder{
    return typeof obj === 'object' && obj !== null && typeof obj.type ==='string' && typeof obj.sugar === 'number'
}

function serveOrder(item:ChaiOrder | string){
    if(isChaiOrder(item)) return `Serving ${item.type} chai with ${item.sugar} sugar`
    return `Serving custom chai ${item}`
}


type MasaalaChai = {type: "masala"; spiceLevel: number};
type GingerChai = {type: "ginger"; amount: number};
type ElaichiChai = {type: "elaichi"; aroma: number};

type Chai = MasaalaChai | GingerChai | ElaichiChai

function makeChai(order: Chai){
    switch (order.type) {
        case "elaichi":
            return `Elaichi Chai`
            break;
        case "ginger":
            return `Ginger Chai`
        case "masala":
            return `Masala Chai`
            break;
    }
}

function brew(order: MasaalaChai | GingerChai) {
    if("spiceLevel" in order) return `MasalaChai`
}

// function isStringArray(arr: unknown): arr is string[]{

// }