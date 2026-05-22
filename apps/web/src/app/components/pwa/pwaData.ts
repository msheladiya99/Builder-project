// ── Types ──────────────────────────────────────────────────────────────────────

export type SyncStatus   = "synced" | "pending" | "failed" | "syncing";
export type AttStatus    = "P" | "A" | "H" | "L";
export type ExpCat       = "Fuel" | "Materials" | "Labour" | "Food" | "Transport" | "Misc";
export type SyncEntity   = "attendance" | "expense" | "diary" | "photo";
export type PWATab       = "attendance" | "expense" | "diary" | "flats" | "sync";
export type WeatherType  = "sunny" | "cloudy" | "rain" | "partly";

// ── Workers ───────────────────────────────────────────────────────────────────

export interface Worker {
  id: string;
  name: string;
  code: string;
  trade: string;
  contractor: string;
  att: AttStatus;
  color: string;
}

export const workers: Worker[] = [
  { id: "W01", name: "Ramesh Kumar",   code: "RK-01", trade: "Mason",       contractor: "Rameshwar & Co.", att: "P", color: "#1B3A6B" },
  { id: "W02", name: "Suresh Yadav",   code: "SY-02", trade: "Steel Fixer", contractor: "Rameshwar & Co.", att: "P", color: "#0D9488" },
  { id: "W03", name: "Mohan Das",      code: "MD-03", trade: "Electrician", contractor: "Joshi Electricals",att: "A", color: "#7C3AED" },
  { id: "W04", name: "Kiran Babu",     code: "KB-04", trade: "Plumber",     contractor: "Direct",           att: "P", color: "#C9922A" },
  { id: "W05", name: "Ashok Tiwari",   code: "AT-05", trade: "Carpenter",   contractor: "Rameshwar & Co.", att: "H", color: "#F97316" },
  { id: "W06", name: "Pradeep Singh",  code: "PS-06", trade: "Mason",       contractor: "Rameshwar & Co.", att: "P", color: "#EF4444" },
  { id: "W07", name: "Dinesh Patel",   code: "DP-07", trade: "Helper",      contractor: "Direct",           att: "P", color: "#16A34A" },
  { id: "W08", name: "Vijay Chauhan",  code: "VC-08", trade: "Steel Fixer", contractor: "Rameshwar & Co.", att: "L", color: "#64748B" },
  { id: "W09", name: "Rakesh Sharma",  code: "RS-09", trade: "Mason",       contractor: "Rameshwar & Co.", att: "P", color: "#1B3A6B" },
  { id: "W10", name: "Santosh Kumar",  code: "SK-10", trade: "Electrician", contractor: "Joshi Electricals",att: "P", color: "#C9922A" },
  { id: "W11", name: "Ganesh Rao",     code: "GR-11", trade: "Plumber",     contractor: "Direct",           att: "A", color: "#0D9488" },
  { id: "W12", name: "Mahesh Verma",   code: "MV-12", trade: "Helper",      contractor: "Rameshwar & Co.", att: "P", color: "#7C3AED" },
];

export const ATT_CONFIG: Record<AttStatus, { label: string; long: string; accent: string; light: string; text: string }> = {
  P: { label: "P",  long: "Present", accent: "#16A34A", light: "#DCFCE7", text: "#166534" },
  A: { label: "A",  long: "Absent",  accent: "#EF4444", light: "#FEE2E2", text: "#991B1B" },
  H: { label: "½",  long: "Half Day",accent: "#F59E0B", light: "#FEF3C7", text: "#92400E" },
  L: { label: "L",  long: "Leave",   accent: "#8B5CF6", light: "#EDE9FE", text: "#4C1D95" },
};

// ── Expenses ──────────────────────────────────────────────────────────────────

export interface Expense {
  id: string;
  cat: ExpCat;
  amount: number;
  desc: string;
  by: string;
  tower: string;
  date: string;
  status: SyncStatus;
  hasPhoto: boolean;
  photoColor?: string;
}

export const expenses: Expense[] = [
  { id: "E001", cat: "Fuel",      amount: 2400,  desc: "JCB diesel — morning shift",    by: "Rajiv Mehta",  tower: "TA", date: "19 May", status: "pending", hasPhoto: true,  photoColor: "#F97316" },
  { id: "E002", cat: "Materials", amount: 8600,  desc: "Sand & aggregate — 3 loads",    by: "Priya Sharma", tower: "TB", date: "19 May", status: "synced",  hasPhoto: false },
  { id: "E003", cat: "Food",      amount: 1200,  desc: "Canteen — 24 workers",          by: "Rajiv Mehta",  tower: "TA", date: "18 May", status: "synced",  hasPhoto: false },
  { id: "E004", cat: "Transport", amount: 3200,  desc: "Material delivery — Bhuj road", by: "Kiran Patil",  tower: "TC", date: "18 May", status: "failed",  hasPhoto: true,  photoColor: "#7C3AED" },
  { id: "E005", cat: "Labour",    amount: 12000, desc: "Overtime — slab pour crew",     by: "Rajiv Mehta",  tower: "TA", date: "19 May", status: "pending", hasPhoto: false },
];

export const EXP_CATS: { id: ExpCat; icon: string; color: string; bg: string }[] = [
  { id: "Fuel",      icon: "⛽", color: "#EA580C", bg: "#FFF7ED" },
  { id: "Materials", icon: "🧱", color: "#B45309", bg: "#FFFBEB" },
  { id: "Labour",    icon: "👷", color: "#1D4ED8", bg: "#EFF6FF" },
  { id: "Food",      icon: "🍱", color: "#15803D", bg: "#F0FDF4" },
  { id: "Transport", icon: "🚛", color: "#7C3AED", bg: "#F5F3FF" },
  { id: "Misc",      icon: "📦", color: "#475569", bg: "#F8FAFC" },
];

