import { Navigate } from 'react-router-dom'
import { useAuthStore } from '@/features/auth/store/auth-store'

const ProtectedRoute = ({ role = 'user', children }) => {
  const user = useAuthStore((s) => s.user)
  const captain = useAuthStore((s) => s.captain)
  const isAllowed = role === 'captain' ? Boolean(captain) : Boolean(user)

  if (!isAllowed) return <Navigate to='/login' replace />
  return children
}

export default ProtectedRoute
