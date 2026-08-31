import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Phone, MapPin, Package, User, XCircle } from "lucide-react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import StatusBadge from "../../components/ui/StatusBadge";
import Avatar from "../../components/ui/Avatar";
import Button from "../../components/ui/Button";
import DeliveryTimeline from "../../components/delivery/DeliveryTimeline";
import CancelDeliveryModal from "../../components/delivery/CancelDeliveryModal";
import EmptyState from "../../components/ui/EmptyState";
import { retailerNav } from "../../utils/navConfig";
import { useDeliveries } from "../../context/DeliveryContext";
import { useToast } from "../../components/ui/Toast";

// Delivery can only be cancelled before a rider has picked up the package.
const CANCELLABLE_STATUSES = ["REQUESTED", "ASSIGNED"];

export default function DeliveryDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getDelivery, advanceStatus } = useDeliveries();
  const { showToast } = useToast();
  const [cancelOpen, setCancelOpen] = useState(false);
  const delivery = getDelivery(id);

  const handleCancel = (deliveryId) => {
    advanceStatus(deliveryId, "CANCELLED");
    showToast("Delivery cancelled");
  };

  return (
    <DashboardLayout navItems={retailerNav} greeting="" subtitle="">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-ink"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Back
      </button>

      {!delivery ? (
        <EmptyState title="Delivery not found" description="This delivery may have been removed." />
      ) : (
        <div className="grid gap-5 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-5">
            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-card sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Delivery Details</p>
                  <h1 className="mt-0.5 text-xl font-extrabold text-ink">#{delivery.id}</h1>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={delivery.status} />
                  {CANCELLABLE_STATUSES.includes(delivery.status) && (
                    <Button variant="danger" size="sm" icon={XCircle} onClick={() => setCancelOpen(true)}>
                      Cancel Delivery
                    </Button>
                  )}
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-card sm:p-6">
              <h2 className="mb-3 flex items-center gap-2 text-sm font-bold text-ink">
                <User className="h-4 w-4 text-maroon-500" aria-hidden="true" /> Customer
              </h2>
              <div className="flex items-center gap-3">
                <Avatar name={delivery.customer.name} />
                <div>
                  <p className="text-sm font-semibold text-ink">{delivery.customer.name}</p>
                  <p className="flex items-center gap-1.5 text-xs text-gray-500">
                    <Phone className="h-3.5 w-3.5" aria-hidden="true" /> {delivery.customer.phone}
                  </p>
                  <p className="mt-0.5 flex items-center gap-1.5 text-xs text-gray-500">
                    <MapPin className="h-3.5 w-3.5" aria-hidden="true" /> {delivery.customer.address}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-card sm:p-6">
              <h2 className="mb-3 flex items-center gap-2 text-sm font-bold text-ink">
                <Package className="h-4 w-4 text-teal-600" aria-hidden="true" /> Item
              </h2>
              <p className="text-sm text-ink/90">{delivery.item}</p>
            </div>

            {delivery.rider && (
              <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-card sm:p-6">
                <h2 className="mb-3 text-sm font-bold text-ink">Assigned Rider</h2>
                <div className="flex items-center gap-3">
                  <Avatar name={delivery.rider.name} />
                  <div>
                    <p className="text-sm font-semibold text-ink">{delivery.rider.name}</p>
                    <p className="flex items-center gap-1.5 text-xs text-gray-500">
                      <Phone className="h-3.5 w-3.5" aria-hidden="true" /> {delivery.rider.phone}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-card sm:p-6 lg:sticky lg:top-20 lg:self-start">
            <h2 className="mb-4 text-sm font-bold text-ink">Delivery Timeline</h2>
            <DeliveryTimeline status={delivery.status} timeline={delivery.timeline} />
          </div>
        </div>
      )}

      <CancelDeliveryModal
        open={cancelOpen}
        onClose={() => setCancelOpen(false)}
        delivery={delivery}
        onConfirm={handleCancel}
      />
    </DashboardLayout>
  );
}