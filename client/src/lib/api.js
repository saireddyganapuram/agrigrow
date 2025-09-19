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


