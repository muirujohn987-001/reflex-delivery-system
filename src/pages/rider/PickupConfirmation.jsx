import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Package, X, CheckCircle2, ScanLine } from "lucide-react";
import RiderLayout from "../../components/layout/RiderLayout";
import Button from "../../components/ui/Button";
import { useDeliveries } from "../../context/DeliveryContext";
import { useToast } from "../../components/ui/Toast";

export default function PickupConfirmation() {
  const location = useLocation();
  const navigate = useNavigate();
  const { deliveries, advanceStatus } = useDeliveries();
  const { showToast } = useToast();
  const [confirmed, setConfirmed] = useState(false);

  const deliveryId = location.state?.deliveryId || deliveries.find((d) => d.status === "ASSIGNED")?.id;
  const delivery = deliveries.find((d) => d.id === deliveryId);

  const handleConfirm = () => {
    if (!delivery) return;
    advanceStatus(delivery.id, "PICKED_UP");
    setConfirmed(true);
    showToast("Package picked up!");
  };

  if (!delivery) {
    return (
      <RiderLayout>
        <p className="text-center text-sm text-gray-500">No delivery selected.</p>
      </RiderLayout>
    );
  }

  return (
    <RiderLayout>
      <div className="mx-auto max-w-sm text-center">
        <h1 className="text-lg font-bold text-ink">Pick Up Confirmation</h1>

        {!confirmed ? (
          <>
            <div className="mx-auto mt-8 flex h-28 w-28 items-center justify-center rounded-full bg-maroon-50">
              <Package className="h-12 w-12 text-maroon-500" aria-hidden="true" />
            </div>
            <p className="mt-6 text-sm text-gray-600">Have you collected this package from the retailer?</p>

            <div className="mt-8 flex gap-3">
              <Button variant="secondary" fullWidth icon={X} onClick={() => navigate(-1)}>
                Cancel
              </Button>
              <Button fullWidth onClick={handleConfirm}>
                Confirm Pickup
              </Button>
            </div>
          </>
        ) : (
          <div className="animate-slideUp">
            <div className="mx-auto mt-8 flex h-28 w-28 items-center justify-center rounded-full bg-teal-50">
              <CheckCircle2 className="h-14 w-14 text-teal-500" aria-hidden="true" />
            </div>
            <p className="mt-5 text-base font-bold text-ink">✓ Package picked up!</p>
            <p className="mt-1 text-sm text-gray-500">Delivery #{delivery.id}</p>
            <p className="mt-3 inline-flex items-center rounded-full bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-600">
              PICKED_UP
            </p>

            <div className="mt-6 rounded-xl bg-gray-50 p-4 text-left">
              <p className="text-sm text-gray-600">Next step: confirm delivery using the customer&apos;s QR code.</p>
            </div>

            <Button
              fullWidth
              size="lg"
              icon={ScanLine}
              className="mt-6"
              onClick={() => navigate("/rider/scanner", { state: { deliveryId: delivery.id } })}
            >
              Scan QR Code
            </Button>
          </div>
        )}
      </div>
    </RiderLayout>
  );
}
