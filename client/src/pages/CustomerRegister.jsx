import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'

export default function CustomerRegister() {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({
    fullname: '',
    email: '',
    phone: '',
    address: '',
    dateOfBirth: '',
    gender: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    emergencyContactRelation: '',
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
      form.dateOfBirth.trim()
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
      const response = await fetch('/api/customers/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullname: form.fullname,
          email: form.email,
          phone: form.phone,
          address: form.address,
          dateOfBirth: form.dateOfBirth,
          gender: form.gender,
          emergencyContact: {
            name: form.emergencyContactName,
            phone: form.emergencyContactPhone,
            relation: form.emergencyContactRelation,
          },
          username: form.username,
          password: form.password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed')
      }

      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.customer))
      navigate('/dashboard')
    } catch (err) {
      setError(err.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="max-w-2xl mx-auto px-4 py-16">
      <h2 className="text-2xl font-bold text-agri-900">Customer Registration</h2>

      {step === 1 && (
        <form onSubmit={onNext} className="mt-6 grid md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <p className="text-sm text-agri-700">Step 1 of 2: Personal details</p>
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
          <div>
            <label className="block text-sm text-agri-700">Date of Birth</label>
            <input type="date" value={form.dateOfBirth} onChange={update('dateOfBirth')} className="mt-1 w-full rounded-md border border-agri-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-agri-400" required />
          </div>
          <div>
            <label className="block text-sm text-agri-700">Gender</label>
            <select value={form.gender} onChange={update('gender')} className="mt-1 w-full rounded-md border border-agri-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-agri-400">
              <option value="">Select gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="md:col-span-2 border-t border-agri-200 pt-4 mt-4">
            <h3 className="text-lg font-semibold text-agri-900 mb-3">Emergency Contact</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm text-agri-700">Contact Name</label>
                <input value={form.emergencyContactName} onChange={update('emergencyContactName')} className="mt-1 w-full rounded-md border border-agri-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-agri-400" />
              </div>
              <div>
                <label className="block text-sm text-agri-700">Contact Phone</label>
                <input value={form.emergencyContactPhone} onChange={update('emergencyContactPhone')} className="mt-1 w-full rounded-md border border-agri-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-agri-400" />
              </div>
              <div>
                <label className="block text-sm text-agri-700">Relation</label>
                <input value={form.emergencyContactRelation} onChange={update('emergencyContactRelation')} className="mt-1 w-full rounded-md border border-agri-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-agri-400" placeholder="e.g., Father, Spouse" />
              </div>
            </div>
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
            <div><span className="font-medium">Date of Birth:</span> {form.dateOfBirth}</div>
            {form.gender && <div><span className="font-medium">Gender:</span> {form.gender}</div>}
            {form.emergencyContactName && <div><span className="font-medium">Emergency Contact:</span> {form.emergencyContactName} ({form.emergencyContactPhone})</div>}
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
