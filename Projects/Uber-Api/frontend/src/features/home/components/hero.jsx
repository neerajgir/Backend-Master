import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  BikeIcon,
  CalendarClockIcon,
  CarFrontIcon,
  CircleIcon,
  PackageIcon,
  SquareIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/features/auth/store/auth-store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import RideMap from './ride-map'

const rideTypes = [
  { id: 'ride', label: 'Ride', icon: CarFrontIcon },
  { id: 'bike', label: 'Bike', icon: BikeIcon },
  { id: 'parcel', label: 'Parcel', icon: PackageIcon },
  { id: 'reserve', label: 'Reserve', icon: CalendarClockIcon },
]

const Hero = () => {
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const [activeRide, setActiveRide] = useState('ride')
  const [pickup, setPickup] = useState('')
  const [destination, setDestination] = useState('')
  const [date, setDate] = useState('today')
  const [time, setTime] = useState('now')

  const seePrices = () => {
    if (!user) {
      navigate('/login')
      return
    }
    const params = new URLSearchParams()
    if (pickup.trim()) params.set('pickup', pickup.trim())
    if (destination.trim()) params.set('destination', destination.trim())
    navigate(`/riding${params.toString() ? `?${params.toString()}` : ''}`)
  }

  return (
    <section className='flex flex-col lg:flex-row items-center gap-8 lg:gap-12 px-4 py-10 sm:px-6 sm:py-14 lg:px-16 min-h-[calc(100vh-4rem)]'>
      <div className='flex flex-col justify-center items-center w-full max-w-lg'>
        <h1 className='text-3xl md:text-5xl font-bold tracking-tight mb-4'>
          Go anywhere with Uber
        </h1>

        <div className='flex flex-wrap items-center justify-center gap-1 mb-6'>
          {rideTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => setActiveRide(type.id)}
              className={cn(
                'flex flex-col items-center gap-1 px-3 py-2 rounded-lg text-xs font-medium text-muted-foreground transition-colors hover:bg-muted',
                activeRide === type.id && 'bg-muted text-foreground'
              )}
            >
              <type.icon className='size-6' />
              {type.label}
            </button>
          ))}
        </div>

        <div className='w-full max-w-lg rounded-xl border bg-card p-5 shadow-sm'>
          <div className='relative flex flex-col gap-2'>
            <div className='absolute left-[1.15rem] top-1/2 -translate-y-1/2 flex flex-col items-center gap-3 pointer-events-none'>
              <SquareIcon className='size-2.5 fill-foreground text-foreground' />
              <span className='h-6 border-l border-dashed border-border' />
              <CircleIcon className='size-2.5 text-foreground' />
            </div>
            <Input
              placeholder='Pickup location'
              value={pickup}
              onChange={(e) => setPickup(e.target.value)}
              className='h-12 pl-10'
            />
            <Input
              placeholder='Dropoff location'
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className='h-12 pl-10'
            />
          </div>

          <div className='mt-3 grid grid-cols-2 gap-2'>
            <Select value={date} onValueChange={setDate}>
              <SelectTrigger className='w-full h-11'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='today'>Today</SelectItem>
                <SelectItem value='tomorrow'>Tomorrow</SelectItem>
                <SelectItem value='schedule'>Schedule</SelectItem>
              </SelectContent>
            </Select>
            <Select value={time} onValueChange={setTime}>
              <SelectTrigger className='w-full h-11'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='now'>Now</SelectItem>
                <SelectItem value='morning'>Morning</SelectItem>
                <SelectItem value='evening'>Evening</SelectItem>
                <SelectItem value='night'>Night</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button size='lg' onClick={seePrices} className='mt-4 w-full h-11 rounded-full font-semibold'>
            See prices
          </Button>
        </div>
      </div>

      <div className='w-full h-75 sm:h-100 lg:flex-1 lg:h-125 rounded-xl overflow-hidden'>
        <RideMap />
      </div>
    </section>
  )
}

export default Hero
