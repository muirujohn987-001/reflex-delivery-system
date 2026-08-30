import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { DeliveryProvider } from "./context/DeliveryContext";
import { ToastProvider } from "./components/ui/Toast";
import RequireRole from "./components/RequireRole";
import { ROLES } from "./utils/constants";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Profile from "./pages/Profile";

import RetailerDashboard from "./pages/retailer/RetailerDashboard";
import Deliveries from "./pages/retailer/Deliveries";
import CreateDelivery from "./pages/retailer/CreateDelivery";
import DeliveryDetails from "./pages/retailer/DeliveryDetails";
import RetailerHistory from "./pages/retailer/HistoryPage";

import DispatcherDashboard from "./pages/dispatcher/DispatcherDashboard";
import OpenDeliveries from "./pages/dispatcher/OpenDeliveries";
import ActiveDeliveries from "./pages/dispatcher/ActiveDeliveries";
import RidersPage from "./pages/dispatcher/RidersPage";
import DispatcherHistory from "./pages/dispatcher/DispatcherHistory";

import RiderDashboard from "./pages/rider/RiderDashboard";
import RiderDeliveryDetail from "./pages/rider/RiderDeliveryDetail";
import PickupConfirmation from "./pages/rider/PickupConfirmation";
import QRScanner from "./pages/rider/QRScanner";
import ConfirmationResult from "./pages/rider/ConfirmationResult";
import RiderHistory from "./pages/rider/RiderHistory";

export default function App() {
  return (
    <AuthProvider>
      <DeliveryProvider>
        <ToastProvider>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Retailer */}
            <Route
              path="/retailer/dashboard"
              element={
                <RequireRole role={ROLES.RETAILER}>
                  <RetailerDashboard />
                </RequireRole>
              }
            />
            <Route
              path="/retailer/deliveries"
              element={
                <RequireRole role={ROLES.RETAILER}>
                  <Deliveries />
                </RequireRole>
              }
            />
            <Route
              path="/retailer/create-delivery"
              element={
                <RequireRole role={ROLES.RETAILER}>
                  <CreateDelivery />
                </RequireRole>
              }
            />
            <Route
              path="/retailer/deliveries/:id"
              element={
                <RequireRole role={ROLES.RETAILER}>
                  <DeliveryDetails />
                </RequireRole>
              }
            />
            <Route
              path="/retailer/history"
              element={
                <RequireRole role={ROLES.RETAILER}>
                  <RetailerHistory />
                </RequireRole>
              }
            />

            {/* Dispatcher */}
            <Route
              path="/dispatcher/dashboard"
              element={
                <RequireRole role={ROLES.DISPATCHER}>
                  <DispatcherDashboard />
                </RequireRole>
              }
            />
            <Route
              path="/dispatcher/open-deliveries"
              element={
                <RequireRole role={ROLES.DISPATCHER}>
                  <OpenDeliveries />
                </RequireRole>
              }
            />
            <Route
              path="/dispatcher/active-deliveries"
              element={
                <RequireRole role={ROLES.DISPATCHER}>
                  <ActiveDeliveries />
                </RequireRole>
              }
            />
            <Route
              path="/dispatcher/deliveries/:id"
              element={
                <RequireRole role={ROLES.DISPATCHER}>
                  <DeliveryDetails />
                </RequireRole>
              }
            />
            <Route
              path="/dispatcher/riders"
              element={
                <RequireRole role={ROLES.DISPATCHER}>
                  <RidersPage />
                </RequireRole>
              }
            />
            <Route
              path="/dispatcher/history"
              element={
                <RequireRole role={ROLES.DISPATCHER}>
                  <DispatcherHistory />
                </RequireRole>
              }
            />

            {/* Rider */}
            <Route
              path="/rider/dashboard"
              element={
                <RequireRole role={ROLES.RIDER}>
                  <RiderDashboard />
                </RequireRole>
              }
            />
            <Route
              path="/rider/delivery/:id"
              element={
                <RequireRole role={ROLES.RIDER}>
                  <RiderDeliveryDetail />
                </RequireRole>
              }
            />
            <Route
              path="/rider/pickup-confirmation"
              element={
                <RequireRole role={ROLES.RIDER}>
                  <PickupConfirmation />
                </RequireRole>
              }
            />
            <Route
              path="/rider/scanner"
              element={
                <RequireRole role={ROLES.RIDER}>
                  <QRScanner />
                </RequireRole>
              }
            />
            <Route
              path="/rider/confirmation"
              element={
                <RequireRole role={ROLES.RIDER}>
                  <ConfirmationResult />
                </RequireRole>
              }
            />
            <Route
              path="/rider/history"
              element={
                <RequireRole role={ROLES.RIDER}>
                  <RiderHistory />
                </RequireRole>
              }
            />

            {/* Shared */}
            <Route
              path="/profile"
              element={
                <RequireRole>
                  <Profile />
                </RequireRole>
              }
            />

            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </ToastProvider>
      </DeliveryProvider>
    </AuthProvider>
  );
}
