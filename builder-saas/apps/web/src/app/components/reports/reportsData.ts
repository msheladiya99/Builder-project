// ── Types ──────────────────────────────────────────────────────────────────────

export type ReportId = "sales" | "gst" | "outstanding" | "material" | "labour" | "profit" | "cashflow";
export type DateRange = "today" | "week" | "month" | "quarter" | "year" | "custom";
export type TowerFilter = "All" | "TA" | "TB" | "TC";

export interface KPICard {
  label: string;
  value: string;
  sub?: string;
  change: number;
  color: string;
  prefix?: string;
}

// ── Date helpers ──────────────────────────────────────────────────────────────

export function fmtINR(n: number): string {
  if (n >= 10_000_000) return `₹${(n / 10_000_000).toFixed(2)} Cr`;
  if (n >= 100_000)    return `₹${(n / 100_000).toFixed(1)} L`;
  if (n >= 1_000)      return `₹${(n / 1_000).toFixed(0)}K`;
  return `₹${n.toLocaleString("en-IN")}`;
}
export function fmtNum(n: number): string {
  if (n >= 10_000_000) return `${(n / 10_000_000).toFixed(2)} Cr`;
  if (n >= 100_000)    return `${(n / 100_000).toFixed(1)} L`;
  return n.toLocaleString("en-IN");
}
export const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
export const SHORT_MONTHS = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];

// ── Sales Report Data ─────────────────────────────────────────────────────────

export const salesMonthly = [
  { month: "Nov", bookings: 8,  value: 18400000, collected: 12600000, target: 20000000 },
  { month: "Dec", bookings: 11, value: 24200000, collected: 18100000, target: 22000000 },
  { month: "Jan", bookings: 7,  value: 15800000, collected: 11200000, target: 20000000 },
  { month: "Feb", bookings: 14, value: 31500000, collected: 24800000, target: 25000000 },
  { month: "Mar", bookings: 18, value: 40200000, collected: 33400000, target: 30000000 },
  { month: "Apr", bookings: 12, value: 27600000, collected: 21900000, target: 28000000 },
  { month: "May", bookings: 9,  value: 20250000, collected: 15800000, target: 25000000 },
];

export const salesByTower = [
  { tower: "Tower A", bookings: 38, value: 86000000, pct: 48 },
  { tower: "Tower B", bookings: 29, value: 65000000, pct: 37 },
  { tower: "Tower C", bookings: 12, value: 27000000, pct: 15 },
];

export const salesByType = [
  { name: "2 BHK",   value: 42, fill: "#1B3A6B" },
  { name: "3 BHK",   value: 31, fill: "#C9922A" },
  { name: "3.5 BHK", value: 14, fill: "#7C3AED" },
  { name: "4 BHK",   value: 7,  fill: "#0D9488" },
  { name: "Penthouse",value: 5, fill: "#EF4444" },
];

export const salesKPIs: KPICard[] = [
  { label: "Total Bookings",   value: "79 Units",     change: 12,  color: "#1B3A6B" },
  { label: "Booking Value",    value: "₹17.8 Cr",     change: 18,  color: "#C9922A" },
  { label: "Collections",      value: "₹13.2 Cr",     change: 9,   color: "#16A34A" },
  { label: "Pending Dues",     value: "₹4.6 Cr",      change: -4,  color: "#EF4444" },
];

// ── GST Report Data ───────────────────────────────────────────────────────────

export const gstMonthly = [
  { month: "Nov", gstCollected: 1840000, gstPaid: 1320000, itc: 520000, netLiability: 520000 },
  { month: "Dec", gstCollected: 2420000, gstPaid: 1810000, itc: 610000, netLiability: 610000 },
  { month: "Jan", gstCollected: 1580000, gstPaid: 1120000, itc: 460000, netLiability: 460000 },
  { month: "Feb", gstCollected: 3150000, gstPaid: 2480000, itc: 670000, netLiability: 670000 },
  { month: "Mar", gstCollected: 4020000, gstPaid: 3340000, itc: 680000, netLiability: 680000 },
  { month: "Apr", gstCollected: 2760000, gstPaid: 2190000, itc: 570000, netLiability: 570000 },
  { month: "May", gstCollected: 2025000, gstPaid: 1580000, itc: 445000, netLiability: 445000 },
];

export const gstByRate = [
  { rate: "GST 5%",   taxable: 48000000, gst: 2400000, fill: "#1B3A6B" },
  { rate: "GST 12%",  taxable: 32000000, gst: 3840000, fill: "#C9922A" },
  { rate: "GST 18%",  taxable: 18000000, gst: 3240000, fill: "#7C3AED" },
  { rate: "GST 28%",  taxable: 8000000,  gst: 2240000, fill: "#EF4444" },
];

export const gstKPIs: KPICard[] = [
  { label: "GST Collected (Output)", value: "₹17.8 L",  change: 18,  color: "#1B3A6B" },
  { label: "ITC Claimed (Input)",    value: "₹3.95 L",   change: 8,   color: "#7C3AED" },
  { label: "Net GST Liability",      value: "₹13.85 L",  change: 22,  color: "#C9922A" },
  { label: "Pending Filing",         value: "0 Months",  change: 0,   color: "#16A34A" },
];

