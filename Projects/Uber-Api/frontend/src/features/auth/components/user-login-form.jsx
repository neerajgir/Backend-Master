import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Field,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { useAuthSubmit, inputClass } from '../hooks/use-auth-submit'

const UserLoginForm = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { error, loading, submit } = useAuthSubmit({ path: '/users/login', redirectTo: '/riding' })

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
