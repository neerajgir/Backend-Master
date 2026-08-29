import "./App.css"
import Card from "./components/Card.tsx";
import ChaiCard from "./components/ChaiCard.tsx";
import ChaiList from "./components/ChaiList.tsx";
import Counter from "./components/Counter.tsx";
import OrderForm from "./components/OrderForm.tsx";
import type {Chai} from './types.ts'
const App = () => {
  const menu:Chai[] = [{id:1 , name: "Masala", price: 25}, {id:1 , name: "Ginger", price: 50}]
  return (
    <>
    <div>
      <h1>Vite + React</h1>
      <ChaiCard name= "Headphone" price={5000}/>
      <ChaiCard name= "Iphone" price={60000}/>
    </div>
    <div>
      <Counter />
    </div>
    <div>
      <ChaiList items={menu}/>
    </div>

    <div>
      <OrderForm onSubmit={(order)=>{
        console.log("Placed:", order.name, order.cups)
      }}/>
    </div>

    <div>
      <Card title="Chai" footer={<button>Order Now</button>}/>
    </div>
    </>
  )
}

export default App