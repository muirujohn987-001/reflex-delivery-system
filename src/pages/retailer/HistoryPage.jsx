import DashboardLayout from "../../components/layout/DashboardLayout";
import DeliveryTable from "../../components/delivery/DeliveryTable";
import { retailerNav } from "../../utils/navConfig";
import { useDeliveries } from "../../context/DeliveryContext";

export default function HistoryPage() {
  const { deliveries } = useDeliveries();
  const past = deliveries.filter((d) => ["DELIVERED", "CANCELLED"].includes(d.status));

  return (
    <DashboardLayout navItems={retailerNav} greeting="History" subtitle="Completed and cancelled deliveries.">
      <DeliveryTable deliveries={past} />
    </DashboardLayout>
  );
}
