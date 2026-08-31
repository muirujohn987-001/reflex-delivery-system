import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import RiderLayout from "../../components/layout/RiderLayout";
import Button from "../../components/ui/Button";
import { useDeliveries } from "../../context/DeliveryContext";

export default function ConfirmationResult() {
  const location = useLocation();
  const navigate = useNavigate();
  const { getDelivery } = useDeliveries();

  const deliveryId = location.state?.deliveryId;
  const delivery = getDelivery(deliveryId);

  return (
    <RiderLayout>
      <div className="mx-auto max-w-sm pt-6 text-center animate-slideUp">
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-emerald-500 animate-popIn">
          <CheckCircle2 className="h-12 w-12 text-white" aria-hidden="true" />
        </div>

        <h1 className="mt-6 text-xl font-extrabold text-ink">Delivery Confirmed!</h1>
        {delivery && (
          <>
            <p className="mt-1 text-sm font-semibold text-gray-500">#{delivery.id}</p>
            <p className="mt-2 inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
              DELIVERED
            </p>

            <div className="mt-6 rounded-2xl border border-gray-100 bg-white p-5 text-left shadow-card">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Customer</p>
              <p className="mt-1 text-sm font-semibold text-ink">{delivery.customer.name}</p>
              <p className="mt-3 text-xs text-gray-500">Confirmed just now &bull; {delivery.updated}</p>
            </div>
          </>
        )}

        <Button fullWidth size="lg" className="mt-8" onClick={() => navigate("/rider/dashboard")}>
          Back to Deliveries
        </Button>
      </div>
    </RiderLayout>
  );
}
