function makeChai(type:string, cups: number){
    console.log(`Making ${cups} cups of ${type}`)
}

makeChai("Masala Chai", 2)

function getChaiPrice():number {
    return 25
}

function makeOrder(order:string) {
    if(!order) return null
    return order
}

function logChai():void {
    console.log("Chai is Ready")
}

function orderChai(type?: string) {
    
}

function createChai(order: {type: string; sugar: number; size: "small" | "large"}):number {
    return 4
}