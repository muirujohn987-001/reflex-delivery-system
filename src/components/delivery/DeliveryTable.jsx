import { Link } from "react-router-dom";
import StatusBadge from "../ui/StatusBadge";
import DeliveryCard from "./DeliveryCard";
import EmptyState from "../ui/EmptyState";
import { PackageSearch } from "lucide-react";

export default function DeliveryTable({ deliveries, basePath = "/retailer/deliveries" }) {
  if (!deliveries.length) {
    return <EmptyState icon={PackageSearch} title="No deliveries yet" description="Deliveries you create will show up here." />;
  }

  return (
    <>
      {/* Mobile: card list */}
      <div className="grid gap-3 sm:hidden">
        {deliveries.map((d) => (
          <DeliveryCard key={d.id} delivery={d} to={`${basePath}/${d.id}`} />
        ))}
      </div>

      {/* Desktop/tablet: table, horizontally scrollable if needed */}
      <div className="hidden overflow-x-auto rounded-2xl border border-gray-100 bg-white shadow-card sm:block">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-gray-100 text-xs font-semibold uppercase tracking-wide text-gray-400">
              <th className="px-5 py-3.5">ID</th>
              <th className="px-5 py-3.5">Customer</th>
              <th className="px-5 py-3.5">Item</th>
              <th className="px-5 py-3.5">Status</th>
              <th className="px-5 py-3.5">Updated</th>
              <th className="px-5 py-3.5 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {deliveries.map((d) => (
              <tr key={d.id} className="transition-colors hover:bg-gray-25 hover:bg-gray-50/60">
                <td className="px-5 py-3.5 font-semibold text-ink">#{d.id}</td>
                <td className="px-5 py-3.5 text-ink/90">{d.customer.name}</td>
                <td className="px-5 py-3.5 text-gray-500">{d.item}</td>
                <td className="px-5 py-3.5">
                  <StatusBadge status={d.status} />
                </td>
                <td className="px-5 py-3.5 text-gray-500">{d.updated}</td>
                <td className="px-5 py-3.5 text-right">
                  <Link to={`${basePath}/${d.id}`} className="text-sm font-semibold text-teal-600 hover:text-teal-700">
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
