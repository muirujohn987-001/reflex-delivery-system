import { AlertTriangle } from "lucide-react";
import Button from "./Button";

export default function ErrorState({ title = "Something went wrong", description = "Please try again.", onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-red-100 bg-red-50/40 px-6 py-14 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-500">
        <AlertTriangle className="h-6 w-6" aria-hidden="true" />
      </div>
      <div>
        <p className="text-sm font-semibold text-ink">{title}</p>
        <p className="mt-1 max-w-xs text-sm text-gray-500">{description}</p>
      </div>
      {onRetry && (
        <Button variant="secondary" size="sm" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}
