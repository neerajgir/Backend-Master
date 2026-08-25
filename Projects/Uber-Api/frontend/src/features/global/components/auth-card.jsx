import React from 'react'
import { cn } from '@/lib/utils'

const AuthCard = ({ variant = 'light', icon: Icon, title, subtitle, footer, children }) => {
  const isDark = variant === 'dark'

  return (
    <div
      className={cn(
        'flex flex-col w-full h-full rounded-2xl border p-5 sm:p-8 shadow-sm transition-shadow hover:shadow-md',
        isDark
          ? 'bg-neutral-950 border-white/15 text-white'
          : 'bg-card border-border'
      )}
    >
      {Icon && (
        <div
          className={cn(
            'size-12 rounded-full flex items-center justify-center shrink-0',
            isDark ? 'bg-white text-black' : 'bg-primary text-primary-foreground'
          )}
        >
          <Icon className='size-5' />
        </div>
      )}

      <h2 className='mt-5 text-lg font-semibold tracking-tight'>{title}</h2>
      <p className={cn('mt-1 text-sm', isDark ? 'text-gray-400' : 'text-muted-foreground')}>
        {subtitle}
      </p>

      <div className='mt-6'>{children}</div>

      {footer && (
        <p className={cn('mt-auto pt-6 text-sm', isDark ? 'text-gray-400' : 'text-muted-foreground')}>
          {footer}
        </p>
      )}
    </div>
  )
}

export default AuthCard
