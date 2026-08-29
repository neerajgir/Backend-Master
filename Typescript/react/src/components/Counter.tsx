import {useState} from 'react';

const Counter = () => {
    const [count,setCount] = useState<number>(0)
  return (
    <div>Counter
        <p>Cups Order: {count}</p>
        <button onClick={()=>setCount((c)=>c+1)}>Order one more</button>
    </div>
  )
}

export default Counter