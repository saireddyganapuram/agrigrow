import { useEffect, useState } from 'react'
import ProfileButtonPanel from '../components/ProfileButtonPanel'
import TopRightBrandBar from '../components/TopRightBrandBar'
import { createCropListing, fetchMyCropListings, deleteCropListing } from '../lib/api'

export default function Sell() {
  const [form, setForm] = useState({ cropName: '', quantity: '', price: '', unit: 'kg', description: '' })
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [deleting, setDeleting] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)

  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const loadListings = () => {
    const token = localStorage.getItem('token')
    if (!token) return
    setLoading(true)
    fetchMyCropListings(token)
      .then((res) => setListings(res.listings || []))
      .catch(() => setError('Failed to load listings'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadListings()
  }, [])

  const onSubmit = (e) => {
    e.preventDefault()
    const token = localStorage.getItem('token')
    if (!token) { alert('Please login first'); return }
    
    setSubmitting(true)
    setError('')
    setSuccess('')
    
    createCropListing(form, token)
      .then(() => {
        setSuccess('Crop listing created successfully!')
        setForm({ cropName: '', quantity: '', price: '', unit: 'kg', description: '' })
        loadListings()
      })
      .catch(() => setError('Failed to create listing'))
      .finally(() => setSubmitting(false))
  }

  const handleDelete = (listing) => {
    setConfirmDelete({ id: listing._id, cropName: listing.cropName })
  }

  const confirmDeleteListing = () => {
    if (!confirmDelete) return
    const token = localStorage.getItem('token')
    if (!token) return
    
    setDeleting(confirmDelete.id)
    deleteCropListing(confirmDelete.id, token)
      .then(() => {
        loadListings()
        setSuccess('Listing deleted successfully!')
      })
      .catch(() => setError('Failed to delete listing'))
      .finally(() => {
        setDeleting(null)
        setConfirmDelete(null)
      })
  }
  return (
    <>
      <TopRightBrandBar />
      <ProfileButtonPanel />
      <section className="max-w-6xl mx-auto px-4 py-10">
        <h2 className="text-2xl font-bold text-agri-900 text-center">Sell Produce</h2>
        
        {/* Create Listing Form */}
        <div className="mt-8 max-w-2xl mx-auto">
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-agri-700">Crop Name</label>
                <input 
                  value={form.cropName} 
                  onChange={update('cropName')} 
                  className="mt-1 w-full rounded-md border border-agri-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-agri-400" 
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-agri-700">Unit</label>
                <select 
                  value={form.unit} 
                  onChange={update('unit')} 
                  className="mt-1 w-full rounded-md border border-agri-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-agri-400"
                >
                  <option value="kg">kg</option>
                  <option value="quintal">quintal</option>
                  <option value="ton">ton</option>
                  <option value="bags">bags</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-agri-700">Quantity</label>
                <input 
                  type="number" 
                  value={form.quantity} 
                  onChange={update('quantity')} 
                  className="mt-1 w-full rounded-md border border-agri-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-agri-400" 
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-agri-700">Price (per unit)</label>
                <input 
                  type="number" 
                  value={form.price} 
                  onChange={update('price')} 
                  className="mt-1 w-full rounded-md border border-agri-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-agri-400" 
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm text-agri-700">Description (optional)</label>
              <textarea 
                value={form.description} 
                onChange={update('description')} 
                rows={3}
                className="mt-1 w-full rounded-md border border-agri-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-agri-400"
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
                {submitting ? 'Creating...' : 'Create Listing'}
              </button>
            </div>
          </form>
        </div>

        {/* My Listings */}
        <div className="mt-12">
          <h3 className="text-xl font-bold text-agri-900 mb-6">My Crop Listings</h3>
          {loading && <p className="text-agri-700">Loading...</p>}
          {!loading && listings.length === 0 && (
            <p className="text-agri-700 text-center py-8">No listings yet. Create your first listing above!</p>
          )}
          {!loading && listings.length > 0 && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {listings.map((listing) => (
                <div key={listing._id} className="rounded-lg border border-agri-200 bg-white p-4 shadow-sm">
                  <h4 className="font-semibold text-agri-900">{listing.cropName}</h4>
                  <p className="text-sm text-agri-700 mt-1">Quantity: {listing.quantity} {listing.unit}</p>
                  <p className="text-sm text-agri-700">Price: ₹{listing.price}/{listing.unit}</p>
                  <p className="text-sm text-agri-700">Total Value: ₹{listing.quantity * listing.price}</p>
                  {listing.description && (
                    <p className="text-sm text-agri-600 mt-2">{listing.description}</p>
                  )}
                  <div className="mt-3 flex items-center justify-between">
                    <span className={`text-xs px-2 py-1 rounded-full ${listing.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {listing.isAvailable ? 'Available' : 'Sold'}
                    </span>
                    <span className="text-xs text-agri-500">
                      {new Date(listing.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="mt-3 flex justify-end">
                    <button
                      onClick={() => handleDelete(listing)}
                      disabled={deleting === listing._id}
                      className={`px-3 py-1.5 rounded-md text-sm ${deleting === listing._id ? 'bg-red-200 text-red-600' : 'bg-red-100 text-red-700 hover:bg-red-200'}`}
                    >
                      {deleting === listing._id ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Delete Confirmation Popup */}
      {confirmDelete && (
        <div className="fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black/50 animate-[fadeIn_.2s_ease-out]" onClick={() => setConfirmDelete(null)} />
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-md p-0">
            <div className="rounded-2xl bg-white shadow-2xl p-6 animate-[popIn_.2s_ease-out]">
              <h4 className="text-lg font-semibold text-agri-900">Delete Listing?</h4>
              <p className="text-agri-700 mt-2">Are you sure you want to delete "{confirmDelete.cropName}" listing? This action cannot be undone.</p>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => setConfirmDelete(null)}
                  className="px-4 py-2 rounded-md border border-agri-300 bg-white hover:bg-agri-100"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDeleteListing}
                  disabled={deleting === confirmDelete.id}
                  className={`px-4 py-2 rounded-md ${deleting === confirmDelete.id ? 'bg-red-300 text-red-600' : 'bg-red-600 text-white hover:bg-red-700'}`}
                >
                  {deleting === confirmDelete.id ? 'Deleting...' : 'Delete'}
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


