import { useParams, useNavigate } from "react-router-dom";
import { Phone, MapPin, Package, ArrowLeft } from "lucide-react";
import RiderLayout from "../../components/layout/RiderLayout";
import StatusBadge from "../../components/ui/StatusBadge";
import Button from "../../components/ui/Button";
import EmptyState from "../../components/ui/EmptyState";
import { useDeliveries } from "../../context/DeliveryContext";

export default function RiderDeliveryDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getDelivery } = useDeliveries();
  const delivery = getDelivery(id);

  return (
    <RiderLayout>
      <button onClick={() => navigate(-1)} className="mb-4 flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-ink">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Back
      </button>

      {!delivery ? (
        <EmptyState title="Delivery not found" />
      ) : (
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-card">
          <div className="flex items-start justify-between">
            <p className="text-base font-bold text-ink">#{delivery.id}</p>
            <StatusBadge status={delivery.status} />
          </div>
          <p className="mt-3 text-sm font-semibold text-ink">{delivery.customer.name}</p>
          <div className="mt-2 space-y-1.5">
            <p className="flex items-center gap-1.5 text-xs text-gray-500">
              <Phone className="h-3.5 w-3.5" aria-hidden="true" /> {delivery.customer.phone}
            </p>
            <p className="flex items-center gap-1.5 text-xs text-gray-500">
              <MapPin className="h-3.5 w-3.5" aria-hidden="true" /> {delivery.customer.address}
            </p>
            <p className="flex items-center gap-1.5 text-xs text-gray-500">
              <Package className="h-3.5 w-3.5" aria-hidden="true" /> {delivery.item}
            </p>
          </div>

          {delivery.status === "ASSIGNED" && (
            <Button fullWidth size="lg" className="mt-5" onClick={() => navigate("/rider/pickup-confirmation", { state: { deliveryId: delivery.id } })}>
              Mark Picked Up
            </Button>
          )}
          {delivery.status === "PICKED_UP" && (
            <Button fullWidth size="lg" className="mt-5" onClick={() => navigate("/rider/scanner", { state: { deliveryId: delivery.id } })}>
              Scan QR Code
            </Button>
          )}
        </div>
      )}
    </RiderLayout>
  );
}
