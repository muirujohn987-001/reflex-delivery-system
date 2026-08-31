const PALETTE = ["bg-teal-500", "bg-maroon-500", "bg-purple-500", "bg-amber-500", "bg-sky-500"];

function initials(name = "") {
  const parts = name.trim().split(" ");
  return ((parts[0]?.[0] || "") + (parts[1]?.[0] || "")).toUpperCase();
}

function colorFor(name = "") {
  const sum = name.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  return PALETTE[sum % PALETTE.length];
}

const SIZES = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-14 w-14 text-lg",
};

export default function Avatar({ name, size = "md", className = "" }) {
  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-full font-semibold text-white ${colorFor(name)} ${SIZES[size]} ${className}`}
      aria-hidden="true"
    >
      {initials(name) || "?"}
    </div>
  );
}
