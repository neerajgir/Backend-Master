import { MapPinIcon, RouteIcon, TimerIcon } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'

const RideRequestCard = ({ ride, onAccept, onDecline, loading }) => {
  const riderName = ride?.user?.fullname?.firstname || 'Rider'

  return (
    <div className='flex flex-col gap-4'>
      <div className='flex items-center gap-3'>
        <Avatar className='size-11'>
          <AvatarFallback className='font-semibold'>
            {riderName.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className='min-w-0 flex-1'>
          <p className='truncate text-sm font-semibold'>{riderName}</p>
          <p className='text-xs text-muted-foreground'>New ride request</p>
        </div>
        <p className='text-xl font-bold'>₹{ride.fare}</p>
      </div>

      <div className='flex flex-col gap-2 rounded-xl border border-white/10 bg-white/5 p-3 text-sm'>
        <p className='flex items-start gap-2'>
          <MapPinIcon className='mt-0.5 size-4 shrink-0 text-muted-foreground' />
          <span className='line-clamp-2'>{ride.pickup}</span>
        </p>
        <p className='flex items-start gap-2'>
          <MapPinIcon className='mt-0.5 size-4 shrink-0 text-muted-foreground' />
          <span className='line-clamp-2'>{ride.destination}</span>
        </p>
        <div className='flex items-center gap-4 text-xs text-muted-foreground'>
          {ride.distance && (
            <span className='flex items-center gap-1'>
              <RouteIcon className='size-3.5' />
              {ride.distance} km
            </span>
          )}
          {ride.duration && (
            <span className='flex items-center gap-1'>
              <TimerIcon className='size-3.5' />
              {ride.duration} min
            </span>
          )}
          <span className='uppercase'>{ride.vehicleType}</span>
        </div>
      </div>

      <div className='grid grid-cols-2 gap-2'>
        <Button variant='outline' onClick={onDecline} disabled={loading} className='h-11 rounded-full'>
          Decline
        </Button>
        <Button onClick={onAccept} disabled={loading} className='h-11 rounded-full font-semibold'>
          {loading ? (
            <>
              <Spinner data-icon='inline-start' />
              Accepting...
            </>
          ) : (
            'Accept ride'
          )}
        </Button>
      </div>
    </div>
  )
}

export default RideRequestCard
