// The base URL is now handled by Vite's proxy in development
const BASE_URL = import.meta.env.VITE_API_URL

export async function request(path, options = {}) {
  const { body, token, ...rest } = options;
  const headers = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${BASE_URL}${path}`, {
      ...rest,
      headers,
      credentials: 'include',
      body: body ? JSON.stringify(body) : undefined,
    });

    const data = await response.json().catch(() => ({}));
    
    if (!response.ok) {
      const error = new Error(data.error || data.details?.[0]?.msg || data.message || 'Something went wrong');
      error.response = { data };
      error.status = response.status;
      throw error;
    }

    return data;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

export function registerUser(payload) {
  return request('/api/auth/register', { method: 'POST', body: payload })
}

export function loginUser(payload) {
  return request('/api/auth/login', { method: 'POST', body: payload })
}

export function loginDoctor(payload) {
  return request('/api/doctors/login', { method: 'POST', body: payload })
}

export function loginCustomer(payload) {
  return request('/api/customers/login', { method: 'POST', body: payload })
}

export function updateDoctorProfile(payload, token) {
  return request('/api/doctors/profile', { method: 'PUT', body: payload, token })
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

export function fetchDoctors(token) {
  return request('/api/doctors', { token })
}

export function fetchDoctorById(id) {
  return request(`/api/doctors/${id}`)
}

export function bookAppointment(doctorId, appointmentData, token) {
  return request(`/api/doctors/${doctorId}/appointments`, {
    method: 'POST',
    body: appointmentData,
    token
  })
}

export function getDoctorAppointments(token) {
  return request('/api/doctors/appointments', { token })
}

export function getCattle(token) {
  return request('/api/cattle', { token })
}

export function addCattle(payload, token) {
  return request('/api/cattle', { method: 'POST', body: payload, token })
}

export function updateCattle(id, payload, token) {
  return request(`/api/cattle/${id}`, { method: 'PUT', body: payload, token })
}

export function deleteCattle(id, token) {
  return request(`/api/cattle/${id}`, { method: 'DELETE', token })
}

export function recordCropSale(cropListingId, quantity, transactionId, paymentMethod, token) {
  return request('/api/crop-sold/record', {
    method: 'POST',
    body: { cropListingId, quantity, transactionId, paymentMethod },
    token
  })
}

export function getFarmerSales(token) {
  return request('/api/crop-sold/farmer-sales', { token })
}

export function getCustomerPurchaseHistory(token) {
  return request('/api/customer-purchases/history', { token })
}

export function recordCustomerPurchase(purchaseData, token) {
  return request('/api/customer-purchases/record', {
    method: 'POST',
    body: purchaseData,
    token
  })
}


