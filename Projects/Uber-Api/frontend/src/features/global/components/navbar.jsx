import React from 'react'
import { Link } from 'react-router-dom'
import { Globe } from 'lucide-react'
import { Button } from '@/components/ui/button'

const navLinks = [
  { label: "Ride", to: "/" },
  { label: "Drive", to: "/login" },
  { label: "Business", to: "/" },
  { label: "About", to: "/" },
]

const Navbar = () => {
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
      </div>
    </header>
  )
}

export default Navbar
