import { LayoutDashboard, Package, PlusCircle, History, User, ClipboardList, Users, Bike } from "lucide-react";

export const retailerNav = [
  { to: "/retailer/dashboard", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/retailer/deliveries", label: "Deliveries", icon: Package },
  { to: "/retailer/create-delivery", label: "Create Delivery", icon: PlusCircle },
  { to: "/retailer/history", label: "History", icon: History },
  { to: "/profile", label: "Profile", icon: User },
];

export const dispatcherNav = [
  { to: "/dispatcher/dashboard", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/dispatcher/open-deliveries", label: "Open Deliveries", icon: ClipboardList },
  { to: "/dispatcher/active-deliveries", label: "Active Deliveries", icon: Bike },
  { to: "/dispatcher/riders", label: "Riders", icon: Users },
  { to: "/dispatcher/history", label: "History", icon: History },
];
