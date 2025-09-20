import { useEffect, useState } from 'react'
function PanelLink({ onClick, label, emoji, badge }) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left px-3 py-2 rounded-md hover:bg-agri-100 active:bg-agri-200 transition flex items-center justify-between gap-2 border-b border-agri-100 last:border-b-0"
    >
      <span className="flex items-center gap-2">
        <span className="text-lg" aria-hidden>{emoji}</span>
        <span className="font-medium text-agri-900">{label}</span>
      </span>
      {typeof badge === 'number' && (
        <span className="inline-flex items-center justify-center min-w-6 h-6 px-2 rounded-full bg-agri-600 text-white text-xs font-semibold">
          {badge}
        </span>
      )}
    </button>
  )
}
import { useNavigate } from 'react-router-dom'
import { fetchCart } from '../lib/api'

export default function ProfileButtonPanel() {
  const [open, setOpen] = useState(false)
  const [cartCount, setCartCount] = useState(0)
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  useEffect(() => {
    if (!open) return
    const token = localStorage.getItem('token')
    if (!token) { setCartCount(0); return }
    fetchCart(token)
      .then((res) => setCartCount((res.items || []).length))
      .catch(() => setCartCount(0))
  }, [open])
  return (
    <>
      {/* Fixed top-left profile button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed left-3 top-2 z-30 flex items-center gap-2 rounded-full border border-agri-400 bg-white/90 hover:bg-white text-agri-800 px-3 py-1.5 shadow"
        aria-label="Open profile panel"
      >
        <span className="text-xl">👤</span>
        <span className="font-medium hidden sm:block">Profile</span>
      </button>

      {open && (
        <div className="fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-[90%] max-w-sm bg-gradient-to-b from-agri-50 via-white to-agri-100 border-r border-agri-300 ring-1 ring-agri-200 shadow-2xl p-5 overflow-y-auto animate-[slideIn_.25s_ease-out] rounded-tr-2xl">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-white border border-agri-300 flex items-center justify-center text-2xl shadow">👨‍🌾</div>
              <div>
                <p className="font-semibold text-agri-900">{user?.name || user?.username || 'Farmer'}</p>
                <p className="text-sm text-agri-700">Welcome back</p>
              </div>
            </div>
            <div className="mt-5 border-t border-agri-200" />
            <nav className="mt-3">
              <PanelLink onClick={() => { setOpen(false); navigate('/agri') }} label="Home" emoji="🏠" />
              <PanelLink onClick={() => { setOpen(false); navigate('/profile/edit') }} label="Edit Profile" emoji="✏️" />
              <PanelLink onClick={() => { setOpen(false); navigate('/reports/submit') }} label="Submit Report" emoji="📝" />
              <PanelLink onClick={() => { setOpen(false); navigate('/transactions') }} label="Transactions" emoji="💳" />
              <PanelLink onClick={() => { setOpen(false); navigate('/crops/history') }} label="Crop History" emoji="📜" />
              <PanelLink onClick={() => { setOpen(false); navigate('/cart') }} label="Cart" emoji="🛒" badge={cartCount} />
            </nav>
          </div>
        </div>
      )}

      <style>{`@keyframes slideIn{from{transform:translateX(-100%);}to{transform:translateX(0);}}`}</style>
    </>
  )
}

// Button is fixed; no scroll-based repositioning



