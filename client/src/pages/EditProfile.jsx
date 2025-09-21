import ProfileButtonPanel from '../components/ProfileButtonPanel'
import { useState, useEffect } from 'react'
import TopRightBrandBar from '../components/TopRightBrandBar'
import { getProfile, updateProfile } from '../lib/api'
import logo from '../assets/agri-logo.png'

export default function EditProfile() {
  const [form, setForm] = useState({ name: '', email: '', username: '', phone: '', address: '' })
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))
  
  const loadProfile = () => {
    const token = localStorage.getItem('token')
    if (!token) {
      setError('Please login first')
      setLoading(false)
      return
    }
    
    getProfile(token)
      .then((res) => {
        setForm({
          name: res.user.name || '',
          email: res.user.email || '',
          username: res.user.username || '',
          phone: res.user.phone || '',
          address: res.user.address || ''
        })
      })
      .catch(() => setError('Failed to load profile'))
      .finally(() => setLoading(false))
  }
  
  useEffect(() => {
    loadProfile()
  }, [])
  
  const onSubmit = (e) => {
    e.preventDefault()
    const token = localStorage.getItem('token')
    if (!token) { alert('Please login first'); return }
    
    setSubmitting(true)
    setError('')
    setSuccess('')
    
    updateProfile(form, token)
      .then((res) => {
        setSuccess('Profile updated successfully!')
        // Update localStorage with new user data
        const userData = { ...JSON.parse(localStorage.getItem('user') || '{}'), ...res.user }
        localStorage.setItem('user', JSON.stringify(userData))
      })
      .catch((err) => setError(err.message || 'Failed to update profile'))
      .finally(() => setSubmitting(false))
  }
  if (loading) {
    return (
      <>
        <TopRightBrandBar />
        <ProfileButtonPanel />
        <section className="max-w-3xl mx-auto px-4 py-10">
          <div className="text-center">
            <p className="text-agri-700">Loading profile...</p>
          </div>
        </section>
      </>
    )
  }

  return (
    <div className="relative min-h-screen">
      {/* Background Logo */}
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-0">
        <div
          className="w-[32rem] h-[32rem] opacity-10 bg-no-repeat bg-contain bg-center"
          style={{ backgroundImage: `url(${logo})` }}
          aria-hidden="true"
        />
      </div>

      <div className="relative z-10">
        <TopRightBrandBar />
        <ProfileButtonPanel />
        <section className="max-w-3xl mx-auto px-4 py-10">
          <h2 className="text-2xl font-bold text-agri-900 text-center">Edit Profile</h2>
          
          <div className="mt-8 max-w-2xl mx-auto">
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-agri-700">Name</label>
                  <input 
                    value={form.name} 
                    onChange={update('name')} 
                    className="mt-1 w-full rounded-md border border-agri-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-agri-400" 
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-agri-700">Username</label>
                  <input 
                    value={form.username} 
                    onChange={update('username')} 
                    className="mt-1 w-full rounded-md border border-agri-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-agri-400" 
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-agri-700">Email</label>
                  <input 
                    type="email"
                    value={form.email} 
                    onChange={update('email')} 
                    className="mt-1 w-full rounded-md border border-agri-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-agri-400" 
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-agri-700">Phone</label>
                  <input 
                    type="tel"
                    value={form.phone} 
                    onChange={update('phone')} 
                    className="mt-1 w-full rounded-md border border-agri-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-agri-400" 
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-agri-700">Address</label>
                <textarea 
                  value={form.address} 
                  onChange={update('address')} 
                  rows={3}
                  className="mt-1 w-full rounded-md border border-agri-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-agri-400"
                  required
                />
              </div>
              
              {error && <p className="text-red-600 text-sm">{error}</p>}
              {success && <p className="text-green-600 text-sm">{success}</p>}
              
              <div className="flex justify-end">
                <button 
                  type="submit" 
                  disabled={submitting}
                  className={`px-6 py-2 rounded-md ${submitting ? 'bg-agri-300 text-agri-600' : 'bg-agri-600 text-white hover:bg-agri-700'}`}
                >
                  {submitting ? 'Updating...' : 'Update Profile'}
                </button>
              </div>
            </form>
          </div>
        </section>
      </div>
    </div>
  )
}


