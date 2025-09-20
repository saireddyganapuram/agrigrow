const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
      ...(options.headers || {}),
    },
    method: options.method || 'GET',
    body: options.body ? JSON.stringify(options.body) : undefined,
  })

  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    const message = data?.error || data?.message || 'Request failed'
    throw new Error(message)
  }
  return data
}

export function registerUser(payload) {
  return request('/api/auth/register', { method: 'POST', body: payload })
}

export function loginUser(payload) {
  return request('/api/auth/login', { method: 'POST', body: payload })
}

export function getMe(token) {
  return request('/api/auth/me', { token })
}

export function fetchSeeds(crop) {
  const qs = crop ? `?crop=${encodeURIComponent(crop)}` : ''
  return request(`/api/seeds${qs}`)
}

export function addToCart(payload, token) {
  return request('/api/cart', { method: 'POST', body: payload, token })
}

export function fetchCart(token) {
  return request('/api/cart', { token })
}

export function removeFromCart(id, token) {
  return request(`/api/cart/${id}`, { method: 'DELETE', token })
}

export function fetchFertilizers(crop) {
  const qs = crop ? `?crop=${encodeURIComponent(crop)}` : ''
  return request(`/api/fertilizers${qs}`)
}

export function createCropListing(payload, token) {
  return request('/api/crop-listings', { method: 'POST', body: payload, token })
}

export function fetchMyCropListings(token) {
  return request('/api/crop-listings/my', { token })
}

export function fetchAllCropListings() {
  return request('/api/crop-listings/all')
}

export function deleteCropListing(id, token) {
  return request(`/api/crop-listings/${id}`, { method: 'DELETE', token })
}

export function updateProfile(payload, token) {
  return request('/api/auth/profile', { method: 'PUT', body: payload, token })
}

export function getProfile(token) {
  return request('/api/auth/profile', { token })
}

export function completePayment(payload, token) {
  return request('/api/payment/complete', { method: 'POST', body: payload, token })
}

export function getPurchaseHistory(token) {
  return request('/api/payment/purchase-history', { token })
}

export function clearPurchaseHistory(token) {
  return request('/api/payment/clear-purchase-history', { method: 'DELETE', token })
}

export function getSalesHistory(token) {
  return request('/api/payment/sales-history', { token })
}

export function getTransactions(token) {
  return request('/api/transactions', { token })
}

export function createTransaction(payload, token) {
  return request('/api/transactions', { method: 'POST', body: payload, token })
}

export function getTransactionSummary(token) {
  return request('/api/transactions/summary', { token })
}


