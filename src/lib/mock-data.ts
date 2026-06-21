export type RoomCategory = "huddle" | "medium" | "boardroom";
export type RoomStatus = "available" | "occupied" | "reserved" | "maintenance";

export interface Room {
  id: string;
  name: string;
  category: RoomCategory;
  capacity: number;
  floor: string;
  equipment: string[];
  status: RoomStatus;
  restricted?: boolean;
  image?: string;
}

export const rooms: Room[] = [
  { id: "r1", name: "Aurora", category: "huddle", capacity: 4, floor: "Floor 3 · North", equipment: ["Display", "Whiteboard"], status: "available" },
  { id: "r2", name: "Nimbus", category: "huddle", capacity: 4, floor: "Floor 3 · North", equipment: ["Display"], status: "occupied" },
  { id: "r3", name: "Cobalt", category: "huddle", capacity: 6, floor: "Floor 4 · West", equipment: ["Display", "Teams Room"], status: "reserved" },
  { id: "r4", name: "Vertex", category: "huddle", capacity: 6, floor: "Floor 4 · West", equipment: ["Display"], status: "available" },
  { id: "r5", name: "Horizon", category: "medium", capacity: 10, floor: "Floor 5 · East", equipment: ["4K Display", "Teams Room", "Whiteboard"], status: "available" },
  { id: "r6", name: "Meridian", category: "medium", capacity: 12, floor: "Floor 5 · East", equipment: ["Dual Display", "Teams Room"], status: "occupied" },
  { id: "r7", name: "Atlas", category: "medium", capacity: 14, floor: "Floor 6 · Central", equipment: ["4K Display", "Surface Hub"], status: "maintenance" },
  { id: "r8", name: "Summit Boardroom", category: "boardroom", capacity: 24, floor: "Floor 12 · Executive", equipment: ["Dual 4K", "Surface Hub", "Catering"], status: "reserved", restricted: true },
  { id: "r9", name: "Pinnacle Boardroom", category: "boardroom", capacity: 18, floor: "Floor 12 · Executive", equipment: ["4K Display", "Catering"], status: "available", restricted: true },
];

export type BookingStatus = "confirmed" | "checked-in" | "pending" | "cancelled" | "auto-released";

export interface Booking {
  id: string;
  title: string;
  roomId: string;
  organizer: string;
  attendees: number;
  startHour: number; // 0-23
  duration: number; // hours
  day: number; // 0=mon
  status: BookingStatus;
  catering?: boolean;
}

export const bookings: Booking[] = [
  { id: "b1", title: "Product Sync", roomId: "r1", organizer: "Alex Tan", attendees: 4, startHour: 9, duration: 1, day: 0, status: "checked-in" },
  { id: "b2", title: "Design Review", roomId: "r5", organizer: "Priya N.", attendees: 8, startHour: 10, duration: 1.5, day: 0, status: "confirmed" },
  { id: "b3", title: "Quarterly Strategy", roomId: "r8", organizer: "CEO Office", attendees: 18, startHour: 13, duration: 2, day: 0, status: "confirmed", catering: true },
  { id: "b4", title: "Client Pitch", roomId: "r6", organizer: "Marcus W.", attendees: 10, startHour: 14, duration: 1, day: 0, status: "pending" },
  { id: "b5", title: "1:1 Coaching", roomId: "r2", organizer: "Sarah K.", attendees: 2, startHour: 11, duration: 0.5, day: 0, status: "confirmed" },
  { id: "b6", title: "Engineering Standup", roomId: "r3", organizer: "Dev Lead", attendees: 6, startHour: 9, duration: 0.5, day: 1, status: "confirmed" },
  { id: "b7", title: "Board Meeting", roomId: "r9", organizer: "Board Secretary", attendees: 14, startHour: 10, duration: 3, day: 1, status: "confirmed", catering: true },
  { id: "b8", title: "Marketing Brainstorm", roomId: "r5", organizer: "Lina P.", attendees: 7, startHour: 14, duration: 2, day: 1, status: "pending" },
  { id: "b9", title: "All Hands", roomId: "r6", organizer: "People Ops", attendees: 12, startHour: 11, duration: 1, day: 2, status: "auto-released" },
  { id: "b10", title: "Vendor Demo", roomId: "r1", organizer: "Procurement", attendees: 4, startHour: 15, duration: 1, day: 2, status: "cancelled" },
  { id: "b11", title: "Sprint Planning", roomId: "r3", organizer: "Scrum Master", attendees: 6, startHour: 13, duration: 1.5, day: 3, status: "confirmed" },
  { id: "b12", title: "Executive Lunch", roomId: "r8", organizer: "CEO Office", attendees: 12, startHour: 12, duration: 1.5, day: 4, status: "confirmed", catering: true },
];

export const approvals = [
  { id: "a1", requestor: "Marcus Whitfield", role: "Senior PM", room: "Summit Boardroom", time: "Thu, Jun 25 · 2:00 – 4:00 PM", reason: "Client executive pitch for Acme Corp acquisition.", priority: "high" },
  { id: "a2", requestor: "Lina Park", role: "Marketing Lead", room: "Pinnacle Boardroom", time: "Mon, Jun 29 · 10:00 AM – 12:00 PM", reason: "Brand relaunch kickoff with agency partners.", priority: "medium" },
  { id: "a3", requestor: "David Chen", role: "Finance Director", room: "Summit Boardroom", time: "Wed, Jul 1 · 9:00 – 11:00 AM", reason: "Quarterly investor preparation review.", priority: "high" },
];

export const cateringRequests = [
  { id: "c1", meeting: "Quarterly Strategy", room: "Summit Boardroom", time: "Today · 1:00 PM", items: "Coffee service, sandwich platter (18)", status: "preparing" as const },
  { id: "c2", meeting: "Board Meeting", room: "Pinnacle Boardroom", time: "Tomorrow · 10:00 AM", items: "Full breakfast, espresso bar (14)", status: "pending" as const },
  { id: "c3", meeting: "Executive Lunch", room: "Summit Boardroom", time: "Fri · 12:00 PM", items: "Plated lunch service (12)", status: "pending" as const },
  { id: "c4", meeting: "Client Pitch", room: "Meridian", time: "Today · 2:00 PM", items: "Espresso, pastries (10)", status: "delivered" as const },
];

export const notifications = [
  { id: "n1", type: "success" as const, title: "Booking confirmed", body: "Design Review in Horizon at 10:00 AM.", time: "2m ago" },
  { id: "n2", type: "warning" as const, title: "Check-in reminder", body: "Product Sync starts in 10 minutes.", time: "8m ago" },
  { id: "n3", type: "info" as const, title: "Approval required", body: "Marcus W. requested Summit Boardroom.", time: "1h ago" },
  { id: "n4", type: "destructive" as const, title: "Auto-release warning", body: "All Hands in Meridian will release in 3m.", time: "1h ago" },
  { id: "n5", type: "success" as const, title: "Catering confirmed", body: "Espresso bar scheduled for Board Meeting.", time: "3h ago" },
];

export const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri"];
