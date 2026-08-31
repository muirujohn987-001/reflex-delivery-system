import { useState } from "react";
import { ClipboardList, Truck, Users } from "lucide-react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import StatCard from "../../components/dashboard/StatCard";
import Button from "../../components/ui/Button";
import EmptyState from "../../components/ui/EmptyState";
import AssignRiderModal from "./AssignRiderModal";
import CancelDeliveryModal from "../../components/delivery/CancelDeliveryModal";
import { dispatcherNav } from "../../utils/navConfig";
import { useDeliveries } from "../../context/DeliveryContext";
import { useToast } from "../../components/ui/Toast";
import { PackageSearch, Clock } from "lucide-react";

export default function DispatcherDashboard() {
  const { deliveries, riders, assignRider, advanceStatus } = useDeliveries();
  const { showToast } = useToast();
  const [assignDelivery, setAssignDelivery] = useState(null);
  const [cancelDelivery, setCancelDelivery] = useState(null);

  const open = deliveries.filter((d) => d.status === "REQUESTED");
  const active = deliveries.filter((d) => ["ASSIGNED", "PICKED_UP"].includes(d.status));
  const availableRiders = riders.filter((r) => r.available);

  const handleAssign = (deliveryId, riderId) => {
    assignRider(deliveryId, riderId);
    showToast("Rider assigned successfully");
  };

  const handleCancel = (deliveryId) => {
    advanceStatus(deliveryId, "CANCELLED");
    showToast("Delivery cancelled");
  };

  return (
    <DashboardLayout navItems={dispatcherNav} greeting="Good morning, Dispatcher" subtitle="Manage deliveries and rider assignments.">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
        <StatCard icon={ClipboardList} label="Open Requests" value={open.length} tone="amber" />
        <StatCard icon={Truck} label="Active Deliveries" value={active.length} tone="teal" />
        <StatCard icon={Users} label="Available Riders" value={availableRiders.length} tone="purple" />
      </div>

      <div className="mt-6 sm:mt-8">
        <h2 className="text-base font-bold text-ink sm:text-lg">Open Delivery Requests</h2>

        {open.length === 0 ? (
          <div className="mt-4">
            <EmptyState icon={PackageSearch} title="No open requests" description="New delivery requests will appear here." />
          </div>
        ) : (
          <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
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

                <div className="mt-4 flex gap-2">
                  <Button fullWidth size="sm" onClick={() => setAssignDelivery(d)}>
                    Assign Rider
                  </Button>
                  <Button variant="secondary" size="sm" onClick={() => setCancelDelivery(d)}>
                    Cancel
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <AssignRiderModal
        open={!!assignDelivery}
        onClose={() => setAssignDelivery(null)}
        delivery={assignDelivery}
        riders={availableRiders}
        onAssign={handleAssign}
      />

      <CancelDeliveryModal
        open={!!cancelDelivery}
        onClose={() => setCancelDelivery(null)}
        delivery={cancelDelivery}
        onConfirm={handleCancel}
      />
    </DashboardLayout>
  );
}