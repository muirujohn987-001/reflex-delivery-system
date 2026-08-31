# REFLEX — Smart Delivery Coordination

A production-quality, mobile-responsive frontend for a delivery coordination platform connecting **Retailers**, **Dispatchers**, and **Riders**.

## Tech stack

- React 18 + Vite
- Tailwind CSS
- React Router DOM
- Lucide React icons

## Getting started

```bash
npm install
npm run dev
```

The app opens at `http://localhost:5173`. Start at `/login`.

### Demo login

Authentication is simulated — no backend is required. On the login screen, the app guesses your role from what you type in **Email or Phone**:

- Contains "dispatch" → signs in as **Dispatcher**
- Contains "rider" or "david" → signs in as **Rider**
- Anything else → signs in as **Retailer**

Password can be anything 4+ characters. Registration lets you pick a role explicitly from the **Account Type** dropdown.

## Project structure

```
src/
  components/
    ui/        Button, Input, Select, Modal, StatusBadge, Avatar, Toast, LoadingSpinner, EmptyState, ErrorState
    layout/    Sidebar, Topbar, MobileNavbar, DashboardLayout, RiderLayout
    delivery/  DeliveryCard, DeliveryTable, DeliveryTimeline, QRCodeScanner
    dashboard/ StatCard
  pages/
    auth/      Login (3D flip card), Register
    retailer/  Dashboard, Deliveries, CreateDelivery, DeliveryDetails, History
    dispatcher/ Dashboard, OpenDeliveries, ActiveDeliveries, AssignRiderModal, Riders, History
    rider/     Dashboard, DeliveryDetail, PickupConfirmation, QRScanner, ConfirmationResult, History
    Profile.jsx
  context/     AuthContext, DeliveryContext (mock in-memory state)
  services/    api.js — stub REST client, ready to point at a real backend
  hooks/       useAuth.js
  utils/       constants.js, mockData.js, navConfig.js
```

## Connecting a real backend

Everything currently reads/writes to in-memory React context seeded with mock data (`src/utils/mockData.js`). To connect a backend:

1. Point `VITE_API_BASE_URL` (in a `.env` file) at your API.
2. Replace the logic inside `AuthContext.jsx` and `DeliveryContext.jsx` with calls to `src/services/api.js`, which already has matching function stubs (`login`, `getDeliveries`, `createDelivery`, `assignRider`, `updateStatus`, etc).
3. Swap the QR scanner placeholder in `src/components/delivery/QRCodeScanner.jsx` for a real camera library (e.g. `html5-qrcode` or `@zxing/browser`) — the viewport, corner markers, and scanning animation are already in place.

## Responsive behavior

- **Desktop (lg+):** full sidebar, multi-column dashboards, tables.
- **Tablet (sm–lg):** narrower grids, sidebar becomes a drawer.
- **Mobile (<sm):** hamburger drawer, single/two-column cards, tables become card lists, forms stack, rider experience uses a fixed bottom navigation bar.

Tested at 375, 390, 430, 768, 1024, and 1440px widths.

## Notes

- Colors, spacing, and component styles follow the supplied brand system (deep maroon, teal, purple, white, grays).
- `npm run build` produces a production bundle with no console errors.
