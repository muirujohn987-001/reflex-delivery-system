import { useNavigate } from "react-router-dom";
import { Mail, Phone, LogOut, ArrowLeft } from "lucide-react";
import DashboardLayout from "../components/layout/DashboardLayout";
import Avatar from "../components/ui/Avatar";
import Button from "../components/ui/Button";
import { useAuth } from "../hooks/useAuth";
import { retailerNav, dispatcherNav } from "../utils/navConfig";
import { ROLES } from "../utils/constants";
import { Home } from "lucide-react";

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const navItems =
    user?.role === ROLES.DISPATCHER
      ? dispatcherNav
      : user?.role === ROLES.RIDER
      ? [{ to: "/rider/dashboard", label: "Home", icon: Home, end: true }]
      : retailerNav;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <DashboardLayout navItems={navItems} greeting="Profile" subtitle="Manage your account information.">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-ink"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Back
      </button>

      <div className="mx-auto max-w-lg rounded-2xl border border-gray-100 bg-white p-6 shadow-card">
        <div className="flex items-center gap-4">
          <Avatar name={user?.name} size="lg" />
          <div>
            <p className="text-lg font-bold text-ink">{user?.name}</p>
            <span className="mt-1 inline-flex items-center rounded-full bg-maroon-50 px-2.5 py-0.5 text-xs font-semibold text-maroon-500">
              {user?.role}
            </span>
          </div>
        </div>

        <div className="mt-6 space-y-3 border-t border-gray-50 pt-5">
          <p className="flex items-center gap-2.5 text-sm text-gray-600">
            <Mail className="h-4 w-4 text-gray-400" aria-hidden="true" />
            {user?.email || "Not provided"}
          </p>
          <p className="flex items-center gap-2.5 text-sm text-gray-600">
            <Phone className="h-4 w-4 text-gray-400" aria-hidden="true" />
            {user?.phone || "Not provided"}
          </p>
        </div>

        <Button variant="danger" fullWidth icon={LogOut} className="mt-6" onClick={handleLogout}>
          Log Out
        </Button>
      </div>
    </DashboardLayout>
  );
}
