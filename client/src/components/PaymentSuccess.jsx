import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import logo from '../assets/agri-logo.png'

export default function PaymentSuccess({ purchaseData, onClose, onViewHistory }) {
  const navigate = useNavigate()
  const [showAnimation, setShowAnimation] = useState(false)

  useEffect(() => {
    // Trigger success animation
    setShowAnimation(true)

    // Auto-redirect to dashboard after 5 seconds
    const timer = setTimeout(() => {
      onClose()
      onViewHistory()
    }, 5000)

    return () => clearTimeout(timer)
  }, [onClose, onViewHistory])

  const formatPrice = (price) => `₹${price.toLocaleString('en-IN')}`
  const formatDate = (dateString) => new Date(dateString).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* Success Header */}
        <div className="text-center p-8 bg-gradient-to-br from-green-50 to-emerald-50 border-b border-green-200">
          <div className={`transition-all duration-1000 ${showAnimation ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}>
            {/* Success Animation */}
            <div className="relative mb-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-2xl">✓</span>
                </div>
              </div>

              {/* Animated circles */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2">
                <div className="w-32 h-32 border-4 border-green-200 rounded-full animate-ping opacity-20"></div>
              </div>
              <div className="absolute top-2 left-1/2 transform -translate-x-1/2">
                <div className="w-24 h-24 border-3 border-green-300 rounded-full animate-ping opacity-40" style={{animationDelay: '0.5s'}}></div>
              </div>
            </div>

            <h1 className="text-3xl font-bold text-green-800 mb-2">Payment Successful!</h1>
            <p className="text-green-600 text-lg">Your order has been confirmed</p>
          </div>
        </div>

        {/* Order Details */}
        <div className="p-6">
          <h2 className="text-xl font-bold text-agri-900 mb-4">Order Details</h2>

          <div className="bg-agri-50 rounded-lg p-4 space-y-4">
            {/* Purchase Info */}
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-agri-100 rounded-lg flex items-center justify-center text-xl flex-shrink-0">
                    🌾
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-agri-900 text-lg">{purchaseData.cropName}</h3>
                    <p className="text-agri-600 text-sm">by {purchaseData.farmerName}</p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-sm text-agri-700">Quantity: 1 kg</span>
                      <span className="font-bold text-agri-900">{formatPrice(purchaseData.price)}</span>
                    </div>
                  </div>
                </div>
              </div>

            {/* Transaction Details */}
            <div className="bg-white rounded-lg p-4 shadow-sm space-y-3">
              <h4 className="font-semibold text-agri-900 mb-3">Transaction Information</h4>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-agri-600">Transaction ID:</span>
                  <p className="font-mono text-agri-900">{purchaseData.transactionId || 'TXN' + Date.now()}</p>
                </div>
                <div>
                  <span className="text-agri-600">Payment Method:</span>
                  <p className="text-agri-900 capitalize">{purchaseData.paymentMethod || 'Online'}</p>
                </div>
                <div>
                  <span className="text-agri-600">Order Time:</span>
                  <p className="text-agri-900">{formatDate(new Date())}</p>
                </div>
                <div>
                  <span className="text-agri-600">Total Amount:</span>
                  <p className="text-agri-900 font-bold">{formatPrice(purchaseData.price)}</p>
                </div>
              </div>
            </div>

            {/* Status */}
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">✓</span>
                </div>
                <div>
                  <p className="font-semibold text-green-800">Order Confirmed</p>
                  <p className="text-sm text-green-600">Your crop purchase has been successfully processed</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="p-6 bg-agri-50 border-t border-agri-200">
          <h3 className="font-semibold text-agri-900 mb-4">What's Next?</h3>

          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-xs">
                1
              </div>
              <span className="text-agri-700">Farmer will prepare your order</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-xs">
                2
              </div>
              <span className="text-agri-700">You'll receive delivery updates</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-xs">
                3
              </div>
              <span className="text-agri-700">Collect your fresh produce!</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-6">
            <button
              onClick={() => {
                onClose()
                onViewHistory()
              }}
              className="flex-1 px-4 py-3 bg-agri-600 text-white rounded-lg hover:bg-agri-700 font-medium transition-colors"
            >
              View Purchase History
            </button>
            <button
              onClick={() => {
                onClose()
                navigate('/dashboard')
              }}
              className="flex-1 px-4 py-3 border-2 border-agri-300 text-agri-700 rounded-lg hover:bg-agri-50 font-medium transition-colors"
            >
              Continue Shopping
            </button>
          </div>

          {/* Auto-redirect notice */}
          <div className="text-center mt-4">
            <p className="text-xs text-agri-500">
              Auto-redirecting to dashboard in <span className="font-semibold">5 seconds...</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
