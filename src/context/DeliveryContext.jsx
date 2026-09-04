
import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";

import { mockRiders } from "../utils/mockData";
import { api } from "../services/api";

const DeliveryContext = createContext(null);

function mapDelivery(row) {
  const createdTime = row.created_at
    ? new Date(row.created_at).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  const updatedTime = row.updated_at
    ? new Date(row.updated_at).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  return {
    // IMPORTANT: this is now the real PostgreSQL UUID
    id: row.id,

    riderId: row.rider_id,

    status: row.current_status,

    updated: updatedTime,

    customer: {
      name: "Customer",
      phone: "",
      address: "",
    },

    item: "Delivery",

    rider: row.rider_id
      ? {
          id: row.rider_id,
          name: "Assigned Rider",
          phone: "",
        }
      : null,

    timeline: [
      {
        status: "CREATED",
        time: createdTime,
        label: "Delivery created",
      },
      {
        status: "ASSIGNED",
        time: null,
        label: "Rider assigned",
      },
      {
        status: "PICKED_UP",
        time: null,
        label: "Package collected",
      },
      {
        status: "DELIVERED",
        time: null,
        label: "Delivery confirmed",
      },
    ],
  };
}

export function DeliveryProvider({ children }) {
  const [deliveries, setDeliveries] = useState([]);
  const [riders, setRiders] = useState(mockRiders);
  const [loading, setLoading] = useState(true);

  const loadDeliveries = useCallback(async () => {
    try {
      setLoading(true);

      const data = await api.getDeliveries();

      const rows = Array.isArray(data)
        ? data
        : data?.deliveries || data?.data || [];

      setDeliveries(rows.map(mapDelivery));
    } catch (error) {
      console.error("Failed to load deliveries:", error);
      setDeliveries([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDeliveries();
  }, [loadDeliveries]);

  const createDelivery = useCallback(
    async (data) => {
      const delivery = await api.createDelivery(data);

      await loadDeliveries();

      return delivery;
    },
    [loadDeliveries]
  );

  const assignRider = useCallback(
    async (deliveryId, riderId) => {
      await api.assignRider(deliveryId, riderId);

      await loadDeliveries();
    },
    [loadDeliveries]
  );

  const advanceStatus = useCallback(
    async (deliveryId, status) => {
      await api.updateStatus(deliveryId, status);

      await loadDeliveries();
    },
    [loadDeliveries]
  );

  const getDelivery = useCallback(
    (id) => deliveries.find((d) => d.id === id),
    [deliveries]
  );

  const value = {
    deliveries,
    riders,
    loading,
    createDelivery,
    assignRider,
    advanceStatus,
    getDelivery,
    refreshDeliveries: loadDeliveries,
  };

  return (
    <DeliveryContext.Provider value={value}>
      {children}
    </DeliveryContext.Provider>
  );
}

export function useDeliveries() {
  const ctx = useContext(DeliveryContext);

  if (!ctx) {
    throw new Error(
      "useDeliveries must be used within DeliveryProvider"
    );
  }

  return ctx;
}
