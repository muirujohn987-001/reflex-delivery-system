import RiderLayout from "../../components/layout/RiderLayout";
import StatusBadge from "../../components/ui/StatusBadge";
import EmptyState from "../../components/ui/EmptyState";
import { useDeliveries } from "../../context/DeliveryContext";
import { PackageSearch } from "lucide-react";

export default function RiderHistory() {
  const { deliveries } = useDeliveries();
  const past = deliveries.filter((d) => d.rider?.name === "David Mwangi" && d.status === "DELIVERED");

  return (
    <RiderLayout>
      <h1 className="text-lg font-bold text-ink">History</h1>
      <p className="mt-0.5 text-sm text-gray-500">Deliveries you've completed.</p>

      <div className="mt-5 space-y-3">
        {past.length === 0 ? (
          <EmptyState icon={PackageSearch} title="No completed deliveries yet" />
        ) : (
          past.map((d) => (
            <div key={d.id} className="flex items-center justify-between rounded-2xl border border-gray-100 bg-white p-4 shadow-card">
              <div>
                <p className="text-sm font-bold text-ink">#{d.id}</p>
                <p className="text-sm text-gray-600">{d.customer.name}</p>
              </div>
              <StatusBadge status={d.status} />
            </div>
          ))
        )}
      </div>
    </RiderLayout>
  );
}
