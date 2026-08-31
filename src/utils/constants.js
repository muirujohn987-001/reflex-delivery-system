export const ROLES = {
  RETAILER: "RETAILER",
  DISPATCHER: "DISPATCHER",
  RIDER: "RIDER",
};

export const ROLE_HOME = {
  [ROLES.RETAILER]: "/retailer/dashboard",
  [ROLES.DISPATCHER]: "/dispatcher/dashboard",
  [ROLES.RIDER]: "/rider/dashboard",
};

export const STATUS = {
  REQUESTED: "REQUESTED",
  ASSIGNED: "ASSIGNED",
  PICKED_UP: "PICKED_UP",
  DELIVERED: "DELIVERED",
  CANCELLED: "CANCELLED",
};

// Tailwind-safe static class strings per status (bg / text / dot)
export const STATUS_STYLES = {
  REQUESTED: {
    bg: "bg-amber-50",
    text: "text-amber-700",
    dot: "bg-amber-500",
    ring: "ring-amber-100",
  },
  ASSIGNED: {
    bg: "bg-teal-50",
    text: "text-teal-700",
    dot: "bg-teal-500",
    ring: "ring-teal-100",
  },
  PICKED_UP: {
    bg: "bg-purple-50",
    text: "text-purple-600",
    dot: "bg-purple-500",
    ring: "ring-purple-100",
  },
  DELIVERED: {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    dot: "bg-emerald-500",
    ring: "ring-emerald-100",
  },
  CANCELLED: {
    bg: "bg-gray-100",
    text: "text-gray-500",
    dot: "bg-gray-400",
    ring: "ring-gray-100",
  },
};

export const STATUS_LABELS = {
  REQUESTED: "Requested",
  ASSIGNED: "Assigned",
  PICKED_UP: "Picked up",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
};

export const TIMELINE_STEPS = ["REQUESTED", "ASSIGNED", "PICKED_UP", "DELIVERED"];
