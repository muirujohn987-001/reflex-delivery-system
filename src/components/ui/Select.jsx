
import { useId } from "react";
import { ChevronDown } from "lucide-react";

export default function Select({
  label,
  error,
  options = [],
  placeholder = "Select an option",
  className = "",
  containerClassName = "",
  ...props
}) {
  const id = useId();

  return (
    <div className={containerClassName}>
      {label && (
        <label
          htmlFor={id}
          className="mb-1.5 block text-sm font-medium text-ink"
        >
          {label}
        </label>
      )}

      <div className="relative">
        <select
          id={id}
          aria-invalid={!!error}
          className={`w-full min-h-[44px] appearance-none rounded-xl border bg-white px-3.5 py-2.5 pr-10 text-sm text-ink
            outline-none transition-colors duration-150
            ${
              error
                ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                : "border-gray-100 focus:border-teal-400 focus:ring-teal-100"
            }
            focus:ring-2 ${className}`}
          {...props}
        >
          <option value="" disabled>
            {placeholder}
          </option>

          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <ChevronDown
          className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
          aria-hidden="true"
        />
      </div>

      {error && (
        <p className="mt-1.5 text-xs font-medium text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}
