import { Menu, Bell } from "lucide-react";
import { Link } from "react-router-dom";
import Avatar from "../ui/Avatar";

export default function Topbar({ greeting, subtitle, onMenuClick, user, roleBadge, actions }) {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-gray-100 bg-white/90 px-4 py-3.5 backdrop-blur sm:px-6 lg:px-8">
      <div className="flex min-w-0 items-center gap-3">
        <button
          onClick={onMenuClick}
          aria-label="Open menu"
          className="rounded-lg p-2 text-ink hover:bg-gray-50 lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="min-w-0">
          {greeting && <h1 className="truncate text-base font-bold text-ink sm:text-lg">{greeting}</h1>}
          {subtitle && <p className="hidden truncate text-sm text-gray-500 sm:block">{subtitle}</p>}
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2 sm:gap-3">
        {actions}
        <button
          aria-label="Notifications, 3 unread"
          className="relative rounded-lg p-2 text-gray-500 hover:bg-gray-50 hover:text-ink transition-colors"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-maroon-500 text-[10px] font-bold text-white">
            3
          </span>
        </button>
        <Link
          to="/profile"
          className="flex items-center gap-2 rounded-xl py-1 pl-1 pr-2 hover:bg-gray-50 transition-colors"
          aria-label="View profile"
        >
          <Avatar name={user?.name} size="sm" />
          <div className="hidden text-left sm:block">
            <p className="text-sm font-semibold leading-tight text-ink">{user?.name}</p>
            {roleBadge && <p className="text-xs leading-tight text-gray-500">{roleBadge}</p>}
          </div>
        </Link>
      </div>
    </header>
  );
}
