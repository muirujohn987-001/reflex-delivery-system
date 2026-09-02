import { NavLink } from "react-router-dom";
import { X } from "lucide-react";
import Logo from "../ui/Logo";

export default function Sidebar({ items, open = false, onClose, dark = false }) {
  return (
    <>
      {/* Mobile drawer backdrop */}
      {open && (
        <button
          aria-label="Close menu"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-ink/40 backdrop-blur-[1px] lg:hidden animate-fadeIn"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-maroon-500 text-white shadow-drawer
          transition-transform duration-300 ease-out
          lg:static lg:z-0 lg:w-64 lg:translate-x-0 lg:shadow-none
          ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex items-start justify-between px-5 py-6">
          <Logo size={40} showTagline taglineClassName="text-white/70" />
          <button onClick={onClose} aria-label="Close menu" className="rounded-lg p-1.5 text-white/70 hover:bg-white/10 lg:hidden">
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-2" aria-label="Primary">
          {items.filter((i) => !i.bottom).map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={onClose}
              className={({ isActive }) =>
                `flex min-h-[44px] items-center gap-3 rounded-xl px-3.5 text-sm font-medium transition-colors duration-150
                ${isActive ? "bg-white text-maroon-500 shadow-sm" : "text-white/80 hover:bg-white/10 hover:text-white"}`
              }
            >
              <item.icon className="h-4.5 w-4.5" aria-hidden="true" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-white/10 px-3 py-4">
          {items.filter((i) => i.bottom).map((item) =>
            item.action ? (
              <button
                key={item.label}
                onClick={item.action}
                className="flex min-h-[44px] w-full items-center gap-3 rounded-xl px-3.5 text-sm font-medium text-white/80 transition-colors hover:bg-white/10 hover:text-white"
              >
                <item.icon className="h-4.5 w-4.5" aria-hidden="true" />
                {item.label}
              </button>
            ) : (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex min-h-[44px] items-center gap-3 rounded-xl px-3.5 text-sm font-medium transition-colors duration-150
                  ${isActive ? "bg-white text-maroon-500" : "text-white/80 hover:bg-white/10 hover:text-white"}`
                }
              >
                <item.icon className="h-4.5 w-4.5" aria-hidden="true" />
                {item.label}
              </NavLink>
            )
          )}
        </div>
      </aside>
    </>
  );
}