const API_BASE = 'http://localhost:5001';

/**
 * Centralized API helper.
 * All requests include `credentials: 'include'` so httpOnly cookies are sent.
 */
async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;

  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    credentials: 'include',
    headers,
    ...options
  };

  // Don't set Content-Type for requests without a body
  if (!config.body) {
    delete config.headers['Content-Type'];
  } else if (typeof config.body === 'object' && !(config.body instanceof FormData)) {
    config.body = JSON.stringify(config.body);
    config.headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(url, config);

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const message = data?.message || `Request failed with status ${response.status}`;
    const error = new Error(message);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

// ---- Auth API ----

export function login(email, password) {
  return request('/api/auth/login', {
    method: 'POST',
    body: { email, password }
  });
}

export function register(name, email, password) {
  return request('/api/auth/register', {
    method: 'POST',
    body: { name, email, password }
  });
}

export function getMe() {
  return request('/api/auth/me');
}

export function logout() {
  return request('/api/auth/logout', {
    method: 'POST'
  });
}

// ---- Products API ----

export function getProducts(params = {}) {
  const searchParams = new URLSearchParams();
  if (params.category && params.category !== 'All') {
    searchParams.set('category', params.category);
  }
  if (params.search) {
    searchParams.set('search', params.search);
  }
  const qs = searchParams.toString();
  return request(`/api/products${qs ? `?${qs}` : ''}`);
}

export function getProduct(id) {
  return request(`/api/products/${id}`);
}

export function createProduct(productData) {
  return request('/api/products', {
    method: 'POST',
    body: productData
  });
}

export function updateProduct(id, productData) {
  return request(`/api/products/${id}`, {
    method: 'PUT',
    body: productData
  });
}

export function deleteProduct(id) {
  return request(`/api/products/${id}`, {
    method: 'DELETE'
  });
}

export default request;
