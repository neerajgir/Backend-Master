import { useEffect, useMemo } from 'react'
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const DEFAULT_CENTER = [24.8607, 67.0011] // Karachi
const DEFAULT_ZOOM = 12

const createDotIcon = (color, size = 14) =>
  L.divIcon({
    className: '',
    html: `<span style="display:block;width:${size}px;height:${size}px;border-radius:9999px;background:${color};border:3px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,0.4)"></span>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  })

const pickupIcon = createDotIcon('#000000')
const destinationIcon = createDotIcon('#e11d48')
const captainIcon = createDotIcon('#16a34a', 16)

const FitBounds = ({ points }) => {
  const map = useMap()

  useEffect(() => {
    if (!points || points.length === 0) return
    if (points.length === 1) {
      map.setView(points[0], 15)
    } else {
      map.fitBounds(L.latLngBounds(points), { padding: [60, 60], maxZoom: 16 })
    }
  }, [points, map])

  return null
}

const RideMap = ({ pickup, destination, captain, className = 'size-full z-0' }) => {
  const points = useMemo(() => {
    const list = []
    if (pickup) list.push(pickup)
    if (destination) list.push(destination)
    return list
  }, [pickup, destination])

  return (
    <MapContainer
      center={DEFAULT_CENTER}
      zoom={DEFAULT_ZOOM}
      scrollWheelZoom
      className={className}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url='https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'
      />
      {pickup && <Marker position={pickup} icon={pickupIcon} />}
      {destination && <Marker position={destination} icon={destinationIcon} />}
      {captain && <Marker position={captain} icon={captainIcon} />}
      {pickup && destination && (
        <Polyline positions={[pickup, destination]} pathOptions={{ color: '#000000', weight: 2, dashArray: '6 8' }} />
      )}
      <FitBounds points={points} />
    </MapContainer>
  )
}

export default RideMap
