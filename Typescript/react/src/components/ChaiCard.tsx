interface ChaiCardProp {
    name: string;
    price: number;
    isSpecial?: boolean;
}

const ChaiCard = ({name, price, isSpecial = false}:ChaiCardProp) => {
  return (
    <div>
        <h2>
            {name} {isSpecial && <span>⭐</span>}
        </h2>
        <p>{price}</p>
    </div>
  )
}

export default ChaiCard