// ── Outstanding Dues Data ─────────────────────────────────────────────────────

export const outstandingBrackets = [
  { bracket: "0–30 days",  amount: 12400000, count: 18, fill: "#16A34A" },
  { bracket: "31–60 days", amount: 8600000,  count: 12, fill: "#C9922A" },
  { bracket: "61–90 days", amount: 4200000,  count: 7,  fill: "#F97316" },
  { bracket: "90+ days",   amount: 2800000,  count: 4,  fill: "#EF4444" },
];

export const outstandingTopDebtors = [
  { name: "Ramesh Agarwal",   flat: "A-804", due: 1840000, days: 45, tower: "TA" },
  { name: "Priya Iyer",       flat: "B-302", due: 1560000, days: 62, tower: "TB" },
  { name: "Suresh Khanna",    flat: "A-1102",due: 1280000, days: 38, tower: "TA" },
  { name: "Anita Fernandes",  flat: "C-201", due: 980000,  days: 94, tower: "TC" },
  { name: "Vikram Mehta",     flat: "B-605", due: 820000,  days: 28, tower: "TB" },
  { name: "Lalita Sharma",    flat: "A-502", due: 640000,  days: 71, tower: "TA" },
];

export const outstandingKPIs: KPICard[] = [
  { label: "Total Outstanding", value: "₹2.8 Cr",  change: -8,  color: "#EF4444" },
  { label: "Overdue 90+ days",  value: "₹28 L",    change: -12, color: "#EF4444" },
  { label: "On-Time Rate",      value: "72%",       change: 5,   color: "#16A34A" },
  { label: "Demand Notices",    value: "4 Sent",    change: 0,   color: "#C9922A" },
];

// ── Material Report Data ──────────────────────────────────────────────────────

export const materialMonthly = [
  { month: "Nov", ordered: 8200000, delivered: 7400000, consumed: 6800000 },
  { month: "Dec", ordered: 9600000, delivered: 8800000, consumed: 8200000 },
  { month: "Jan", ordered: 7800000, delivered: 7200000, consumed: 6600000 },
  { month: "Feb", ordered: 11200000,delivered: 10400000,consumed: 9800000 },
  { month: "Mar", ordered: 13600000,delivered: 12800000,consumed: 11200000 },
  { month: "Apr", ordered: 10400000,delivered: 9800000, consumed: 9200000 },
  { month: "May", ordered: 8800000, delivered: 8200000, consumed: 7400000 },
];

export const materialByCategory = [
  { category: "Cement",    ordered: 12600000, consumed: 11200000, waste: 1400000, fill: "#1B3A6B" },
  { category: "Steel TMT", ordered: 18400000, consumed: 17200000, waste: 1200000, fill: "#C9922A" },
  { category: "Sand",      ordered: 4200000,  consumed: 3800000,  waste: 400000,  fill: "#7C3AED" },
  { category: "Aggregate", ordered: 3600000,  consumed: 3200000,  waste: 400000,  fill: "#0D9488" },
  { category: "Bricks",    ordered: 6800000,  consumed: 6200000,  waste: 600000,  fill: "#F97316" },
  { category: "Plumbing",  ordered: 2800000,  consumed: 2600000,  waste: 200000,  fill: "#EAB308" },
  { category: "Electrical",ordered: 3200000,  consumed: 2800000,  waste: 400000,  fill: "#EC4899" },
];

export const materialKPIs: KPICard[] = [
  { label: "Total Ordered",   value: "₹6.96 Cr",  change: 14,  color: "#1B3A6B" },
  { label: "Total Consumed",  value: "₹5.92 Cr",  change: 12,  color: "#C9922A" },
  { label: "Stock at Site",   value: "₹1.04 Cr",  change: 8,   color: "#7C3AED" },
  { label: "Waste %",         value: "5.8%",       change: -2,  color: "#16A34A" },
];

// ── Labour Report Data ────────────────────────────────────────────────────────

export const labourMonthly = [
  { month: "Nov", headcount: 148, payroll: 4280000, mandays: 3256, overtime: 320000 },
  { month: "Dec", headcount: 162, payroll: 4680000, mandays: 3564, overtime: 410000 },
  { month: "Jan", headcount: 155, payroll: 4480000, mandays: 3410, overtime: 380000 },
  { month: "Feb", headcount: 171, payroll: 4940000, mandays: 3762, overtime: 440000 },
  { month: "Mar", headcount: 186, payroll: 5380000, mandays: 4092, overtime: 520000 },
  { month: "Apr", headcount: 178, payroll: 5140000, mandays: 3916, overtime: 480000 },
  { month: "May", headcount: 193, payroll: 5580000, mandays: 2124, overtime: 210000 },
];

