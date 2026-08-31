import { Link } from "react-router-dom";
import { MapPin, Clock, ChevronRight } from "lucide-react";
import StatusBadge from "../ui/StatusBadge";

export default function DeliveryCard({ delivery, to, action }) {
  const content = (
    <div className="group rounded-2xl border border-gray-100 bg-white p-4 shadow-card transition-all duration-150 hover:shadow-card-hover hover:-translate-y-0.5">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-sm font-bold text-ink">#{delivery.id}</p>
          <p className="truncate text-sm font-medium text-ink/90">{delivery.customer.name}</p>
        </div>
        <StatusBadge status={delivery.status} />
      </div>

      <div className="mt-3 space-y-1.5">
        <p className="flex items-center gap-1.5 text-xs text-gray-500">
          <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          <span className="truncate">{delivery.customer.address}</span>
        </p>
        <p className="truncate text-xs text-gray-500">{delivery.item}</p>
      </div>

      <div className="mt-3 flex items-center justify-between border-t border-gray-50 pt-3">
        <p className="flex items-center gap-1.5 text-xs text-gray-400">
          <Clock className="h-3.5 w-3.5" aria-hidden="true" />
          {delivery.updated}
        </p>
        {action ? action : to && <ChevronRight className="h-4 w-4 text-gray-300 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />}
      </div>
    </div>
  );

  if (to) {
    return (
      <Link to={to} className="block">
        {content}
      </Link>
    );
  }
  return content;
}
