import { Loader2 } from "lucide-react";

export default function LoadingSpinner({ label = "Loading", size = "md", className = "" }) {
  const sizes = { sm: "h-4 w-4", md: "h-6 w-6", lg: "h-9 w-9" };
  return (
    <div role="status" className={`flex flex-col items-center justify-center gap-2 py-10 text-gray-400 ${className}`}>
      <Loader2 className={`${sizes[size]} animate-spin text-teal-500`} aria-hidden="true" />
      <span className="text-sm">{label}</span>
    </div>
  );
}
