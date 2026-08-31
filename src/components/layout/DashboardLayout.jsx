import { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { useAuth } from "../../hooks/useAuth";
import { LogOut } from "lucide-react";

export default function DashboardLayout({ navItems, greeting, subtitle, actions, children }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { user, logout } = useAuth();

  const items = [
    ...navItems,
    { label: "Logout", icon: LogOut, bottom: true, action: logout },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar items={items} open={drawerOpen} onClose={() => setDrawerOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar
          greeting={greeting}
          subtitle={subtitle}
          onMenuClick={() => setDrawerOpen(true)}
          user={user}
          roleBadge={user?.role}
          actions={actions}
        />
        <main className="flex-1 px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8 animate-fadeIn">
          <div className="mx-auto w-full max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
