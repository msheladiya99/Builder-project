// ── Types ────────────────────────────────────────────────────────────────────

export interface Tenant {
  id: string;
  name: string;
  shortName: string;
  plan: "starter" | "growth" | "enterprise";
  logo: string;
  city: string;
  gstin: string;
  projects: number;
}

export interface NavUser {
  name: string;
  initials: string;
  role: string;
  email: string;
  avatar?: string;
}

export interface KPICard {
  id: string;
  label: string;
  value: string;
  sub: string;
  delta: number;
  deltaLabel: string;
  icon: string;
  color: string;
  bg: string;
  sparkline: number[];
}

export interface RevenuePoint {
  month: string;
  collections: number;
  target: number;
  expenses: number;
}

export interface ProjectHealth {
  name: string;
  status: "active" | "delayed" | "completed" | "planning";
  pct: number;
  unitsTotal: number;
  unitsSold: number;
  budget: number;
  spent: number;
}

export interface RecentTransaction {
  id: string;
  owner: string;
  flat: string;
  amount: number;
  type: "collection" | "refund" | "penalty";
  mode: string;
  date: string;
  status: "success" | "pending" | "failed";
}

export interface AlertItem {
  id: string;
  type: "overdue" | "stock" | "rera" | "diary" | "labour";
  title: string;
  sub: string;
  severity: "critical" | "high" | "medium";
  action: string;
}

export interface ActivityEvent {
  id: string;
  actor: string;
  initials: string;
  action: string;
  target: string;
  time: string;
  icon: string;
  color: string;
}

// ── GST Types ────────────────────────────────────────────────────────────────

export interface GSTInvoice {
  id: string;
  invoiceNo: string;
  date: string;
  buyer: string;
  gstin: string;
  flatNo: string;
  taxableAmount: number;
  cgst: number;
  sgst: number;
  igst: number;
  total: number;
  type: "B2B" | "B2C";
  status: "filed" | "pending" | "amended";
  irnNo?: string;
}

export interface GSTReturn {
  period: string;
  type: "GSTR-1" | "GSTR-3B";
  dueDate: string;
  filedDate?: string;
  status: "filed" | "pending" | "late";
  taxLiability: number;
  itcClaimed: number;
  netPayable: number;
}

export interface ITCEntry {
  id: string;
  vendor: string;
  gstin: string;
  invoiceNo: string;
  date: string;
  taxableValue: number;
  igst: number;
  cgst: number;
  sgst: number;
  eligibility: "eligible" | "ineligible" | "blocked";
  category: string;
}

// ── Labour Types ─────────────────────────────────────────────────────────────

export interface Worker {
  id: string;
  name: string;
  trade: string;
  contractor: string;
  dailyWage: number;
  phone: string;
  aadhaar: string;
  joinDate: string;
  status: "active" | "inactive" | "absent";
  skills: string[];
  tower: string;
}

export interface AttendanceRecord {
  workerId: string;
  workerName: string;
  trade: string;
  date: string;
  status: "present" | "absent" | "half-day" | "holiday";
  inTime?: string;
  outTime?: string;
  overtime?: number;
}

export interface Contractor {
  id: string;
  name: string;
  trade: string;
  workers: number;
  ratePerDay: number;
  advance: number;
  totalPayable: number;
  paid: number;
  status: "active" | "closed";
}

// ── Mock Data ─────────────────────────────────────────────────────────────────

export const currentTenant: Tenant = {
  id: "shg-001",
  name: "Shri Hari Group",
  shortName: "SHG",
  plan: "enterprise",
  logo: "🏗️",
  city: "Pune",
  gstin: "27AABCS1234A1Z5",
  projects: 3,
};

export const currentUser: NavUser = {
  name: "Rajesh Sharma",
  initials: "RS",
  role: "Super Admin",
  email: "rajesh@shrihari.com",
};

export const tenants: Tenant[] = [
  { id: "shg-001", name: "Shri Hari Group",     shortName: "SHG", plan: "enterprise", logo: "🏗️", city: "Pune",   gstin: "27AABCS1234A1Z5", projects: 3 },
  { id: "hariheights", name: "Hari Heights", shortName: "HH", plan: "enterprise", logo: "🏢", city: "Bengaluru", gstin: "29AABCH1234A1Z5", projects: 1 },
  { id: "kmb-002", name: "Kamble Builders",      shortName: "KB",  plan: "growth",     logo: "🏢", city: "Nashik", gstin: "27AABCK5678A1Z2", projects: 2 },
  { id: "prb-003", name: "Prestige Realty",      shortName: "PR",  plan: "starter",    logo: "🌆", city: "Mumbai", gstin: "27AABCP9012A1Z8", projects: 1 },
];