export const labourByTrade = [
  { trade: "Civil / Masons",   headcount: 68, payroll: 1680000, fill: "#1B3A6B" },
  { trade: "Steel Fixers",     headcount: 42, payroll: 1260000, fill: "#C9922A" },
  { trade: "Electricians",     headcount: 28, payroll: 980000,  fill: "#7C3AED" },
  { trade: "Plumbers",         headcount: 22, payroll: 770000,  fill: "#0D9488" },
  { trade: "Carpenters",       headcount: 18, payroll: 540000,  fill: "#F97316" },
  { trade: "Helpers / Misc",   headcount: 15, payroll: 345000,  fill: "#6B7280" },
];

export const labourKPIs: KPICard[] = [
  { label: "Total Headcount",  value: "193 Workers", change: 8,  color: "#1B3A6B" },
  { label: "Monthly Payroll",  value: "₹55.8 L",     change: 8,  color: "#C9922A" },
  { label: "Man-Days (MTD)",   value: "2,124",        change: 5,  color: "#7C3AED" },
  { label: "Avg Daily Wage",   value: "₹612",         change: 3,  color: "#16A34A" },
];

// ── Profit Analysis Data ──────────────────────────────────────────────────────

export const profitMonthly = [
  { month: "Nov", revenue: 18400000, costs: 14200000, gross: 4200000, margin: 22.8 },
  { month: "Dec", revenue: 24200000, costs: 18600000, gross: 5600000, margin: 23.1 },
  { month: "Jan", revenue: 15800000, costs: 12400000, gross: 3400000, margin: 21.5 },
  { month: "Feb", revenue: 31500000, costs: 23800000, gross: 7700000, margin: 24.4 },
  { month: "Mar", revenue: 40200000, costs: 29800000, gross: 10400000,margin: 25.9 },
  { month: "Apr", revenue: 27600000, costs: 20600000, gross: 7000000, margin: 25.4 },
  { month: "May", revenue: 20250000, costs: 15200000, gross: 5050000, margin: 24.9 },
];

export const costBreakdown = [
  { name: "Construction",   value: 58, fill: "#1B3A6B" },
  { name: "Land",           value: 18, fill: "#C9922A" },
  { name: "Labour",         value: 12, fill: "#7C3AED" },
  { name: "Marketing",      value: 5,  fill: "#0D9488" },
  { name: "Admin & G&A",   value: 4,  fill: "#F97316" },
  { name: "Finance",        value: 3,  fill: "#EF4444" },
];

export const profitKPIs: KPICard[] = [
  { label: "Total Revenue",   value: "₹17.79 Cr", change: 16,  color: "#1B3A6B" },
  { label: "Gross Profit",    value: "₹4.35 Cr",  change: 22,  color: "#16A34A" },
  { label: "Net Margin",      value: "24.4%",      change: 2.1, color: "#16A34A" },
  { label: "EBITDA",          value: "₹5.12 Cr",  change: 18,  color: "#C9922A" },
];

// ── Cash Flow Data ────────────────────────────────────────────────────────────

export const cashFlowMonthly = [
  { month: "Nov", inflow: 12600000, outflow: 9800000,  net: 2800000,  balance: 18400000 },
  { month: "Dec", inflow: 18100000, outflow: 13200000, net: 4900000,  balance: 23300000 },
  { month: "Jan", inflow: 11200000, outflow: 10400000, net: 800000,   balance: 24100000 },
  { month: "Feb", inflow: 24800000, outflow: 18600000, net: 6200000,  balance: 30300000 },
  { month: "Mar", inflow: 33400000, outflow: 24800000, net: 8600000,  balance: 38900000 },
  { month: "Apr", inflow: 21900000, outflow: 19200000, net: 2700000,  balance: 41600000 },
  { month: "May", inflow: 15800000, outflow: 14200000, net: 1600000,  balance: 43200000 },
];

export const cashSources = [
  { source: "Customer Collections", amount: 83200000, pct: 61, fill: "#1B3A6B" },
  { source: "Bank Disbursements",   amount: 34000000, pct: 25, fill: "#C9922A" },
  { source: "Equity / Promoter",    amount: 14000000, pct: 10, fill: "#7C3AED" },
  { source: "Other Income",         amount: 5400000,  pct: 4,  fill: "#0D9488" },
];

export const cashKPIs: KPICard[] = [
  { label: "Opening Balance",  value: "₹1.84 Cr",  change: 0,   color: "#6B7280" },
  { label: "Total Inflow",     value: "₹13.79 Cr", change: 14,  color: "#16A34A" },
  { label: "Total Outflow",    value: "₹11.02 Cr", change: 11,  color: "#EF4444" },
  { label: "Closing Balance",  value: "₹4.32 Cr",  change: 134, color: "#1B3A6B" },
];

// ── Date range labels ─────────────────────────────────────────────────────────
export const DATE_RANGES: { id: DateRange; label: string }[] = [
  { id: "today",   label: "Today" },
  { id: "week",    label: "This Week" },
  { id: "month",   label: "This Month" },
  { id: "quarter", label: "This Quarter" },
  { id: "year",    label: "This Year" },
];

export const TOWER_FILTERS: { id: TowerFilter; label: string }[] = [
  { id: "All", label: "All Towers" },
  { id: "TA",  label: "Tower A" },
  { id: "TB",  label: "Tower B" },
  { id: "TC",  label: "Tower C" },
];
