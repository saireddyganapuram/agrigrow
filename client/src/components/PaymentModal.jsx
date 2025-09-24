import { useState } from 'react'
import { recordCropSale } from '../lib/api'
import logo from '../assets/agri-logo.png'
import PaymentSuccess from './PaymentSuccess'

export default function PaymentModal({ isOpen, onClose, cropDetails, onPaymentComplete }) {
  const [paymentMethod, setPaymentMethod] = useState('card')
  const [loading, setLoading] = useState(false)
  const [showScanner, setShowScanner] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [purchaseData, setPurchaseData] = useState(null)
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardHolderName: ''
  })
  const [upiId, setUpiId] = useState('')

  const handleCloseSuccess = () => {
    setShowSuccess(false)
    setPurchaseData(null)
    onClose()
  }

  const handleViewHistory = () => {
    setShowSuccess(false)
    setPurchaseData(null)
    onPaymentComplete()
    onClose()
  }

  // If success page should be shown, render it instead
  if (showSuccess && purchaseData) {
    return (
      <PaymentSuccess
        purchaseData={purchaseData}
        onClose={handleCloseSuccess}
        onViewHistory={handleViewHistory}
      />
    )
  }

  // Early return if no crop details or modal not open
  if (!isOpen || !cropDetails) {
    return null
  }

  const handlePayment = async () => {
    setLoading(true)

    try {
      // Show processing animation
      await new Promise(resolve => setTimeout(resolve, 2000))

      // For demo purposes - always succeed
      console.log('Processing dummy payment...')

      // Validate required data before making request
      if (!cropDetails?.cropName || !cropDetails?.farmerName || !cropDetails?.farmerId || !cropDetails?.price) {
        alert('Invalid crop data. Please try again.')
        return
      }

      const token = localStorage.getItem('token')
      if (!token) {
        alert('Authentication required. Please log in again.')
        return
      }

      // Attempt purchase (this might fail in real scenario, but for demo we'll handle it)
      try {
        const response = await fetch('/api/transactions/purchase', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            cropName: cropDetails.cropName,
            farmerName: cropDetails.farmerName,
            farmerId: cropDetails.farmerId,
            price: cropDetails.price,
            quantity: 1,
            unit: cropDetails.unit || 'kg'
          })
        })

        console.log('Purchase request sent:', {
          cropName: cropDetails.cropName,
          farmerName: cropDetails.farmerName,
          farmerId: cropDetails.farmerId,
          price: cropDetails.price,
          quantity: 1,
          unit: cropDetails.unit || 'kg'
        })

        let result
        if (response.ok) {
          result = await response.json()
          console.log('Purchase successful:', result)
        } else {
          // For demo, even if purchase fails, we'll show success
          console.log('Purchase failed but proceeding with demo success')
          result = { message: 'Payment successful (Demo Mode)' }
        }

        // Generate a transaction ID for the payment completion
        const transactionId = `TXN${Date.now()}${Math.random().toString(36).substr(2, 9)}`

        // Complete the payment process
        const paymentResponse = await fetch('/api/payment/complete', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            paymentMethod,
            transactionId
          })
        })

        let paymentResult
        if (paymentResponse.ok) {
          paymentResult = await paymentResponse.json()
          console.log('Payment completion successful:', paymentResult)
        } else {
          // For demo, even if completion fails, we'll show success
          console.log('Payment completion failed but proceeding with demo success')
          paymentResult = { message: 'Transaction completed (Demo Mode)' }
        }

        // Record complete purchase (crop sold + customer purchase + remove listing)
        try {
          await recordCropSale(cropDetails._id, 1, transactionId, paymentMethod, token)
          console.log('Purchase completed successfully')
        } catch (purchaseError) {
          console.log('Failed to complete purchase:', purchaseError)
        }

        // Store purchase data for success page
        setPurchaseData({
          ...cropDetails,
          transactionId,
          paymentMethod
        })

        // Show success page
        setShowSuccess(true)

      } catch (apiError) {
        // Even if API fails, show success for demo
        console.log('API error but showing demo success:', apiError)

        // Record complete purchase (crop sold + customer purchase + remove listing)
        const transactionId = `TXN${Date.now()}${Math.random().toString(36).substr(2, 9)}`
        try {
          await recordCropSale(cropDetails._id, 1, transactionId, paymentMethod, token)
          console.log('Purchase completed successfully')
        } catch (purchaseError) {
          console.log('Failed to complete purchase:', purchaseError)
        }

        // Store purchase data for success page
        setPurchaseData({
          ...cropDetails,
          transactionId,
          paymentMethod
        })

        // Show success page
        setShowSuccess(true)
      }

    } catch (error) {
      console.error('Payment error:', error)
      alert('Payment failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const formatPrice = (price) => `₹${price.toLocaleString('en-IN')}`

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[95vh] flex flex-col">
        {/* Header - Fixed */}
        <div className="flex items-center justify-between p-6 border-b border-agri-200 flex-shrink-0">
          <div className="flex items-center gap-4">
            <img src={logo} alt="AgriGrow" className="w-10 h-10 bg-white rounded-full p-1" />
            <div>
              <h2 className="text-2xl font-bold text-agri-900">Secure Payment</h2>
              <p className="text-agri-600">Complete your purchase safely</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-agri-700 hover:text-agri-900 text-2xl p-2 hover:bg-agri-100 rounded-full transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Content Area - Scrollable */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left Side - Order Summary - Fixed */}
          <div className="w-1/3 bg-agri-50 p-6 border-r border-agri-200 flex-shrink-0">
            <h3 className="font-bold text-agri-900 mb-6 text-lg">Order Summary</h3>

            <div className="space-y-4">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-agri-100 rounded-lg flex items-center justify-center text-xl">
                    🌾
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-agri-900">{cropDetails?.cropName || 'Loading...'}</h4>
                    <p className="text-sm text-agri-600">by {cropDetails?.farmerName || 'Unknown Farmer'}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 shadow-sm space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-agri-700">Quantity:</span>
                  <span className="font-medium">1 {cropDetails?.unit || 'kg'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-agri-700">Price per {cropDetails?.unit || 'kg'}:</span>
                  <span className="font-medium">{formatPrice(cropDetails?.price || 0)}</span>
                </div>
                <hr className="border-agri-300" />
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Total:</span>
                  <span className="text-agri-600">{formatPrice(cropDetails?.price || 0)}</span>
                </div>
              </div>

              <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                <div className="flex items-center gap-2 text-green-700">
                  <span className="text-lg">🔒</span>
                  <span className="text-sm font-medium">Secure Payment</span>
                </div>
                <p className="text-xs text-green-600 mt-1">Your payment information is encrypted and secure</p>
              </div>
            </div>
          </div>

          {/* Right Side - Payment Methods - Scrollable */}
          <div className="flex-1 overflow-y-auto p-6">
            <h3 className="font-bold text-agri-900 mb-6 text-lg">Choose Payment Method</h3>

            <div className="space-y-4">
                {/* Credit/Debit Card */}
                <div className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${
                  paymentMethod === 'card' ? 'border-agri-500 bg-agri-50' : 'border-agri-200 hover:border-agri-300'
                }`} onClick={() => setPaymentMethod('card')}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      💳
                    </div>
                    <span className="font-medium text-agri-900">Credit/Debit Card</span>
                  </div>

                  {paymentMethod === 'card' && (
                    <div className="space-y-4 mt-4">
                      <div>
                        <label className="block text-sm font-medium text-agri-700 mb-2">Card Number</label>
                        <input
                          type="text"
                          placeholder="1234 5678 9012 3456"
                          value={cardDetails.cardNumber}
                          onChange={(e) => setCardDetails({...cardDetails, cardNumber: e.target.value})}
                          className="w-full px-4 py-3 border border-agri-300 rounded-lg focus:ring-2 focus:ring-agri-400 focus:border-transparent"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-agri-700 mb-2">Expiry Date</label>
                          <input
                            type="text"
                            placeholder="MM/YY"
                            value={cardDetails.expiryDate}
                            onChange={(e) => setCardDetails({...cardDetails, expiryDate: e.target.value})}
                            className="w-full px-4 py-3 border border-agri-300 rounded-lg focus:ring-2 focus:ring-agri-400 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-agri-700 mb-2">CVV</label>
                          <input
                            type="text"
                            placeholder="123"
                            value={cardDetails.cvv}
                            onChange={(e) => setCardDetails({...cardDetails, cvv: e.target.value})}
                            className="w-full px-4 py-3 border border-agri-300 rounded-lg focus:ring-2 focus:ring-agri-400 focus:border-transparent"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-agri-700 mb-2">Card Holder Name</label>
                        <input
                          type="text"
                          placeholder="John Doe"
                          value={cardDetails.cardHolderName}
                          onChange={(e) => setCardDetails({...cardDetails, cardHolderName: e.target.value})}
                          className="w-full px-4 py-3 border border-agri-300 rounded-lg focus:ring-2 focus:ring-agri-400 focus:border-transparent"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* UPI */}
                <div className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${
                  paymentMethod === 'upi' ? 'border-agri-500 bg-agri-50' : 'border-agri-200 hover:border-agri-300'
                }`} onClick={() => setPaymentMethod('upi')}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        📱
                      </div>
                      <span className="font-medium text-agri-900">UPI</span>
                    </div>
                    {paymentMethod === 'upi' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setShowScanner(!showScanner)
                        }}
                        className="px-3 py-1 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700"
                      >
                        {showScanner ? 'Manual Entry' : 'QR Scanner'}
                      </button>
                    )}
                  </div>

                  {paymentMethod === 'upi' && (
                    <div className="mt-4">
                      {showScanner ? (
                        <div className="text-center py-6">
                          <div className="w-72 h-72 bg-white rounded-xl mx-auto mb-4 flex items-center justify-center border-2 border-agri-200 shadow-inner p-4">
                            <div className="relative">
                              {/* QR Code Pattern - Made smaller to fit properly */}
                              <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-sm">
                                {/* Outer border */}
                                <rect x="0" y="0" width="200" height="200" fill="#000000" stroke="#000" strokeWidth="3"/>

                                {/* Inner white space */}
                                <rect x="6" y="6" width="188" height="188" fill="#ffffff"/>

                                {/* Corner position markers */}
                                <g fill="#000000">
                                  {/* Top-left corner */}
                                  <rect x="0" y="0" width="42" height="42" fill="#ffffff"/>
                                  <rect x="6" y="6" width="30" height="30" fill="#000000"/>
                                  <rect x="12" y="12" width="18" height="18" fill="#ffffff"/>
                                  <rect x="18" y="18" width="6" height="6" fill="#000000"/>

                                  {/* Top-right corner */}
                                  <rect x="158" y="0" width="42" height="42" fill="#ffffff"/>
                                  <rect x="164" y="6" width="30" height="30" fill="#000000"/>
                                  <rect x="170" y="12" width="18" height="18" fill="#ffffff"/>
                                  <rect x="176" y="18" width="6" height="6" fill="#000000"/>

                                  {/* Bottom-left corner */}
                                  <rect x="0" y="158" width="42" height="42" fill="#ffffff"/>
                                  <rect x="6" y="164" width="30" height="30" fill="#000000"/>
                                  <rect x="12" y="170" width="18" height="18" fill="#ffffff"/>
                                  <rect x="18" y="176" width="6" height="6" fill="#000000"/>
                                </g>

                                {/* Data pattern - simulating QR code data */}
                                <g fill="#000000">
                                  {/* Left data blocks */}
                                  <rect x="48" y="48" width="6" height="6"/>
                                  <rect x="48" y="60" width="6" height="6"/>
                                  <rect x="48" y="72" width="6" height="6"/>
                                  <rect x="60" y="48" width="6" height="6"/>
                                  <rect x="60" y="72" width="6" height="6"/>
                                  <rect x="72" y="48" width="6" height="6"/>
                                  <rect x="72" y="60" width="6" height="6"/>
                                  <rect x="72" y="72" width="6" height="6"/>

                                  {/* Right data blocks */}
                                  <rect x="126" y="48" width="6" height="6"/>
                                  <rect x="126" y="60" width="6" height="6"/>
                                  <rect x="126" y="72" width="6" height="6"/>
                                  <rect x="138" y="48" width="6" height="6"/>
                                  <rect x="138" y="72" width="6" height="6"/>
                                  <rect x="150" y="48" width="6" height="6"/>
                                  <rect x="150" y="60" width="6" height="6"/>
                                  <rect x="150" y="72" width="6" height="6"/>

                                  {/* Bottom data blocks */}
                                  <rect x="48" y="126" width="6" height="6"/>
                                  <rect x="60" y="126" width="6" height="6"/>
                                  <rect x="72" y="126" width="6" height="6"/>
                                  <rect x="48" y="138" width="6" height="6"/>
                                  <rect x="48" y="150" width="6" height="6"/>
                                  <rect x="72" y="138" width="6" height="6"/>
                                  <rect x="72" y="150" width="6" height="6"/>

                                  {/* Center data blocks */}
                                  <rect x="88" y="88" width="24" height="24" fill="#ffffff"/>
                                  <rect x="94" y="94" width="12" height="12" fill="#000000"/>
                                  <rect x="100" y="100" width="6" height="6" fill="#ffffff"/>
                                  <rect x="103" y="103" width="3" height="3" fill="#000000"/>
                                </g>

                                {/* Timing patterns */}
                                <rect x="42" y="6" width="6" height="36" fill="#000000"/>
                                <rect x="6" y="42" width="36" height="6" fill="#000000"/>
                                <rect x="152" y="6" width="6" height="36" fill="#000000"/>
                                <rect x="158" y="42" width="36" height="6" fill="#000000"/>

                                {/* Alignment pattern */}
                                <rect x="158" y="158" width="18" height="18" fill="#ffffff"/>
                                <rect x="164" y="164" width="6" height="6" fill="#000000"/>
                              </svg>

                              {/* UPI Payment Info Overlay */}
                              <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 bg-white rounded-lg px-4 py-2 shadow-lg border border-agri-200 min-w-max">
                                <div className="text-center">
                                  <p className="text-sm font-semibold text-agri-900">UPI: demo@paytm</p>
                                  <p className="text-sm text-agri-600">₹{cropDetails?.price || 0}</p>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <button
                              onClick={() => setShowScanner(false)}
                              className="px-4 py-2 bg-agri-600 text-white rounded-lg hover:bg-agri-700 text-sm transition-colors"
                            >
                              Use Manual Entry
                            </button>
                            <p className="text-sm text-agri-500 text-center">
                              📱 Point your UPI app camera at this QR code to pay
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <label className="block text-sm font-medium text-agri-700 mb-2">UPI ID</label>
                          <input
                            type="text"
                            placeholder="yourname@paytm or yournumber@upi"
                            value={upiId}
                            onChange={(e) => setUpiId(e.target.value)}
                            className="w-full px-4 py-3 border border-agri-300 rounded-lg focus:ring-2 focus:ring-agri-400 focus:border-transparent"
                          />
                          <p className="text-xs text-agri-500 mt-2">Enter your UPI ID (e.g., john@paytm, 9876543210@upi)</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Net Banking */}
                <div className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${
                  paymentMethod === 'netbanking' ? 'border-agri-500 bg-agri-50' : 'border-agri-200 hover:border-agri-300'
                }`} onClick={() => setPaymentMethod('netbanking')}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                      🏦
                    </div>
                    <span className="font-medium text-agri-900">Net Banking</span>
                  </div>

                  {paymentMethod === 'netbanking' && (
                    <div className="mt-4">
                      <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                        <p className="text-sm text-orange-700 mb-2">🏦 You will be redirected to your bank's secure payment page</p>
                        <p className="text-xs text-orange-600">Select your bank from the list after clicking Pay</p>
                      </div>
                    </div>
                  )}
                </div>
            </div>
          </div>
        </div>

        {/* Action Buttons - Fixed */}
        <div className="flex gap-4 p-6 border-t border-agri-200 flex-shrink-0">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 border-2 border-agri-300 text-agri-700 rounded-lg hover:bg-agri-100 font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handlePayment}
            disabled={loading}
            className={`flex-1 px-6 py-3 rounded-lg font-bold text-lg transition-all ${
              loading
                ? 'bg-agri-300 text-agri-600 cursor-not-allowed'
                : 'bg-agri-600 text-white hover:bg-agri-700 shadow-lg hover:shadow-xl'
            }`}
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Processing Payment...
              </div>
            ) : (
              `Pay ${formatPrice(cropDetails?.price || 0)}`
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
