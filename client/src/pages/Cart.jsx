import { useEffect, useState } from 'react'
import ProfileButtonPanel from '../components/ProfileButtonPanel'
import TopRightBrandBar from '../components/TopRightBrandBar'
import { fetchCart, removeFromCart, completePayment } from '../lib/api'
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
import logo from '../assets/agri-logo.png'
export default function Cart() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [removing, setRemoving] = useState(null)
  const [confirmRemove, setConfirmRemove] = useState(null) // { id, crop, company }
  const [showPayment, setShowPayment] = useState(false)
  const [paymentStep, setPaymentStep] = useState(1) // 1: payment method, 2: payment details, 3: processing, 4: success
  const [upiMethod, setUpiMethod] = useState('') // 'id' or 'qr'
  const [paymentMethod, setPaymentMethod] = useState('')
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    name: '',
    upiId: '',
    phone: ''
  })
  const [processing, setProcessing] = useState(false)

  // Fertilizer images mapping
  const fertilizerImages = [f1, f2, f3, f4, f5, f6, f7, f8, f9, f10, f11, f12, f13]

  // Function to get image for cart item (only for fertilizers)
  const getItemImage = (item) => {
    // Only return image if item has imageUrl (fertilizers)
    return item.imageUrl || null
  }

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

  const handleCheckout = () => {
    if (items.length === 0) {
      alert('Your cart is empty')
      return
    }
    setShowPayment(true)
    setPaymentStep(1)
  }

  const handlePaymentMethodSelect = (method) => {
    setPaymentMethod(method)
    if (method === 'upi') {
      setPaymentStep(1.5) // Show UPI method selection
    } else {
      setPaymentStep(2)
    }
  }

  const handleUpiMethodSelect = (method) => {
    setUpiMethod(method)
    setPaymentStep(2)
  }

  const handlePaymentDetailsChange = (field, value) => {
    setPaymentDetails(prev => ({ ...prev, [field]: value }))
  }

  const processPayment = async () => {
    setPaymentStep(3)
    setProcessing(true)
    
    // Simulate processing delay
    setTimeout(async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          alert('Please login first')
          setProcessing(false)
          setPaymentStep(2)
          return
        }

        // Generate transaction ID
        const transactionId = `TXN${Date.now()}${Math.random().toString(36).substr(2, 9)}`
        
        // Call payment API
        await completePayment({
          paymentMethod,
          transactionId
        }, token)

        setProcessing(false)
        setPaymentStep(4)
        
        // Redirect to agri home after success
        setTimeout(() => {
          window.location.href = '/agri'
        }, 2000)
        
      } catch (error) {
        console.error('Payment error:', error)
        setProcessing(false)
        setPaymentStep(2)
        alert('Payment failed. Please try again.')
      }
    }, 1500)
  }

  const resetPayment = () => {
    setShowPayment(false)
    setPaymentStep(1)
    setPaymentMethod('')
    setUpiMethod('')
    setPaymentDetails({
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      name: '',
      upiId: '',
      phone: ''
    })
  }

  const total = items.reduce((s, i) => s + i.quantity * i.pricePerUnit, 0)
  return (
    <div className="relative min-h-screen">
      {/* Background Logo */}
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-0">
        <div
          className="w-[32rem] h-[32rem] opacity-10 bg-no-repeat bg-contain bg-center"
          style={{ backgroundImage: `url(${logo})` }}
          aria-hidden="true"
        />
      </div>

      <div className="relative z-10">
        <TopRightBrandBar />
        <ProfileButtonPanel />
        <section className="max-w-4xl mx-auto px-4 py-10">
          <h2 className="text-2xl font-bold text-agri-900">Cart</h2>
        <div className="mt-6 space-y-4">
          {loading && <p className="text-agri-700">Loading...</p>}
          {error && <p className="text-red-600">{error}</p>}
          {items.map((i) => (
            <div key={i._id} className="flex items-center gap-4 rounded-lg border border-agri-200 bg-white p-4 shadow-sm">
              {/* Item Image - Only for fertilizers */}
              <div className="w-16 h-16 rounded-lg border border-agri-200 bg-agri-50 flex items-center justify-center overflow-hidden flex-shrink-0">
                {getItemImage(i) ? (
                  <img 
                    src={getItemImage(i)} 
                    alt={i.crop}
                    className="max-h-full max-w-full object-contain"
                  />
                ) : (
                  <span className="text-2xl">🌱</span>
                )}
              </div>
              
              {/* Item Details */}
              <div className="flex-1">
                <p className="font-semibold text-agri-900">{i.crop} • {i.company}</p>
                <p className="text-agri-700">Qty: {i.quantity} • ₹{i.pricePerUnit}/unit</p>
              </div>
              
              {/* Price and Remove Button */}
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
          <button 
            onClick={handleCheckout}
            disabled={items.length === 0}
            className={`px-6 py-2 rounded-md ${items.length === 0 ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-agri-600 text-white hover:bg-agri-700'}`}
          >
            Checkout
          </button>
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

      {/* Payment Gateway Modal */}
      {showPayment && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50 animate-[fadeIn_.2s_ease-out]" onClick={resetPayment} />
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-md p-0">
            <div className="rounded-2xl bg-white shadow-2xl p-6 animate-[popIn_.2s_ease-out]">
              
              {/* Step 1: Payment Method Selection */}
              {paymentStep === 1 && (
                <>
                  <h4 className="text-xl font-semibold text-agri-900 mb-4">Choose Payment Method</h4>
                  <div className="space-y-3">
                    <button
                      onClick={() => handlePaymentMethodSelect('card')}
                      className="w-full p-4 rounded-lg border border-agri-200 hover:border-agri-400 hover:bg-agri-50 transition-colors text-left"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-blue-100 flex items-center justify-center">💳</div>
                        <div>
                          <p className="font-medium text-agri-900">Credit/Debit Card</p>
                          <p className="text-sm text-agri-600">Visa, Mastercard, RuPay</p>
                        </div>
                      </div>
                    </button>
                    
                    <button
                      onClick={() => handlePaymentMethodSelect('upi')}
                      className="w-full p-4 rounded-lg border border-agri-200 hover:border-agri-400 hover:bg-agri-50 transition-colors text-left"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-purple-100 flex items-center justify-center">📱</div>
                        <div>
                          <p className="font-medium text-agri-900">UPI Payment</p>
                          <p className="text-sm text-agri-600">Google Pay, PhonePe, Paytm</p>
                        </div>
                      </div>
                    </button>
                    
                    <button
                      onClick={() => handlePaymentMethodSelect('netbanking')}
                      className="w-full p-4 rounded-lg border border-agri-200 hover:border-agri-400 hover:bg-agri-50 transition-colors text-left"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-green-100 flex items-center justify-center">🏦</div>
                        <div>
                          <p className="font-medium text-agri-900">Net Banking</p>
                          <p className="text-sm text-agri-600">All major banks</p>
                        </div>
                      </div>
                    </button>
                  </div>
                  <div className="mt-6 flex justify-between">
                    <button onClick={resetPayment} className="px-4 py-2 rounded-md border border-agri-300 bg-white hover:bg-agri-50">
                      Cancel
                    </button>
                    <div className="text-right">
                      <p className="text-sm text-agri-600">Total Amount</p>
                      <p className="text-lg font-bold text-agri-900">₹{total}</p>
                    </div>
                  </div>
                </>
              )}

              {/* Step 1.5: UPI Method Selection */}
              {paymentStep === 1.5 && (
                <>
                  <div className="flex items-center gap-3 mb-4">
                    <button onClick={() => setPaymentStep(1)} className="text-agri-600 hover:text-agri-800">←</button>
                    <h4 className="text-xl font-semibold text-agri-900">Choose UPI Method</h4>
                  </div>
                  
                  <div className="space-y-3">
                    <button
                      onClick={() => handleUpiMethodSelect('id')}
                      className="w-full p-4 rounded-lg border border-agri-200 hover:border-agri-400 hover:bg-agri-50 transition-colors text-left"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-blue-100 flex items-center justify-center">📝</div>
                        <div>
                          <p className="font-medium text-agri-900">Enter UPI ID</p>
                          <p className="text-sm text-agri-600">Type your UPI ID manually</p>
                        </div>
                      </div>
                    </button>
                    
                    <button
                      onClick={() => handleUpiMethodSelect('qr')}
                      className="w-full p-4 rounded-lg border border-agri-200 hover:border-agri-400 hover:bg-agri-50 transition-colors text-left"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-green-100 flex items-center justify-center">📱</div>
                        <div>
                          <p className="font-medium text-agri-900">Scan QR Code</p>
                          <p className="text-sm text-agri-600">Scan QR code with your UPI app</p>
                        </div>
                      </div>
                    </button>
                  </div>
                  
                  <div className="mt-6 flex justify-between">
                    <button onClick={() => setPaymentStep(1)} className="px-4 py-2 rounded-md border border-agri-300 bg-white hover:bg-agri-50">
                      Back
                    </button>
                    <div className="text-right">
                      <p className="text-sm text-agri-600">Total Amount</p>
                      <p className="text-lg font-bold text-agri-900">₹{total}</p>
                    </div>
                  </div>
                </>
              )}

              {/* Step 2: Payment Details */}
              {paymentStep === 2 && (
                <>
                  <div className="flex items-center gap-3 mb-4">
                    <button onClick={() => setPaymentStep(paymentMethod === 'upi' ? 1.5 : 1)} className="text-agri-600 hover:text-agri-800">←</button>
                    <h4 className="text-xl font-semibold text-agri-900">Payment Details</h4>
                  </div>
                  
                  {paymentMethod === 'card' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm text-agri-700 mb-1">Card Number</label>
                        <input
                          type="text"
                          value={paymentDetails.cardNumber}
                          onChange={(e) => handlePaymentDetailsChange('cardNumber', e.target.value)}
                          placeholder="1234 5678 9012 3456"
                          className="w-full rounded-md border border-agri-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-agri-400"
                          maxLength="19"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm text-agri-700 mb-1">Expiry Date</label>
                          <input
                            type="text"
                            value={paymentDetails.expiryDate}
                            onChange={(e) => handlePaymentDetailsChange('expiryDate', e.target.value)}
                            placeholder="MM/YY"
                            className="w-full rounded-md border border-agri-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-agri-400"
                            maxLength="5"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-agri-700 mb-1">CVV</label>
                          <input
                            type="text"
                            value={paymentDetails.cvv}
                            onChange={(e) => handlePaymentDetailsChange('cvv', e.target.value)}
                            placeholder="123"
                            className="w-full rounded-md border border-agri-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-agri-400"
                            maxLength="3"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm text-agri-700 mb-1">Cardholder Name</label>
                        <input
                          type="text"
                          value={paymentDetails.name}
                          onChange={(e) => handlePaymentDetailsChange('name', e.target.value)}
                          placeholder="John Doe"
                          className="w-full rounded-md border border-agri-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-agri-400"
                        />
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'upi' && upiMethod === 'id' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm text-agri-700 mb-1">UPI ID</label>
                        <input
                          type="text"
                          value={paymentDetails.upiId}
                          onChange={(e) => handlePaymentDetailsChange('upiId', e.target.value)}
                          placeholder="yourname@paytm"
                          className="w-full rounded-md border border-agri-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-agri-400"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-agri-700 mb-1">Phone Number</label>
                        <input
                          type="tel"
                          value={paymentDetails.phone}
                          onChange={(e) => handlePaymentDetailsChange('phone', e.target.value)}
                          placeholder="+91 98765 43210"
                          className="w-full rounded-md border border-agri-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-agri-400"
                        />
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'upi' && upiMethod === 'qr' && (
                    <div className="space-y-4">
                      <div className="text-center">
                        <h5 className="text-lg font-semibold text-agri-900 mb-2">Scan QR Code to Pay</h5>
                        <p className="text-sm text-agri-600 mb-4">Amount: ₹{total}</p>
                        
                        {/* QR Code Display */}
                        <div className="bg-white border-2 border-agri-200 rounded-lg p-6 inline-block">
                          <div className="w-48 h-48 bg-white rounded-lg flex items-center justify-center border border-gray-200">
                            <img 
                              src="https://api.qrserver.com/v1/create-qr-code/?size=192x192&data=upi://pay?pa=agrigrow@paytm&pn=AgriGrow&am=500&cu=INR&tn=AgriGrow%20Payment"
                              alt="UPI QR Code"
                              className="w-full h-full object-contain rounded"
                              onError={(e) => {
                                e.target.style.display = 'none'
                                e.target.nextSibling.style.display = 'block'
                              }}
                            />
                            <div className="text-center hidden">
                              <div className="text-4xl mb-2">📱</div>
                              <p className="text-sm text-gray-600">QR Code</p>
                              <p className="text-xs text-gray-500 mt-1">upi://pay?pa=agrigrow@paytm&pn=AgriGrow&am={total}&cu=INR</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-4 space-y-2">
                          <p className="text-sm text-agri-600">📱 Open your UPI app</p>
                          <p className="text-sm text-agri-600">📷 Scan the QR code above</p>
                          <p className="text-sm text-agri-600">✅ Complete the payment</p>
                        </div>
                        
                        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                          <p className="text-sm text-blue-800">
                            <strong>Note:</strong> This is a demo QR code. In a real application, this would generate a proper UPI QR code.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'netbanking' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm text-agri-700 mb-1">Select Bank</label>
                        <select className="w-full rounded-md border border-agri-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-agri-400">
                          <option value="">Choose your bank</option>
                          <option value="sbi">State Bank of India</option>
                          <option value="hdfc">HDFC Bank</option>
                          <option value="icici">ICICI Bank</option>
                          <option value="axis">Axis Bank</option>
                          <option value="pnb">Punjab National Bank</option>
                        </select>
                      </div>
                    </div>
                  )}

                  <div className="mt-6 flex justify-between">
                    <button onClick={() => setPaymentStep(paymentMethod === 'upi' ? 1.5 : 1)} className="px-4 py-2 rounded-md border border-agri-300 bg-white hover:bg-agri-50">
                      Back
                    </button>
                    <button
                      onClick={processPayment}
                      className="px-6 py-2 rounded-md bg-agri-600 text-white hover:bg-agri-700"
                    >
                      {paymentMethod === 'upi' && upiMethod === 'qr' ? 'Payment Done' : `Pay ₹${total}`}
                    </button>
                  </div>
                </>
              )}

              {/* Step 3: Processing */}
              {paymentStep === 3 && (
                <div className="text-center py-8">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-agri-100 flex items-center justify-center">
                    <div className="w-8 h-8 border-4 border-agri-600 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                  <h4 className="text-xl font-semibold text-agri-900 mb-2">Processing Payment</h4>
                  <p className="text-agri-600">Please wait while we process your payment...</p>
                </div>
              )}

              {/* Step 4: Success */}
              {paymentStep === 4 && (
                <div className="text-center py-8">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
                    <div className="text-2xl text-green-600">✅</div>
                  </div>
                  <h4 className="text-xl font-semibold text-agri-900 mb-2">Payment Successful!</h4>
                  <p className="text-agri-600 mb-4">Your order has been placed successfully.</p>
                  <p className="text-agri-600 mb-4">Items have been added to your purchase history.</p>
                  <p className="text-sm text-agri-500 mt-2">Redirecting to AgriGrow home...</p>
                </div>
              )}
            </div>
          </div>
          <style>{`@keyframes fadeIn{from{opacity:0}to{opacity:1}}@keyframes popIn{0%{opacity:.6;transform:scale(.96)}100%{opacity:1;transform:scale(1)}}`}</style>
        </div>
      )}
      </div>
    </div>
  )
}


