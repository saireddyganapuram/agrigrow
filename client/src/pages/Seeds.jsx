import { useEffect, useMemo, useState } from 'react'
import ProfileButtonPanel from '../components/ProfileButtonPanel'
import TopRightBrandBar from '../components/TopRightBrandBar'
import { addToCart, fetchSeeds } from '../lib/api'

export default function Seeds() {
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [items, setItems] = useState([])
  const [error, setError] = useState('')
  const [modal, setModal] = useState(null) // { crop, company }
  const [qty, setQty] = useState(1)
  const [addLoading, setAddLoading] = useState(false)
  const [addSuccess, setAddSuccess] = useState('')

  useEffect(() => {
    setLoading(true)
    fetchSeeds()
      .then((res) => setItems(res.items || []))
      .catch(() => setError('Failed to load seeds'))
      .finally(() => setLoading(false))
  }, [])

  const crops = useMemo(() => {
    const cropToCompanies = {}
    for (const company of items) {
      for (const crop of company.seeds || []) {
        const key = crop.trim()
        if (!query || key.toLowerCase().includes(query.toLowerCase())) {
          if (!cropToCompanies[key]) cropToCompanies[key] = []
          cropToCompanies[key].push({ company: company.company_name, category: company.category })
        }
      }
    }
    // Sort crops alphabetically and companies by name
    const entries = Object.entries(cropToCompanies).sort((a, b) => a[0].localeCompare(b[0]))
    return entries.map(([crop, companies]) => ({ crop, companies: companies.sort((a, b) => a.company.localeCompare(b.company)) }))
  }, [items, query])

  return (
    <>
      <TopRightBrandBar />
      <ProfileButtonPanel />
      <section className="max-w-6xl mx-auto px-4 py-10">
        <h2 className="text-2xl font-bold text-agri-900 text-center">Seeds</h2>
        <div className="mt-4 flex items-center justify-center">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search crop (e.g., Paddy, Tomato)"
            className="w-full max-w-2xl rounded-xl border border-agri-300 bg-white/90 px-4 py-3 outline-none focus:ring-2 focus:ring-agri-400 shadow"
          />
        </div>

        {loading && <p className="mt-6 text-agri-700">Loading...</p>}
        {error && <p className="mt-6 text-red-600">{error}</p>}

        {!loading && !error && (
          <div className="mt-8 space-y-8">
            {crops.length === 0 && <p className="text-agri-700">No results.</p>}
            {crops.map(({ crop, companies }) => (
              <div key={crop} className="rounded-2xl border border-agri-200 bg-gradient-to-br from-agri-50 to-white shadow-lg overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-agri-200">
                  <h3 className="text-xl font-bold text-agri-900">{crop}</h3>
                  <span className="text-sm text-agri-700">{companies.length} companies</span>
                </div>
                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5 p-5">
                  {companies.map((c, idx) => (
                    <div
                      key={idx}
                      className="group relative rounded-xl border border-agri-200 bg-white p-4 shadow transition transform hover:-translate-y-1 hover:shadow-xl"
                    >
                      <div className="absolute -right-4 -top-4 w-12 h-12 rounded-full bg-agri-100 opacity-60 transition-transform group-hover:scale-125" />
                      <p className="relative z-10 font-semibold text-agri-900">{c.company}</p>
                      <button onClick={() => { setModal({ crop, company: c.company }); setQty(1) }} className="relative z-10 mt-3 px-3 py-1.5 rounded-md bg-agri-600 text-white hover:bg-agri-700 text-sm">View</button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {modal && (
        <div className="fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black/50 animate-[fadeIn_.2s_ease-out]" onClick={() => setModal(null)} />
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-md p-0">
            <div className="rounded-2xl bg-white shadow-2xl p-5 animate-[popIn_.2s_ease-out]">
              <h4 className="text-lg font-semibold text-agri-900">{modal.crop}</h4>
              <p className="text-agri-700">{modal.company}</p>
              <div className="mt-4 h-40 rounded-lg border border-agri-200 bg-agri-50 flex items-center justify-center text-agri-700">Image</div>
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="w-8 h-8 rounded-full border border-agri-300 bg-white hover:bg-agri-100" disabled={addLoading}>-</button>
                  <span className="w-10 text-center">{qty}</span>
                <button onClick={() => setQty((q) => q + 1)} className="w-8 h-8 rounded-full border border-agri-300 bg-white hover:bg-agri-100" disabled={addLoading}>+</button>
                </div>
                <span className="font-semibold text-agri-900">Price: ₹100</span>
              </div>
            {addSuccess && (
              <div className="mt-3 rounded-md bg-green-50 border border-green-200 text-green-800 px-3 py-2 text-sm animate-[fadeIn_.15s_ease-out]">
                {addSuccess}
              </div>
            )}
              <div className="mt-5 flex justify-end gap-3">
              <button onClick={() => setModal(null)} className="px-4 py-2 rounded-md border border-agri-300 bg-white hover:bg-agri-100" disabled={addLoading}>Cancel</button>
                <button
                  onClick={() => {
                    const token = localStorage.getItem('token')
                    if (!token) { alert('Please login first'); return }
                    setAddLoading(true)
                    setAddSuccess('')
                    addToCart({ crop: modal.crop, company: modal.company, pricePerUnit: 100, quantity: qty }, token)
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


