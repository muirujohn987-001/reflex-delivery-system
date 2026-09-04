import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { api } from "../services/api";

const DeliveryContext = createContext(null);

function normalizeRider(rider) {
  return {
    id: String(rider.id),
    name: rider.name,
    phone: rider.phone || "",
    email: rider.email || "",
    available: true,
  };
}

function normalizeDelivery(delivery) {
  return {
    id: String(delivery.id),
    retailerId: delivery.retailer_id,
    customer: {
      name: delivery.customer_name,
      phone: delivery.customer_phone,
      address: delivery.delivery_address,
    },
    item: delivery.item_description,
    status: delivery.current_status,
    updated: delivery.updated_at
      ? new Date(delivery.updated_at).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      : "",
    rider: delivery.rider_id
      ? {
          id: String(delivery.rider_id),
          name: delivery.rider_name || "Assigned rider",
          phone: delivery.rider_phone || "",
        }
      : null,
    timeline: [
      {
        status: "REQUESTED",
        time: null,
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
        label: "Delivered to customer",
      },
    ],
  };
}

export function DeliveryProvider({ children }) {
  const [deliveries, setDeliveries] = useState([]);
  const [riders, setRiders] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);

      const user = JSON.parse(
        localStorage.getItem("reflex_user") || "null"
      );

      // All authenticated users can load deliveries.
      const deliveryResponse = await api.getDeliveries();

      const deliveryData =
        deliveryResponse?.data || deliveryResponse || [];

      setDeliveries(
        Array.isArray(deliveryData)
          ? deliveryData.map(normalizeDelivery)
          : []
      );

      // Only dispatchers are allowed to request the riders endpoint.
      if (user?.role === "DISPATCHER") {
        const riderResponse = await api.getRiders();

        const riderData =
          riderResponse?.data || riderResponse || [];

        setRiders(
          Array.isArray(riderData)
            ? riderData.map(normalizeRider)
            : []
        );
      } else {
        setRiders([]);
      }
    } catch (error) {
      console.error("Failed to load delivery data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("reflex_token");

    if (token) {
      loadData();
    } else {
      setLoading(false);
    }
  }, [loadData]);

  const createDelivery = useCallback(async (data) => {
    const response = await api.createDelivery(data);

    const rawDelivery =
      response?.delivery || response?.data?.delivery;

    if (!rawDelivery) {
      throw new Error("Invalid delivery response from server");
    }

    const delivery = normalizeDelivery(rawDelivery);

    setDeliveries((prev) => [delivery, ...prev]);

    return {
      ...delivery,
      qr_token: rawDelivery.qr_token,
    };
  }, []);

  const assignRider = useCallback(
    async (deliveryId, riderId) => {
      const response = await api.assignRider(
        deliveryId,
        riderId
      );

      const rawDelivery =
        response?.delivery || response?.data?.delivery;

      if (rawDelivery) {
        const updatedDelivery =
          normalizeDelivery(rawDelivery);

        setDeliveries((prev) =>
          prev.map((delivery) =>
            String(delivery.id) === String(deliveryId)
              ? updatedDelivery
              : delivery
          )
        );

        return updatedDelivery;
      }

      await loadData();
    },
    [loadData]
  );

  const advanceStatus = useCallback(
    async (deliveryId, status, note) => {
      const response = await api.updateStatus(
        deliveryId,
        status,
        note
      );

      const rawDelivery =
        response?.delivery || response?.data?.delivery;

      if (rawDelivery) {
        const updatedDelivery =
          normalizeDelivery(rawDelivery);

        setDeliveries((prev) =>
          prev.map((delivery) =>
            String(delivery.id) === String(deliveryId)
              ? updatedDelivery
              : delivery
          )
        );

        return updatedDelivery;
      }

      await loadData();
    },
    [loadData]
  );

  const cancelDelivery = useCallback(
    async (deliveryId, note) => {
      const response = await api.cancelDelivery(
        deliveryId,
        note
      );

      const rawDelivery =
        response?.delivery || response?.data?.delivery;

      if (rawDelivery) {
        const updatedDelivery =
          normalizeDelivery(rawDelivery);

        setDeliveries((prev) =>
          prev.map((delivery) =>
            String(delivery.id) === String(deliveryId)
              ? updatedDelivery
              : delivery
          )
        );

        return updatedDelivery;
      }

      await loadData();
    },
    [loadData]
  );

  const getDelivery = useCallback(
    (id) =>
      deliveries.find(
        (delivery) =>
          String(delivery.id) === String(id)
      ),
    [deliveries]
  );

  const refreshDeliveries = useCallback(async () => {
    await loadData();
  }, [loadData]);

  const value = {
    deliveries,
    riders,
    loading,
    createDelivery,
    assignRider,
    advanceStatus,
    cancelDelivery,
    getDelivery,
    refreshDeliveries,
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
