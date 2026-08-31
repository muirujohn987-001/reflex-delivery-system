import { createContext, useContext, useState, useCallback } from "react";
import { mockDeliveries, mockRiders } from "../utils/mockData";

const DeliveryContext = createContext(null);

let nextId = 1046;

export function DeliveryProvider({ children }) {
  const [deliveries, setDeliveries] = useState(mockDeliveries);
  const [riders, setRiders] = useState(mockRiders);

  const createDelivery = useCallback((data) => {
    const id = String(nextId++);
    const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const delivery = {
      id,
      customer: {
        name: data.customerName,
        phone: data.customerPhone,
        address: data.address,
      },
      item: data.item,
      status: "REQUESTED",
      updated: time,
      rider: null,
      timeline: [
        { status: "REQUESTED", time, label: "Delivery created" },
        { status: "ASSIGNED", time: null, label: "Rider assigned" },
        { status: "PICKED_UP", time: null, label: "Package collected" },
        { status: "DELIVERED", time: null, label: "Awaiting confirmation" },
      ],
    };
    setDeliveries((prev) => [delivery, ...prev]);
    return delivery;
  }, []);

  const assignRider = useCallback((deliveryId, riderId) => {
    const rider = riders.find((r) => r.id === riderId);
    if (!rider) return;
    const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setDeliveries((prev) =>
      prev.map((d) =>
        d.id === deliveryId
          ? {
              ...d,
              status: "ASSIGNED",
              rider: { name: rider.name, phone: rider.phone },
              updated: time,
              timeline: d.timeline.map((t) => (t.status === "ASSIGNED" ? { ...t, time } : t)),
            }
          : d
      )
    );
  }, [riders]);

  const advanceStatus = useCallback((deliveryId, status) => {
    const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setDeliveries((prev) =>
      prev.map((d) =>
        d.id === deliveryId
          ? {
              ...d,
              status,
              updated: time,
              timeline: d.timeline.map((t) => (t.status === status ? { ...t, time } : t)),
            }
          : d
      )
    );
  }, []);

  const getDelivery = useCallback((id) => deliveries.find((d) => d.id === id), [deliveries]);

  const value = {
    deliveries,
    riders,
    createDelivery,
    assignRider,
    advanceStatus,
    getDelivery,
  };

  return <DeliveryContext.Provider value={value}>{children}</DeliveryContext.Provider>;
}

export function useDeliveries() {
  const ctx = useContext(DeliveryContext);
  if (!ctx) throw new Error("useDeliveries must be used within DeliveryProvider");
  return ctx;
}
