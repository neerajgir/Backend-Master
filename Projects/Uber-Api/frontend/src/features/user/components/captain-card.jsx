import { StarIcon } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'

const CaptainCard = ({ captain }) => {
  const firstname = captain?.fullname?.firstname || 'Captain'
  const lastname = captain?.fullname?.lastname || ''
  const vehicles = captain?.vehicles || {}

  return (
    <div className='flex items-center gap-3 rounded-xl border p-3'>
      <Avatar className='size-12'>
        <AvatarFallback className='text-base font-semibold'>
          {firstname.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div className='flex min-w-0 flex-1 flex-col'>
        <p className='truncate text-sm font-semibold'>
          {firstname} {lastname}
        </p>
        <p className='flex items-center gap-1 text-xs text-muted-foreground'>
          <StarIcon className='size-3 fill-foreground text-foreground' />
          4.9 rating
        </p>
      </div>
      <div className='flex flex-col items-end gap-1'>
        <Badge variant='secondary' className='uppercase'>{vehicles.vehicleType}</Badge>
        <p className='text-xs font-medium text-muted-foreground'>
          {vehicles.color} · {vehicles.plate}
        </p>
      </div>
    </div>
  )
}

export default CaptainCard
