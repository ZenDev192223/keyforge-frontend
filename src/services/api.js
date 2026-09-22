const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

async function request(path, options = {}, authenticated = false) {
  const headers = { "Content-Type": "application/json", ...(options.headers || {}) };
  if (authenticated) {
    const token = sessionStorage.getItem("admin_token");
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${path}`, { ...options, headers });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Request failed");
  return data;
}

const publicRequest = (path, options) => request(path, options, false);
const adminRequest = (path, options) => request(path, options, true);

export const api = {
  products: {
    list: (params = {}) => {
      const q = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== "" && value !== undefined && value !== null) q.set(key, value);
      });
      return publicRequest(`/products${q.toString() ? `?${q}` : ""}`);
    },
    get: (id) => publicRequest(`/products/${id}`),
    categories: () => publicRequest("/products/meta/categories"),
    brands: () => publicRequest("/products/meta/brands"),
    create: (body) => adminRequest("/products", { method: "POST", body: JSON.stringify(body) }),
    update: (id, body) => adminRequest(`/products/${id}`, { method: "PUT", body: JSON.stringify(body) }),
    remove: (id) => adminRequest(`/products/${id}`, { method: "DELETE" }),
  },
  orders: {
    create: (body) => publicRequest("/orders", { method: "POST", body: JSON.stringify(body) }),
    get: (id) => publicRequest(`/orders/${id}`),
    list: (params = {}) => {
      const q = new URLSearchParams(params);
      return adminRequest(`/orders${q.toString() ? `?${q}` : ""}`);
    },
    updateStatus: (id, status) => adminRequest(`/orders/${id}/status`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    }),
  },
  auth: {
    login: (body) => publicRequest("/auth/login", { method: "POST", body: JSON.stringify(body) }),
    me: () => adminRequest("/auth/me"),
  },
  analytics: {
    summary: () => adminRequest("/analytics/summary"),
    sales: (days = 30) => adminRequest(`/analytics/sales-over-time?days=${days}`),
    topProducts: (limit = 5) => adminRequest(`/analytics/top-products?limit=${limit}`),
    categories: () => adminRequest("/analytics/category-breakdown"),
    inventory: () => adminRequest("/analytics/inventory"),
  },
};
