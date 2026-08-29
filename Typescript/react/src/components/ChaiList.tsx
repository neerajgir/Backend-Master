import type {Chai} from '../types.ts';
import ChaiCard from './ChaiCard.tsx';

interface ChaiListProps {
    items: Chai[]
}
const ChaiList = ({items}:ChaiListProps) => {
  return (
    <div>ChaiList
        {items.map((chai)=>(
            <ChaiCard key={chai.id} name={chai.name} price={chai.price} isSpecial={chai.price > 30}/>
        ))}
    </div>
  )
}

export default ChaiList