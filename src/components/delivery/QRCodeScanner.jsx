import { useEffect, useRef } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

const CONTAINER_ID = "reflex-qr-reader";

/**
 * Live camera QR scanner using html5-qrcode's built-in widget.
 * It renders its own "Request Camera Permissions" button (a required
 * user click, which avoids browsers silently blocking auto-started
 * camera requests) plus a camera-picker dropdown if more than one
 * camera is available. Calls onScanSuccess(text) once, then stops.
 */
export default function QRCodeScanner({ active = true, onScanSuccess, onError }) {
  const scannerRef = useRef(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (!active) return undefined;
    if (initialized.current) return undefined;
    initialized.current = true;

    const scanner = new Html5QrcodeScanner(
      CONTAINER_ID,
      { fps: 10, qrbox: 240, rememberLastUsedCamera: true },
      /* verbose */ false
    );
    scannerRef.current = scanner;

    scanner.render(
      (decodedText) => {
        scanner.clear().catch(() => { });
        onScanSuccess?.(decodedText);
      },
      (err) => {
        // Fires continuously while no QR code is in frame — this is
        // normal, not a real error, so just forward it if the caller
        // wants to inspect it (they usually won't).
        onError?.(err);
      }
    );

    return () => {
      const instance = scannerRef.current;
      if (instance) {
        instance.clear().catch(() => { });
      }
      initialized.current = false;
    };
  }, [active, onScanSuccess, onError]);

  return (
    <div className="mx-auto w-full max-w-[320px]">
      <div
        id={CONTAINER_ID}
        className="overflow-hidden rounded-2xl text-ink
          [&_video]:rounded-2xl
          [&_select]:min-h-[38px] [&_select]:rounded-lg [&_select]:border [&_select]:border-gray-200 [&_select]:px-2 [&_select]:text-sm
          [&_button]:min-h-[40px] [&_button]:rounded-xl [&_button]:bg-teal-500 [&_button]:px-4 [&_button]:py-2 [&_button]:text-sm [&_button]:font-semibold [&_button]:text-white [&_button]:transition-colors hover:[&_button]:bg-teal-600"
      />
    </div>
  );
}