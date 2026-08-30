import { QrCode } from "lucide-react";

/**
 * Presentational QR scanner viewport. Wire up a camera library
 * (e.g. html5-qrcode or @zxing/browser) by rendering its <video>
 * element inside this component in place of the placeholder below.
 */
export default function QRCodeScanner({ scanning = true }) {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[320px] overflow-hidden rounded-2xl bg-ink">
      <div className="absolute inset-0 flex items-center justify-center">
        <QrCode className="h-16 w-16 text-white/10" aria-hidden="true" />
      </div>

      {/* Corner markers */}
      <div className="absolute inset-6">
        <span className="absolute left-0 top-0 h-8 w-8 rounded-tl-xl border-l-4 border-t-4 border-teal-400" />
        <span className="absolute right-0 top-0 h-8 w-8 rounded-tr-xl border-r-4 border-t-4 border-teal-400" />
        <span className="absolute bottom-0 left-0 h-8 w-8 rounded-bl-xl border-b-4 border-l-4 border-teal-400" />
        <span className="absolute bottom-0 right-0 h-8 w-8 rounded-br-xl border-b-4 border-r-4 border-teal-400" />

        {scanning && (
          <span className="absolute inset-x-0 top-0 h-0.5 animate-scanLine bg-teal-400 shadow-[0_0_8px_2px_rgba(0,140,149,0.8)]" aria-hidden="true" />
        )}
      </div>
    </div>
  );
}
