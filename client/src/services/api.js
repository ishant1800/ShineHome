const API_BASE = import.meta.env.VITE_API_URL || '/api';

async function request(path, options = {}) {
  const token = localStorage.getItem('shinehome_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || `Request failed (${res.status})`);
  }
  return data;
}

export const api = {
  // Auth
  login: (payload) => request('/auth/login', { method: 'POST', body: JSON.stringify(payload) }),
  register: (payload) => request('/auth/register', { method: 'POST', body: JSON.stringify(payload) }),
  getMe: () => request('/auth/me'),

  // Designs
  getDesigns: (params = {}) => {
    const qs = new URLSearchParams();
    if (params.style && params.style !== 'All') qs.set('style', params.style);
    if (params.search) qs.set('search', params.search);
    const suffix = qs.toString() ? `?${qs.toString()}` : '';
    return request(`/designs${suffix}`);
  },
  getDesignById: (id) => request(`/designs/${id}`),
  toggleDesignFavorite: (id) => request(`/designs/${id}/favorite`, { method: 'POST' }),
  addDesignReview: (id, payload) =>
    request(`/designs/${id}/reviews`, { method: 'POST', body: JSON.stringify(payload) }),
  inquireDesigner: (id, payload) =>
    request(`/designs/${id}/inquire`, { method: 'POST', body: JSON.stringify(payload) }),

  // Products
  getProducts: (params = {}) => {
    const qs = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== '' && v !== 'All') qs.set(k, String(v));
    });
    const suffix = qs.toString() ? `?${qs.toString()}` : '';
    return request(`/products${suffix}`);
  },
  getProductById: (id) => request(`/products/${id}`),
  addProductReview: (id, payload) =>
    request(`/products/${id}/reviews`, { method: 'POST', body: JSON.stringify(payload) }),

  // Orders
  createOrder: (payload) => request('/orders', { method: 'POST', body: JSON.stringify(payload) }),
  getOrders: () => request('/orders'),
};
