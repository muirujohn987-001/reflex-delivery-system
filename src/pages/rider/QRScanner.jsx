import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Zap, Keyboard } from "lucide-react";
import QRCodeScanner from "../../components/delivery/QRCodeScanner";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import { useDeliveries } from "../../context/DeliveryContext";
import { api } from "../../services/api";

export default function QRScanner() {
  const location = useLocation();
  const navigate = useNavigate();

  const { deliveries, refreshDeliveries } = useDeliveries();

  const [manualMode, setManualMode] = useState(false);
  const [code, setCode] = useState("");
  const [scanning, setScanning] = useState(true);
  const [error, setError] = useState("");
  const [processing, setProcessing] = useState(false);

  const deliveryId =
    location.state?.deliveryId ||
    deliveries.find((d) => d.status === "PICKED_UP")?.id;

  const delivery = deliveries.find(
    (d) => String(d.id) === String(deliveryId)
  );

  const completeScan = async (qrToken) => {
    if (!delivery || !qrToken || processing) return;

    try {
      setProcessing(true);
      setScanning(false);
      setError("");

      await api.confirmDelivery(delivery.id, qrToken);

      await refreshDeliveries();

      navigate("/rider/confirmation", {
        state: {
          deliveryId: delivery.id,
        },
      });
    } catch (err) {
      console.error("QR confirmation failed:", err);

      setError(
        err.message || "Invalid QR code. Please try again."
      );

      setProcessing(false);
      setScanning(true);
    }
  };

  const handleManualConfirm = async () => {
    await completeScan(code.trim());
  };

  if (!delivery) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ink px-6 text-center text-white">
        <div>
          <h1 className="text-lg font-bold">
            Delivery not found
          </h1>

          <p className="mt-2 text-sm text-white/60">
            Return to your dashboard and select a delivery.
          </p>

          <Button
            className="mt-5"
            onClick={() => navigate("/rider/dashboard")}
          >
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-ink text-white">
      <header className="flex items-center justify-between px-4 py-4">
        <button
          onClick={() => navigate(-1)}
          aria-label="Back"
          className="rounded-lg p-2 hover:bg-white/10"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>

        <h1 className="text-sm font-bold">
          QR Scanner
        </h1>

        <button
          aria-label="Toggle flash"
          className="rounded-lg p-2 hover:bg-white/10"
        >
          <Zap className="h-5 w-5" />
        </button>
      </header>

      <div className="flex flex-1 flex-col items-center justify-center px-6">
        {!manualMode ? (
          <>
            <p className="mb-6 text-sm text-white/70">
              Scan customer's QR code
            </p>

            <QRCodeScanner
              scanning={scanning}
              onScan={completeScan}
            />

            {processing && (
              <p className="mt-5 text-sm text-teal-300">
                Verifying QR code...
              </p>
            )}

            {error && (
              <p className="mt-5 max-w-xs text-center text-sm text-red-300">
                {error}
              </p>
            )}

            <p className="mt-6 text-xs text-white/40">
              Point the camera at the customer's QR code.
            </p>
          </>
        ) : (
          <div className="w-full max-w-xs animate-slideUp">
            <p className="mb-4 text-center text-sm text-white/70">
              Enter the QR token manually
            </p>

            <Input
              placeholder="Paste QR token"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="bg-white text-ink"
            />

            {error && (
              <p className="mt-3 text-sm text-red-300">
                {error}
              </p>
            )}

            <Button
              fullWidth
              className="mt-4"
              disabled={!code.trim() || processing}
              onClick={handleManualConfirm}
            >
              {processing ? "Verifying..." : "Confirm Code"}
            </Button>
          </div>
        )}
      </div>

      <div className="px-6 pb-8">
        <button
          onClick={() => {
            setManualMode((m) => !m);
            setError("");
          }}
          className="mx-auto flex min-h-[44px] items-center gap-2 rounded-xl px-4 text-sm font-semibold text-white/80 hover:bg-white/10"
        >
          <Keyboard className="h-4 w-4" aria-hidden="true" />

          {manualMode
            ? "Back to scanner"
            : "Enter code manually"}
        </button>
      </div>
    </div>
  );
}
