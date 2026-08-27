import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { LogOutIcon, MapPinIcon } from 'lucide-react'
import api from '@/lib/api'
import { connectSocket, disconnectSocket } from '@/lib/socket'
import { useAuthStore } from '@/features/auth/store/auth-store'
import { toast } from '@/components/ui/toast'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp'
import RideMap from '@/features/home/components/ride-map'
import RideRequestCard from '@/features/captain/components/ride-request-card'

const Captain = () => {
  const navigate = useNavigate()
  const captain = useAuthStore((s) => s.captain)
  const clearAuth = useAuthStore((s) => s.clearAuth)

  const [online, setOnline] = useState(false)
  const [captainPos, setCaptainPos] = useState(null)
  const [incoming, setIncoming] = useState(null)
  const [activeRide, setActiveRide] = useState(null)
  const [phase, setPhase] = useState(null)
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [routePoints, setRoutePoints] = useState({ pickup: null, destination: null })

  const busyRef = useRef(false)

  useEffect(() => {
    busyRef.current = Boolean(activeRide) || Boolean(incoming)
  }, [activeRide, incoming])

  useEffect(() => {
    if (!online) return
    const socket = connectSocket()
    socket.emit('join', { userId: captain._id, userType: 'captain' })

    const onNewRide = (data) => {
      if (busyRef.current) return
      setIncoming(data)
      toast.add({
        title: 'New ride request',
        description: `₹${data.fare} · ${data.pickup}`,
        type: 'info',
      })
    }
    socket.on('newRide', onNewRide)

    let watchId = null
    if (navigator.geolocation) {
      watchId = navigator.geolocation.watchPosition(
        (pos) => {
          const location = { ltd: pos.coords.latitude, lng: pos.coords.longitude }
          setCaptainPos([location.ltd, location.lng])
          socket.emit('update-location-captain', { userId: captain._id, location })
        },
        () => {},
        { enableHighAccuracy: true, maximumAge: 5000 }
      )
    }

    return () => {
      socket.off('newRide', onNewRide)
      if (watchId !== null) navigator.geolocation.clearWatch(watchId)
    }
  }, [online, captain])

  const ride = activeRide || incoming
  const rideId = ride?._id
  const pickupAddress = ride?.pickup
  const destinationAddress = ride?.destination

  useEffect(() => {
    if (!rideId || !pickupAddress || !destinationAddress) return
    let cancelled = false
    Promise.all([
      api
        .get('/maps/get-coordinates', { params: { address: pickupAddress } })
        .then((res) => [res.data.lat, res.data.lng])
        .catch(() => null),
      api
        .get('/maps/get-coordinates', { params: { address: destinationAddress } })
        .then((res) => [res.data.lat, res.data.lng])
        .catch(() => null),
    ]).then(([pickup, destination]) => {
      if (!cancelled) setRoutePoints({ rideId, pickup, destination })
    })
    return () => {
      cancelled = true
    }
  }, [rideId, pickupAddress, destinationAddress])

  const activePoints = routePoints.rideId === rideId ? routePoints : { pickup: null, destination: null }

  const acceptRide = async () => {
    setLoading(true)
    setError('')
    try {
      const { data } = await api.post('/rides/confirm', { rideId: incoming._id })
      setActiveRide(data)
      setPhase('accepted')
      setIncoming(null)
      toast.add({ title: 'Ride accepted', description: 'Head to the pickup location.', type: 'success' })
    } catch (err) {
      setError(err.response?.data?.error || 'Could not accept this ride.')
      setIncoming(null)
    } finally {
      setLoading(false)
    }
  }

  const startRide = async () => {
    setLoading(true)
    setError('')
    try {
      const { data } = await api.get('/rides/start-ride', {
        params: { rideId: activeRide._id, otp },
      })
      setActiveRide(data)
      setPhase('ongoing')
      toast.add({ title: 'Ride started', type: 'success' })
    } catch (err) {
      setError(err.response?.data?.error || 'Could not start the ride. Check the OTP.')
    } finally {
      setLoading(false)
    }
  }

  const endRide = async () => {
    setLoading(true)
    setError('')
    try {
      const { data } = await api.post('/rides/end-ride', { rideId: activeRide._id })
      setActiveRide(data)
      setPhase('completed')
      toast.add({ title: 'Ride completed', description: `You earned ₹${data.fare}`, type: 'success' })
    } catch (err) {
      setError(err.response?.data?.error || 'Could not end the ride.')
    } finally {
      setLoading(false)
    }
  }

  const finishTrip = () => {
    setActiveRide(null)
    setPhase(null)
    setOtp('')
    setError('')
    setIncoming(null)
  }

  const logout = async () => {
    try {
      await api.get('/captains/logout')
    } catch {
      // ignore logout errors
    }
    clearAuth()
    disconnectSocket()
    navigate('/')
  }

  const riderName = activeRide?.user?.fullname?.firstname || 'Rider'

  return (
    <div className='flex h-screen w-full bg-neutral-950 text-white'>
      <aside className='flex w-full flex-col border-r border-white/10 md:max-w-md'>
        <header className='flex h-16 shrink-0 items-center justify-between border-b border-white/10 px-6'>
          <Link to='/' className='text-2xl font-bold tracking-tight'>
            Uber
          </Link>
          <Button
            variant='ghost'
            onClick={logout}
            className='text-gray-300 hover:bg-white/10 hover:text-white'
          >
            <LogOutIcon data-icon='inline-start' />
            Logout
          </Button>
        </header>

        <div className='flex items-center justify-between border-b border-white/10 px-6 py-4'>
          <div className='min-w-0'>
            <p className='truncate text-sm font-semibold'>
              {captain?.fullname?.firstname} {captain?.fullname?.lastname}
            </p>
            <p className='text-xs text-gray-400'>
              {captain?.vehicles?.vehicleType?.toUpperCase()} · {captain?.vehicles?.color} ·{' '}
              {captain?.vehicles?.plate}
            </p>
          </div>
          <div className='flex items-center gap-2'>
            <span className='text-xs font-medium text-gray-400'>
              {online ? 'Online' : 'Offline'}
            </span>
            <Switch
              checked={online}
              onCheckedChange={(next) => {
                setOnline(next)
                if (!next) setIncoming(null)
              }}
            />
          </div>
        </div>

        <div className='flex-1 overflow-auto p-6'>
          {!online && (
            <div className='flex h-full flex-col items-center justify-center gap-3 text-center'>
              <p className='text-lg font-semibold'>You are offline</p>
              <p className='max-w-xs text-sm text-gray-400'>
                Go online to start receiving ride requests from nearby riders.
              </p>
            </div>
          )}

          {online && !incoming && !activeRide && (
            <div className='flex h-full flex-col items-center justify-center gap-4 text-center'>
              <span className='relative flex size-4'>
                <span className='absolute inline-flex size-full animate-ping rounded-full bg-green-400 opacity-60' />
                <span className='relative inline-flex size-4 rounded-full bg-green-500' />
              </span>
              <p className='text-lg font-semibold'>Waiting for requests</p>
              <p className='max-w-xs text-sm text-gray-400'>
                Keep this app open. New ride requests will appear here automatically.
              </p>
              {!captainPos && (
                <p className='max-w-xs text-xs text-gray-500'>
                  Allow location access so riders near you can find you.
                </p>
              )}
            </div>
          )}

          {online && incoming && !activeRide && (
            <div className='flex flex-col gap-3'>
              <RideRequestCard
                ride={incoming}
                onAccept={acceptRide}
                onDecline={() => setIncoming(null)}
                loading={loading}
              />
              {error && <p className='text-sm text-red-400'>{error}</p>}
            </div>
          )}

          {activeRide && phase === 'accepted' && (
            <div className='flex flex-col gap-4'>
              <div>
                <p className='text-lg font-semibold'>Pick up {riderName}</p>
                <p className='text-sm text-gray-400'>Ask for the OTP before starting the ride.</p>
              </div>
              <div className='flex flex-col gap-2 rounded-xl border border-white/10 bg-white/5 p-3 text-sm'>
                <p className='flex items-start gap-2'>
                  <MapPinIcon className='mt-0.5 size-4 shrink-0 text-gray-400' />
                  <span className='line-clamp-2'>{activeRide.pickup}</span>
                </p>
                <p className='flex items-start gap-2'>
                  <MapPinIcon className='mt-0.5 size-4 shrink-0 text-gray-400' />
                  <span className='line-clamp-2'>{activeRide.destination}</span>
                </p>
              </div>
              <div className='flex flex-col gap-2'>
                <p className='text-sm font-medium'>Enter ride OTP</p>
                <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                  <InputOTPGroup>
                    {Array.from({ length: 6 }).map((_, index) => (
                      <InputOTPSlot key={index} index={index} />
                    ))}
                  </InputOTPGroup>
                </InputOTP>
              </div>
              {error && <p className='text-sm text-red-400'>{error}</p>}
              <Button
                onClick={startRide}
                disabled={loading || otp.length !== 6}
                className='h-11 rounded-full font-semibold'
              >
                {loading ? (
                  <>
                    <Spinner data-icon='inline-start' />
                    Starting...
                  </>
                ) : (
                  'Start ride'
                )}
              </Button>
            </div>
          )}

          {activeRide && phase === 'ongoing' && (
            <div className='flex flex-col gap-4'>
              <div>
                <p className='text-lg font-semibold'>Trip in progress</p>
                <p className='text-sm text-gray-400'>Drive safe and end the ride on arrival.</p>
              </div>
              <div className='flex flex-col gap-2 rounded-xl border border-white/10 bg-white/5 p-3 text-sm'>
                <p className='flex items-start gap-2'>
                  <MapPinIcon className='mt-0.5 size-4 shrink-0 text-gray-400' />
                  <span className='line-clamp-2'>{activeRide.destination}</span>
                </p>
                <div className='flex items-center justify-between text-xs text-gray-400'>
                  <span>Rider: {riderName}</span>
                  <span className='uppercase'>{activeRide.vehicleType}</span>
                </div>
              </div>
              {error && <p className='text-sm text-red-400'>{error}</p>}
              <Button
                onClick={endRide}
                disabled={loading}
                className='h-11 rounded-full font-semibold'
              >
                {loading ? (
                  <>
                    <Spinner data-icon='inline-start' />
                    Ending...
                  </>
                ) : (
                  'End ride'
                )}
              </Button>
            </div>
          )}

          {activeRide && phase === 'completed' && (
            <div className='flex flex-col gap-4'>
              <div>
                <p className='text-lg font-semibold'>Trip completed</p>
                <p className='text-sm text-gray-400'>Nice work! Here is your summary.</p>
              </div>
              <div className='flex flex-col gap-3 rounded-xl border border-white/10 bg-white/5 p-4'>
                <div className='flex items-center justify-between'>
                  <span className='text-sm text-gray-400'>You earned</span>
                  <span className='text-2xl font-bold'>₹{activeRide.fare}</span>
                </div>
                {activeRide.distance && (
                  <div className='flex items-center justify-between text-sm text-gray-400'>
                    <span>Distance</span>
                    <span>{activeRide.distance} km</span>
                  </div>
                )}
                <div className='flex items-center justify-between text-sm text-gray-400'>
                  <span>Rider</span>
                  <span>{riderName}</span>
                </div>
              </div>
              <Button onClick={finishTrip} className='h-11 rounded-full font-semibold'>
                Done
              </Button>
            </div>
          )}
        </div>
      </aside>

      <div className='relative hidden flex-1 md:block'>
        <RideMap
          captain={captainPos}
          pickup={activePoints.pickup}
          destination={activePoints.destination}
        />
        {online && (
          <div className='absolute left-4 top-4 z-10'>
            <Badge variant='secondary' className='bg-white/90'>
              {captainPos ? 'Sharing live location' : 'Waiting for GPS...'}
            </Badge>
          </div>
        )}
      </div>
    </div>
  )
}

export default Captain
