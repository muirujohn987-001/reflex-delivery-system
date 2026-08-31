import DashboardLayout from "../../components/layout/DashboardLayout";
import DeliveryTable from "../../components/delivery/DeliveryTable";
import { dispatcherNav } from "../../utils/navConfig";
import { useDeliveries } from "../../context/DeliveryContext";

export default function ActiveDeliveries() {
  const { deliveries } = useDeliveries();
  const active = deliveries.filter((d) => ["ASSIGNED", "PICKED_UP"].includes(d.status));

  return (
    <DashboardLayout navItems={dispatcherNav} greeting="Active Deliveries" subtitle="Deliveries currently in progress.">
      <DeliveryTable deliveries={active} basePath="/dispatcher/deliveries" />
    </DashboardLayout>
  );
}
