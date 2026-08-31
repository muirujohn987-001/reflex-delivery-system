import { Check } from "lucide-react";
import { TIMELINE_STEPS, STATUS_LABELS, STATUS_STYLES } from "../../utils/constants";

export default function DeliveryTimeline({ status, timeline }) {
  const currentIndex = TIMELINE_STEPS.indexOf(status);

  return (
    <ol className="space-y-0">
      {TIMELINE_STEPS.map((step, i) => {
        const entry = timeline?.find((t) => t.status === step);
        const isDone = i <= currentIndex;
        const isCurrent = i === currentIndex;
        const style = STATUS_STYLES[step];
        const isLast = i === TIMELINE_STEPS.length - 1;

        return (
          <li key={step} className="relative flex gap-3.5 pb-6 last:pb-0">
            {!isLast && (
              <span
                className={`absolute left-[15px] top-8 h-full w-0.5 ${isDone && i < currentIndex ? "bg-teal-400" : "bg-gray-100"}`}
                aria-hidden="true"
              />
            )}
            <span
              className={`z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ring-4 ${
                isDone ? `${style.dot} ring-4 ${style.ring}` : "bg-gray-100 ring-gray-50"
              }`}
            >
              {isDone ? <Check className="h-4 w-4 text-white" aria-hidden="true" /> : <span className="h-2 w-2 rounded-full bg-gray-300" />}
            </span>
            <div className="pt-0.5">
              <p className={`text-sm font-semibold ${isDone ? "text-ink" : "text-gray-400"}`}>
                {STATUS_LABELS[step]}
                {isCurrent && <span className="ml-2 text-xs font-medium text-teal-600">Current</span>}
              </p>
              <p className="text-xs text-gray-500">{entry?.time || (isDone ? "" : "Pending")}</p>
              {entry?.label && <p className="mt-0.5 text-xs text-gray-400">{entry.label}</p>}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
