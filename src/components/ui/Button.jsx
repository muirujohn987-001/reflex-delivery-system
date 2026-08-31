import { Loader2 } from "lucide-react";

const VARIANTS = {
  primary: "bg-teal-500 text-white hover:bg-teal-600 active:bg-teal-700 shadow-sm",
  maroon: "bg-maroon-500 text-white hover:bg-maroon-600 active:bg-maroon-700 shadow-sm",
  secondary: "bg-white text-ink border border-gray-100 hover:bg-gray-50 active:bg-gray-100",
  ghost: "bg-transparent text-ink hover:bg-gray-50",
  danger: "bg-white text-red-600 border border-red-100 hover:bg-red-50",
  outlineTeal: "bg-white text-teal-600 border border-teal-100 hover:bg-teal-50",
};

const SIZES = {
  sm: "text-sm px-3.5 py-2 min-h-[38px]",
  md: "text-sm px-5 py-2.5 min-h-[44px]",
  lg: "text-base px-6 py-3.5 min-h-[52px]",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  fullWidth = false,
  loading = false,
  disabled = false,
  icon: Icon,
  className = "",
  type = "button",
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-150
        disabled:opacity-50 disabled:cursor-not-allowed
        active:scale-[0.98]
        ${VARIANTS[variant]} ${SIZES[size]} ${fullWidth ? "w-full" : ""} ${className}`}
      {...props}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
      ) : (
        Icon && <Icon className="h-4 w-4" aria-hidden="true" />
      )}
      {children}
    </button>
  );
}
