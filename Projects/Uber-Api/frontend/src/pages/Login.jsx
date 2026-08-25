import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRightIcon, CarFrontIcon, UserRoundIcon } from 'lucide-react'
import AuthCard from '@/features/global/components/auth-card'
import UserLoginForm from '@/features/auth/components/user-login-form'
import CaptainLoginForm from '@/features/auth/components/captain-login-form'

const Login = () => {
  return (
    <div className='min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-10 sm:py-14 bg-background'>
      <div className='grid w-full max-w-5xl gap-6 md:gap-8 lg:grid-cols-2 items-stretch'>
        <AuthCard
          variant='light'
          icon={UserRoundIcon}
          title='Rider login'
          subtitle='Sign in to book rides and manage your trips.'
          footer={
            <>
              New to Uber?{' '}
              <Link to='/register' className='font-medium text-primary hover:underline'>
                Create an account
              </Link>
            </>
          }
        >
          <UserLoginForm />
        </AuthCard>

        <AuthCard
          variant='dark'
          icon={CarFrontIcon}
          title='Captain login'
          subtitle='Sign in as a captain and start earning on the road.'
          footer={
            <>
              Want to drive with us?{' '}
              <Link to='/register' className='inline-flex items-center gap-1 font-medium text-white hover:underline'>
                Register your vehicle
                <ArrowRightIcon className='size-3.5' />
              </Link>
            </>
          }
        >
          <CaptainLoginForm />
        </AuthCard>
      </div>
    </div>
  )
}

export default Login
