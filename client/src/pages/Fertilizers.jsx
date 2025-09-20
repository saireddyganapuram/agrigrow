import { useEffect, useMemo, useState } from 'react'
import ProfileButtonPanel from '../components/ProfileButtonPanel'
import TopRightBrandBar from '../components/TopRightBrandBar'
import { fetchFertilizers, addToCart } from '../lib/api'
import f1 from '../assets/f1.png'
import f2 from '../assets/f2.png'
import f3 from '../assets/f3.png'
import f4 from '../assets/f4.png'
import f5 from '../assets/f5.png'
import f6 from '../assets/f6.png'
import f7 from '../assets/f7.png'
import f8 from '../assets/f8.png'
import f9 from '../assets/f9.png'
import f10 from '../assets/f10.png'
import f11 from '../assets/f11.png'
import f12 from '../assets/f12.png'
import f13 from '../assets/f13.png'

export default function Fertilizers() {
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [items, setItems] = useState([])
  const [error, setError] = useState('')
  const [modal, setModal] = useState(null) // { crop, fertilizer }
  const [qty, setQty] = useState(1)
  const [addLoading, setAddLoading] = useState(false)
  const [addSuccess, setAddSuccess] = useState('')

  // Fertilizer images mapping
  const fertilizerImages = [f1, f2, f3, f4, f5, f6, f7, f8, f9, f10, f11, f12, f13]

  useEffect(() => {
    setLoading(true)
    fetchFertilizers()
      .then((res) => setItems(res.items || []))
      .catch(() => setError('Failed to load fertilizers'))
      .finally(() => setLoading(false))
  }, [])

  const crops = useMemo(() => {
    const filteredItems = items.filter(item => 
      !query || item.crop.toLowerCase().includes(query.toLowerCase())
    )
    return filteredItems.sort((a, b) => a.crop.localeCompare(b.crop))
  }, [items, query])

  return (
    <>
      <TopRightBrandBar />
      <ProfileButtonPanel />
      <section className="max-w-6xl mx-auto px-4 py-10">
        <h2 className="text-2xl font-bold text-agri-900 text-center">Fertilizers</h2>
        <div className="mt-4 flex items-center justify-center">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search crop (e.g., Paddy, Wheat)"
            className="w-full max-w-2xl rounded-xl border border-agri-300 bg-white/90 px-4 py-3 outline-none focus:ring-2 focus:ring-agri-400 shadow"
          />
        </div>

        {loading && <p className="mt-6 text-agri-700">Loading...</p>}
        {error && <p className="mt-6 text-red-600">{error}</p>}

        {!loading && !error && (
          <div className="mt-8 space-y-8">
            {crops.length === 0 && <p className="text-agri-700">No results.</p>}
            {crops.map(({ crop, fertilizers }) => (
              <div key={crop} className="rounded-2xl border border-agri-200 bg-gradient-to-br from-agri-50 to-white shadow-lg overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-agri-200">
                  <h3 className="text-xl font-bold text-agri-900">{crop}</h3>
                  <span className="text-sm text-agri-700">{fertilizers.length} fertilizers</span>
                </div>
                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5 p-5">
                  {fertilizers.map((fertilizer, idx) => (
                    <div
                      key={idx}
                      className="group relative rounded-xl border border-agri-200 bg-white p-4 shadow transition transform hover:-translate-y-1 hover:shadow-xl"
                    >
                      <div className="absolute -right-4 -top-4 w-12 h-12 rounded-full bg-agri-100 opacity-60 transition-transform group-hover:scale-125" />
                      {/* Fertilizer Image */}
                      <div className="mb-3 h-24 rounded-lg border border-agri-200 bg-agri-50 flex items-center justify-center overflow-hidden">
                        <img 
                          src={fertilizerImages[idx % fertilizerImages.length]} 
                          alt={fertilizer.name}
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>
                      <p className="relative z-10 font-semibold text-agri-900">{fertilizer.name}</p>
                      <p className="relative z-10 text-sm text-agri-700 mt-1">
                        Companies: {fertilizer.companies.join(', ')}
                      </p>
                      <button 
                        onClick={() => { setModal({ crop, fertilizer, imageUrl: fertilizerImages[idx % fertilizerImages.length] }); setQty(1); setAddSuccess('') }} 
                        className="relative z-10 mt-3 px-3 py-1.5 rounded-md bg-agri-600 text-white hover:bg-agri-700 text-sm"
                      >
                        View
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black/50 animate-[fadeIn_.2s_ease-out]" onClick={() => setModal(null)} />
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-md p-0">
            <div className="rounded-2xl bg-white shadow-2xl p-5 animate-[popIn_.2s_ease-out]">
              <h4 className="text-lg font-semibold text-agri-900">{modal.fertilizer.name}</h4>
              <p className="text-agri-700">{modal.crop}</p>
              <p className="text-sm text-agri-600 mt-1">Companies: {modal.fertilizer.companies.join(', ')}</p>
              <div className="mt-4 h-40 rounded-lg border border-agri-200 bg-agri-50 flex items-center justify-center overflow-hidden">
                {modal.imageUrl ? (
                  <img 
                    src={modal.imageUrl} 
                    alt={modal.fertilizer.name}
                    className="max-h-full max-w-full object-contain"
                  />
                ) : (
                  <span className="text-agri-700">Image</span>
                )}
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setQty((q) => Math.max(1, q - 1))} 
                    className="w-8 h-8 rounded-full border border-agri-300 bg-white hover:bg-agri-100" 
                    disabled={addLoading}
                  >
                    -
                  </button>
                  <span className="w-10 text-center">{qty}</span>
                  <button 
                    onClick={() => setQty((q) => q + 1)} 
                    className="w-8 h-8 rounded-full border border-agri-300 bg-white hover:bg-agri-100" 
                    disabled={addLoading}
                  >
                    +
                  </button>
                </div>
                <span className="font-semibold text-agri-900">Price: ₹150</span>
              </div>
              {addSuccess && (
                <div className="mt-3 rounded-md bg-green-50 border border-green-200 text-green-800 px-3 py-2 text-sm animate-[fadeIn_.15s_ease-out]">
                  {addSuccess}
                </div>
              )}
              <div className="mt-5 flex justify-end gap-3">
                <button 
                  onClick={() => setModal(null)} 
                  className="px-4 py-2 rounded-md border border-agri-300 bg-white hover:bg-agri-100" 
                  disabled={addLoading}
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    const token = localStorage.getItem('token')
                    if (!token) { alert('Please login first'); return }
                    setAddLoading(true)
                    setAddSuccess('')
                    addToCart({ 
                      crop: modal.fertilizer.name, 
                      company: modal.fertilizer.companies[0], 
                      pricePerUnit: 150, 
                      quantity: qty 
                    }, token)
                      .then(() => {
                        setAddSuccess('Item successfully added to cart')
                        setTimeout(() => setModal(null), 1200)
                      })
                      .catch(() => alert('Failed to add to cart'))
                      .finally(() => setAddLoading(false))
                  }}
                  className={`px-4 py-2 rounded-md ${addLoading ? 'bg-agri-300 text-agri-600' : 'bg-agri-600 text-white hover:bg-agri-700'}`}
                  disabled={addLoading}
                >
                  {addLoading ? 'Adding...' : 'Add to Cart'}
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


