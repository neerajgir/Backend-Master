import { Link } from 'react-router-dom'

const footerColumns = [
  {
    title: 'Company',
    links: [
      { label: 'About us', to: '/' },
      { label: 'Careers', to: '/' },
      { label: 'Newsroom', to: '/' },
    ],
  },
  {
    title: 'Products',
    links: [
      { label: 'Ride', to: '/' },
      { label: 'Drive', to: '/login' },
      { label: 'Reserve', to: '/' },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'Help center', to: '/' },
      { label: 'Safety', to: '/' },
      { label: 'Terms', to: '/' },
    ],
  },
]

const Footer = () => {
  return (
    <footer className='bg-black text-white'>
      <div className='mx-auto flex w-full max-w-7xl flex-col gap-10 px-6 py-12 lg:px-10'>
        <p className='text-2xl font-bold tracking-tight'>Uber</p>

        <div className='grid gap-8 sm:grid-cols-3'>
          {footerColumns.map((column) => (
            <div key={column.title} className='flex flex-col gap-3'>
              <p className='text-sm font-semibold'>{column.title}</p>
              {column.links.map((link) => (
                <Link
                  key={link.label}
                  to={link.to}
                  className='text-sm text-gray-400 transition-colors hover:text-white'
                >
                  {link.label}
                </Link>
              ))}
            </div>
          ))}
        </div>

        <div className='flex flex-col gap-2 border-t border-white/10 pt-6 text-xs text-gray-500 sm:flex-row sm:items-center sm:justify-between'>
          <p>© {new Date().getFullYear()} Uber Clone. Built for learning purposes.</p>
          <p>React · Express · MongoDB · Socket.IO</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
