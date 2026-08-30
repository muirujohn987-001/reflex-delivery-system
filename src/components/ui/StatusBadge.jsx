import { STATUS_STYLES, STATUS_LABELS } from "../../utils/constants";

export default function StatusBadge({ status, className = "" }) {
  const style = STATUS_STYLES[status] || STATUS_STYLES.REQUESTED;
  const label = STATUS_LABELS[status] || status;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${style.bg} ${style.text} ${className}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} aria-hidden="true" />
      {label}
    </span>
  );
}
