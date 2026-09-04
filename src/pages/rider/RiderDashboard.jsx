import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Phone, MapPin, Package, Flag, PackageSearch } from "lucide-react";
import RiderLayout from "../../components/layout/RiderLayout";
import StatusBadge from "../../components/ui/StatusBadge";
import Button from "../../components/ui/Button";
import EmptyState from "../../components/ui/EmptyState";
import ReportIssueModal from "../../components/delivery/ReportIssueModal";
import { useDeliveries } from "../../context/DeliveryContext";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../components/ui/Toast";

export default function RiderDashboard() {
  const { deliveries } = useDeliveries();
  const { user } = useAuth();
  const { showToast } = useToast();

  const [tab, setTab] = useState("mine");
  const [reportOpen, setReportOpen] = useState(false);

  const navigate = useNavigate();

  const myDeliveries = deliveries.filter(
    (delivery) =>
      ["ASSIGNED", "PICKED_UP"].includes(delivery.status) &&
      String(delivery.rider?.id) === String(user?.id)
  );

  const active = myDeliveries[0];
  const later = myDeliveries.slice(1);

  const handleReport = () => {
    showToast("Issue reported to dispatcher");
  };

  return (
    <RiderLayout>
      <h1 className="text-lg font-bold text-ink">
        Good morning, {user?.name?.split(" ")[0] || "Rider"} 👋
      </h1>

      <p className="mt-0.5 text-sm text-gray-500">
        You have {myDeliveries.length}{" "}
        {myDeliveries.length === 1 ? "delivery" : "deliveries"} today.
      </p>

      <div className="mt-5 flex gap-1 border-b border-gray-100">
        <button
          onClick={() => setTab("mine")}
          className={`px-3 pb-2.5 text-sm font-semibold transition-colors ${
            tab === "mine"
              ? "border-b-2 border-maroon-500 text-maroon-500"
              : "text-gray-400"
          }`}
        >
          My Delivery
        </button>

        <button
          onClick={() => setTab("other")}
          className={`px-3 pb-2.5 text-sm font-semibold transition-colors ${
            tab === "other"
              ? "border-b-2 border-maroon-500 text-maroon-500"
              : "text-gray-400"
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
                <p className="text-base font-bold text-ink">
                  #{active.id}
                </p>

                <StatusBadge status={active.status} />
              </div>

              <p className="mt-3 text-sm font-semibold text-ink">
                {active.customer.name}
              </p>

              <div className="mt-2 space-y-1.5">
                <p className="flex items-center gap-1.5 text-xs text-gray-500">
                  <Phone className="h-3.5 w-3.5" />
                  {active.customer.phone}
                </p>

                <p className="flex items-center gap-1.5 text-xs text-gray-500">
                  <MapPin className="h-3.5 w-3.5" />
                  {active.customer.address}
                </p>

                <p className="flex items-center gap-1.5 text-xs text-gray-500">
                  <Package className="h-3.5 w-3.5" />
                  {active.item}
                </p>
              </div>

              {active.status === "ASSIGNED" && (
                <Button
                  fullWidth
                  size="lg"
                  className="mt-5"
                  onClick={() =>
                    navigate(
                      `/rider/delivery/${active.id}`
                    )
                  }
                >
                  Mark Picked Up
                </Button>
              )}

              {active.status === "PICKED_UP" && (
                <Button
                  fullWidth
                  size="lg"
                  className="mt-5"
                  onClick={() =>
                    navigate("/rider/scanner", {
                      state: { deliveryId: active.id },
                    })
                  }
                >
                  Scan QR Code
                </Button>
              )}

              <button
                onClick={() => setReportOpen(true)}
                className="mx-auto mt-4 flex min-h-[40px] items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-red-500"
              >
                <Flag className="h-3.5 w-3.5" />
                Report an issue
              </button>
            </div>
          ) : (
            <EmptyState
              icon={PackageSearch}
              title="No active delivery"
              description="You're all caught up for now."
            />
          )
        ) : later.length === 0 ? (
          <EmptyState
            icon={PackageSearch}
            title="No other deliveries"
            description="New assignments will show up here."
          />
        ) : (
          <div className="space-y-3">
            <p className="text-sm font-semibold text-ink">
              Later Deliveries
            </p>

            {later.map((delivery) => (
              <div
                key={delivery.id}
                className="flex items-center justify-between rounded-2xl border border-gray-100 bg-white p-4 shadow-card"
              >
                <div>
                  <p className="text-sm font-bold text-ink">
                    #{delivery.id}
                  </p>

                  <p className="text-sm text-gray-600">
                    {delivery.customer.name}
                  </p>
                </div>

                <StatusBadge status={delivery.status} />
              </div>
            ))}
          </div>
        )}
      </div>

      <ReportIssueModal
        open={reportOpen}
        onClose={() => setReportOpen(false)}
        delivery={active}
        onSubmit={handleReport}
      />
    </RiderLayout>
  );
}
