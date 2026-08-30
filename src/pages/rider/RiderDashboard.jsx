import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Phone, MapPin, Package } from "lucide-react";
import RiderLayout from "../../components/layout/RiderLayout";
import StatusBadge from "../../components/ui/StatusBadge";
import Button from "../../components/ui/Button";
import EmptyState from "../../components/ui/EmptyState";
import { useDeliveries } from "../../context/DeliveryContext";
import { useAuth } from "../../hooks/useAuth";
import { PackageSearch } from "lucide-react";

export default function RiderDashboard() {
  const { deliveries } = useDeliveries();
  const { user } = useAuth();
  const [tab, setTab] = useState("mine");
  const navigate = useNavigate();

  // Demo: "mine" = the first assigned/picked-up delivery, "other" = the rest assigned to this rider.
  const myDeliveries = deliveries.filter((d) => ["ASSIGNED", "PICKED_UP"].includes(d.status) && d.rider?.name === "David Mwangi");
  const active = myDeliveries[0];
  const later = myDeliveries.slice(1);

  return (
    <RiderLayout>
      <h1 className="text-lg font-bold text-ink">Good morning, {user?.name?.split(" ")[0] || "David"} 👋</h1>
      <p className="mt-0.5 text-sm text-gray-500">
        You have {myDeliveries.length} {myDeliveries.length === 1 ? "delivery" : "deliveries"} today.
      </p>

      <div className="mt-5 flex gap-1 border-b border-gray-100">
        <button
          onClick={() => setTab("mine")}
          className={`px-3 pb-2.5 text-sm font-semibold transition-colors ${
            tab === "mine" ? "border-b-2 border-maroon-500 text-maroon-500" : "text-gray-400"
          }`}
        >
          My Delivery
        </button>
        <button
          onClick={() => setTab("other")}
          className={`px-3 pb-2.5 text-sm font-semibold transition-colors ${
            tab === "other" ? "border-b-2 border-maroon-500 text-maroon-500" : "text-gray-400"
          }`}
        >
          Other Deliveries
        </button>
      </div>

      <div className="mt-5">
        {tab === "mine" ? (
          active ? (
            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-card">
              <div className="flex items-start justify-between">
                <p className="text-base font-bold text-ink">#{active.id}</p>
                <StatusBadge status={active.status} />
              </div>
              <p className="mt-3 text-sm font-semibold text-ink">{active.customer.name}</p>
              <div className="mt-2 space-y-1.5">
                <p className="flex items-center gap-1.5 text-xs text-gray-500">
                  <Phone className="h-3.5 w-3.5" aria-hidden="true" /> {active.customer.phone}
                </p>
                <p className="flex items-center gap-1.5 text-xs text-gray-500">
                  <MapPin className="h-3.5 w-3.5" aria-hidden="true" /> {active.customer.address}
                </p>
                <p className="flex items-center gap-1.5 text-xs text-gray-500">
                  <Package className="h-3.5 w-3.5" aria-hidden="true" /> {active.item}
                </p>
              </div>

              {active.status === "ASSIGNED" && (
                <Button
                  fullWidth
                  size="lg"
                  className="mt-5"
                  onClick={() => navigate(`/rider/delivery/${active.id}`)}
                >
                  Mark Picked Up
                </Button>
              )}
              {active.status === "PICKED_UP" && (
                <Button fullWidth size="lg" className="mt-5" onClick={() => navigate("/rider/scanner")}>
                  Scan QR Code
                </Button>
              )}
            </div>
          ) : (
            <EmptyState icon={PackageSearch} title="No active delivery" description="You're all caught up for now." />
          )
        ) : later.length === 0 ? (
          <EmptyState icon={PackageSearch} title="No other deliveries" description="New assignments will show up here." />
        ) : (
          <div className="space-y-3">
            <p className="text-sm font-semibold text-ink">Later Deliveries</p>
            {later.map((d) => (
              <div key={d.id} className="flex items-center justify-between rounded-2xl border border-gray-100 bg-white p-4 shadow-card">
                <div>
                  <p className="text-sm font-bold text-ink">#{d.id}</p>
                  <p className="text-sm text-gray-600">{d.customer.name}</p>
                </div>
                <StatusBadge status={d.status} />
              </div>
            ))}
          </div>
        )}
      </div>
    </RiderLayout>
  );
}
