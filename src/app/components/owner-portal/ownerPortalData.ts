export interface Owner {
  name: string;
  phone: string;
  email: string;
  avatar: string;
}

export interface FlatInfo {
  flatNo: string;
  tower: string;
  floor: number;
  type: string;
  area: number;
  facing: string;
  parkingNo: string;
  projectName: string;
  address: string;
  possessionDate: string;
  registrationDate: string;
  reraNo: string;
  totalCost: number;
  paidAmount: number;
  status: "under-construction" | "ready" | "registered";
}

export interface EMIEntry {
  id: string;
  installmentNo: number;
  dueDate: string;
  amount: number;
  paidDate?: string;
  status: "paid" | "upcoming" | "overdue" | "pending";
  receiptNo?: string;
  label: string;
}

export interface Receipt {
  id: string;
  receiptNo: string;
  date: string;
  amount: number;
  mode: "NEFT" | "IMPS" | "Cheque" | "Cash" | "UPI";
  refNo: string;
  installment: string;
  status: "issued" | "pending";
}

export interface OwnerDocument {
  id: string;
  name: string;
  type: "agreement" | "noc" | "plan" | "rera" | "tax" | "other";
  icon: string;
  date: string;
  size: string;
  available: boolean;
  pages?: number;
}

export interface ProgressMilestone {
  id: string;
  label: string;
  description: string;
  date: string;
  status: "done" | "active" | "upcoming";
  pct: number;
  photo?: string;
  photoColor?: string;
}

export interface Complaint {
  id: string;
  ticketNo: string;
  category: string;
  subject: string;
  description: string;
  raisedDate: string;
  updatedDate: string;
  status: "open" | "in-progress" | "resolved" | "closed";
  priority: "low" | "medium" | "high";
  response?: string;
}

// ── Mock data ─────────────────────────────────────────────────────────────────

export const owner: Owner = {
  name: "Rajesh Mehta",
  phone: "+91 98765 43210",
  email: "rajesh.mehta@gmail.com",
  avatar: "RM",
};

export const flat: FlatInfo = {
  flatNo: "4B",
  tower: "Tower A",
  floor: 4,
  type: "3 BHK Premium",
  area: 1450,
  facing: "East (Garden View)",
  parkingNo: "B-42",
  projectName: "SHG Tower Heights",
  address: "Survey No. 45, Baner, Pune – 411045",
  possessionDate: "Dec 2026",
  registrationDate: "Not yet",
  reraNo: "P52100047892",
  totalCost: 12500000,
  paidAmount: 7500000,
  status: "under-construction",
};

export const emiSchedule: EMIEntry[] = [
  { id: "E01", installmentNo: 1, dueDate: "01 Aug 2024", amount: 1250000, paidDate: "29 Jul 2024", status: "paid",     receiptNo: "SHG/2024/001", label: "Booking Amount" },
  { id: "E02", installmentNo: 2, dueDate: "01 Nov 2024", amount: 1250000, paidDate: "30 Oct 2024", status: "paid",     receiptNo: "SHG/2024/038", label: "Foundation Stage" },
  { id: "E03", installmentNo: 3, dueDate: "01 Feb 2025", amount: 1250000, paidDate: "03 Feb 2025", status: "paid",     receiptNo: "SHG/2025/012", label: "Plinth Stage" },
  { id: "E04", installmentNo: 4, dueDate: "01 May 2025", amount: 1250000, paidDate: "28 Apr 2025", status: "paid",     receiptNo: "SHG/2025/047", label: "Slab Casting 5th Floor" },
  { id: "E05", installmentNo: 5, dueDate: "01 Aug 2025", amount: 1250000, paidDate: "15 Aug 2025", status: "paid",     receiptNo: "SHG/2025/089", label: "Brickwork Completion" },
  { id: "E06", installmentNo: 6, dueDate: "01 Nov 2025", amount: 1250000, paidDate: "28 Oct 2025", status: "paid",     receiptNo: "SHG/2025/134", label: "Plastering Completion" },
  { id: "E07", installmentNo: 7, dueDate: "01 Feb 2026", amount: 1250000,                          status: "overdue",  label: "Flooring Completion" },
  { id: "E08", installmentNo: 8, dueDate: "01 May 2026", amount: 1250000,                          status: "upcoming", label: "Electrical & Plumbing" },
  { id: "E09", installmentNo: 9, dueDate: "01 Sep 2026", amount: 1250000,                          status: "pending",  label: "Finishing Work" },
  { id: "E10", installmentNo: 10, dueDate: "01 Dec 2026", amount: 1250000,                         status: "pending",  label: "On Possession" },
];