// ── Sync queue ────────────────────────────────────────────────────────────────

export interface SyncItem {
  id: string;
  entity: SyncEntity;
  title: string;
  sub: string;
  size: string;
  time: string;
  status: SyncStatus;
  retries?: number;
  pct?: number;
}

export const initialQueue: SyncItem[] = [
  { id: "SQ1", entity: "attendance", title: "Attendance — 19 May",   sub: "47 workers · Tower A",         size: "4.2 KB", time: "10:32",  status: "pending"             },
  { id: "SQ2", entity: "photo",      title: "Photos × 3",            sub: "Floor 10 slab pour",           size: "8.4 MB", time: "10:18",  status: "pending"             },
  { id: "SQ3", entity: "expense",    title: "Expense — ₹2,400",      sub: "Fuel · JCB diesel",            size: "1.1 KB", time: "09:45",  status: "failed",  retries: 2 },
  { id: "SQ4", entity: "diary",      title: "Site Diary — 19 May",   sub: "Tower A · Rajiv Mehta",        size: "3.8 KB", time: "09:30",  status: "pending"             },
  { id: "SQ5", entity: "photo",      title: "Receipt Photo",         sub: "Fuel receipt — Tower B",       size: "1.2 MB", time: "09:12",  status: "syncing", pct: 60    },
  { id: "SQ6", entity: "expense",    title: "Expense — ₹8,600",      sub: "Materials · Sand & aggregate", size: "1.0 KB", time: "08:55",  status: "synced"              },
  { id: "SQ7", entity: "attendance", title: "Attendance — 18 May",   sub: "52 workers · Tower B",         size: "4.8 KB", time: "Yesterday", status: "synced"           },
];

// ── Flats ─────────────────────────────────────────────────────────────────────

export type FlatStatus = "Available" | "Booked" | "Construction" | "Ready" | "Handed Over";

export interface Flat {
  id: string;
  no: string;
  tower: string;
  floor: number;
  type: string;
  area: number;
  owner: string;
  phone: string;
  value: number;
  paid: number;
  status: FlatStatus;
  color: string;
}

export const flats: Flat[] = [
  { id: "F01", no: "A-1201", tower: "A", floor: 12, type: "3 BHK",    area: 1480, owner: "Ramesh Agarwal",  phone: "98765 00001", value: 9200000,  paid: 6440000, status: "Construction", color: "#1B3A6B" },
  { id: "F02", no: "A-1101", tower: "A", floor: 11, type: "2 BHK",    area: 1080, owner: "Priya Mehta",     phone: "98765 00002", value: 6700000,  paid: 6700000, status: "Construction", color: "#1B3A6B" },
  { id: "F03", no: "A-804",  tower: "A", floor: 8,  type: "3.5 BHK",  area: 1680, owner: "Suresh Khanna",   phone: "98765 00003", value: 10400000, paid: 7280000, status: "Construction", color: "#1B3A6B" },
  { id: "F04", no: "B-302",  tower: "B", floor: 3,  type: "2 BHK",    area: 1080, owner: "Anita Iyer",      phone: "98765 00004", value: 6500000,  paid: 4550000, status: "Booked",       color: "#C9922A" },
  { id: "F05", no: "B-605",  tower: "B", floor: 6,  type: "3 BHK",    area: 1480, owner: "Vikram Mehta",    phone: "98765 00005", value: 9000000,  paid: 5400000, status: "Booked",       color: "#C9922A" },
  { id: "F06", no: "C-201",  tower: "C", floor: 2,  type: "2 BHK",    area: 1020, owner: "Lalita Sharma",   phone: "98765 00006", value: 5800000,  paid: 2900000, status: "Booked",       color: "#7C3AED" },
  { id: "F07", no: "A-501",  tower: "A", floor: 5,  type: "4 BHK",    area: 2100, owner: "—",               phone: "—",           value: 13000000, paid: 0,       status: "Available",    color: "#16A34A" },
];

export const FLAT_STATUS: Record<FlatStatus, { color: string; bg: string; dot: string }> = {
  "Available":    { color: "#15803D", bg: "#F0FDF4", dot: "#16A34A" },
  "Booked":       { color: "#1D4ED8", bg: "#EFF6FF", dot: "#3B82F6" },
  "Construction": { color: "#B45309", bg: "#FFFBEB", dot: "#F59E0B" },
  "Ready":        { color: "#0D9488", bg: "#F0FDFA", dot: "#14B8A6" },
  "Handed Over":  { color: "#475569", bg: "#F8FAFC", dot: "#94A3B8" },
};

// ── Diary photos ──────────────────────────────────────────────────────────────

export interface SitePhoto {
  id: string;
  color: string;
  label: string;
  size: string;
  synced: boolean;
}

export const diaryPhotos: SitePhoto[] = [
  { id: "DP1", color: "#1B3A6B", label: "Column formwork",  size: "2.4 MB", synced: true  },
  { id: "DP2", color: "#C9922A", label: "Rebar inspection", size: "3.1 MB", synced: false },
  { id: "DP3", color: "#7C3AED", label: "Concrete pour",    size: "4.2 MB", synced: false },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

export function fmtINR(n: number) {
  if (n >= 10_000_000) return `₹${(n / 10_000_000).toFixed(2)} Cr`;
  if (n >= 100_000)    return `₹${(n / 100_000).toFixed(1)} L`;
  return `₹${n.toLocaleString("en-IN")}`;
}

export function initials(name: string) {
  return name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
}

export const ENTITY_EMOJI: Record<SyncEntity, string> = {
  attendance: "📋", expense: "💰", diary: "📖", photo: "📷",
};
