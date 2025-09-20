import { useState } from 'react'
import { loginUser } from '../lib/api'
import { useNavigate } from 'react-router-dom'
import logo from '../assets/agri-logo.png'

export default function Login() {
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
    <section className="min-h-screen flex items-center justify-center px-4 py-8">
      <div
        className="relative flex items-center justify-center w-72 h-72 sm:w-96 sm:h-96 md:w-[32rem] md:h-[32rem] rounded-full overflow-hidden"
        aria-label="AgriGrow logo"
        role="img"
      >
        <div className="absolute inset-0 bg-no-repeat bg-contain bg-center opacity-30" style={{ backgroundImage: `url(${logo})` }} />
        <div className="relative z-10 w-[85%] sm:w-[75%] max-w-md">
          <div className="p-0">
            <h2 className="text-center text-2xl md:text-3xl font-extrabold text-agri-900">Login</h2>
            <form onSubmit={onSubmit} className="mt-6 md:mt-8 space-y-4 md:space-y-5">
              <div className="text-center">
                <label className="block text-sm md:text-base font-medium text-agri-700">Email or Username</label>
                <input
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="mt-2 w-full rounded-xl bg-white/70 backdrop-blur-sm shadow-inner ring-1 ring-agri-300 focus:ring-2 focus:ring-agri-400 px-4 py-3 outline-none placeholder-agri-600"
                  placeholder="you@example.com or johndoe"
                />
              </div>
              <div className="text-center">
                <label className="block text-sm md:text-base font-medium text-agri-700">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-2 w-full rounded-xl bg-white/70 backdrop-blur-sm shadow-inner ring-1 ring-agri-300 focus:ring-2 focus:ring-agri-400 px-4 py-3 outline-none placeholder-agri-600"
                  placeholder="********"
                />
              </div>
              {error && <p className="text-center text-sm text-red-600">{error}</p>}
              <div className="flex items-center justify-center gap-3 text-sm text-agri-700 px-1">
                <button type="button" className="hover:underline" onClick={() => alert('Password reset flow pending setup')}>Forgot password?</button>
                <button type="button" className="hover:underline" onClick={() => navigate('/register')}>Create an account</button>
              </div>
              <button disabled={loading} className={`w-40 mx-auto block rounded-xl py-3 ${loading ? 'bg-agri-300 text-agri-600' : 'bg-agri-600 text-white hover:bg-agri-700'}`}>{loading ? 'Signing in...' : 'Sign in'}</button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}


