import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Zap, Keyboard } from "lucide-react";
import QRCodeScanner from "../../components/delivery/QRCodeScanner";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import { useDeliveries } from "../../context/DeliveryContext";

export default function QRScanner() {
  const location = useLocation();
  const navigate = useNavigate();
  const { deliveries, advanceStatus } = useDeliveries();
  const [manualMode, setManualMode] = useState(false);
  const [code, setCode] = useState("");

  const deliveryId = location.state?.deliveryId || deliveries.find((d) => d.status === "PICKED_UP")?.id;
  const delivery = deliveries.find((d) => d.id === deliveryId);

  const completeScan = () => {
    if (!delivery) return;
    advanceStatus(delivery.id, "DELIVERED");
    navigate("/rider/confirmation", { state: { deliveryId: delivery.id } });
  };

  return (
    <div className="flex min-h-screen flex-col bg-ink text-white">
      <header className="flex items-center justify-between px-4 py-4">
        <button onClick={() => navigate(-1)} aria-label="Back" className="rounded-lg p-2 hover:bg-white/10">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-sm font-bold">QR Scanner</h1>
        <button aria-label="Toggle flash" className="rounded-lg p-2 hover:bg-white/10">
          <Zap className="h-5 w-5" />
        </button>
      </header>

      <div className="flex flex-1 flex-col items-center justify-center px-6">
        {!manualMode ? (
          <>
            <p className="mb-6 text-sm text-white/70">Scan customer&apos;s QR code</p>
            <button onClick={completeScan} className="rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-teal-400" aria-label="Simulate successful scan">
              <QRCodeScanner />
            </button>
            <p className="mt-6 text-xs text-white/40">Tap the scanner to simulate a successful scan</p>
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
            <Button fullWidth className="mt-4" disabled={!code.trim()} onClick={completeScan}>
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