export const kpiCards: KPICard[] = [
  {
    id: "revenue",
    label: "Total Collections",
    value: "₹18.4 Cr",
    sub: "FY 2025–26",
    delta: 12.4,
    deltaLabel: "vs last FY",
    icon: "💰",
    color: "#22C55E",
    bg: "#F0FDF4",
    sparkline: [8.2, 9.1, 10.4, 12.1, 14.8, 16.2, 18.4],
  },
  {
    id: "projects",
    label: "Active Projects",
    value: "3",
    sub: "1 completing Q4",
    delta: 0,
    deltaLabel: "unchanged",
    icon: "🏗️",
    color: "#1B3A6B",
    bg: "#EFF6FF",
    sparkline: [2, 2, 3, 3, 3, 3, 3],
  },
  {
    id: "units",
    label: "Units Sold",
    value: "147 / 240",
    sub: "61% inventory sold",
    delta: 8.2,
    deltaLabel: "vs last quarter",
    icon: "🏠",
    color: "#C9922A",
    bg: "#FEF3C7",
    sparkline: [95, 108, 119, 128, 136, 142, 147],
  },
  {
    id: "overdue",
    label: "Overdue Payments",
    value: "₹2.1 Cr",
    sub: "8 customers",
    delta: -3.1,
    deltaLabel: "improved",
    icon: "⚠️",
    color: "#EF4444",
    bg: "#FEF2F2",
    sparkline: [3.2, 3.0, 2.8, 2.6, 2.4, 2.2, 2.1],
  },
];

export const revenueData: RevenuePoint[] = [
  { month: "Nov", collections: 2.1, target: 2.5, expenses: 1.4 },
  { month: "Dec", collections: 2.8, target: 2.5, expenses: 1.6 },
  { month: "Jan", collections: 2.4, target: 3.0, expenses: 1.5 },
  { month: "Feb", collections: 3.2, target: 3.0, expenses: 1.8 },
  { month: "Mar", collections: 4.1, target: 3.5, expenses: 2.1 },
  { month: "Apr", collections: 3.8, target: 3.5, expenses: 1.9 },
];

export const projectHealth: ProjectHealth[] = [
  { name: "Tower Heights A",  status: "active",    pct: 68, unitsTotal: 120, unitsSold: 89,  budget: 4500, spent: 3100 },
  { name: "Tower Heights B",  status: "delayed",   pct: 42, unitsTotal: 80,  unitsSold: 41,  budget: 3200, spent: 1890 },
  { name: "Silver Meadows",   status: "planning",  pct: 8,  unitsTotal: 40,  unitsSold: 17,  budget: 1800, spent: 140  },
];

export const recentTransactions: RecentTransaction[] = [
  { id: "T001", owner: "Priya Sharma",  flat: "7C / Tower A", amount: 875000,  type: "collection", mode: "NEFT",  date: "Today, 10:14 AM", status: "success" },
  { id: "T002", owner: "Ankit Joshi",   flat: "2A / Tower C", amount: 1250000, type: "collection", mode: "IMPS",  date: "Today, 9:02 AM",  status: "pending" },
  { id: "T003", owner: "Neha Gupta",    flat: "9D / Tower B", amount: 50000,   type: "penalty",    mode: "UPI",   date: "Yesterday",       status: "success" },
  { id: "T004", owner: "Suresh Patil",  flat: "3F / Tower A", amount: 1250000, type: "collection", mode: "Cheque",date: "19 May",          status: "failed"  },
  { id: "T005", owner: "Kavita More",   flat: "5B / Tower B", amount: 875000,  type: "collection", mode: "NEFT",  date: "18 May",          status: "success" },
];

export const alerts: AlertItem[] = [
  { id: "AL1", type: "overdue",  title: "Payment overdue 15d",   sub: "Rajesh Mehta · Flat 4B · ₹12.5L", severity: "critical", action: "Send reminder" },
  { id: "AL2", type: "rera",     title: "RERA expiry in 8 days", sub: "MH/07/2022/1456 · Tower B",       severity: "critical", action: "Renew now"     },
  { id: "AL3", type: "stock",    title: "TMT Bars critically low",sub: "2.4 MT remaining · Min 5 MT",     severity: "high",     action: "Raise PO"      },
  { id: "AL4", type: "stock",    title: "Cement OPC low",        sub: "48 bags · Min 200 bags",          severity: "high",     action: "Raise PO"      },
  { id: "AL5", type: "diary",    title: "Site diary missing",    sub: "Tower B · 18 May · Kiran Patil",  severity: "medium",   action: "Request entry" },
  { id: "AL6", type: "labour",   title: "Attendance not marked", sub: "42 workers · Tower A · today",    severity: "medium",   action: "Mark now"      },
];

