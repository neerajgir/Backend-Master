import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { useAuthSubmit, inputClass } from './user-login-form'

const CaptainLoginForm = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { error, loading, submit } = useAuthSubmit({ path: '/captains/login' })

  return (
    <form onSubmit={(e) => { e.preventDefault(); submit({ email, password }) }}>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor='cap-login-email'>Email</FieldLabel>
          <Input id='cap-login-email' type='email' placeholder='email@example.com' value={email} onChange={(e) => setEmail(e.target.value)} required className={inputClass.dark} />
        </Field>
        <Field>
          <FieldLabel htmlFor='cap-login-password'>Password</FieldLabel>
          <Input id='cap-login-password' type='password' placeholder='Your password' value={password} onChange={(e) => setPassword(e.target.value)} required className={inputClass.dark} />
        </Field>
        {error && <p className='text-sm text-red-400'>{error}</p>}
        <Button type='submit' size='lg' disabled={loading} className='w-full h-11 rounded-full font-semibold bg-white text-black hover:bg-gray-200'>
          {loading ? 'Signing in...' : 'Sign in to drive'}
        </Button>
      </FieldGroup>
    </form>
  )
}

export default CaptainLoginForm
