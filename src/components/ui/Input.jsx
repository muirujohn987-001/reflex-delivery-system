import { useId } from "react";

export default function Input({
  label,
  error,
  icon: Icon,
  hint,
  className = "",
  containerClassName = "",
  ...props
}) {
  const id = useId();
  return (
    <div className={containerClassName}>
      {label && (
        <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-ink">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <Icon className="pointer-events-none absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-gray-400" aria-hidden="true" />
        )}
        <input
          id={id}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
          className={`w-full min-h-[44px] rounded-xl border bg-white text-sm text-ink placeholder:text-gray-400
            transition-colors duration-150
            ${Icon ? "pl-10 pr-3.5" : "px-3.5"} py-2.5
            ${error ? "border-red-300 focus:border-red-400" : "border-gray-100 focus:border-teal-400"}
            outline-none focus:ring-2 ${error ? "focus:ring-red-100" : "focus:ring-teal-100"}
            ${className}`}
          {...props}
        />
      </div>
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-xs font-medium text-red-500">
          {error}
        </p>
      )}
      {!error && hint && (
        <p id={`${id}-hint`} className="mt-1.5 text-xs text-gray-500">
          {hint}
        </p>
      )}
    </div>
  );
}
