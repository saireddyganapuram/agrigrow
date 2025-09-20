import { useEffect, useState } from 'react'
import ProfileButtonPanel from '../components/ProfileButtonPanel'
import TopRightBrandBar from '../components/TopRightBrandBar'
import { fetchCart, removeFromCart } from '../lib/api'
export default function Cart() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [removing, setRemoving] = useState(null)
  const [confirmRemove, setConfirmRemove] = useState(null) // { id, crop, company }

  const loadCart = () => {
    const token = localStorage.getItem('token')
    if (!token) return
    setLoading(true)
    fetchCart(token)
      .then((res) => setItems(res.items || []))
      .catch(() => setError('Failed to load cart'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadCart()
  }, [])

  const handleRemove = (id) => {
    const item = items.find(i => i._id === id)
    if (item) {
      setConfirmRemove({ id, crop: item.crop, company: item.company })
    }
  }

  const confirmRemoveItem = () => {
    if (!confirmRemove) return
    const token = localStorage.getItem('token')
    if (!token) return
    setRemoving(confirmRemove.id)
    removeFromCart(confirmRemove.id, token)
      .then(() => loadCart())
      .catch(() => alert('Failed to remove item'))
      .finally(() => {
        setRemoving(null)
        setConfirmRemove(null)
      })
  }

  const total = items.reduce((s, i) => s + i.quantity * i.pricePerUnit, 0)
  return (
    <>
      <TopRightBrandBar />
      <ProfileButtonPanel />
      <section className="max-w-4xl mx-auto px-4 py-10">
        <h2 className="text-2xl font-bold text-agri-900">Cart</h2>
      <div className="mt-6 space-y-4">
        {loading && <p className="text-agri-700">Loading...</p>}
        {error && <p className="text-red-600">{error}</p>}
        {items.map((i) => (
          <div key={i._id} className="flex items-center justify-between rounded-lg border border-agri-200 bg-white p-4 shadow-sm">
            <div className="flex-1">
              <p className="font-semibold text-agri-900">{i.crop} • {i.company}</p>
              <p className="text-agri-700">Qty: {i.quantity} • ₹{i.pricePerUnit}/unit</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-semibold">₹{i.pricePerUnit * i.quantity}</span>
              <button
                onClick={() => handleRemove(i._id)}
                disabled={removing === i._id}
                className={`px-3 py-1.5 rounded-md text-sm ${removing === i._id ? 'bg-red-200 text-red-600' : 'bg-red-100 text-red-700 hover:bg-red-200'}`}
              >
                {removing === i._id ? 'Removing...' : 'Remove'}
              </button>
            </div>
          </div>
        ))}
        <div className="flex items-center justify-between border-t border-agri-200 pt-4">
          <span className="text-agri-700">Total</span>
          <span className="text-agri-900 font-bold">₹{total}</span>
        </div>
        <button className="px-6 py-2 rounded-md bg-agri-600 text-white hover:bg-agri-700">Checkout</button>
      </div>
    </section>

    {/* Confirmation popup */}
    {confirmRemove && (
      <div className="fixed inset-0 z-40">
        <div className="absolute inset-0 bg-black/50 animate-[fadeIn_.2s_ease-out]" onClick={() => setConfirmRemove(null)} />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-md p-0">
          <div className="rounded-2xl bg-white shadow-2xl p-6 animate-[popIn_.2s_ease-out]">
            <h4 className="text-lg font-semibold text-agri-900">Remove from Cart?</h4>
            <p className="text-agri-700 mt-2">{confirmRemove.crop} • {confirmRemove.company}</p>
            <div className="mt-6 flex justify-end gap-3">
              <button 
                onClick={() => setConfirmRemove(null)} 
                className="px-4 py-2 rounded-md border border-agri-300 bg-white hover:bg-agri-100"
              >
                Cancel
              </button>
              <button
                onClick={confirmRemoveItem}
                disabled={removing === confirmRemove.id}
                className={`px-4 py-2 rounded-md ${removing === confirmRemove.id ? 'bg-red-300 text-red-600' : 'bg-red-600 text-white hover:bg-red-700'}`}
              >
                {removing === confirmRemove.id ? 'Removing...' : 'Remove'}
              </button>
            </div>
          </div>
        </div>
        <style>{`@keyframes fadeIn{from{opacity:0}to{opacity:1}}@keyframes popIn{0%{opacity:.6;transform:scale(.96)}100%{opacity:1;transform:scale(1)}}`}</style>
      </div>
    )}
    </>
  )
}


