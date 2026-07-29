//?Example-1

// console.log(global)

//?Example-2
// setTimeout(()=>{
//     console.log("Hello From Global");
// },2000)

//?Example-3
let count = 0;

const interval = setInterval(() => {
    console.log(`Interval Count: ${++count}`)
    if(count === 4){
        clearInterval(interval)
    }
}, 1000);

//__dirname, __filename, exports, module, and require() - these are coming from module function executor and these all are available in commonJS not moduleJS