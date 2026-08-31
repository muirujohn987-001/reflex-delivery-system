// Thin API client stub. Replace BASE_URL and fetch calls with the real
// backend once it's available — every function below already returns
// promises so callers won't need to change.

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return res.json();
}

export const api = {
  login: (payload) => request("/auth/login", { method: "POST", body: JSON.stringify(payload) }),
  register: (payload) => request("/auth/register", { method: "POST", body: JSON.stringify(payload) }),
  getDeliveries: () => request("/deliveries"),
  getDelivery: (id) => request(`/deliveries/${id}`),
  createDelivery: (payload) => request("/deliveries", { method: "POST", body: JSON.stringify(payload) }),
  assignRider: (deliveryId, riderId) =>
    request(`/deliveries/${deliveryId}/assign`, { method: "POST", body: JSON.stringify({ riderId }) }),
  updateStatus: (deliveryId, status) =>
    request(`/deliveries/${deliveryId}/status`, { method: "PATCH", body: JSON.stringify({ status }) }),
  getRiders: () => request("/riders"),
};
