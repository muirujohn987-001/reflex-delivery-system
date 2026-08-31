import { Menu, Bell } from "lucide-react";
import { Truck } from "lucide-react";
import MobileNavbar from "./MobileNavbar";

export default function RiderLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50 pb-20 lg:pb-0">
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-gray-100 bg-maroon-500 px-4 py-3.5 text-white sm:px-6">
        <div className="flex items-center gap-2">
          <Truck className="h-5 w-5" aria-hidden="true" />
          <span className="text-base font-bold tracking-tight">REFLEX</span>
        </div>
        <div className="flex items-center gap-1">
          <button aria-label="Menu" className="rounded-lg p-2 text-white/80 hover:bg-white/10 lg:hidden">
            <Menu className="h-5 w-5" />
          </button>
          <button aria-label="Notifications" className="relative rounded-lg p-2 text-white/80 hover:bg-white/10">
            <Bell className="h-5 w-5" />
            <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-teal-400" />
          </button>
        </div>
      </header>
      <main className="animate-fadeIn px-4 py-5 sm:px-6">{children}</main>
      <MobileNavbar />
    </div>
  );
}