export const activityFeed: ActivityEvent[] = [
  { id: "EV1", actor: "Priya Nair",    initials: "PN", action: "collected payment of",    target: "₹8.75L from Flat 7C",      time: "10 min ago",  icon: "💰", color: "#22C55E" },
  { id: "EV2", actor: "Kiran Patil",   initials: "KP", action: "submitted site diary for", target: "Tower A · 19 May",         time: "32 min ago",  icon: "📓", color: "#1B3A6B" },
  { id: "EV3", actor: "Suresh Kumar",  initials: "SK", action: "raised PO for",            target: "TMT Bars · 10 MT",         time: "1h ago",      icon: "📦", color: "#C9922A" },
  { id: "EV4", actor: "Rajesh Sharma", initials: "RS", action: "approved KYC for",         target: "Neha Gupta · Flat 9D",     time: "2h ago",      icon: "✅", color: "#7C3AED" },
  { id: "EV5", actor: "Meena Joshi",   initials: "MJ", action: "uploaded document",        target: "Agreement · Flat 2A",      time: "3h ago",      icon: "📄", color: "#0D9488" },
  { id: "EV6", actor: "System",        initials: "SY", action: "sent payment reminder to",  target: "8 overdue accounts",      time: "4h ago",      icon: "🔔", color: "#F59E0B" },
];

// ── GST Data ──────────────────────────────────────────────────────────────────

export const gstInvoices: GSTInvoice[] = [
  { id: "GI01", invoiceNo: "SHG/2026/INV/001", date: "01 Apr 2026", buyer: "Rajesh Mehta",  gstin: "27ABCPM1234P1ZX", flatNo: "4B/Tower A", taxableAmount: 1190476, cgst: 29762, sgst: 29762, igst: 0, total: 1250000, type: "B2B", status: "filed",   irnNo: "IRN2026001234" },
  { id: "GI02", invoiceNo: "SHG/2026/INV/002", date: "15 Apr 2026", buyer: "Priya Sharma",  gstin: "",                flatNo: "7C/Tower A", taxableAmount: 833333,  cgst: 20833, sgst: 20833, igst: 0, total: 875000,  type: "B2C", status: "filed",   irnNo: "IRN2026001235" },
  { id: "GI03", invoiceNo: "SHG/2026/INV/003", date: "02 May 2026", buyer: "Ankit Joshi",   gstin: "27ABCPJ5678J1ZY", flatNo: "2A/Tower C", taxableAmount: 1190476, cgst: 29762, sgst: 29762, igst: 0, total: 1250000, type: "B2B", status: "pending", irnNo: undefined       },
  { id: "GI04", invoiceNo: "SHG/2026/INV/004", date: "10 May 2026", buyer: "Neha Gupta",    gstin: "",                flatNo: "9D/Tower B", taxableAmount: 833333,  cgst: 20833, sgst: 20833, igst: 0, total: 875000,  type: "B2C", status: "pending", irnNo: undefined       },
  { id: "GI05", invoiceNo: "SHG/2026/INV/005", date: "18 May 2026", buyer: "Suresh Patil",  gstin: "27ABCPP9012P1ZZ", flatNo: "3F/Tower A", taxableAmount: 1190476, cgst: 29762, sgst: 29762, igst: 0, total: 1250000, type: "B2B", status: "filed",   irnNo: "IRN2026001236" },
];

