import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getMe } from '../lib/api'
import logo from '../assets/agri-logo.png'

function Card({ title, description, icon, onClick, ghost = false }) {
  return (
    <button
      onClick={onClick}
      className={`group relative overflow-hidden rounded-full w-64 h-64 md:w-72 md:h-72 ${ghost ? 'bg-transparent border border-agri-500' : 'border border-agri-400 bg-white'} shadow-2xl shadow-black/20 hover:shadow-2xl hover:shadow-black/30 transition transform hover:-translate-y-1 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-agri-300`}
    >
      {!ghost && <div className="absolute inset-0 rounded-full bg-gradient-to-br from-agri-50 to-white opacity-70" />}
      {!ghost && <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full bg-agri-100 opacity-70 transition-transform group-hover:scale-125" />}
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
        <div className={`w-16 h-16 md:w-20 md:h-20 rounded-full ${ghost ? 'bg-white/80' : 'bg-agri-50'} border border-agri-200 flex items-center justify-center text-agri-700 text-3xl md:text-4xl shadow-sm`}
        >
          {icon}
        </div>
        <h3 className="mt-4 text-xl md:text-2xl font-bold text-agri-900 drop-shadow-sm">{title}</h3>
        <p className="mt-2 text-agri-700 text-sm md:text-base drop-shadow-sm">{description}</p>
      </div>
    </button>
  )
}

export default function Dashboard() {
  const navigate = useNavigate()
  const [panelOpen, setPanelOpen] = useState(false)
  const [me, setMe] = useState(null)
  const [loadingMe, setLoadingMe] = useState(false)
  const displayName = (me && me.name) || (JSON.parse(localStorage.getItem('user') || '{}').name) || ''

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  useEffect(() => {
    if (!panelOpen) return
    const token = localStorage.getItem('token')
    if (!token) return
    setLoadingMe(true)
    getMe(token)
      .then((data) => setMe(data.user || data))
      .catch(() => {})
      .finally(() => setLoadingMe(false))
  }, [panelOpen])

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-agri-200 via-agri-100 to-agri-50 text-agri-900">
      <div
        className="pointer-events-none absolute inset-0 bg-no-repeat bg-[length:28rem] md:bg-[length:32rem] opacity-10"
        style={{ backgroundImage: `url(${logo})`, backgroundPosition: 'center 9rem' }}
        aria-hidden
      />
      <header className="border-b border-agri-200 bg-white/80 backdrop-blur sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center">
          <div className="flex items-center gap-2 font-semibold text-xl md:text-2xl">
            <img src={logo} alt="AgriGrow" className="w-12 h-12" />
            AgriGrow
          </div>
          <div className="flex-1" />
          <div className="flex items-center gap-3 ml-auto pr-0">
            <button onClick={() => setPanelOpen(true)} className="hidden sm:flex items-center gap-2 rounded-full border border-agri-400 bg-white hover:bg-agri-100 text-agri-800 px-3 py-1.5">
              <span className="text-xl">👤</span>
              <span className="font-medium truncate max-w-[12rem]">{displayName || 'Farmer'}</span>
            </button>
            <button onClick={logout} className="px-4 py-2 rounded-full border border-agri-400 bg-white hover:bg-agri-100 text-agri-800 text-base md:text-lg">Logout</button>
            <button onClick={() => setPanelOpen(true)} className="sm:hidden w-10 h-10 rounded-full border border-agri-400 bg-white flex items-center justify-center text-agri-800 hover:bg-agri-100" aria-label="Profile">
              <span className="text-xl">👤</span>
            </button>
          </div>
        </div>
      </header>

      <main className="relative max-w-6xl mx-auto px-4 pt-20 pb-10">
        <h2 className="text-2xl font-bold">Farmer Dashboard</h2>
        <div className="mt-20 grid gap-20 md:gap-40 md:grid-cols-3 place-items-center">
          <Card title="Agri" description="Crop info, markets and inputs" icon="🌾" ghost onClick={() => navigate('/agri')} />
          <Card title="Cattle" description="Livestock care and marketplace" icon="🐄" ghost onClick={() => {}} />
          <Card title="Govt. Schemes" description="Latest schemes and eligibility" icon="🏛️" ghost onClick={() => {}} />
        </div>
      </main>
      {panelOpen && (
        <div className="fixed inset-0 z-20">
          <div className="absolute inset-0 bg-black/30" onClick={() => setPanelOpen(false)} />
          <div className="absolute right-4 top-24 w-96 bg-gradient-to-b from-agri-200 via-agri-100 to-agri-50 border border-agri-300 rounded-2xl shadow-2xl p-5 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-agri-900">Farmer Profile</h3>
              <button onClick={() => setPanelOpen(false)} className="text-agri-800 hover:text-agri-900">✕</button>
            </div>
            <div className="mt-4 space-y-3 text-sm">
              {loadingMe && <p className="text-agri-700">Loading...</p>}
              {!loadingMe && (
                <>
                  <div><span className="font-medium">Name:</span> {me?.name || JSON.parse(localStorage.getItem('user')||'{}')?.name || '-'}</div>
                  <div><span className="font-medium">Email:</span> {me?.email || JSON.parse(localStorage.getItem('user')||'{}')?.email || '-'}</div>
                  <div><span className="font-medium">Username:</span> {me?.username || JSON.parse(localStorage.getItem('user')||'{}')?.username || '-'}</div>
                  <div><span className="font-medium">Phone:</span> {me?.phone || JSON.parse(localStorage.getItem('user')||'{}')?.phone || '-'}</div>
                  <div><span className="font-medium">Address:</span> {me?.address || JSON.parse(localStorage.getItem('user')||'{}')?.address || '-'}</div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )}


