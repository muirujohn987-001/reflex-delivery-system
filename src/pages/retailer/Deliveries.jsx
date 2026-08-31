import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Search } from "lucide-react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import DeliveryTable from "../../components/delivery/DeliveryTable";
import Button from "../../components/ui/Button";
import { retailerNav } from "../../utils/navConfig";
import { useDeliveries } from "../../context/DeliveryContext";
import { STATUS_LABELS } from "../../utils/constants";

const FILTERS = ["ALL", "REQUESTED", "ASSIGNED", "PICKED_UP", "DELIVERED"];

export default function Deliveries() {
  const { deliveries } = useDeliveries();
  const [filter, setFilter] = useState("ALL");
  const [query, setQuery] = useState("");

  const filtered = deliveries.filter((d) => {
    const matchesFilter = filter === "ALL" || d.status === filter;
    const matchesQuery =
      !query ||
      d.customer.name.toLowerCase().includes(query.toLowerCase()) ||
      d.id.includes(query) ||
      d.item.toLowerCase().includes(query.toLowerCase());
    return matchesFilter && matchesQuery;
  });

  return (
    <DashboardLayout
      navItems={retailerNav}
      greeting="Deliveries"
      subtitle="Track and manage every delivery request."
      actions={
        <Link to="/retailer/create-delivery" className="hidden sm:block">
          <Button icon={Plus}>Create Delivery</Button>
        </Link>
      }
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" aria-hidden="true" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by ID, customer, item"
            className="min-h-[44px] w-full rounded-xl border border-gray-100 bg-white pl-10 pr-3.5 text-sm outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100"
          />
        </div>
        <div className="flex gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`shrink-0 rounded-full px-3.5 py-2 text-xs font-semibold transition-colors ${
                filter === f ? "bg-maroon-500 text-white" : "bg-white text-gray-500 border border-gray-100 hover:bg-gray-50"
              }`}
            >
              {f === "ALL" ? "All" : STATUS_LABELS[f]}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5">
        <DeliveryTable deliveries={filtered} />
      </div>
    </DashboardLayout>
  );
}
