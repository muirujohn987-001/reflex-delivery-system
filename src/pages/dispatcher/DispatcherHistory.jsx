import DashboardLayout from "../../components/layout/DashboardLayout";
import DeliveryTable from "../../components/delivery/DeliveryTable";
import { dispatcherNav } from "../../utils/navConfig";
import { useDeliveries } from "../../context/DeliveryContext";

export default function DispatcherHistory() {
  const { deliveries } = useDeliveries();
  const past = deliveries.filter((d) => ["DELIVERED", "CANCELLED"].includes(d.status));

  return (
    <DashboardLayout navItems={dispatcherNav} greeting="History" subtitle="Completed and cancelled deliveries.">
      <DeliveryTable deliveries={past} basePath="/dispatcher/deliveries" />
    </DashboardLayout>
  );
}
