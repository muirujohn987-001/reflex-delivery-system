import { useCallback, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Keyboard } from "lucide-react";
import QRCodeScanner from "../../components/delivery/QRCodeScanner";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import { useDeliveries } from "../../context/DeliveryContext";
import { useToast } from "../../components/ui/Toast";

export default function QRScanner() {
  const location = useLocation();
  const navigate = useNavigate();
  const { deliveries, advanceStatus } = useDeliveries();
  const { showToast } = useToast();
  const [manualMode, setManualMode] = useState(false);
  const [code, setCode] = useState("");

  const preselectedId = location.state?.deliveryId;
  const fallbackDelivery = useMemo(() => deliveries.find((d) => d.status === "PICKED_UP"), [deliveries]);
  const delivery = deliveries.find((d) => d.id === preselectedId) || fallbackDelivery;

  const confirmDelivery = useCallback(
    (target) => {
      if (!target) {
        showToast("No matching delivery found", "error");
        return;
      }
      advanceStatus(target.id, "DELIVERED");
      navigate("/rider/confirmation", { state: { deliveryId: target.id } });
    },
    [advanceStatus, navigate, showToast]
  );

  const handleScanSuccess = useCallback(() => confirmDelivery(delivery), [confirmDelivery, delivery]);

  const handleManualSubmit = () => {
    const cleaned = code.trim().replace(/^REF-/i, "");
    const match = deliveries.find((d) => d.id === cleaned);
    confirmDelivery(match);
  };

  return (
    <div className="flex min-h-screen flex-col bg-maroon-900 text-white">
      {/* Nav bar — brand maroon, not black */}
      <header className="flex items-center justify-between border-b border-white/10 bg-maroon-500 px-4 py-4">
        <button onClick={() => navigate(-1)} aria-label="Back" className="rounded-lg p-2 hover:bg-white/10">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-sm font-bold">QR Scanner</h1>
        <span className="w-9" aria-hidden="true" />
      </header>

      <div className="flex flex-1 flex-col items-center justify-center px-6 py-6">
        {!manualMode ? (
          <>
            <p className="mb-4 text-sm text-white/70">Scan customer&apos;s QR code</p>
            <div className="w-full max-w-[320px] rounded-2xl bg-white p-3 shadow-card-hover">
              <QRCodeScanner active={!manualMode} onScanSuccess={handleScanSuccess} />
            </div>
            <p className="mt-6 max-w-xs text-center text-xs text-white/40">
              Tap &quot;Request Camera Permissions&quot; above, then point your phone&apos;s back camera at the customer&apos;s QR code.
            </p>
            {!delivery && (
              <p className="mt-3 max-w-xs text-center text-xs text-amber-300">
                Note: no delivery is currently picked up — mark one as picked up first so a scan has something to confirm.
              </p>
            )}
          </>
        ) : (
          <div className="w-full max-w-xs animate-slideUp">
            <p className="mb-4 text-center text-sm text-white/70">Enter the delivery code manually</p>
            <Input
              placeholder="e.g. REF-1041"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="bg-white text-ink"
            />
            <Button fullWidth className="mt-4" disabled={!code.trim()} onClick={handleManualSubmit}>
              Confirm Code
            </Button>
          </div>
        )}
      </div>

      <div className="px-6 pb-8">
        <button
          onClick={() => setManualMode((m) => !m)}
          className="mx-auto flex min-h-[44px] items-center gap-2 rounded-xl px-4 text-sm font-semibold text-white/80 hover:bg-white/10"
        >
          <Keyboard className="h-4 w-4" aria-hidden="true" />
          {manualMode ? "Back to scanner" : "Enter code manually"}
        </button>
      </div>
    </div>
  );
}