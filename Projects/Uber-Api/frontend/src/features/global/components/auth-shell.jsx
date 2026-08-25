import React from 'react'
import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'

const AuthShell = ({ variant = 'user', icon: Icon, title, subtitle, footer, children }) => {
  const isCaptain = variant === 'captain'

  return (
    <div
      className={cn(
        'min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-10',
        isCaptain ? 'bg-black' : 'bg-background'
      )}
    >
      <div
        className={cn(
          'w-full max-w-md rounded-xl border p-6 sm:p-8 shadow-sm',
          isCaptain ? 'bg-black border-white/15 text-white' : 'bg-card'
        )}
      >
        <div className='flex items-center gap-3 mb-6'>
          {Icon && (
            <div
              className={cn(
                'size-11 rounded-full flex items-center justify-center shrink-0',
                isCaptain ? 'bg-white text-black' : 'bg-primary text-primary-foreground'
              )}
            >
              <Icon className='size-5' />
            </div>
          )}
          <div>
            <h1 className='text-xl font-bold tracking-tight'>{title}</h1>
            <p className={cn('text-sm', isCaptain ? 'text-gray-400' : 'text-muted-foreground')}>
              {subtitle}
            </p>
          </div>
        </div>

        {children}

        <p
          className={cn(
            'mt-6 text-sm text-center',
            isCaptain ? 'text-gray-400' : 'text-muted-foreground'
          )}
        >
          {footer}
        </p>
      </div>
    </div>
  )
}

export const AuthLink = ({ to, children }) => (
  <Link to={to} className='font-medium text-primary hover:underline'>
    {children}
  </Link>
)

export default AuthShell
