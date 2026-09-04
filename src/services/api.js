// Frontend API client
// Backend runs on http://localhost:4000

const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api";

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  let data;

  try {
    data = await res.json();
  } catch {
    data = {};
  }

  if (!res.ok) {
    throw new Error(
      data?.message ||
        data?.error ||
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

  getDeliveries: () => request("/deliveries"),

  getDelivery: (id) =>
    request(`/deliveries/${id}`),

  createDelivery: (payload) =>
    request("/deliveries", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  assignRider: (deliveryId, riderId) =>
    request(`/deliveries/${deliveryId}/assign`, {
      method: "POST",
      body: JSON.stringify({ riderId }),
    }),

  updateStatus: (deliveryId, status) =>
    request(`/deliveries/${deliveryId}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),

  getRiders: () =>
    request("/riders"),

  // QR delivery confirmation
  confirmDelivery: (deliveryId, riderId, rawToken) =>
    request(`/deliveries/${deliveryId}/confirm`, {
      method: "POST",
      body: JSON.stringify({
        deliveryId,
        riderId,
        rawToken,
      }),
    }),
};