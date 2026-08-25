import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { CarFrontIcon, UserRoundIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import UserRegisterForm from '@/features/auth/components/user-register-form'
import CaptainRegisterForm from '@/features/auth/components/captain-register-form'

const Register = () => {
  const [role, setRole] = useState('user')
  const isCaptain = role === 'captain'

  return (
    <div className={cn('min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-10 transition-colors', isCaptain ? 'bg-black' : 'bg-background')}>
      <div className={cn('w-full max-w-md rounded-xl border p-6 sm:p-8 shadow-sm', isCaptain ? 'bg-black border-white/15 text-white' : 'bg-card')}>
        <h1 className='text-xl font-bold tracking-tight mb-1'>Create an account</h1>
        <p className={cn('text-sm mb-6', isCaptain ? 'text-gray-400' : 'text-muted-foreground')}>
          Register as a rider or captain
        </p>

        <Tabs value={role} onValueChange={setRole}>
          <TabsList className={cn('w-full mb-6', isCaptain && 'bg-input/30 border border-white/15 text-gray-400')}>
            <TabsTrigger value='user' className='flex-1 gap-2'>
              <UserRoundIcon data-icon='inline-start' />
              Rider
            </TabsTrigger>
            <TabsTrigger value='captain' className='flex-1 gap-2'>
              <CarFrontIcon data-icon='inline-start' />
              Captain
            </TabsTrigger>
          </TabsList>
          <TabsContent value='user'>
            <UserRegisterForm />
          </TabsContent>
          <TabsContent value='captain'>
            <CaptainRegisterForm />
          </TabsContent>
        </Tabs>

        <p className={cn('mt-6 text-sm text-center', isCaptain ? 'text-gray-400' : 'text-muted-foreground')}>
          Already have an account?{' '}
          <Link to='/login' className='font-medium text-primary hover:underline'>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Register
