import { NavLink } from "react-router-dom";
import { Home, Package, ScanLine, History, User } from "lucide-react";

const ITEMS = [
  { to: "/rider/dashboard", label: "Home", icon: Home, end: true },
  { to: "/rider/dashboard?tab=other", label: "Deliveries", icon: Package },
  { to: "/rider/scanner", label: "Scan", icon: ScanLine },
  { to: "/rider/history", label: "History", icon: History },
  { to: "/profile", label: "Profile", icon: User },
];

export default function MobileNavbar() {
  return (
    <nav
      aria-label="Rider navigation"
      className="fixed inset-x-0 bottom-0 z-40 flex items-stretch justify-center gap-1 border-t border-gray-100 bg-white pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_16px_rgba(17,17,17,0.06)]"
    >
      <div className="flex w-full max-w-xl items-stretch justify-around">
        {ITEMS.map((item) => (
          <NavLink
            key={item.label}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `flex min-h-[56px] flex-1 flex-col items-center justify-center gap-0.5 text-[11px] font-medium transition-colors
              ${isActive ? "text-maroon-500" : "text-gray-400 hover:text-gray-600"}`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon className={`h-5 w-5 ${isActive ? "text-maroon-500" : ""}`} aria-hidden="true" />
                {item.label}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}