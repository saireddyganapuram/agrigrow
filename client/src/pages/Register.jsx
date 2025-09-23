import { useState, useMemo } from 'react'
import { registerUser } from '../lib/api'
import { useNavigate, Link } from 'react-router-dom'
import logo from '../assets/agri-logo.png'

export default function Register() {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
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
      form.name.trim() &&
      form.email.trim() &&
      form.phone.trim() &&
      form.address.trim()
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

  const onSubmit = (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    registerUser(form)
      .then((data) => {
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
        navigate('/dashboard')
      })
      .catch((err) => setError(err.message || 'Registration failed'))
      .finally(() => setLoading(false))
  }

  return (
    <div className="min-h-screen bg-agri-50">
      {/* Navigation Bar */}
      <header className="border-b border-agri-200 bg-white/80 backdrop-blur sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 font-semibold text-2xl text-agri-900">
            <img src={logo} alt="AgriGrow" className="w-10 h-10" />
            AgriGrow
          </Link>
          <nav className="flex items-center gap-4 text-base">
            <Link to="/login" className="px-3 py-1.5 rounded-md bg-agri-600 text-white hover:bg-agri-700">Login</Link>
          </nav>
        </div>
      </header>

      <section className="max-w-2xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-agri-900">Create your account</h2>

      {step === 1 && (
        <form onSubmit={onNext} className="mt-6 grid md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <p className="text-sm text-agri-700">Step 1 of 2: Contact details</p>
          </div>
          <div>
            <label className="block text-sm text-agri-700">Full name</label>
            <input value={form.name} onChange={update('name')} className="mt-1 w-full rounded-md border border-agri-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-agri-400" />
          </div>
          <div>
            <label className="block text-sm text-agri-700">Email</label>
            <input value={form.email} onChange={update('email')} className="mt-1 w-full rounded-md border border-agri-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-agri-400" />
          </div>
          <div>
            <label className="block text-sm text-agri-700">Phone</label>
            <input value={form.phone} onChange={update('phone')} className="mt-1 w-full rounded-md border border-agri-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-agri-400" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm text-agri-700">Address</label>
            <input value={form.address} onChange={update('address')} className="mt-1 w-full rounded-md border border-agri-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-agri-400" />
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
            <div><span className="font-medium">Name:</span> {form.name}</div>
            <div><span className="font-medium">Email:</span> {form.email}</div>
            <div><span className="font-medium">Phone:</span> {form.phone}</div>
            <div><span className="font-medium">Address:</span> {form.address}</div>
          </div>
          <div>
            <label className="block text-sm text-agri-700">Username</label>
            <input value={form.username} onChange={update('username')} className="mt-1 w-full rounded-md border border-agri-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-agri-400" />
          </div>
          <div>
            <label className="block text-sm text-agri-700">Password</label>
            <input type="password" value={form.password} onChange={update('password')} className="mt-1 w-full rounded-md border border-agri-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-agri-400" />
          </div>
          <div>
            <label className="block text-sm text-agri-700">Confirm Password</label>
            <input type="password" value={form.confirmPassword} onChange={update('confirmPassword')} className="mt-1 w-full rounded-md border border-agri-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-agri-400" />
          </div>
          {error && <p className="md:col-span-2 text-sm text-red-600">{error}</p>}
          <div className="md:col-span-2 flex gap-3">
            <button onClick={onBack} className="flex-1 rounded-md border border-agri-300 bg-white text-agri-800 py-2 hover:bg-agri-100">Back</button>
            <button disabled={loading} className={`flex-1 rounded-md py-2 ${loading ? 'bg-agri-300 text-agri-600' : 'bg-agri-600 text-white hover:bg-agri-700'}`}>{loading ? 'Creating...' : 'Create account'}</button>
          </div>
        </form>
      )}
      </section>
    </div>
  )
}


