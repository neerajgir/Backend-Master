import { MapPinIcon } from 'lucide-react'
import { Spinner } from '@/components/ui/spinner'

const Suggestions = ({ items, loading, onSelect }) => {
  if (!loading && items.length === 0) return null

  return (
    <div className='absolute top-full left-0 right-0 z-20 mt-1 max-h-56 overflow-auto rounded-lg border bg-popover shadow-md'>
      {loading && items.length === 0 ? (
        <div className='flex items-center gap-2 px-3 py-2.5 text-sm text-muted-foreground'>
          <Spinner className='size-3.5' />
          Finding places...
        </div>
      ) : (
        items.map((item, index) => (
          <button
            key={`${item.lat}-${item.lng}-${index}`}
            type='button'
            onMouseDown={(e) => {
              e.preventDefault()
              onSelect(item)
            }}
            className='flex w-full items-start gap-2.5 px-3 py-2.5 text-left text-sm transition-colors hover:bg-muted'
          >
            <MapPinIcon className='mt-0.5 size-4 shrink-0 text-muted-foreground' />
            <span className='line-clamp-2'>{item.display_name}</span>
          </button>
        ))
      )}
    </div>
  )
}

export default Suggestions
