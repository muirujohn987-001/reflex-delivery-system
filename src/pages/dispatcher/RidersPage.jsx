import DashboardLayout from "../../components/layout/DashboardLayout";
import Avatar from "../../components/ui/Avatar";
import { dispatcherNav } from "../../utils/navConfig";
import { useDeliveries } from "../../context/DeliveryContext";

export default function RidersPage() {
  const { riders } = useDeliveries();

  return (
    <DashboardLayout navItems={dispatcherNav} greeting="Riders" subtitle="Everyone currently active in the field.">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {riders.map((r) => (
          <div key={r.id} className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-card">
            <Avatar name={r.name} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-ink">{r.name}</p>
              <p className="text-xs text-gray-500">{r.phone}</p>
            </div>
            <span
              className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                r.available ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-500"
              }`}
            >
              {r.available ? "Available" : "Busy"}
            </span>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}
