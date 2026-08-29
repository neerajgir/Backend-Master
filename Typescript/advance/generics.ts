// generics

function wrapInArr<T>(item:T):T[] {
    return [item]
}

wrapInArr("Masala")
wrapInArr(33)
wrapInArr({flavour: "Ginger"})

function pair<A,B>(a: A, b: B):[A,B] {
    return [a,b]
}

pair("masala", 20)
pair("masala", {flavour: "Ginger"})

//generic interface

interface Box<T>{
    content: T
}

const numBox:Box<number> = {content: 10}
const numBoxCup:Box<string> = {content: "10"}


// generics real world case

interface ApiPromise<T> {
    status: number;
    data: T
}

const res: ApiPromise<{flavour: string}> = {
    status: 200,
    data: {flavour: "masala"}
}