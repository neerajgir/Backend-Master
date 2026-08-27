import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { useAuthSubmit, inputClass } from '../hooks/use-auth-submit'

const initialForm = {
  firstname: '',
  lastname: '',
  email: '',
  password: '',
  color: '',
  plate: '',
  capacity: 1,
  vehicleType: 'car',
}

const CaptainRegisterForm = () => {
  const [form, setForm] = useState(initialForm)
  const { error, loading, submit } = useAuthSubmit({ path: '/captains/register', redirectTo: '/captain' })

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.type === 'number' ? Number(e.target.value) : e.target.value,
    }))
  }

  return (
    <form onSubmit={(e) => {
      e.preventDefault()
      submit({
        email: form.email,
        password: form.password,
        fullname: { firstname: form.firstname, lastname: form.lastname },
        vehicles: { color: form.color, plate: form.plate, capacity: form.capacity, vehicleType: form.vehicleType },
      })
    }}>
      <FieldGroup>
        <div className='grid grid-cols-2 gap-3'>
          <Field>
            <FieldLabel htmlFor='cap-firstname'>First name</FieldLabel>
            <Input id='cap-firstname' name='firstname' placeholder='John' value={form.firstname} onChange={handleChange} required className={inputClass.dark} />
          </Field>
          <Field>
            <FieldLabel htmlFor='cap-lastname'>Last name</FieldLabel>
            <Input id='cap-lastname' name='lastname' placeholder='Doe' value={form.lastname} onChange={handleChange} required className={inputClass.dark} />
          </Field>
        </div>
        <Field>
          <FieldLabel htmlFor='cap-email'>Email</FieldLabel>
          <Input id='cap-email' name='email' type='email' placeholder='email@example.com' value={form.email} onChange={handleChange} required className={inputClass.dark} />
        </Field>
        <Field>
          <FieldLabel htmlFor='cap-password'>Password</FieldLabel>
          <Input id='cap-password' name='password' type='password' placeholder='At least 8 characters' value={form.password} onChange={handleChange} required minLength={8} className={inputClass.dark} />
        </Field>

        <div className='h-px bg-white/10 my-1' />

        <div className='grid grid-cols-2 gap-3'>
          <Field>
            <FieldLabel htmlFor='cap-color'>Vehicle color</FieldLabel>
            <Input id='cap-color' name='color' placeholder='Black' value={form.color} onChange={handleChange} required className={inputClass.dark} />
          </Field>
          <Field>
            <FieldLabel htmlFor='cap-plate'>Plate number</FieldLabel>
            <Input id='cap-plate' name='plate' placeholder='ABC-123' value={form.plate} onChange={handleChange} required className={inputClass.dark} />
          </Field>
        </div>
        <div className='grid grid-cols-2 gap-3'>
          <Field>
            <FieldLabel htmlFor='cap-capacity'>Capacity</FieldLabel>
            <Input id='cap-capacity' name='capacity' type='number' min={1} value={form.capacity} onChange={handleChange} required className={inputClass.dark} />
            <FieldDescription>Seats available for riders.</FieldDescription>
          </Field>
          <Field>
            <FieldLabel htmlFor='cap-vehicleType'>Vehicle type</FieldLabel>
            <Select name='vehicleType' value={form.vehicleType} onValueChange={(value) => setForm((prev) => ({ ...prev, vehicleType: value }))}>
              <SelectTrigger id='cap-vehicleType' className={`${inputClass.dark} w-full`}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='car'>Car</SelectItem>
                <SelectItem value='bike'>Bike</SelectItem>
                <SelectItem value='bus'>Bus</SelectItem>
              </SelectContent>
            </Select>
          </Field>
        </div>

        {error && <p className='text-sm text-red-400'>{error}</p>}
        <Button type='submit' size='lg' disabled={loading} className='w-full h-11 rounded-full font-semibold bg-white text-black hover:bg-gray-200'>
          {loading ? 'Registering...' : 'Register as captain'}
        </Button>
      </FieldGroup>
    </form>
  )
}

export default CaptainRegisterForm
