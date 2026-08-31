import { useEffect, useRef } from "react";
import { X } from "lucide-react";

export default function Modal({ open, onClose, title, subtitle, children, footer, size = "md" }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose?.();
    document.addEventListener("keydown", onKey);
    dialogRef.current?.focus();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  const widths = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center animate-fadeIn" role="presentation">
      <button
        aria-label="Close dialog"
        onClick={onClose}
        className="absolute inset-0 bg-ink/40 backdrop-blur-[2px]"
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        tabIndex={-1}
        className={`relative z-10 w-full ${widths[size]} max-h-[90vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl bg-white shadow-card-hover
          animate-slideUp mx-0 sm:mx-4 outline-none`}
      >
        <div className="sticky top-0 z-10 flex items-start justify-between gap-3 border-b border-gray-100 bg-white px-5 py-4 sm:px-6">
          <div>
            <h2 id="modal-title" className="text-lg font-bold text-ink">
              {title}
            </h2>
            {subtitle && <p className="mt-0.5 text-sm text-gray-500">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-50 hover:text-ink transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="px-5 py-5 sm:px-6">{children}</div>
        {footer && <div className="sticky bottom-0 flex items-center justify-end gap-3 border-t border-gray-100 bg-white px-5 py-4 sm:px-6">{footer}</div>}
      </div>
    </div>
  );
}
