//class

class Chai {
    flavour: string;
    // price: number;

    // constructor(flavour: string, price: number) {
    //     this.flavour = flavour
    //     this.price = price 
    // }
    constructor(flavour: string) {
        this.flavour = flavour
        console.log(this)
    }
}

// const masalaChai = new Chai("Ginger",  20)
// masalaChai.flavour = "Masala"
// masalaChai.price = 20


class ChaiNew {
    public flavour: string = "Masala"
    private secretIng = "Cardmon"
    
    reveal(){
        return this.secretIng 
    }
}

class shopName {
    protected shopName = "Chai Corner"
}

class Branch extends shopName {
    getName(){
        return this.shopName
    }
}

new Branch().getName


class Wallet {
    #balance = 100
    getBalance(){
        return this.#balance
    }
}

const w = new Wallet()


// class Cup{
//     readonly capacity: number = 20
//     constructor(capacity: number){
//         this.capacity = capacity
//     }
// }


class ModernChai {
    private _sugar = 2

    get sugar(){
        return this._sugar
    }

    set sugar(value:number){
        if(value > 5) {
            throw new Error("Too Much Sugar");
            this._sugar = value
        }
    }
}

const c = new ModernChai()
c.sugar = 3

class EkChai {
    static shopName = "Chaicode Cafe"
    constructor (public flavour: string){

    }
}

console.log(EkChai.shopName)

abstract class Drink {
    abstract make(): void
}

class MyChai extends Drink {
    make(){
        console.log("Brewing Chai")
    }
}

class Heater {
    heat(){}
}

class ChaiMaker {
    constructor(private heater: Heater){}

    make(){
        this.heater.heat
    }
}