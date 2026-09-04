const BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

async function request(path, options = {}) {
  const token = localStorage.getItem("reflex_token");

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  });

  let data;

  try {
    data = await res.json();
  } catch {
    data = {};
  }

  if (!res.ok) {
    throw new Error(
      data?.error ||
      data?.message ||
      `Request failed: ${res.status}`
    );
  }

  return data;
}

export const api = {
  login: (payload) =>
    request("/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  register: (payload) =>
    request("/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  me: () => request("/auth/me"),

  getDeliveries: () =>
    request("/deliveries"),

  getDelivery: (id) =>
    request(`/deliveries/${id}`),

  getHistory: (id) =>
    request(`/deliveries/${id}/history`),

  createDelivery: (payload) =>
    request("/deliveries", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  getOpenDeliveries: () =>
    request("/deliveries/open"),

  getRiders: () =>
    request("/deliveries/riders"),

  assignRider: (deliveryId, riderId) =>
    request(`/deliveries/${deliveryId}/assign`, {
      method: "POST",
      body: JSON.stringify({ riderId }),
    }),

  updateStatus: (deliveryId, status, note) =>
    request(`/deliveries/${deliveryId}/status`, {
      method: "POST",
      body: JSON.stringify({ status, note }),
    }),

  cancelDelivery: (deliveryId, note) =>
    request(`/deliveries/${deliveryId}/cancel`, {
      method: "POST",
      body: JSON.stringify({ note }),
    }),

  confirmDelivery: (deliveryId, qrToken) =>
    request(`/deliveries/${deliveryId}/confirm`, {
      method: "POST",
      body: JSON.stringify({ qrToken }),
    }),
};
