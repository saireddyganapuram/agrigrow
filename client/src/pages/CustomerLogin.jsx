import { useState } from 'react'
import { loginUser } from '../lib/api'
import { useNavigate, Link } from 'react-router-dom'
import logo from '../assets/agri-logo.png'

export default function CustomerLogin() {
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const onSubmit = (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const payload = identifier.includes('@')
      ? { email: identifier, password }
      : { username: identifier, password }

    loginUser(payload)
      .then((data) => {
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
        navigate('/dashboard')
      })
      .catch((err) => setError(err.message || 'Login failed'))
      .finally(() => setLoading(false))
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-agri-50 to-white">
      {/* Navbar */}
      <header className="border-b border-agri-200 bg-white/80 backdrop-blur sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <Link to="/" className="flex items-center gap-3 font-semibold text-2xl text-agri-900">
            <img src={logo} alt="AgriGrow" className="w-10 h-10" />
            AgriGrow
          </Link>
        </div>
      </header>

      <section className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="relative flex items-center justify-center w-full max-w-md">
        <div
          className="absolute inset-0 flex items-center justify-center opacity-10"
        >
          <img
            src={logo}
            alt=""
            className="h-[80vh] w-auto object-contain"
            style={{
              minHeight: '400px',
              maxHeight: '80vh',
              width: 'auto',
              maxWidth: '90%'
            }}
          />
        </div>
        <div className="relative z-10 w-full max-w-xs mx-auto">
          <div className="p-0">
            <h2 className="text-center text-xl font-bold text-agri-600 mb-4">Customer Login</h2>
            <form onSubmit={onSubmit} className="space-y-3">
              <div className="text-center">
                <label className="block text-sm text-agri-700 mb-1">Email or Username</label>
                <input
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="w-full rounded-lg bg-white/90 backdrop-blur-sm shadow-sm ring-1 ring-agri-200 focus:ring-2 focus:ring-agri-400 px-3 py-2 text-sm outline-none placeholder-agri-500"
                  placeholder="you@example.com or johndoe"
                />
              </div>
              <div className="text-center">
                <label className="block text-sm text-agri-700 mb-1">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg bg-white/90 backdrop-blur-sm shadow-sm ring-1 ring-agri-200 focus:ring-2 focus:ring-agri-400 px-3 py-2 text-sm outline-none placeholder-agri-500"
                  placeholder="********"
                />
              </div>
              {error && <p className="text-center text-sm text-red-600">{error}</p>}
              <div className="flex items-center justify-center gap-3 text-xs text-agri-600 mt-2">
                <button type="button" className="hover:underline hover:text-agri-800" onClick={() => alert('Password reset flow pending setup')}>Forgot password?</button>
                <span>•</span>
                <Link to="/customers/register" className="hover:underline hover:text-agri-800">Create account</Link>
              </div>
              <button
                disabled={loading}
                className={`w-32 mx-auto block rounded-lg py-2 text-sm mt-3 ${loading ? 'bg-agri-300 text-agri-600' : 'bg-agri-600 text-white hover:bg-agri-700'}`}
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </form>
          </div>
        </div>
        </div>
      </section>
    </div>
  )
}
