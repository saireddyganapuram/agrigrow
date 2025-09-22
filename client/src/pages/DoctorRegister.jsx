import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'

export default function DoctorRegister() {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({
    fullname: '',
    email: '',
    phone: '',
    address: '',
    qualification: '',
    specialization: '',
    experience: '',
    licenseNumber: '',
    username: '',
    password: '',
    confirmPassword: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const canNext = useMemo(() => {
    return (
      form.fullname.trim() &&
      form.email.trim() &&
      form.phone.trim() &&
      form.address.trim() &&
      form.qualification.trim()
    )
  }, [form])

  const canSubmit = useMemo(() => {
    return (
      form.username.trim() &&
      form.password.trim() &&
      form.confirmPassword.trim() &&
      form.password === form.confirmPassword
    )
  }, [form])

  const onNext = (e) => {
    e.preventDefault()
    if (canNext) setStep(2)
  }

  const onBack = (e) => {
    e.preventDefault()
    setStep(1)
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/doctors/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullname: form.fullname,
          email: form.email,
          phone: form.phone,
          address: form.address,
          qualification: form.qualification,
          specialization: form.specialization,
          experience: form.experience ? parseInt(form.experience) : undefined,
          licenseNumber: form.licenseNumber,
          username: form.username,
          password: form.password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed')
      }

      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.doctor))
      navigate('/dashboard')
    } catch (err) {
      setError(err.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="max-w-2xl mx-auto px-4 py-16">
      <h2 className="text-2xl font-bold text-agri-900">Doctor Registration</h2>

      {step === 1 && (
        <form onSubmit={onNext} className="mt-6 grid md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <p className="text-sm text-agri-700">Step 1 of 2: Professional details</p>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm text-agri-700">Full name</label>
            <input value={form.fullname} onChange={update('fullname')} className="mt-1 w-full rounded-md border border-agri-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-agri-400" required />
          </div>
          <div>
            <label className="block text-sm text-agri-700">Email</label>
            <input type="email" value={form.email} onChange={update('email')} className="mt-1 w-full rounded-md border border-agri-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-agri-400" required />
          </div>
          <div>
            <label className="block text-sm text-agri-700">Phone</label>
            <input value={form.phone} onChange={update('phone')} className="mt-1 w-full rounded-md border border-agri-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-agri-400" required />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm text-agri-700">Address</label>
            <input value={form.address} onChange={update('address')} className="mt-1 w-full rounded-md border border-agri-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-agri-400" required />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm text-agri-700">Medical Qualification</label>
            <input value={form.qualification} onChange={update('qualification')} className="mt-1 w-full rounded-md border border-agri-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-agri-400" placeholder="e.g., MBBS, MD, MS" required />
          </div>
          <div>
            <label className="block text-sm text-agri-700">Specialization</label>
            <input value={form.specialization} onChange={update('specialization')} className="mt-1 w-full rounded-md border border-agri-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-agri-400" placeholder="e.g., Cardiology, Pediatrics" />
          </div>
          <div>
            <label className="block text-sm text-agri-700">Years of Experience</label>
            <input type="number" min="0" value={form.experience} onChange={update('experience')} className="mt-1 w-full rounded-md border border-agri-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-agri-400" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm text-agri-700">Medical License Number</label>
            <input value={form.licenseNumber} onChange={update('licenseNumber')} className="mt-1 w-full rounded-md border border-agri-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-agri-400" />
          </div>
          <div className="md:col-span-2 flex justify-end">
            <button disabled={!canNext} className={`w-40 rounded-md py-2 ${canNext ? 'bg-agri-600 hover:bg-agri-700 text-white' : 'bg-agri-200 text-agri-600 cursor-not-allowed'}`}>Next</button>
          </div>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={onSubmit} className="mt-6 grid md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <p className="text-sm text-agri-700">Step 2 of 2: Account security</p>
          </div>
          <div className="md:col-span-2 rounded-md border border-agri-200 bg-agri-50 p-3 text-sm text-agri-800">
            <div><span className="font-medium">Name:</span> {form.fullname}</div>
            <div><span className="font-medium">Email:</span> {form.email}</div>
            <div><span className="font-medium">Phone:</span> {form.phone}</div>
            <div><span className="font-medium">Address:</span> {form.address}</div>
            <div><span className="font-medium">Qualification:</span> {form.qualification}</div>
            {form.specialization && <div><span className="font-medium">Specialization:</span> {form.specialization}</div>}
            {form.experience && <div><span className="font-medium">Experience:</span> {form.experience} years</div>}
            {form.licenseNumber && <div><span className="font-medium">License:</span> {form.licenseNumber}</div>}
          </div>
          <div>
            <label className="block text-sm text-agri-700">Username</label>
            <input value={form.username} onChange={update('username')} className="mt-1 w-full rounded-md border border-agri-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-agri-400" required />
          </div>
          <div>
            <label className="block text-sm text-agri-700">Password</label>
            <input type="password" value={form.password} onChange={update('password')} className="mt-1 w-full rounded-md border border-agri-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-agri-400" required />
          </div>
          <div>
            <label className="block text-sm text-agri-700">Confirm Password</label>
            <input type="password" value={form.confirmPassword} onChange={update('confirmPassword')} className="mt-1 w-full rounded-md border border-agri-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-agri-400" required />
          </div>
          {error && <p className="md:col-span-2 text-sm text-red-600">{error}</p>}
          <div className="md:col-span-2 flex gap-3">
            <button onClick={onBack} className="flex-1 rounded-md border border-agri-300 bg-white text-agri-800 py-2 hover:bg-agri-100">Back</button>
            <button disabled={loading || !canSubmit} className={`flex-1 rounded-md py-2 ${loading || !canSubmit ? 'bg-agri-300 text-agri-600' : 'bg-agri-600 text-white hover:bg-agri-700'}`}>{loading ? 'Creating...' : 'Create account'}</button>
          </div>
        </form>
      )}
    </section>
  )
}
