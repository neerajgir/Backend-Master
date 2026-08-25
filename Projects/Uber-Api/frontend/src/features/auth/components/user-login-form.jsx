import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'

export const useAuthSubmit = ({ path, redirectTo = '/' }) => {
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const submit = async (payload) => {
    setError('')
    setLoading(true)
    try {
      await axios.post(`${API_URL}${path}`, payload, { withCredentials: true })
      navigate(redirectTo)
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.')
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

const UserLoginForm = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { error, loading, submit } = useAuthSubmit({ path: '/users/login' })

  return (
    <form onSubmit={(e) => { e.preventDefault(); submit({ email, password }) }}>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor='login-email'>Email</FieldLabel>
          <Input id='login-email' type='email' placeholder='email@example.com' value={email} onChange={(e) => setEmail(e.target.value)} required className={inputClass.light} />
        </Field>
        <Field>
          <FieldLabel htmlFor='login-password'>Password</FieldLabel>
          <Input id='login-password' type='password' placeholder='Your password' value={password} onChange={(e) => setPassword(e.target.value)} required className={inputClass.light} />
        </Field>
        {error && <p className='text-sm text-destructive'>{error}</p>}
        <Button type='submit' size='lg' disabled={loading} className='w-full h-11 rounded-full font-semibold'>
          {loading ? 'Signing in...' : 'Sign in'}
        </Button>
      </FieldGroup>
    </form>
  )
}

export default UserLoginForm
