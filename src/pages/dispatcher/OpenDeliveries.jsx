import { useState } from "react";
import { Clock, PackageSearch } from "lucide-react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import Button from "../../components/ui/Button";
import EmptyState from "../../components/ui/EmptyState";
import AssignRiderModal from "./AssignRiderModal";
import { dispatcherNav } from "../../utils/navConfig";
import { useDeliveries } from "../../context/DeliveryContext";
import { useToast } from "../../components/ui/Toast";

export default function OpenDeliveries() {
  const { deliveries, riders, assignRider } = useDeliveries();
  const { showToast } = useToast();
  const [modalDelivery, setModalDelivery] = useState(null);

  const open = deliveries.filter((d) => d.status === "REQUESTED");
  const availableRiders = riders.filter((r) => r.available);

  const handleAssign = (deliveryId, riderId) => {
    assignRider(deliveryId, riderId);
    showToast("Rider assigned successfully");
  };

  return (
    <DashboardLayout navItems={dispatcherNav} greeting="Open Deliveries" subtitle="All delivery requests awaiting a rider.">
      {open.length === 0 ? (
        <EmptyState icon={PackageSearch} title="No open requests" description="New delivery requests will appear here." />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {open.map((d) => (
            <div key={d.id} className="rounded-2xl border border-gray-100 bg-white p-4 shadow-card transition-shadow hover:shadow-card-hover sm:p-5">
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-bold text-ink">#{d.id}</p>
                <p className="flex items-center gap-1 text-xs text-gray-400">
                  <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                  {d.updated}
                </p>
              </div>
              <p className="mt-2 text-sm font-semibold text-ink">{d.customer.name}</p>
              <p className="mt-0.5 text-xs text-gray-500">{d.customer.address}</p>
              <p className="mt-0.5 text-xs text-gray-500">{d.item}</p>

              <Button fullWidth size="sm" className="mt-4" onClick={() => setModalDelivery(d)}>
                Assign Rider
              </Button>
            </div>
          ))}
        </div>
      )}

      <AssignRiderModal
        open={!!modalDelivery}
        onClose={() => setModalDelivery(null)}
        delivery={modalDelivery}
        riders={availableRiders}
        onAssign={handleAssign}
      />
    </DashboardLayout>
  );
}
