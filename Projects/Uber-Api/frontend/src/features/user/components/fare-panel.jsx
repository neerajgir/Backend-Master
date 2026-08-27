import { BikeIcon, CarFrontIcon, CarTaxiFrontIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

const vehicleOptions = [
  { type: 'auto', label: 'Auto', icon: CarTaxiFrontIcon, description: 'Quick and affordable' },
  { type: 'car', label: 'Car', icon: CarFrontIcon, description: 'Comfortable rides' },
  { type: 'moto', label: 'Moto', icon: BikeIcon, description: 'Fastest through traffic' },
]

const FarePanel = ({ fares, selected, onSelect }) => {
  return (
    <div className='flex flex-col gap-2'>
      {vehicleOptions.map((option) => {
        const fare = fares?.[option.type]
        const isActive = selected === option.type
        return (
          <button
            key={option.type}
            type='button'
            onClick={() => onSelect(option.type)}
            className={cn(
              'flex w-full items-center gap-3 rounded-xl border p-3 text-left transition-colors',
              isActive ? 'border-foreground bg-muted' : 'border-border hover:bg-muted/60'
            )}
          >
            <option.icon className='size-8 shrink-0' />
            <span className='flex min-w-0 flex-1 flex-col'>
              <span className='text-sm font-semibold'>{option.label}</span>
              <span className='truncate text-xs text-muted-foreground'>{option.description}</span>
            </span>
            <span className='text-sm font-semibold'>₹{fare ?? '—'}</span>
          </button>
        )
      })}
    </div>
  )
}

export default FarePanel
