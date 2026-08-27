import { Link } from 'react-router-dom'
import { ArrowRightIcon, CarFrontIcon, UserRoundIcon } from 'lucide-react'
import AuthCard from '@/features/global/components/auth-card'
import UserRegisterForm from '@/features/auth/components/user-register-form'
import CaptainRegisterForm from '@/features/auth/components/captain-register-form'

const Register = () => {
  return (
    <div className='min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-10 sm:py-14 bg-background'>
      <div className='grid w-full max-w-5xl gap-6 md:gap-8 lg:grid-cols-2 items-stretch'>
        <AuthCard
          variant='light'
          icon={UserRoundIcon}
          title='Create a rider account'
          subtitle='Sign up in seconds and get moving with Uber.'
          footer={
            <>
              Already have an account?{' '}
              <Link to='/login' className='font-medium text-primary hover:underline'>
                Sign in
              </Link>
            </>
          }
        >
          <UserRegisterForm />
        </AuthCard>

        <AuthCard
          variant='dark'
          icon={CarFrontIcon}
          title='Register as captain'
          subtitle='Add your vehicle details and start earning.'
          footer={
            <>
              Already registered?{' '}
              <Link to='/login' className='inline-flex items-center gap-1 font-medium text-white hover:underline'>
                Sign in to drive
                <ArrowRightIcon className='size-3.5' />
              </Link>
            </>
          }
        >
          <CaptainRegisterForm />
        </AuthCard>
      </div>
    </div>
  )
}

export default Register
