
import { useEffect, useRef, useState } from "react";
import { QrCode } from "lucide-react";
import { Html5Qrcode } from "html5-qrcode";

export default function QRCodeScanner({
  scanning = true,
  onScan,
}) {
  const scannerRef = useRef(null);
  const hasScannedRef = useRef(false);
  const onScanRef = useRef(onScan);

  // Makes sure a previous camera cleanup finishes
  // before another scanner tries to access the camera.
  const cleanupPromiseRef = useRef(Promise.resolve());

  const [error, setError] = useState("");

  // Always keep the latest callback without restarting
  // the scanner whenever the parent re-renders.
  useEffect(() => {
    onScanRef.current = onScan;
  }, [onScan]);

  useEffect(() => {
    if (!scanning) {
      return;
    }

    let mounted = true;
    let scanner = null;
    let startPromise = null;

    const stopAndClear = async (instance) => {
      if (!instance) return;

      try {
        const state =
          typeof instance.getState === "function"
            ? instance.getState()
            : null;

        /*
         * Html5Qrcode states:
         * 0 = NOT_STARTED
         * 2 = SCANNING
         * 3 = PAUSED
         *
         * Only call stop() when the scanner is actually
         * running or paused.
         */
        if (state === 2 || state === 3) {
          try {
            await instance.stop();
          } catch (err) {
            console.warn(
              "QR scanner stop warning:",
              err
            );
          }
        }
      } finally {
        try {
          instance.clear();
        } catch (err) {
          // clear() can fail if the scanner never rendered.
          console.warn(
            "QR scanner clear warning:",
            err
          );
        }

        if (scannerRef.current === instance) {
          scannerRef.current = null;
        }
      }
    };

    const startScanner = async () => {
      /*
       * IMPORTANT:
       * Wait for any previous scanner instance to finish
       * stopping before requesting the camera again.
       *
       * This prevents:
       * "NotReadableError: Device in use"
       */
      await cleanupPromiseRef.current;

      if (!mounted) return;

      setError("");
      hasScannedRef.current = false;

      scanner = new Html5Qrcode("qr-reader");
      scannerRef.current = scanner;

      startPromise = scanner.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: {
            width: 220,
            height: 220,
          },
          aspectRatio: 1,
        },
        async (decodedText) => {
          if (!mounted || hasScannedRef.current) {
            return;
          }

          hasScannedRef.current = true;

          /*
           * Stop the camera before sending the QR token
           * to the parent component.
           */
          await stopAndClear(scanner);

          if (mounted && onScanRef.current) {
            onScanRef.current(decodedText);
          }
        },
        () => {
          // Normal QR scanning errors are ignored.
        }
      );

      try {
        await startPromise;

        /*
         * The component may have been unmounted while
         * the camera was starting.
         *
         * In that case, immediately clean up the scanner.
         */
        if (!mounted) {
          await stopAndClear(scanner);
        }
      } catch (err) {
        console.error("QR scanner error:", err);

        /*
         * If the component was already unmounted, don't
         * update React state.
         */
        if (!mounted) {
          return;
        }

        setError(
          "Unable to access the camera. Please allow camera permission."
        );

        /*
         * The scanner may have partially started even
         * though start() rejected, so clean it safely.
         */
        await stopAndClear(scanner);
      }
    };

    startScanner();

    return () => {
      mounted = false;

      const instance = scanner;

      /*
       * Create a cleanup promise and store it.
       *
       * The next scanner start will wait for this promise.
       * This is the key fix for React Strict Mode and
       * camera "Device in use" errors.
       */
      const cleanup = (async () => {
        /*
         * If start() is still pending, wait until it settles
         * before attempting stop().
         */
        if (startPromise) {
          try {
            await startPromise;
          } catch {
            // start() failed; nothing else to do here.
          }
        }

        await stopAndClear(instance);
      })();

      cleanupPromiseRef.current = cleanup;
    };
  }, [scanning]);

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[320px] overflow-hidden rounded-2xl bg-ink">
      {/* Actual camera scanner */}
      <div
        id="qr-reader"
        className="absolute inset-0 h-full w-full overflow-hidden"
      />

      {/* Camera error fallback */}
      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-ink px-6 text-center">
          <QrCode
            className="mb-4 h-16 w-16 text-white/10"
            aria-hidden="true"
          />

          <p className="text-sm text-red-300">
            {error}
          </p>

          <p className="mt-2 text-xs text-white/50">
            Check your browser camera permission and try again.
          </p>
        </div>
      )}

      {/* Scanner corner markers */}
      <div className="pointer-events-none absolute inset-6">
        <span className="absolute left-0 top-0 h-8 w-8 rounded-tl-xl border-l-4 border-t-4 border-teal-400" />

        <span className="absolute right-0 top-0 h-8 w-8 rounded-tr-xl border-r-4 border-t-4 border-teal-400" />

        <span className="absolute bottom-0 left-0 h-8 w-8 rounded-bl-xl border-b-4 border-l-4 border-teal-400" />

        <span className="absolute bottom-0 right-0 h-8 w-8 rounded-br-xl border-b-4 border-r-4 border-teal-400" />

        {scanning && !error && (
          <span
            className="absolute inset-x-0 top-0 h-0.5 animate-scanLine bg-teal-400 shadow-[0_0_8px_2px_rgba(0,140,149,0.8)]"
            aria-hidden="true"
          />
        )}
      </div>
    </div>
  );
}