export const gstReturns: GSTReturn[] = [
  { period: "Apr 2026", type: "GSTR-1",  dueDate: "11 May 2026", filedDate: "09 May 2026", status: "filed",   taxLiability: 150157, itcClaimed: 0,       netPayable: 150157 },
  { period: "Apr 2026", type: "GSTR-3B", dueDate: "20 May 2026", filedDate: undefined,     status: "pending", taxLiability: 150157, itcClaimed: 38400,   netPayable: 111757 },
  { period: "Mar 2026", type: "GSTR-1",  dueDate: "11 Apr 2026", filedDate: "10 Apr 2026", status: "filed",   taxLiability: 195244, itcClaimed: 0,       netPayable: 195244 },
  { period: "Mar 2026", type: "GSTR-3B", dueDate: "20 Apr 2026", filedDate: "19 Apr 2026", status: "filed",   taxLiability: 195244, itcClaimed: 52100,   netPayable: 143144 },
  { period: "Feb 2026", type: "GSTR-1",  dueDate: "11 Mar 2026", filedDate: "11 Mar 2026", status: "filed",   taxLiability: 119047, itcClaimed: 0,       netPayable: 119047 },
  { period: "Feb 2026", type: "GSTR-3B", dueDate: "20 Mar 2026", filedDate: "18 Mar 2026", status: "filed",   taxLiability: 119047, itcClaimed: 31200,   netPayable: 87847  },
];

export const itcEntries: ITCEntry[] = [
  { id: "ITC01", vendor: "Ambuja Cements",    gstin: "27AAACA1234A1ZB", invoiceNo: "AC/2026/1234", date: "05 Apr 2026", taxableValue: 180000, igst: 0,     cgst: 16200, sgst: 16200, eligibility: "eligible",   category: "Construction Material" },
  { id: "ITC02", vendor: "TATA Steel",        gstin: "27AAACT5678T1ZC", invoiceNo: "TS/2026/5678", date: "08 Apr 2026", taxableValue: 350000, igst: 63000, cgst: 0,     sgst: 0,     eligibility: "eligible",   category: "Construction Material" },
  { id: "ITC03", vendor: "M/s Sharma & Co.",  gstin: "27ABCMS9012S1ZD", invoiceNo: "SC/2026/0091", date: "12 Apr 2026", taxableValue: 120000, igst: 0,     cgst: 10800, sgst: 10800, eligibility: "ineligible", category: "Employee Welfare"      },
  { id: "ITC04", vendor: "Kirloskar Pumps",   gstin: "27AABCK3456K1ZE", invoiceNo: "KP/2026/0234", date: "15 Apr 2026", taxableValue: 85000,  igst: 0,     cgst: 7650,  sgst: 7650,  eligibility: "eligible",   category: "Plant & Machinery"     },
  { id: "ITC05", vendor: "Pidilite Industries",gstin: "27AAABP7890P1ZF", invoiceNo: "PI/2026/0567", date: "18 Apr 2026", taxableValue: 42000,  igst: 0,     cgst: 2520,  sgst: 2520,  eligibility: "eligible",   category: "Construction Material" },
];

// ── Labour Data ────────────────────────────────────────────────────────────────

export const workers: Worker[] = [
  { id: "W001", name: "Ramesh Yadav",   trade: "Mason",      contractor: "Sharma Contractor", dailyWage: 750, phone: "+91 94512 34567", aadhaar: "XXXX-XXXX-1234", joinDate: "10 Jan 2026", status: "active",   skills: ["Brickwork", "Plastering"],       tower: "Tower A" },
  { id: "W002", name: "Suresh Gupta",   trade: "Carpenter",  contractor: "Gupta Works",       dailyWage: 850, phone: "+91 94523 45678", aadhaar: "XXXX-XXXX-2345", joinDate: "15 Jan 2026", status: "active",   skills: ["Shuttering", "Formwork"],        tower: "Tower A" },
  { id: "W003", name: "Mohan Lal",      trade: "Helper",     contractor: "Sharma Contractor", dailyWage: 550, phone: "+91 94534 56789", aadhaar: "XXXX-XXXX-3456", joinDate: "20 Jan 2026", status: "present",  skills: ["Material Handling"],             tower: "Tower B" },
  { id: "W004", name: "Raju Mishra",    trade: "Electrician",contractor: "EM Electric",       dailyWage: 900, phone: "+91 94545 67890", aadhaar: "XXXX-XXXX-4567", joinDate: "05 Feb 2026", status: "active",   skills: ["Wiring", "Panel Work"],          tower: "Tower A" },
  { id: "W005", name: "Keshav Singh",   trade: "Plumber",    contractor: "Plumbing Pro",      dailyWage: 850, phone: "+91 94556 78901", aadhaar: "XXXX-XXXX-5678", joinDate: "08 Feb 2026", status: "inactive", skills: ["Pipe Fitting", "Sanitation"],    tower: "Tower B" },
  { id: "W006", name: "Dinesh Thakur",  trade: "Mason",      contractor: "Sharma Contractor", dailyWage: 750, phone: "+91 94567 89012", aadhaar: "XXXX-XXXX-6789", joinDate: "10 Feb 2026", status: "active",   skills: ["Tiling", "Pointing"],            tower: "Tower A" },
  { id: "W007", name: "Arun Verma",     trade: "Welder",     contractor: "Steel Works",       dailyWage: 950, phone: "+91 94578 90123", aadhaar: "XXXX-XXXX-7890", joinDate: "14 Feb 2026", status: "active",   skills: ["MIG Welding", "Arc Welding"],   tower: "Tower A" },
  { id: "W008", name: "Prakash Jain",   trade: "Painter",    contractor: "Color Coat",        dailyWage: 700, phone: "+91 94589 01234", aadhaar: "XXXX-XXXX-8901", joinDate: "01 Mar 2026", status: "absent",   skills: ["Wall Painting", "Texture"],     tower: "Tower B" },
];

