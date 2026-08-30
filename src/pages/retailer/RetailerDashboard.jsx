import { Link } from "react-router-dom";
import { Package, Clock3, Truck, CheckCircle2, Plus } from "lucide-react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import StatCard from "../../components/dashboard/StatCard";
import DeliveryTable from "../../components/delivery/DeliveryTable";
import Button from "../../components/ui/Button";
import { retailerNav } from "../../utils/navConfig";
import { useDeliveries } from "../../context/DeliveryContext";
import { useAuth } from "../../hooks/useAuth";

export default function RetailerDashboard() {
  const { deliveries } = useDeliveries();
  const { user } = useAuth();

  const stats = {
    total: deliveries.length,
    requested: deliveries.filter((d) => d.status === "REQUESTED").length,
    inTransit: deliveries.filter((d) => ["ASSIGNED", "PICKED_UP"].includes(d.status)).length,
    delivered: deliveries.filter((d) => d.status === "DELIVERED").length,
  };

  return (
    <DashboardLayout
      navItems={retailerNav}
      greeting={`Good morning, ${user?.name || "there"} 👋`}
      subtitle="Here's what's happening with your deliveries today."
      actions={
        <Link to="/retailer/create-delivery" className="hidden sm:block">
          <Button icon={Plus}>Create Delivery</Button>
        </Link>
      }
    >
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <StatCard icon={Package} label="Total Deliveries" value={stats.total} tone="maroon" />
        <StatCard icon={Clock3} label="Requested" value={stats.requested} tone="amber" />
        <StatCard icon={Truck} label="In Transit" value={stats.inTransit} tone="teal" />
        <StatCard icon={CheckCircle2} label="Delivered" value={stats.delivered} tone="emerald" />
      </div>

      <div className="mt-6 flex items-center justify-between sm:mt-8">
        <h2 className="text-base font-bold text-ink sm:text-lg">Recent Deliveries</h2>
        <Link to="/retailer/deliveries" className="text-sm font-semibold text-teal-600 hover:text-teal-700">
          View All
        </Link>
      </div>
      <div className="mt-3 sm:mt-4">
        <DeliveryTable deliveries={deliveries.slice(0, 4)} />
      </div>

      <Link to="/retailer/create-delivery" className="fixed bottom-6 right-6 sm:hidden">
        <Button size="lg" className="rounded-full !px-4 shadow-card-hover" icon={Plus} aria-label="Create Delivery" />
      </Link>
    </DashboardLayout>
  );
}