export const receipts: Receipt[] = [
  { id: "R01", receiptNo: "SHG/2025/134", date: "28 Oct 2025", amount: 1250000, mode: "NEFT",   refNo: "NEFT25298001234", installment: "Plastering Completion", status: "issued" },
  { id: "R02", receiptNo: "SHG/2025/089", date: "15 Aug 2025", amount: 1250000, mode: "IMPS",   refNo: "IMPS25227543210", installment: "Brickwork Completion",   status: "issued" },
  { id: "R03", receiptNo: "SHG/2025/047", date: "28 Apr 2025", amount: 1250000, mode: "NEFT",   refNo: "NEFT25118009876", installment: "Slab Casting 5th Floor", status: "issued" },
  { id: "R04", receiptNo: "SHG/2025/012", date: "03 Feb 2025", amount: 1250000, mode: "Cheque", refNo: "CHQ/00654321",    installment: "Plinth Stage",           status: "issued" },
  { id: "R05", receiptNo: "SHG/2024/038", date: "30 Oct 2024", amount: 1250000, mode: "NEFT",   refNo: "NEFT24304007654", installment: "Foundation Stage",        status: "issued" },
  { id: "R06", receiptNo: "SHG/2024/001", date: "29 Jul 2024", amount: 1250000, mode: "UPI",    refNo: "UPI/9876543210",  installment: "Booking Amount",         status: "issued" },
];

export const documents: OwnerDocument[] = [
  { id: "D01", name: "Agreement for Sale",       type: "agreement", icon: "📝", date: "15 Aug 2024", size: "2.4 MB",  available: true,  pages: 48 },
  { id: "D02", name: "Allotment Letter",          type: "other",     icon: "📄", date: "01 Aug 2024", size: "0.3 MB",  available: true,  pages: 2  },
  { id: "D03", name: "RERA Registration Cert.",   type: "rera",      icon: "📋", date: "12 Jan 2024", size: "0.8 MB",  available: true,  pages: 4  },
  { id: "D04", name: "Approved Floor Plan",       type: "plan",      icon: "🗺️", date: "20 Mar 2024", size: "5.1 MB",  available: true,  pages: 6  },
  { id: "D05", name: "NOC — Society",             type: "noc",       icon: "✅", date: "Pending",     size: "—",       available: false              },
  { id: "D06", name: "Property Tax Receipt",      type: "tax",       icon: "🧾", date: "Pending",     size: "—",       available: false              },
  { id: "D07", name: "Possession Certificate",    type: "other",     icon: "🏠", date: "Dec 2026",    size: "—",       available: false              },
  { id: "D08", name: "Registration Documents",    type: "agreement", icon: "📜", date: "Dec 2026",    size: "—",       available: false              },
];

