import { useEffect, useState } from 'react'
import ProfileButtonPanel from '../components/ProfileButtonPanel'
import TopRightBrandBar from '../components/TopRightBrandBar'
import { getPurchaseHistory, getSalesHistory, clearPurchaseHistory } from '../lib/api'
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

export default function CropHistory() {
  const [soldItems, setSoldItems] = useState([])
  const [boughtItems, setBoughtItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [clearing, setClearing] = useState(false)

  // Fertilizer images mapping
  const fertilizerImages = [f1, f2, f3, f4, f5, f6, f7, f8, f9, f10, f11, f12, f13]

  const loadHistory = async (forceRefresh = false) => {
    const token = localStorage.getItem('token')
    if (!token) {
      setError('Please login first')
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError('')
      
      // Add timestamp to prevent caching
      const timestamp = forceRefresh ? `?t=${Date.now()}` : ''
      
      const [salesRes, purchaseRes] = await Promise.all([
        getSalesHistory(token),
        getPurchaseHistory(token)
      ])
      
      console.log('Sales response:', salesRes)
      console.log('Purchase response:', purchaseRes)
      
      setSoldItems(salesRes.items || [])
      setBoughtItems(purchaseRes.items || [])
    } catch (err) {
      console.error('Error loading history:', err)
      setError('Failed to load history')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadHistory()
  }, [])

  const getItemImage = (item, index) => {
    if (item.imageUrl) {
      return item.imageUrl
    }
    return fertilizerImages[index % fertilizerImages.length]
  }

  const handleClearPurchaseHistory = async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      setError('Please login first')
      return
    }

    if (!window.confirm('Are you sure you want to clear all purchase history? This action cannot be undone.')) {
      return
    }

    try {
      setClearing(true)
      await clearPurchaseHistory(token)
      setBoughtItems([])
      alert('Purchase history cleared successfully!')
    } catch (err) {
      setError('Failed to clear purchase history')
    } finally {
      setClearing(false)
    }
  }
  if (loading) {
    return (
      <>
        <TopRightBrandBar />
        <ProfileButtonPanel />
        <section className="max-w-5xl mx-auto px-4 py-10">
          <div className="text-center">
            <p className="text-agri-700">Loading history...</p>
          </div>
        </section>
      </>
    )
  }

  return (
    <>
      <TopRightBrandBar />
      <ProfileButtonPanel />
      <section className="max-w-6xl mx-auto px-4 py-10 space-y-8">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold text-agri-900">Transaction History</h2>
          <button
            onClick={() => loadHistory(true)}
            disabled={loading}
            className="px-4 py-2 bg-agri-600 text-white rounded-md hover:bg-agri-700 disabled:bg-agri-300 flex items-center gap-2"
          >
            <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
        
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Crops Sold */}
        <div>
          <h3 className="text-2xl font-bold text-agri-900 mb-4">Crops Sold</h3>
          {soldItems.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <p className="text-agri-700">No sales history found</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {soldItems.map((item, i) => (
                <div key={item._id} className="rounded-lg border border-agri-200 bg-white p-4 shadow-sm">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-lg border border-agri-200 bg-agri-50 flex items-center justify-center overflow-hidden flex-shrink-0">
                      <img 
                        src={getItemImage(item, i)} 
                        alt={item.crop}
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-agri-900">{item.crop}</p>
                      <p className="text-sm text-agri-700">{item.company}</p>
                      <p className="text-sm text-agri-700">Qty: {item.quantity} • ₹{item.pricePerUnit}/unit</p>
                      <p className="text-sm text-agri-700">Total: ₹{item.totalAmount}</p>
                      <p className="text-xs text-agri-500 mt-1">
                        {new Date(item.saleDate).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-agri-500 break-all">TXN: {item.transactionId}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Items Bought */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-2xl font-bold text-agri-900">Items Bought</h3>
            {boughtItems.length > 0 && (
              <button
                onClick={handleClearPurchaseHistory}
                disabled={clearing}
                className="px-3 py-1.5 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-red-300 text-sm"
              >
                {clearing ? 'Clearing...' : 'Clear All'}
              </button>
            )}
          </div>
          {boughtItems.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <p className="text-agri-700">No purchase history found</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {boughtItems.map((item, i) => (
                <div key={item._id} className="rounded-lg border border-agri-200 bg-white p-4 shadow-sm">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-lg border border-agri-200 bg-agri-50 flex items-center justify-center overflow-hidden flex-shrink-0">
                      <img 
                        src={getItemImage(item, i)} 
                        alt={item.crop}
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-agri-900">{item.crop}</p>
                      <p className="text-sm text-agri-700">{item.company}</p>
                      <p className="text-sm text-agri-700">Qty: {item.quantity} • ₹{item.pricePerUnit}/unit</p>
                      <p className="text-sm text-agri-700">Total: ₹{item.totalAmount}</p>
                      <p className="text-xs text-agri-500 mt-1">
                        {new Date(item.purchaseDate).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-agri-500 break-all">TXN: {item.transactionId}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}