export const contractors: Contractor[] = [
  { id: "C001", name: "Sharma Contractor", trade: "Civil",      workers: 18, ratePerDay: 13500, advance: 250000, totalPayable: 810000, paid: 560000, status: "active" },
  { id: "C002", name: "Gupta Works",       trade: "Carpentry",  workers: 8,  ratePerDay: 6800,  advance: 100000, totalPayable: 408000, paid: 308000, status: "active" },
  { id: "C003", name: "EM Electric",       trade: "Electrical", workers: 5,  ratePerDay: 4500,  advance: 80000,  totalPayable: 270000, paid: 190000, status: "active" },
  { id: "C004", name: "Plumbing Pro",      trade: "Plumbing",   workers: 4,  ratePerDay: 3400,  advance: 60000,  totalPayable: 204000, paid: 144000, status: "active" },
  { id: "C005", name: "Steel Works",       trade: "Structural", workers: 6,  ratePerDay: 5700,  advance: 120000, totalPayable: 342000, paid: 222000, status: "active" },
];

export const todayAttendance: AttendanceRecord[] = workers.map(w => ({
  workerId: w.id,
  workerName: w.name,
  trade: w.trade,
  date: "19 May 2026",
  status: w.status === "absent" ? "absent" : w.status === "inactive" ? "absent" : "present" as "present" | "absent",
  inTime:  w.status !== "absent" && w.status !== "inactive" ? "08:15 AM" : undefined,
  outTime: w.status !== "absent" && w.status !== "inactive" ? "06:00 PM" : undefined,
  overtime: w.status === "active" ? 0 : undefined,
}));

export function fmtINR(n: number): string {
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(2)} Cr`;
  if (n >= 100000)   return `₹${(n / 100000).toFixed(2)} L`;
  return `₹${n.toLocaleString("en-IN")}`;
}

export const MODULE_GROUPS = [
  {
    label: "Overview",
    items: [
      { id: "dashboard",  label: "Dashboard",         icon: "LayoutDashboard", badge: null       },
    ],
  },
  {
    label: "Operations",
    items: [
      { id: "projects",   label: "Projects",           icon: "FolderKanban",   badge: null       },
      { id: "flats",      label: "Flat Management",    icon: "Building2",      badge: null       },
      { id: "crm",        label: "Owner CRM",          icon: "Users",          badge: "12 KYC"  },
      { id: "labour",     label: "Labour",             icon: "HardHat",        badge: "41 Active"},
      { id: "construction", label: "Site Progress",    icon: "Construction",   badge: null       },
    ],
  },
  {
    label: "Finance",
    items: [
      { id: "accounting", label: "Accounting",         icon: "Calculator",     badge: null       },
      { id: "gst",        label: "GST & Compliance",   icon: "FileText",       badge: "1 Due"   },
    ],
  },
  {
    label: "Supply Chain",
    items: [
      { id: "inventory",  label: "Materials",          icon: "Package",        badge: "2 Low"   },
    ],
  },
  {
    label: "Intelligence",
    items: [
      { id: "reports",    label: "Reports & Analytics",icon: "BarChart3",      badge: null       },
    ],
  },
  {
    label: "Engagement",
    items: [
      { id: "notifications", label: "Notifications",  icon: "Bell",           badge: "4 New"   },
      { id: "owner-portal",  label: "Owner Portal",   icon: "Smartphone",     badge: null       },
    ],
  },
  {
    label: "Field",
    items: [
      { id: "pwa",        label: "Mobile Field App",   icon: "TabletSmartphone", badge: null    },
    ],
  },
  {
    label: "Administration",
    items: [
      { id: "settings",   label: "Company Settings",   icon: "Settings",         badge: null    },
    ],
  },
];
