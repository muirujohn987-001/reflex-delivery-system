import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";

export default function QRCodeScanner({ onScan, scanning = true }) {
  const scannerRef = useRef(null);
  const startedRef = useRef(false);
  const onScanRef = useRef(onScan);

  const [cameraError, setCameraError] = useState("");

  useEffect(() => {
    onScanRef.current = onScan;
  }, [onScan]);

  useEffect(() => {
    if (!scanning) return;

    const scannerId = "reflex-qr-reader";
    const scanner = new Html5Qrcode(scannerId);

    scannerRef.current = scanner;
    startedRef.current = false;
    setCameraError("");

    let stopped = false;

    const startScanner = async () => {
      try {
        await scanner.start(
          { facingMode: "environment" },
          {
            fps: 10,
            qrbox: {
              width: 250,
              height: 250,
            },
          },
          (decodedText) => {
            if (!stopped) {
              onScanRef.current?.(decodedText);
            }
          },
          () => {
            // Ignore frames where no QR code is detected.
          }
        );

        startedRef.current = true;
      } catch (error) {
        console.error("Unable to start QR scanner:", error);

        setCameraError(
          "No camera was found. Connect or enable a webcam, then try again."
        );
      }
    };

    startScanner();

    return () => {
      stopped = true;

      if (startedRef.current) {
        scanner
          .stop()
          .catch((error) => {
            console.warn("QR scanner cleanup:", error);
          })
          .finally(() => {
            scanner.clear().catch(() => {});
          });
      }
    };
  }, [scanning]);

  return (
    <div className="relative mx-auto w-full max-w-[320px] overflow-hidden rounded-2xl bg-ink">
      <div
        id="reflex-qr-reader"
        className="min-h-[320px] w-full"
      />

      {cameraError && (
        <div className="absolute inset-0 flex items-center justify-center bg-ink px-6 text-center">
          <div>
            <p className="text-sm font-semibold text-white">
              Camera unavailable
            </p>

            <p className="mt-2 text-xs text-white/60">
              {cameraError}
            </p>
          </div>
        </div>
      )}

      <div className="pointer-events-none absolute inset-6">
        <span className="absolute left-0 top-0 h-8 w-8 rounded-tl-xl border-l-4 border-t-4 border-teal-400" />
        <span className="absolute right-0 top-0 h-8 w-8 rounded-tr-xl border-r-4 border-t-4 border-teal-400" />
        <span className="absolute bottom-0 left-0 h-8 w-8 rounded-bl-xl border-b-4 border-l-4 border-teal-400" />
        <span className="absolute bottom-0 right-0 h-8 w-8 rounded-br-xl border-b-4 border-r-4 border-teal-400" />

        {scanning && !cameraError && (
          <span className="absolute inset-x-0 top-0 h-0.5 animate-scanLine bg-teal-400 shadow-[0_0_8px_2px_rgba(0,140,149,0.8)]" />
        )}
      </div>
    </div>
  );
}
