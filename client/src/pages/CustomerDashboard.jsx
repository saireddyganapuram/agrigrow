import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { request } from '../lib/api'
import logo from '../assets/agri-logo.png'
import PaymentModal from '../components/PaymentModal'

export default function CustomerDashboard() {
  const navigate = useNavigate()
  const [panelOpen, setPanelOpen] = useState(false)
  const [me, setMe] = useState(null)
  const [loadingMe, setLoadingMe] = useState(false)
  const [cropListings, setCropListings] = useState([])
  const [loadingListings, setLoadingListings] = useState(true)
  const [buyingItem, setBuyingItem] = useState(null)
  const [paymentModalOpen, setPaymentModalOpen] = useState(false)
  const [selectedCrop, setSelectedCrop] = useState(null)

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/customer-login')
  }

  useEffect(() => {
    if (!panelOpen) return
    const token = localStorage.getItem('token')
    if (!token) return

    const fetchProfile = async () => {
      try {
        setLoadingMe(true)
        const response = await request('/api/customers/me', { token })
        setMe(response.customer)
      } catch (error) {
        console.error('Error fetching profile:', error)
      } finally {
        setLoadingMe(false)
      }
    }

    fetchProfile()
  }, [panelOpen])

  useEffect(() => {
    fetchCropListings()
  }, [])

  const fetchCropListings = async () => {
    try {
      const response = await fetch('/api/crop-listings/all')
      const data = await response.json()
      if (response.ok) {
        setCropListings(data.listings || [])
      }
    } catch (error) {
      console.error('Failed to fetch crop listings:', error)
    } finally {
      setLoadingListings(false)
    }
  }

  const handlePurchaseCrop = (listing) => {
    setSelectedCrop(listing)
    setPaymentModalOpen(true)
  }

  const handlePaymentComplete = () => {
    // Refresh the crop listings after successful payment
    fetchCropListings()
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatPrice = (price) => `₹${price.toLocaleString('en-IN')}`

  const displayName = me?.fullname || JSON.parse(localStorage.getItem('user') || '{}').fullname || 'Customer'

  return (
    <div className="min-h-screen bg-gradient-to-b from-agri-50 to-white text-agri-900">
      {/* Navbar */}
      <header className="border-b border-agri-200 bg-white/80 backdrop-blur sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3 font-semibold text-2xl text-agri-900">
            <img src={logo} alt="AgriGrow" className="w-10 h-10" />
            AgriGrow
          </div>
          <nav className="flex items-center gap-4 text-base">
            <button
              onClick={() => setPanelOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-agri-400 bg-white hover:bg-agri-100 text-agri-800"
            >
              <span className="text-lg">👤</span>
              <span className="font-medium">{displayName}</span>
            </button>
            <button
              onClick={logout}
              className="px-4 py-2 rounded-full border border-agri-400 bg-white hover:bg-agri-100 text-agri-800"
            >
              Logout
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-agri-900 mb-4">Customer Dashboard</h1>
          <p className="text-lg text-agri-700 mb-8">Welcome to your AgriGrow customer portal</p>
        </div>

        {/* Available Crops Section */}
        <section>
          <h2 className="text-2xl font-bold text-agri-900 mb-6">Available Crops</h2>

          {loadingListings ? (
            <div className="text-center py-8">
              <p className="text-agri-700">Loading crop listings...</p>
            </div>
          ) : cropListings.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-agri-700">No crops available at the moment.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cropListings.map((listing) => (
                <div key={listing._id} className="bg-white rounded-lg shadow-md p-6 border border-agri-200 hover:shadow-lg transition-shadow">
                  <div className="mb-4">
                    <h3 className="text-xl font-semibold text-agri-900 mb-2">{listing.cropName}</h3>
                    <p className="text-agri-700 text-sm mb-3">{listing.description || 'No description available'}</p>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="font-medium text-agri-800">Farmer:</span>
                        <span className="text-agri-700">{listing.farmerName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-agri-800">Price:</span>
                        <span className="text-agri-700">{formatPrice(listing.price)} per {listing.unit}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-agri-800">Quantity:</span>
                        <span className="text-agri-700">{listing.quantity} {listing.unit}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-agri-800">Listed:</span>
                        <span className="text-agri-700">{formatDate(listing.createdAt)}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handlePurchaseCrop(listing)}
                    disabled={buyingItem === listing._id}
                    className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                      buyingItem === listing._id
                        ? 'bg-agri-300 text-agri-600 cursor-not-allowed'
                        : 'bg-agri-600 text-white hover:bg-agri-700'
                    }`}
                  >
                    {buyingItem === listing._id ? 'Processing...' : 'Buy Now'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Profile Panel */}
      {panelOpen && (
        <div className="fixed inset-0 z-20">
          <div className="absolute inset-0 bg-black/30" onClick={() => setPanelOpen(false)} />
          <div className="absolute right-4 top-24 w-96 bg-white border border-agri-300 rounded-2xl shadow-2xl p-6 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-agri-900">Customer Profile</h3>
              <button
                onClick={() => setPanelOpen(false)}
                className="text-agri-800 hover:text-agri-900 text-xl"
              >
                ✕
              </button>
            </div>

            {loadingMe ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-agri-500"></div>
              </div>
            ) : me ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-agri-100 flex items-center justify-center">
                    <span className="text-xl">👤</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-agri-900">{me.fullname}</h4>
                    <p className="text-sm text-agri-600">Customer</p>
                  </div>
                </div>
                
                <div className="space-y-3 text-sm border-t border-agri-200 pt-4">
                  <div className="flex justify-between">
                    <span className="font-medium text-agri-700">Email:</span>
                    <span className="text-agri-900">{me.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-agri-700">Username:</span>
                    <span className="text-agri-900">{me.username}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-agri-700">Phone:</span>
                    <span className="text-agri-900">{me.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-agri-700">Address:</span>
                    <span className="text-agri-900 text-right max-w-48">{me.address}</span>
                  </div>
                  {me.gender && (
                    <div className="flex justify-between">
                      <span className="font-medium text-agri-700">Gender:</span>
                      <span className="text-agri-900">{me.gender}</span>
                    </div>
                  )}
                </div>
                
                <div className="mt-6 pt-4 border-t border-agri-200">
                  <button
                    onClick={() => {
                      setPanelOpen(false)
                      navigate('/customers/purchase-history')
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 bg-agri-100 hover:bg-agri-200 rounded-lg transition-colors"
                  >
                    <span className="text-xl">📋</span>
                    <span className="font-medium text-agri-900">Purchase History</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-4xl mb-2">⚠️</div>
                <p className="text-agri-600">Failed to load profile data</p>
                <button 
                  onClick={() => setPanelOpen(false)}
                  className="mt-2 text-agri-700 hover:text-agri-900 underline"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Payment Modal */}
      <PaymentModal
        isOpen={paymentModalOpen}
        onClose={() => {
          setPaymentModalOpen(false)
          setSelectedCrop(null)
        }}
        cropDetails={selectedCrop}
        onPaymentComplete={handlePaymentComplete}
      />
    </div>
  )
}
