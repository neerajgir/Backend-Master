import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '@/lib/api'
import { useAuthStore } from '@/features/auth/store/auth-store'

export const useAuthSubmit = ({ path, redirectTo = '/' }) => {
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const setUser = useAuthStore((s) => s.setUser)
  const setCaptain = useAuthStore((s) => s.setCaptain)

  const submit = async (payload) => {
    setError('')
    setLoading(true)
    try {
      const { data } = await api.post(path, payload)
      if (data.user) setUser(data.user)
      if (data.captain) setCaptain(data.captain)
      navigate(redirectTo)
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.response?.data?.errors?.[0]?.msg ||
          'Something went wrong. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  return { error, loading, submit }
}

export const inputClass = {
  light: 'h-11',
  dark: 'h-11 bg-neutral-900 border-white/25 text-white placeholder:text-gray-500',
}
