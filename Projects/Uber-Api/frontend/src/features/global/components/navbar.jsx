import { Link, useNavigate } from 'react-router-dom'
import { Globe, LogOutIcon } from 'lucide-react'
import api from '@/lib/api'
import { disconnectSocket } from '@/lib/socket'
import { useAuthStore } from '@/features/auth/store/auth-store'
import { Button } from '@/components/ui/button'

const navLinks = [
  { label: "Ride", to: "/" },
  { label: "Drive", to: "/login" },
  { label: "Business", to: "/" },
  { label: "About", to: "/" },
]

const Navbar = () => {
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const captain = useAuthStore((s) => s.captain)
  const clearAuth = useAuthStore((s) => s.clearAuth)

  const logout = async () => {
    try {
      await api.get(captain ? '/captains/logout' : '/users/logout')
    } catch {
      // ignore logout errors
    }
    clearAuth()
    disconnectSocket()
    navigate('/')
  }

  return (
    <header className='bg-black w-full fixed top-0 left-0 z-50 h-16 flex items-center justify-between px-6 lg:px-10'>
      <div className='flex items-center gap-8'>
        <Link to="/" className='text-white text-2xl font-bold tracking-tight'>
          Uber
        </Link>
        <nav className='hidden md:flex items-center gap-1'>
          {navLinks.map((link) => (
            <Button
              key={link.label}
              variant='ghost'
              nativeButton={false}
              render={<Link to={link.to} />}
              className='text-gray-300 hover:text-white hover:bg-white/10 rounded-full'
            >
              {link.label}
            </Button>
          ))}
        </nav>
      </div>

      <div className='flex items-center gap-2'>
        <Button
          variant='ghost'
          className='hidden md:flex text-gray-300 hover:text-white hover:bg-white/10 rounded-full'
        >
          <Globe data-icon='inline-start' />
          EN
        </Button>
        {user || captain ? (
          <>
            <Button
              variant='ghost'
              nativeButton={false}
              render={<Link to={captain ? '/captain' : '/riding'} />}
              className='text-white hover:bg-white/10 rounded-full'
            >
              {captain ? 'Dashboard' : 'My trips'}
            </Button>
            <Button
              variant='ghost'
              onClick={logout}
              className='text-gray-300 hover:text-white hover:bg-white/10 rounded-full'
            >
              <LogOutIcon data-icon='inline-start' />
              Logout
            </Button>
          </>
        ) : (
          <>
            <Button
              variant='ghost'
              nativeButton={false}
              render={<Link to='/login' />}
              className='text-white hover:bg-white/10 rounded-full'
            >
              Log in
            </Button>
            <Button
              nativeButton={false}
              render={<Link to='/register' />}
              className='bg-white text-black hover:bg-gray-200 rounded-full'
            >
              Sign up
            </Button>
          </>
        )}
      </div>
    </header>
  )
}

export default Navbar
