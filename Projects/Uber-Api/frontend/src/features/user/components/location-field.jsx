import { useState } from 'react'
import { Input } from '@/components/ui/input'
import Suggestions from '@/features/home/components/suggestions'
import { useLocationSuggestions } from '@/features/home/hooks/use-location-suggestions'

const LocationField = ({ id, placeholder, value, onChange, onSelect, icon }) => {
  const [focused, setFocused] = useState(false)
  const { suggestions, loading } = useLocationSuggestions(value, focused)

  return (
    <div className='relative'>
      <div className='relative'>
        {icon && (
          <span className='pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground'>
            {icon}
          </span>
        )}
        <Input
          id={id}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className='h-12 pl-9'
        />
      </div>
      {focused && (
        <Suggestions
          items={suggestions}
          loading={loading}
          onSelect={(item) => {
            onSelect(item)
            setFocused(false)
          }}
        />
      )}
    </div>
  )
}

export default LocationField