export const milestones: ProgressMilestone[] = [
  { id: "M01", label: "Foundation",          description: "Excavation & RCC foundation completed", date: "Oct 2024", status: "done",     pct: 100, photoColor: "#94A3B8" },
  { id: "M02", label: "Plinth & Podium",     description: "Ground floor podium casting completed",  date: "Jan 2025", status: "done",     pct: 100, photoColor: "#78909C" },
  { id: "M03", label: "Slab Casting",        description: "Floors 1–5 slab casting completed",     date: "May 2025", status: "done",     pct: 100, photoColor: "#607D8B" },
  { id: "M04", label: "Brickwork",           description: "All floors brickwork completed",         date: "Aug 2025", status: "done",     pct: 100, photoColor: "#546E7A" },
  { id: "M05", label: "Plastering",          description: "Internal & external plastering done",    date: "Nov 2025", status: "done",     pct: 100, photoColor: "#455A64" },
  { id: "M06", label: "Flooring & Tiling",   description: "Flooring work in progress (60%)",        date: "Mar 2026", status: "active",   pct: 60,  photoColor: "#1B3A6B" },
  { id: "M07", label: "Electrical & Plumbing", description: "MEP work scheduled",                  date: "Jun 2026", status: "upcoming", pct: 0  },
  { id: "M08", label: "Painting & Finishing", description: "Final finishing scheduled",             date: "Sep 2026", status: "upcoming", pct: 0  },
  { id: "M09", label: "Possession",          description: "Expected handover to owners",            date: "Dec 2026", status: "upcoming", pct: 0  },
];

export const complaints: Complaint[] = [
  {
    id: "C01", ticketNo: "TKT-2026-0412",
    category: "Construction Quality",
    subject: "Ceiling crack in living room",
    description: "A hairline crack has appeared on the living room ceiling near the window corner.",
    raisedDate: "12 May 2026", updatedDate: "15 May 2026",
    status: "in-progress", priority: "high",
    response: "Our site engineer has inspected the crack. It is a minor settlement crack. Rectification work scheduled for 20 May.",
  },
  {
    id: "C02", ticketNo: "TKT-2026-0387",
    category: "Documentation",
    subject: "Delay in Agreement copy",
    description: "Requested hard copy of Agreement for Sale on 1 May but not received yet.",
    raisedDate: "02 May 2026", updatedDate: "10 May 2026",
    status: "resolved", priority: "medium",
    response: "Hard copy dispatched via courier on 10 May. Tracking: DHL/8876543.",
  },
  {
    id: "C03", ticketNo: "TKT-2026-0351",
    category: "Payment",
    subject: "Receipt not received for installment 6",
    description: "Made NEFT payment on 28 Oct 2025 but official receipt was not issued for 2 weeks.",
    raisedDate: "15 Nov 2025", updatedDate: "18 Nov 2025",
    status: "closed", priority: "low",
    response: "Receipt SHG/2025/134 has been issued and emailed. We apologize for the delay.",
  },
];

export const COMPLAINT_CATEGORIES = [
  "Construction Quality", "Documentation", "Payment", "Possession Delay",
  "Amenities", "Parking", "Society Transfer", "Other",
];

export function fmtINR(n: number): string {
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(2)} Cr`;
  if (n >= 100000)   return `₹${(n / 100000).toFixed(2)} L`;
  return `₹${n.toLocaleString("en-IN")}`;
}

export const STATUS_CFG = {
  "under-construction": { label: "Under Construction", color: "#F59E0B", bg: "#FFFBEB" },
  "ready":              { label: "Ready to Register",  color: "#22C55E", bg: "#F0FDF4" },
  "registered":         { label: "Registered",         color: "#1B3A6B", bg: "#EFF6FF" },
};

export const EMI_STATUS = {
  paid:     { label: "Paid",     color: "#22C55E", bg: "#F0FDF4" },
  upcoming: { label: "Upcoming", color: "#1B3A6B", bg: "#EFF6FF" },
  overdue:  { label: "Overdue",  color: "#EF4444", bg: "#FEF2F2" },
  pending:  { label: "Pending",  color: "#94A3B8", bg: "#F8FAFC" },
};

export const COMPLAINT_STATUS = {
  "open":        { label: "Open",        color: "#F59E0B", bg: "#FFFBEB" },
  "in-progress": { label: "In Progress", color: "#3B82F6", bg: "#EFF6FF" },
  "resolved":    { label: "Resolved",    color: "#22C55E", bg: "#F0FDF4" },
  "closed":      { label: "Closed",      color: "#94A3B8", bg: "#F8FAFC" },
};

export const PRIORITY_CFG = {
  low:    { label: "Low",    color: "#94A3B8" },
  medium: { label: "Medium", color: "#F59E0B" },
  high:   { label: "High",   color: "#EF4444" },
};
