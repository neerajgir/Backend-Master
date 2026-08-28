// union
let sub: number | string = "1M"
console.log(sub)

//example
let apiRequestStatus: 'pending' | 'success' | 'error' = 'pending';
apiRequestStatus = 'success'
console.log(apiRequestStatus);


//any 
let orders = ['1', '3', '5']
// let currentOrder:any; - avoid any
let currentOrder:string | undefined;

for (const order of orders) {
    if (order === "5") {
        currentOrder = order
    }
}

console.log(currentOrder);

