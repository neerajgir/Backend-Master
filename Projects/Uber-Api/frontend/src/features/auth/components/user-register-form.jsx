import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Field,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { useAuthSubmit } from './user-login-form'

const UserRegisterForm = () => {
  const [form, setForm] = useState({ firstname: '', lastname: '', email: '', password: '' })
  const { error, loading, submit } = useAuthSubmit({ path: '/users/register' })

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  return (
    <form onSubmit={(e) => {
      e.preventDefault()
      submit({ email: form.email, password: form.password, fullname: { firstname: form.firstname, lastname: form.lastname } })
    }}>
      <FieldGroup>
        <div className='grid grid-cols-2 gap-3'>
          <Field>
            <FieldLabel htmlFor='reg-firstname'>First name</FieldLabel>
            <Input id='reg-firstname' name='firstname' placeholder='John' value={form.firstname} onChange={handleChange} required className='h-11' />
          </Field>
          <Field>
            <FieldLabel htmlFor='reg-lastname'>Last name</FieldLabel>
            <Input id='reg-lastname' name='lastname' placeholder='Doe' value={form.lastname} onChange={handleChange} className='h-11' />
          </Field>
        </div>
        <Field>
          <FieldLabel htmlFor='reg-email'>Email</FieldLabel>
          <Input id='reg-email' name='email' type='email' placeholder='email@example.com' value={form.email} onChange={handleChange} required className='h-11' />
        </Field>
        <Field>
          <FieldLabel htmlFor='reg-password'>Password</FieldLabel>
          <Input id='reg-password' name='password' type='password' placeholder='At least 8 characters' value={form.password} onChange={handleChange} required minLength={8} className='h-11' />
          <p className='text-xs text-muted-foreground'>Must be at least 8 characters.</p>
        </Field>
        {error && <p className='text-sm text-destructive'>{error}</p>}
        <Button type='submit' size='lg' disabled={loading} className='w-full h-11 rounded-full font-semibold'>
          {loading ? 'Creating account...' : 'Create account'}
        </Button>
      </FieldGroup>
    </form>
  )
}

export default UserRegisterForm
