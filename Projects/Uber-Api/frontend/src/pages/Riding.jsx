import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { CircleIcon, LogOutIcon, MapPinIcon, SquareIcon } from 'lucide-react'
import api from '@/lib/api'
import { connectSocket, disconnectSocket } from '@/lib/socket'
import { useAuthStore } from '@/features/auth/store/auth-store'
import { toast } from '@/components/ui/toast'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { Separator } from '@/components/ui/separator'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import RideMap from '@/features/home/components/ride-map'
import LocationField from '@/features/user/components/location-field'
import FarePanel from '@/features/user/components/fare-panel'
import CaptainCard from '@/features/user/components/captain-card'

const resolveCoords = async (loc) => {
  if (loc.coords) return loc.coords
  const { data } = await api.get('/maps/get-coordinates', { params: { address: loc.text } })
  return [data.lat, data.lng]
}

const Riding = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const user = useAuthStore((s) => s.user)
  const clearAuth = useAuthStore((s) => s.clearAuth)

  const [panel, setPanel] = useState('search')
  const [pickup, setPickup] = useState({ text: searchParams.get('pickup') || '', coords: null })
  const [destination, setDestination] = useState({ text: searchParams.get('destination') || '', coords: null })
  const [fares, setFares] = useState(null)
  const [tripInfo, setTripInfo] = useState(null)
  const [vehicleType, setVehicleType] = useState('car')
  const [ride, setRide] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const socket = connectSocket()
    socket.emit('join', { userId: user._id, userType: 'user' })

    const onRideAccepted = (data) => {
      setRide(data)
      setPanel('accepted')
      toast.add({
        title: 'Captain found',
        description: `${data.captain?.fullname?.firstname} is on the way to pick you up.`,
        type: 'success',
      })
    }
    const onRideStarted = (data) => {
      setRide(data)
      setPanel('ongoing')
      toast.add({ title: 'Ride started', description: 'Enjoy your trip!', type: 'info' })
    }
    const onRideEnded = (data) => {
      setRide(data)
      setPanel('completed')
      toast.add({
        title: 'Trip completed',
        description: `Total fare: ₹${data.fare}`,
        type: 'success',
      })
    }

    socket.on('rideAccepted', onRideAccepted)
    socket.on('rideStarted', onRideStarted)
    socket.on('rideEnded', onRideEnded)

    return () => {
      socket.off('rideAccepted', onRideAccepted)
      socket.off('rideStarted', onRideStarted)
      socket.off('rideEnded', onRideEnded)
    }
  }, [user])

  const findTrips = async () => {
    setError('')
    setLoading(true)
    try {
      const [pickupCoords, destinationCoords] = await Promise.all([
        resolveCoords(pickup),
        resolveCoords(destination),
      ])
      setPickup((prev) => ({ ...prev, coords: pickupCoords }))
      setDestination((prev) => ({ ...prev, coords: destinationCoords }))

      const [fareRes, distanceRes] = await Promise.all([
        api.post('/rides/get-fare', { pickup: pickup.text, destination: destination.text }),
        api.get('/maps/get-distance-time', {
          params: { origin: pickup.text, destination: destination.text },
        }),
      ])
      setFares(fareRes.data)
      setTripInfo(distanceRes.data)
      setPanel('fares')
    } catch (err) {
      setError(
        err.response?.data?.error ||
          err.response?.data?.message ||
          'Could not find this route. Try different addresses.'
      )
    } finally {
      setLoading(false)
    }
  }

  const confirmRide = async () => {
    setError('')
    setLoading(true)
    try {
      const { data } = await api.post('/rides/create', {
        pickup: pickup.text,
        destination: destination.text,
        vehicleType,
      })
      setRide(data)
      setPanel('waiting')
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || 'Could not create ride.')
      setPanel('fares')
    } finally {
      setLoading(false)
    }
  }

  const resetFlow = () => {
    setPanel('search')
    setPickup({ text: '', coords: null })
    setDestination({ text: '', coords: null })
    setFares(null)
    setTripInfo(null)
    setRide(null)
    setError('')
  }

  const logout = async () => {
    try {
      await api.get('/users/logout')
    } catch {
      // ignore logout errors
    }
    clearAuth()
    disconnectSocket()
    navigate('/')
  }

  return (
    <div className='relative h-screen w-full overflow-hidden bg-background'>
      <RideMap pickup={pickup.coords} destination={destination.coords} />

      <header className='absolute inset-x-0 top-0 z-20 flex h-16 items-center justify-between bg-black px-6'>
        <Link to='/' className='text-2xl font-bold tracking-tight text-white'>
          Uber
        </Link>
        <div className='flex items-center gap-3'>
          <p className='hidden text-sm text-gray-300 sm:block'>
            Hi, {user?.fullname?.firstname}
          </p>
          <Button
            variant='ghost'
            onClick={logout}
            className='text-gray-300 hover:bg-white/10 hover:text-white'
          >
            <LogOutIcon data-icon='inline-start' />
            Logout
          </Button>
        </div>
      </header>

      <div className='absolute left-4 top-20 z-10 w-[calc(100%-2rem)] max-w-sm'>
        <Card className='shadow-lg'>
          {panel === 'search' && (
            <>
              <CardHeader>
                <CardTitle>Find a trip</CardTitle>
                <CardDescription>Where do you want to go today?</CardDescription>
              </CardHeader>
              <CardContent>
                <div className='flex flex-col gap-2'>
                  <LocationField
                    id='riding-pickup'
                    placeholder='Pickup location'
                    value={pickup.text}
                    onChange={(text) => setPickup({ text, coords: null })}
                    onSelect={(item) => setPickup({ text: item.display_name, coords: [item.lat, item.lng] })}
                    icon={<SquareIcon className='size-2.5 fill-foreground text-foreground' />}
                  />
                  <LocationField
                    id='riding-destination'
                    placeholder='Dropoff location'
                    value={destination.text}
                    onChange={(text) => setDestination({ text, coords: null })}
                    onSelect={(item) => setDestination({ text: item.display_name, coords: [item.lat, item.lng] })}
                    icon={<CircleIcon className='size-2.5 text-foreground' />}
                  />
                </div>
                {error && <p className='mt-3 text-sm text-destructive'>{error}</p>}
              </CardContent>
              <CardFooter>
                <Button
                  size='lg'
                  onClick={findTrips}
                  disabled={loading || pickup.text.trim().length < 3 || destination.text.trim().length < 3}
                  className='h-11 w-full rounded-full font-semibold'
                >
                  {loading ? (
                    <>
                      <Spinner data-icon='inline-start' />
                      Finding trips...
                    </>
                  ) : (
                    'Find trips'
                  )}
                </Button>
              </CardFooter>
            </>
          )}

          {panel === 'fares' && (
            <>
              <CardHeader>
                <CardTitle>Choose a ride</CardTitle>
                <CardDescription>
                  {tripInfo
                    ? `${tripInfo.distance_km.toFixed(1)} km · ${Math.round(tripInfo.duration_min)} min`
                    : 'Select a vehicle to continue'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FarePanel fares={fares} selected={vehicleType} onSelect={setVehicleType} />
                {error && <p className='mt-3 text-sm text-destructive'>{error}</p>}
              </CardContent>
              <CardFooter className='flex-col gap-2'>
                <Button
                  size='lg'
                  onClick={confirmRide}
                  disabled={loading}
                  className='h-11 w-full rounded-full font-semibold'
                >
                  {loading ? (
                    <>
                      <Spinner data-icon='inline-start' />
                      Confirming...
                    </>
                  ) : (
                    `Confirm ride · ₹${fares?.[vehicleType] ?? ''}`
                  )}
                </Button>
                <Button variant='ghost' onClick={() => setPanel('search')} className='w-full'>
                  Back
                </Button>
              </CardFooter>
            </>
          )}

          {panel === 'waiting' && (
            <>
              <CardHeader>
                <CardTitle>Finding your captain</CardTitle>
                <CardDescription>Contacting nearby captains...</CardDescription>
              </CardHeader>
              <CardContent>
                <div className='flex flex-col items-center gap-4 py-6'>
                  <Spinner className='size-8' />
                  <p className='text-center text-sm text-muted-foreground'>
                    Hang tight! We are looking for a captain near{' '}
                    <span className='font-medium text-foreground'>{pickup.text}</span>.
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant='outline' onClick={resetFlow} className='w-full'>
                  Cancel request
                </Button>
              </CardFooter>
            </>
          )}

          {panel === 'accepted' && ride && (
            <>
              <CardHeader>
                <CardTitle>Captain is on the way</CardTitle>
                <CardDescription>Share the OTP below to start your ride.</CardDescription>
              </CardHeader>
              <CardContent className='flex flex-col gap-3'>
                <CaptainCard captain={ride.captain} />
                <div className='flex flex-col items-center gap-1 rounded-xl bg-muted py-4'>
                  <p className='text-xs font-medium uppercase tracking-wide text-muted-foreground'>
                    Your ride OTP
                  </p>
                  <p className='text-3xl font-bold tracking-[0.4em]'>{ride.otp}</p>
                </div>
                <div className='flex flex-col gap-1 text-sm'>
                  <p className='flex items-start gap-2'>
                    <MapPinIcon className='mt-0.5 size-4 shrink-0 text-muted-foreground' />
                    <span className='line-clamp-1'>{ride.pickup}</span>
                  </p>
                  <p className='flex items-start gap-2'>
                    <MapPinIcon className='mt-0.5 size-4 shrink-0 text-muted-foreground' />
                    <span className='line-clamp-1'>{ride.destination}</span>
                  </p>
                </div>
              </CardContent>
              <CardFooter className='flex items-center justify-between'>
                <p className='text-sm text-muted-foreground'>Waiting for captain to start the ride...</p>
                <Spinner />
              </CardFooter>
            </>
          )}

          {panel === 'ongoing' && ride && (
            <>
              <CardHeader>
                <CardTitle>You are on your way</CardTitle>
                <CardDescription>Heading to your destination.</CardDescription>
              </CardHeader>
              <CardContent className='flex flex-col gap-3'>
                <CaptainCard captain={ride.captain} />
                <div className='flex flex-col gap-1 text-sm'>
                  <p className='flex items-start gap-2'>
                    <MapPinIcon className='mt-0.5 size-4 shrink-0 text-muted-foreground' />
                    <span className='line-clamp-1'>{ride.destination}</span>
                  </p>
                  {ride.distance && (
                    <p className='text-muted-foreground'>
                      {ride.distance} km · approx {ride.duration} min
                    </p>
                  )}
                </div>
              </CardContent>
              <CardFooter className='justify-between'>
                <p className='text-sm text-muted-foreground'>Total fare</p>
                <p className='text-lg font-semibold'>₹{ride.fare}</p>
              </CardFooter>
            </>
          )}

          {panel === 'completed' && ride && (
            <>
              <CardHeader>
                <CardTitle>Trip completed</CardTitle>
                <CardDescription>Thanks for riding with Uber.</CardDescription>
              </CardHeader>
              <CardContent className='flex flex-col gap-3'>
                <div className='flex flex-col gap-1 text-sm'>
                  <p className='flex items-start gap-2'>
                    <MapPinIcon className='mt-0.5 size-4 shrink-0 text-muted-foreground' />
                    <span className='line-clamp-1'>{ride.pickup}</span>
                  </p>
                  <p className='flex items-start gap-2'>
                    <MapPinIcon className='mt-0.5 size-4 shrink-0 text-muted-foreground' />
                    <span className='line-clamp-1'>{ride.destination}</span>
                  </p>
                </div>
                <Separator />
                <div className='flex items-center justify-between'>
                  <p className='text-sm text-muted-foreground'>Amount paid</p>
                  <p className='text-2xl font-bold'>₹{ride.fare}</p>
                </div>
              </CardContent>
              <CardFooter>
                <Button size='lg' onClick={resetFlow} className='h-11 w-full rounded-full font-semibold'>
                  Book another ride
                </Button>
              </CardFooter>
            </>
          )}
        </Card>
      </div>
    </div>
  )
}

export default Riding
