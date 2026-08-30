export const mockUsers = [
  { id: "u1", name: "Adenike", role: "RETAILER", email: "adenike@shopmart.co", phone: "0712 000 111" },
  { id: "u2", name: "Dispatcher", role: "DISPATCHER", email: "ops@reflex.co", phone: "0712 000 222" },
  { id: "u3", name: "David", role: "RIDER", email: "david@reflex.co", phone: "0711 555 444" },
];

export const mockRiders = [
  { id: "r1", name: "David Mwangi", phone: "0711 555 444", available: true },
  { id: "r2", name: "Peter Otieno", phone: "0722 333 444", available: true },
  { id: "r3", name: "John Kiprono", phone: "0733 777 888", available: true },
];

export const mockDeliveries = [
  {
    id: "1042",
    customer: { name: "Jane Wanjiku", phone: "0712 345 678", address: "Kiambu Road, Nairobi" },
    item: "Wireless earbuds",
    status: "REQUESTED",
    updated: "10:32 AM",
    rider: null,
    timeline: [
      { status: "REQUESTED", time: "10:32 AM", label: "Delivery created" },
      { status: "ASSIGNED", time: null, label: "Rider assigned" },
      { status: "PICKED_UP", time: null, label: "Package collected" },
      { status: "DELIVERED", time: null, label: "Awaiting confirmation" },
    ],
  },
  {
    id: "1041",
    customer: { name: "Brian Otieno", phone: "0712 222 333", address: "Westlands, Nairobi" },
    item: "Keyboard",
    status: "ASSIGNED",
    updated: "10:45 AM",
    rider: { name: "David Mwangi", phone: "0711 555 444" },
    timeline: [
      { status: "REQUESTED", time: "10:32 AM", label: "Delivery created" },
      { status: "ASSIGNED", time: "10:45 AM", label: "Rider assigned" },
      { status: "PICKED_UP", time: null, label: "Package collected" },
      { status: "DELIVERED", time: null, label: "Awaiting confirmation" },
    ],
  },
  {
    id: "1040",
    customer: { name: "Mary Akinyi", phone: "0712 444 555", address: "Ngong Road, Nairobi" },
    item: "Headphones",
    status: "PICKED_UP",
    updated: "11:10 AM",
    rider: { name: "Peter Otieno", phone: "0722 333 444" },
    timeline: [
      { status: "REQUESTED", time: "09:50 AM", label: "Delivery created" },
      { status: "ASSIGNED", time: "10:02 AM", label: "Rider assigned" },
      { status: "PICKED_UP", time: "11:10 AM", label: "Package collected" },
      { status: "DELIVERED", time: null, label: "Awaiting confirmation" },
    ],
  },
  {
    id: "1039",
    customer: { name: "John Kamau", phone: "0712 666 777", address: "Roysambu, Nairobi" },
    item: "Mouse",
    status: "DELIVERED",
    updated: "12:05 PM",
    rider: { name: "John Kiprono", phone: "0733 777 888" },
    timeline: [
      { status: "REQUESTED", time: "09:00 AM", label: "Delivery created" },
      { status: "ASSIGNED", time: "09:15 AM", label: "Rider assigned" },
      { status: "PICKED_UP", time: "09:50 AM", label: "Package collected" },
      { status: "DELIVERED", time: "12:05 PM", label: "Delivered to customer" },
    ],
  },
  {
    id: "1043",
    customer: { name: "Peter Njenga", phone: "0712 888 999", address: "Lavington, Nairobi" },
    item: "Laptop charger",
    status: "REQUESTED",
    updated: "10:40 AM",
    rider: null,
    timeline: [
      { status: "REQUESTED", time: "10:40 AM", label: "Delivery created" },
      { status: "ASSIGNED", time: null, label: "Rider assigned" },
      { status: "PICKED_UP", time: null, label: "Package collected" },
      { status: "DELIVERED", time: null, label: "Awaiting confirmation" },
    ],
  },
  {
    id: "1044",
    customer: { name: "Sarah Wairimu", phone: "0712 111 222", address: "Roysambu, Nairobi" },
    item: "Phone case",
    status: "REQUESTED",
    updated: "10:50 AM",
    rider: null,
    timeline: [
      { status: "REQUESTED", time: "10:50 AM", label: "Delivery created" },
      { status: "ASSIGNED", time: null, label: "Rider assigned" },
      { status: "PICKED_UP", time: null, label: "Package collected" },
      { status: "DELIVERED", time: null, label: "Awaiting confirmation" },
    ],
  },
  {
    id: "1045",
    customer: { name: "Sarah Wairimu", phone: "0712 111 222", address: "TRM Drive, Nairobi" },
    item: "Bluetooth speaker",
    status: "ASSIGNED",
    updated: "09:20 AM",
    rider: { name: "David Mwangi", phone: "0711 555 444" },
    timeline: [
      { status: "REQUESTED", time: "09:00 AM", label: "Delivery created" },
      { status: "ASSIGNED", time: "09:20 AM", label: "Rider assigned" },
      { status: "PICKED_UP", time: null, label: "Package collected" },
      { status: "DELIVERED", time: null, label: "Awaiting confirmation" },
    ],
  },
];

export const mockCustomerNames = ["Jane Wanjiku", "Brian Otieno", "Mary Akinyi", "John Kamau", "Sarah Wairimu"];
export const mockItems = ["Wireless earbuds", "Keyboard", "Headphones", "Mouse", "Laptop charger", "Phone case"];
