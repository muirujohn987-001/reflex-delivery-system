import { useCallback, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Zap, Keyboard, Loader2 } from "lucide-react";

import QRCodeScanner from "../../components/delivery/QRCodeScanner";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";

import { useDeliveries } from "../../context/DeliveryContext";
import { api } from "../../services/api";

export default function QRScanner() {
  const location = useLocation();
  const navigate = useNavigate();

  const { deliveries } = useDeliveries();

  const [manualMode, setManualMode] = useState(false);
  const [code, setCode] = useState("");
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
 
  const delivery =
  deliveries.find(
    (d) => d.id === location.state?.deliveryId
  ) ||
  deliveries.find(
    (d) => d.status === "PICKED_UP"
  );

const deliveryId = delivery?.id;

  /*
   * Try to get the rider ID from the delivery first.
   *
   * If your login system stores the rider ID in localStorage,
   * these fallbacks support common names.
   */
  const getRiderId = () => {
    if (delivery?.riderId) {
      return delivery.riderId;
    }

    const storedRiderId =
      localStorage.getItem("riderId") ||
      localStorage.getItem("userId");

    return storedRiderId;
  };

  const completeScan = useCallback(
    async (rawToken) => {
      if (processing) return;

      setError("");

      if (!delivery) {
        setError("Delivery could not be found.");
        return;
      }

      if (!rawToken || !rawToken.trim()) {
        setError("Invalid QR code.");
        return;
      }

      const riderId = getRiderId();

      if (!riderId) {
        setError(
          "Rider ID is missing. Please log in again."
        );
        return;
      }

      try {
        setProcessing(true);

        console.log("Confirming delivery:", {
          deliveryId: delivery.id,
          riderId,
          rawToken,
        });

        const result = await api.confirmDelivery(
          delivery.id,
          riderId,
          rawToken.trim()
        );

        console.log(
          "Delivery confirmation successful:",
          result
        );

        navigate("/rider/confirmation", {
          state: {
            deliveryId: delivery.id,
            confirmation: result,
          },
        });
      } catch (err) {
        console.error(
          "Delivery confirmation failed:",
          err
        );

        setError(
          err.message ||
            "Delivery confirmation failed. Please try again."
        );
      } finally {
        setProcessing(false);
      }
    },
    [delivery, processing, navigate]
  );

  const handleManualConfirm = () => {
    completeScan(code);
  };

  if (!delivery) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-ink px-6 text-white">
        <p className="text-center text-red-300">
          No PICKED_UP delivery was found.
        </p>

        <Button
          className="mt-4"
          onClick={() => navigate(-1)}
        >
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-ink text-white">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-4">
        <button
          onClick={() => navigate(-1)}
          aria-label="Back"
          className="rounded-lg p-2 hover:bg-white/10"
          disabled={processing}
        >
          <ArrowLeft className="h-5 w-5" />
        </button>

        <h1 className="text-sm font-bold">
          QR Scanner
        </h1>

        <button
          aria-label="Toggle flash"
          className="rounded-lg p-2 hover:bg-white/10"
          disabled={processing}
        >
          <Zap className="h-5 w-5" />
        </button>
      </header>

      {/* Scanner */}
      <div className="flex flex-1 flex-col items-center justify-center px-6">
        {!manualMode ? (
          <>
            <p className="mb-6 text-sm text-white/70">
              Scan customer&apos;s QR code
            </p>

            <QRCodeScanner
              scanning={!processing}
              onScan={completeScan}
            />

            {processing ? (
              <div className="mt-6 flex items-center gap-2 text-sm text-teal-300">
                <Loader2 className="h-4 w-4 animate-spin" />
                Confirming delivery...
              </div>
            ) : (
              <p className="mt-6 text-xs text-white/40">
                Point your camera at the customer&apos;s QR code
              </p>
            )}

            {error && (
              <p className="mt-4 max-w-xs text-center text-sm text-red-300">
                {error}
              </p>
            )}
          </>
        ) : (
          /* Manual mode */
          <div className="w-full max-w-xs animate-slideUp">
            <p className="mb-4 text-center text-sm text-white/70">
              Enter the delivery code manually
            </p>

            <Input
              placeholder="Enter QR token"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="bg-white text-ink"
              disabled={processing}
            />

            {error && (
              <p className="mt-3 text-center text-sm text-red-300">
                {error}
              </p>
            )}

            <Button
              fullWidth
              className="mt-4"
              disabled={!code.trim() || processing}
              onClick={handleManualConfirm}
            >
              {processing ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Confirming...
                </span>
              ) : (
                "Confirm Code"
              )}
            </Button>
          </div>
        )}
      </div>

      {/* Manual mode button */}
      <div className="px-6 pb-8">
        <button
          onClick={() => {
            setError("");
            setManualMode((m) => !m);
          }}
          disabled={processing}
          className="mx-auto flex min-h-[44px] items-center gap-2 rounded-xl px-4 text-sm font-semibold text-white/80 hover:bg-white/10 disabled:opacity-50"
        >
          <Keyboard
            className="h-4 w-4"
            aria-hidden="true"
          />

          {manualMode
            ? "Back to scanner"
            : "Enter code manually"}
        </button>
      </div>
    </div>
  );
}