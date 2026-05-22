import { useState } from "react";
import {
  TrendingUp, TrendingDown, Building2, Users, IndianRupee, Layers,
  Bell, Settings, Menu, Search, Sun, Moon, ChevronDown, Plus,
  Download, Filter, Eye, MoreHorizontal, ArrowUpRight, AlertTriangle,
  CheckCircle2, Clock, Activity, Shield, RefreshCw, FileText,
  HardHat, Wifi, Package, CalendarDays, X, ChevronRight
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import { AdminSidebar } from "./AdminSidebar";
import { ProjectManagementModule } from "../projects/ProjectManagementModule";
import { useAuthStore } from "../../store/store";

// ─── Data ─────────────────────────────────────────────────────────────────────

const revenueData = [
  { month: "Jun", revenue: 389, expenses: 252, profit: 137 },
  { month: "Jul", revenue: 456, expenses: 297, profit: 159 },
  { month: "Aug", revenue: 512, expenses: 330, profit: 182 },
  { month: "Sep", revenue: 478, expenses: 308, profit: 170 },
  { month: "Oct", revenue: 534, expenses: 345, profit: 189 },
  { month: "Nov", revenue: 498, expenses: 322, profit: 176 },
  { month: "Dec", revenue: 562, expenses: 360, profit: 202 },
  { month: "Jan", revenue: 445, expenses: 289, profit: 156 },
  { month: "Feb", revenue: 610, expenses: 392, profit: 218 },
  { month: "Mar", revenue: 578, expenses: 368, profit: 210 },
  { month: "Apr", revenue: 648, expenses: 415, profit: 233 },
  { month: "May", revenue: 694, expenses: 432, profit: 262 },
];

const projectRevenue = [
  { name: "Hari Heights", revenue: 12.4, expenses: 8.1, units: 240 },
  { name: "Shri Residency", revenue: 8.6, expenses: 5.8, units: 160 },
  { name: "Green Valley", revenue: 5.2, expenses: 3.9, units: 320 },
  { name: "Lakshmi Towers", revenue: 9.8, expenses: 6.4, units: 180 },
  { name: "Sunrise Enclave", revenue: 6.2, expenses: 4.1, units: 140 },
  { name: "River View", revenue: 4.8, expenses: 3.2, units: 96 },
];

const salesTrend = [
  { month: "Jun", bookings: 38, cancellations: 4, leads: 124 },
  { month: "Jul", bookings: 45, cancellations: 3, leads: 138 },
  { month: "Aug", bookings: 52, cancellations: 6, leads: 162 },
  { month: "Sep", bookings: 48, cancellations: 5, leads: 148 },
  { month: "Oct", bookings: 56, cancellations: 3, leads: 172 },
  { month: "Nov", bookings: 51, cancellations: 4, leads: 158 },
  { month: "Dec", bookings: 62, cancellations: 7, leads: 194 },
  { month: "Jan", bookings: 44, cancellations: 2, leads: 136 },
  { month: "Feb", bookings: 71, cancellations: 5, leads: 218 },
  { month: "Mar", bookings: 68, cancellations: 4, leads: 207 },
  { month: "Apr", bookings: 79, cancellations: 6, leads: 244 },
  { month: "May", bookings: 84, cancellations: 5, leads: 262 },
];

const expenseBreakdown = [
  { name: "Construction", value: 45, color: "#1B3A6B" },
  { name: "Labour", value: 20, color: "#C9922A" },
  { name: "Marketing", value: 15, color: "#16A34A" },
  { name: "Admin & Ops", value: 12, color: "#0EA5E9" },
  { name: "Legal / Comp.", value: 8, color: "#8B5CF6" },
];

const constructionProjects = [
  { name: "Hari Heights", phase: "Structure — Phase 3", progress: 78, target: "Dec 2026", status: "On Track", color: "bg-green-500", budget: "₹42Cr", spent: "₹32.8Cr" },
  { name: "Shri Residency", phase: "Finishing — Block B", progress: 52, target: "Mar 2027", status: "On Track", color: "bg-green-500", budget: "₹28Cr", spent: "₹14.6Cr" },
  { name: "Green Valley", phase: "Foundation — Phase 1", progress: 34, target: "Jun 2027", status: "Delayed", color: "bg-amber-500", budget: "₹18Cr", spent: "₹6.1Cr" },
  { name: "Lakshmi Towers", phase: "Finishing — All Blocks", progress: 91, target: "Sep 2026", status: "Ahead", color: "bg-blue-500", budget: "₹36Cr", spent: "₹32.8Cr" },
  { name: "Sunrise Enclave", phase: "Approval & Layout", progress: 12, target: "Dec 2027", status: "Planning", color: "bg-purple-500", budget: "₹22Cr", spent: "₹2.6Cr" },
];

const recentBookings = [
  { id: "BK-2847", customer: "Suresh Nair", unit: "B-204", project: "Hari Heights", amount: "₹68.5L", status: "Active", date: "19 May 2026", type: "2 BHK" },
  { id: "BK-2846", customer: "Priya Sharma", unit: "A-101", project: "Shri Residency", amount: "₹42L", status: "Completed", date: "18 May 2026", type: "2 BHK" },
  { id: "BK-2845", customer: "Anil Mehta", unit: "C-312", project: "Green Valley", amount: "₹55.8L", status: "Pending", date: "17 May 2026", type: "3 BHK" },
  { id: "BK-2844", customer: "Kavitha Rao", unit: "D-508", project: "Lakshmi Towers", amount: "₹88L", status: "Active", date: "16 May 2026", type: "4 BHK" },
  { id: "BK-2843", customer: "Vijay Krishnan", unit: "B-115", project: "Hari Heights", amount: "₹38.5L", status: "Cancelled", date: "15 May 2026", type: "1 BHK" },
  { id: "BK-2842", customer: "Meena Pillai", unit: "A-303", project: "Sunrise Enclave", amount: "₹47.3L", status: "Completed", date: "14 May 2026", type: "2 BHK" },
  { id: "BK-2841", customer: "Ravi Shankar", unit: "E-201", project: "River View", amount: "₹72L", status: "Active", date: "13 May 2026", type: "3 BHK" },
  { id: "BK-2840", customer: "Anita Desai", unit: "F-402", project: "Lakshmi Towers", amount: "₹1.2Cr", status: "Active", date: "12 May 2026", type: "4 BHK" },
];

const overduePayments = [
  { customer: "Rajesh Kumar", unit: "A-205", project: "Hari Heights", due: "₹18.4L", days: 42, lastPay: "02 Apr 2026", mobile: "98765 43210" },
  { customer: "Sunita Joshi", unit: "C-108", project: "Green Valley", due: "₹9.6L", days: 28, lastPay: "21 Apr 2026", mobile: "87654 32109" },
  { customer: "Deepak Verma", unit: "B-301", project: "Shri Residency", due: "₹24.8L", days: 65, lastPay: "14 Mar 2026", mobile: "76543 21098" },
  { customer: "Lakshmi Naidu", unit: "D-412", project: "Lakshmi Towers", due: "₹33.2L", days: 80, lastPay: "01 Mar 2026", mobile: "65432 10987" },
  { customer: "Arvind Patel", unit: "A-109", project: "Sunrise Enclave", due: "₹12.1L", days: 15, lastPay: "04 May 2026", mobile: "94321 09876" },
  { customer: "Geeta Iyer", unit: "F-202", project: "River View", due: "₹7.8L", days: 33, lastPay: "16 Apr 2026", mobile: "83210 98765" },
];

const reraAlerts = [
  { project: "Hari Heights", reraNo: "PRM/KA/RERA/1251/309/PR/200218/001823", expiry: "15 Aug 2026", daysLeft: 88, status: "Expiring Soon" },
  { project: "Shri Residency", reraNo: "PRM/KA/RERA/1251/309/PR/210318/002145", expiry: "30 Sep 2026", daysLeft: 134, status: "Valid" },
  { project: "Green Valley", reraNo: "PRM/KA/RERA/1251/309/PR/220518/003261", expiry: "01 Jun 2026", daysLeft: 13, status: "Critical" },
  { project: "Lakshmi Towers", reraNo: "PRM/KA/RERA/1251/309/PR/230718/004382", expiry: "31 Dec 2026", daysLeft: 226, status: "Valid" },
  { project: "Sunrise Enclave", reraNo: "PRM/KA/RERA/1251/309/PR/240218/005491", expiry: "28 Feb 2027", daysLeft: 285, status: "Valid" },
  { project: "River View", reraNo: "PRM/KA/RERA/1251/309/PR/240918/006201", expiry: "10 Jul 2026", daysLeft: 52, status: "Expiring Soon" },
];

const activities = [
  { icon: <CheckCircle2 size={14} className="text-green-400" />, text: "Booking BK-2847 confirmed — Suresh Nair, B-204", time: "2 min ago", dot: "bg-green-500" },
  { icon: <IndianRupee size={14} className="text-blue-400" />, text: "₹18.4L payment received — Priya Sharma, A-101", time: "18 min ago", dot: "bg-blue-500" },
  { icon: <AlertTriangle size={14} className="text-red-400" />, text: "RERA expiry alert — Green Valley (13 days left)", time: "1 hr ago", dot: "bg-red-500" },
  { icon: <HardHat size={14} className="text-amber-400" />, text: "Construction update — Lakshmi Towers Phase 4 complete", time: "2 hr ago", dot: "bg-amber-500" },
  { icon: <FileText size={14} className="text-purple-400" />, text: "Agreement generated — Unit D-508, Kavitha Rao", time: "3 hr ago", dot: "bg-purple-500" },
  { icon: <Users size={14} className="text-teal-400" />, text: "New lead registered — Arjun Mehta, 3 BHK interest", time: "4 hr ago", dot: "bg-teal-500" },
  { icon: <Package size={14} className="text-orange-400" />, text: "Material order placed — Steel 48MT for Green Valley", time: "5 hr ago", dot: "bg-orange-500" },
  { icon: <Shield size={14} className="text-indigo-400" />, text: "Role updated — Ramesh Kumar granted Finance access", time: "6 hr ago", dot: "bg-indigo-500" },
];

const kpiCards = [
  {
    title: "Total Revenue", value: "₹48.6 Cr", change: "+22.4%", up: true, sub: "vs last FY",
    icon: <IndianRupee size={20} />, accent: "from-blue-600 to-[#1B3A6B]",
    bg: "from-blue-50 to-blue-100/50 dark:from-blue-950/30 dark:to-blue-900/20",
    border: "border-blue-100 dark:border-blue-900/40", detail: "₹4.05Cr / mo avg",
  },
  {
    title: "Total Expenses", value: "₹31.2 Cr", change: "+15.1%", up: false, sub: "vs last FY",
    icon: <TrendingDown size={20} />, accent: "from-red-600 to-red-700",
    bg: "from-red-50 to-red-100/50 dark:from-red-950/30 dark:to-red-900/20",
    border: "border-red-100 dark:border-red-900/40", detail: "₹2.6Cr / mo avg",
  },
  {
    title: "Net Profit", value: "₹17.4 Cr", change: "+34.2%", up: true, sub: "vs last FY",
    icon: <TrendingUp size={20} />, accent: "from-emerald-600 to-green-700",
    bg: "from-emerald-50 to-emerald-100/50 dark:from-emerald-950/30 dark:to-green-900/20",
    border: "border-emerald-100 dark:border-emerald-900/40", detail: "35.8% margin",
  },
  {
    title: "Profit Margin", value: "35.8%", change: "+8.2pp", up: true, sub: "vs last FY",
    icon: <Activity size={20} />, accent: "from-violet-600 to-purple-700",
    bg: "from-violet-50 to-violet-100/50 dark:from-violet-950/30 dark:to-purple-900/20",
    border: "border-violet-100 dark:border-violet-900/40", detail: "Target: 40%",
  },
  {
    title: "Flats Sold", value: "284", change: "+18", up: true, sub: "this month",
    icon: <Layers size={20} />, accent: "from-[#C9922A] to-amber-600",
    bg: "from-amber-50 to-amber-100/50 dark:from-amber-950/30 dark:to-amber-900/20",
    border: "border-amber-100 dark:border-amber-900/40", detail: "612 still available",
  },
  {
    title: "Available Units", value: "612", change: "-18", up: false, sub: "units sold",
    icon: <Building2 size={20} />, accent: "from-sky-500 to-sky-700",
    bg: "from-sky-50 to-sky-100/50 dark:from-sky-950/30 dark:to-sky-900/20",
    border: "border-sky-100 dark:border-sky-900/40", detail: "Across 8 projects",
  },
  {
    title: "Pending Payments", value: "₹8.4 Cr", change: "47 accounts", up: false, sub: "overdue",
    icon: <Clock size={20} />, accent: "from-orange-500 to-orange-700",
    bg: "from-orange-50 to-orange-100/50 dark:from-orange-950/30 dark:to-orange-900/20",
    border: "border-orange-100 dark:border-orange-900/40", detail: "Oldest: 80 days",
  },
  {
    title: "Collection Rate", value: "76.4%", change: "-3.1pp", up: false, sub: "vs last month",
    icon: <RefreshCw size={20} />, accent: "from-teal-500 to-teal-700",
    bg: "from-teal-50 to-teal-100/50 dark:from-teal-950/30 dark:to-teal-900/20",
    border: "border-teal-100 dark:border-teal-900/40", detail: "Target: 85%",
  },
];

// ─── Status Badge ─────────────────────────────────────────────────────────────
const statusMap: Record<string, string> = {
  Active: "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400",
  Completed: "bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400",
  Pending: "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400",
  Cancelled: "bg-gray-100 text-gray-500 dark:bg-gray-800/40 dark:text-gray-400",
  "On Track": "bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400",
  Delayed: "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400",
  Ahead: "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400",
  Planning: "bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-400",
  Critical: "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400",
  "Expiring Soon": "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400",
  Valid: "bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400",
};

function Badge({ status }: { status: string }) {
  const dotMap: Record<string, string> = {
    Active: "bg-blue-500", Completed: "bg-green-500", Pending: "bg-amber-500",
    Cancelled: "bg-gray-400", "On Track": "bg-green-500", Delayed: "bg-amber-500",
    Ahead: "bg-blue-500", Planning: "bg-purple-500", Critical: "bg-red-500",
    "Expiring Soon": "bg-amber-500", Valid: "bg-green-500",
  };
  return (
    <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full ${statusMap[status] || statusMap.Active}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dotMap[status] || "bg-blue-500"}`} />
      {status}
    </span>
  );
}

// ─── Tooltip ──────────────────────────────────────────────────────────────────
const ChartTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-border rounded-xl p-3 shadow-2xl text-xs min-w-[140px]">
      <p className="font-bold text-foreground mb-2">{label}</p>
      {payload.map((p: any, i: number) => (
        <div key={i} className="flex items-center justify-between gap-4">
          <span className="flex items-center gap-1.5 text-muted-foreground">
            <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
            {p.name}
          </span>
          <span className="font-semibold text-foreground">
            {typeof p.value === "number" && p.name !== "Bookings" && p.name !== "Leads" && p.name !== "Cancellations"
              ? `₹${p.value}L` : p.value}
          </span>
        </div>
      ))}
    </div>
  );
};

const tooltipStyle = {
  contentStyle: { borderRadius: 12, border: "1px solid var(--border)", background: "var(--card)", fontSize: 12, boxShadow: "0 20px 60px rgba(0,0,0,0.2)" },
};

// ─── Section Header ───────────────────────────────────────────────────────────
function SectionHeader({ title, sub, action }: { title: string; sub?: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div>
        <h3 className="text-foreground">{title}</h3>
        {sub && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
      </div>
      {action}
    </div>
  );
}

// ─── Admin Navbar ─────────────────────────────────────────────────────────────
function AdminNavbar({ onMenuToggle, isDark, onDarkToggle, onCollapse, collapsed }: {
  onMenuToggle: () => void; isDark: boolean; onDarkToggle: () => void;
  onCollapse: () => void; collapsed: boolean;
}) {
  const [notifOpen, setNotifOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  return (
    <header className="h-14 bg-card border-b border-border flex items-center px-4 gap-3 sticky top-0 z-20 shadow-sm flex-shrink-0">
      {/* Collapse toggle (desktop) */}
      <button onClick={onCollapse} className="hidden lg:flex p-1.5 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors" title="Toggle sidebar">
        <Menu size={17} />
      </button>
      {/* Mobile open */}
      <button onClick={onMenuToggle} className="lg:hidden p-1.5 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
        <Menu size={17} />
      </button>

      {/* Breadcrumb */}
      <div className="hidden sm:flex items-center gap-1.5 text-sm">
        <Shield size={13} className="text-[#C9922A]" />
        <span className="text-[#C9922A] font-semibold text-xs">Super Admin</span>
        <ChevronRight size={12} className="text-border" />
        <span className="text-foreground font-medium text-xs">Dashboard</span>
      </div>

      <div className="flex-1" />

      {/* Search */}
      <div className={`hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl border bg-muted transition-all duration-200 ${searchFocused ? "w-72 border-primary bg-card shadow-sm" : "w-52 border-border"}`}>
        <Search size={13} className="text-muted-foreground flex-shrink-0" />
        <input
          type="text"
          placeholder="Search units, customers, projects…"
          className="bg-transparent text-xs outline-none w-full text-foreground placeholder:text-muted-foreground"
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
        />
        {!searchFocused && <kbd className="text-[9px] text-muted-foreground border border-border rounded px-1 hidden lg:block">⌘K</kbd>}
      </div>

      {/* Quick actions */}
      <button className="hidden sm:flex items-center gap-1.5 bg-primary text-primary-foreground text-xs font-semibold px-3 py-1.5 rounded-lg hover:opacity-90 transition-all shadow-sm">
        <Plus size={13} /> New Booking
      </button>

      {/* Dark mode */}
      <button onClick={onDarkToggle} className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
        {isDark ? <Sun size={15} /> : <Moon size={15} />}
      </button>

      {/* Notifications */}
      <div className="relative">
        <button onClick={() => { setNotifOpen(o => !o); setUserOpen(false); }} className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors relative">
          <Bell size={15} />
          <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-red-500 rounded-full" />
        </button>
        {notifOpen && (
          <>
            <div className="fixed inset-0 z-30" onClick={() => setNotifOpen(false)} />
            <div className="absolute right-0 top-11 w-80 bg-card border border-border rounded-2xl shadow-2xl z-40 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                <div>
                  <span className="text-sm font-bold text-foreground">Notifications</span>
                  <span className="ml-2 text-[10px] bg-red-500 text-white px-1.5 py-0.5 rounded-full font-bold">12 new</span>
                </div>
                <button className="text-xs text-primary font-medium hover:underline">Mark all read</button>
              </div>
              <div className="divide-y divide-border max-h-72 overflow-y-auto">
                {activities.slice(0, 5).map((a, i) => (
                  <div key={i} className="flex gap-3 px-4 py-3 hover:bg-muted/50 cursor-pointer transition-colors">
                    <div className={`w-2 h-2 rounded-full ${a.dot} mt-1.5 flex-shrink-0`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-foreground leading-snug">{a.text}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{a.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-4 py-2.5 border-t border-border text-center">
                <button className="text-xs text-primary font-medium hover:underline">View all notifications</button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* User */}
      <div className="relative">
        <button onClick={() => { setUserOpen(o => !o); setNotifOpen(false); }} className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-muted transition-colors">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#C9922A] to-[#A87520] flex items-center justify-center flex-shrink-0 shadow-sm">
            <span className="text-white text-[10px] font-bold">SA</span>
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-[11px] font-bold text-foreground leading-none">Ramesh Kumar</p>
            <p className="text-[9px] text-[#C9922A] font-semibold leading-none mt-0.5">Super Admin</p>
          </div>
          <ChevronDown size={11} className="text-muted-foreground hidden sm:block" />
        </button>
        {userOpen && (
          <>
            <div className="fixed inset-0 z-30" onClick={() => setUserOpen(false)} />
            <div className="absolute right-0 top-11 w-52 bg-card border border-border rounded-2xl shadow-2xl z-40 py-1 overflow-hidden">
              <div className="px-4 py-3 border-b border-border">
                <p className="text-sm font-bold text-foreground">Ramesh Kumar</p>
                <p className="text-xs text-muted-foreground">admin@shrihari.in</p>
                <span className="inline-flex items-center gap-1 mt-1.5 text-[10px] bg-[#C9922A]/10 border border-[#C9922A]/30 text-[#C9922A] px-2 py-0.5 rounded-full font-bold">
                  <Shield size={9} /> Super Admin
                </span>
              </div>
              {[
                { icon: <Settings size={13} />, label: "Platform Settings" },
                { icon: <Users size={13} />, label: "User Management" },
                { icon: <FileText size={13} />, label: "Audit Logs" },
              ].map(item => (
                <button key={item.label} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors">
                  <span className="text-muted-foreground">{item.icon}</span>{item.label}
                </button>
              ))}
              <div className="border-t border-border">
                <button 
                  onClick={() => {
                    setUserOpen(false);
                    useAuthStore.getState().logout();
                  }}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                >
                  <X size={13} /> Sign out
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </header>
  );
}

// ─── Main Dashboard Content ───────────────────────────────────────────────────
function DashboardContent() {
  const [bookingsTab, setBookingsTab] = useState("All");

  return (
    <div className="p-5 space-y-6 max-w-[1600px] mx-auto">

      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-foreground">Super Admin Dashboard</h1>
            <span className="text-[10px] bg-[#C9922A]/10 border border-[#C9922A]/30 text-[#C9922A] px-2 py-0.5 rounded-full font-bold">SHG Central</span>
          </div>
          <p className="text-sm text-muted-foreground">Financial Year 2025–26 · All Tenants · Last updated just now</p>
        </div>
        <div className="flex items-center gap-2">
          <select className="text-xs bg-card border border-border rounded-lg px-3 py-2 text-foreground outline-none focus:border-primary cursor-pointer">
            <option>FY 2025–26</option>
            <option>FY 2024–25</option>
          </select>
          <button className="flex items-center gap-1.5 border border-border text-xs font-medium px-3 py-2 rounded-lg hover:bg-muted transition-colors text-foreground">
            <Filter size={13} /> Filters
          </button>
          <button className="flex items-center gap-1.5 bg-primary text-primary-foreground text-xs font-semibold px-3 py-2 rounded-lg hover:opacity-90 transition-all shadow-sm">
            <Download size={13} /> Export Report
          </button>
        </div>
      </div>

      {/* Alert banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        {[
          { icon: <AlertTriangle size={13} />, cls: "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800/50 text-red-700 dark:text-red-400", text: "Green Valley RERA expires in 13 days — Renew immediately" },
          { icon: <Clock size={13} />, cls: "bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800/50 text-amber-700 dark:text-amber-400", text: "₹8.4 Cr in overdue collections — 47 accounts pending" },
          { icon: <CheckCircle2 size={13} />, cls: "bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800/50 text-green-700 dark:text-green-400", text: "Lakshmi Towers 91% complete — On target for Sep handover" },
        ].map((a, i) => (
          <div key={i} className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl border text-xs font-medium ${a.cls}`}>
            {a.icon} {a.text}
          </div>
        ))}
      </div>

      {/* ─ KPI Cards ─ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {kpiCards.map((card, i) => (
          <div key={card.title} className={`bg-gradient-to-br ${card.bg} border ${card.border} rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-200 group relative overflow-hidden`}>
            {/* Background decoration */}
            <div className={`absolute top-0 right-0 w-20 h-20 rounded-full bg-gradient-to-br ${card.accent} opacity-8 translate-x-6 -translate-y-6 blur-xl`} />
            <div className="relative">
              <div className="flex items-start justify-between mb-3">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider leading-none">{card.title}</p>
                <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${card.accent} flex items-center justify-center text-white shadow-sm flex-shrink-0`}>
                  {card.icon}
                </div>
              </div>
              <p className="text-2xl font-black text-foreground tracking-tight leading-none mb-2">{card.value}</p>
              <div className="flex items-center gap-1.5">
                {card.up
                  ? <TrendingUp size={11} className="text-emerald-500" />
                  : <TrendingDown size={11} className="text-red-500" />}
                <span className={`text-xs font-bold ${card.up ? "text-emerald-600 dark:text-emerald-400" : "text-red-500"}`}>{card.change}</span>
                <span className="text-[10px] text-muted-foreground">{card.sub}</span>
              </div>
              <div className="mt-2 pt-2 border-t border-black/5 dark:border-white/5">
                <p className="text-[10px] text-muted-foreground">{card.detail}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ─ Charts Row 1 ─ */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Revenue vs Expenses area chart */}
        <div className="xl:col-span-2 bg-card border border-border rounded-2xl p-5 shadow-sm">
          <SectionHeader
            title="Revenue & Expense Trend"
            sub="Monthly overview — ₹ in Lakhs (Jun 2025 – May 2026)"
            action={
              <div className="flex items-center gap-2">
                <select className="text-xs bg-muted border border-border rounded-lg px-2.5 py-1.5 text-foreground outline-none cursor-pointer">
                  <option>Last 12 Months</option><option>Last 6 Months</option><option>This FY</option>
                </select>
                <button className="text-muted-foreground hover:text-foreground p-1 rounded transition-colors"><MoreHorizontal size={15} /></button>
              </div>
            }
          />
          <ResponsiveContainer width="100%" height={240} minWidth={1} minHeight={1}>
            <AreaChart data={revenueData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1B3A6B" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="#1B3A6B" stopOpacity={0.02} />
                </linearGradient>
                <linearGradient id="expensesGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#DC2626" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#DC2626" stopOpacity={0.02} />
                </linearGradient>
                <linearGradient id="profitGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#16A34A" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#16A34A" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
              <Tooltip content={<ChartTooltip />} />
              <Legend iconType="circle" iconSize={7} wrapperStyle={{ fontSize: 11, paddingTop: 12 }} />
              <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#1B3A6B" strokeWidth={2.5} fill="url(#revenueGrad)" dot={false} activeDot={{ r: 4, fill: "#1B3A6B" }} />
              <Area type="monotone" dataKey="expenses" name="Expenses" stroke="#DC2626" strokeWidth={2} fill="url(#expensesGrad)" dot={false} activeDot={{ r: 4, fill: "#DC2626" }} />
              <Area type="monotone" dataKey="profit" name="Profit" stroke="#16A34A" strokeWidth={2} fill="url(#profitGrad)" dot={false} activeDot={{ r: 4, fill: "#16A34A" }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Expense breakdown donut */}
        <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
          <SectionHeader title="Expense Breakdown" sub="FY 2025–26 allocation" />
          <ResponsiveContainer width="100%" height={180} minWidth={1} minHeight={1}>
            <PieChart>
              <Pie data={expenseBreakdown} cx="50%" cy="50%" innerRadius={50} outerRadius={78} paddingAngle={3} dataKey="value">
                {expenseBreakdown.map((entry, i) => <Cell key={`cell-${i}`} fill={entry.color} stroke="none" />)}
              </Pie>
              <Tooltip contentStyle={tooltipStyle.contentStyle} formatter={(v: any, n: any) => [`${v}%`, n]} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-1">
            {expenseBreakdown.map(item => (
              <div key={item.name} className="flex items-center gap-2.5">
                <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: item.color }} />
                <span className="text-xs text-muted-foreground flex-1">{item.name}</span>
                <div className="flex items-center gap-2">
                  <div className="w-16 h-1 bg-muted rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${item.value}%`, background: item.color }} />
                  </div>
                  <span className="text-xs font-bold text-foreground w-8 text-right">{item.value}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─ Charts Row 2 ─ */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {/* Project-wise revenue bar */}
        <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
          <SectionHeader
            title="Project-wise Revenue Comparison"
            sub="Revenue vs Expenses — ₹ in Crores"
            action={<button className="text-muted-foreground hover:text-foreground p-1 rounded"><MoreHorizontal size={15} /></button>}
          />
          <ResponsiveContainer width="100%" height={240} minWidth={1} minHeight={1}>
            <BarChart data={projectRevenue} margin={{ top: 0, right: 0, left: -20, bottom: 0 }} barGap={3} barSize={18}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle.contentStyle} formatter={(v: any, n: any) => [`₹${v}Cr`, n]} />
              <Legend iconType="circle" iconSize={7} wrapperStyle={{ fontSize: 11, paddingTop: 12 }} />
              <Bar dataKey="revenue" name="Revenue" fill="#1B3A6B" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expenses" name="Expenses" fill="#C9922A" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Sales trend line */}
        <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
          <SectionHeader
            title="Sales Trend"
            sub="Monthly bookings, leads & cancellations"
            action={<button className="text-muted-foreground hover:text-foreground p-1 rounded"><MoreHorizontal size={15} /></button>}
          />
          <ResponsiveContainer width="100%" height={240} minWidth={1} minHeight={1}>
            <LineChart data={salesTrend} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle.contentStyle} />
              <Legend iconType="circle" iconSize={7} wrapperStyle={{ fontSize: 11, paddingTop: 12 }} />
              <Line type="monotone" dataKey="bookings" name="Bookings" stroke="#1B3A6B" strokeWidth={2.5} dot={false} activeDot={{ r: 5, fill: "#1B3A6B" }} />
              <Line type="monotone" dataKey="leads" name="Leads" stroke="#C9922A" strokeWidth={2} strokeDasharray="5 3" dot={false} activeDot={{ r: 5, fill: "#C9922A" }} />
              <Line type="monotone" dataKey="cancellations" name="Cancellations" stroke="#DC2626" strokeWidth={1.5} dot={false} activeDot={{ r: 4, fill: "#DC2626" }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ─ Construction Progress ─ */}
      <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
        <SectionHeader
          title="Construction Progress"
          sub="Live status across all active projects"
          action={
            <button className="flex items-center gap-1.5 text-xs text-primary font-semibold hover:underline">
              View detailed timeline <ArrowUpRight size={12} />
            </button>
          }
        />
        <div className="space-y-0 divide-y divide-border">
          {constructionProjects.map(p => (
            <div key={p.name} className="py-3.5 flex items-center gap-4">
              {/* Project info */}
              <div className="w-40 flex-shrink-0">
                <p className="text-sm font-semibold text-foreground">{p.name}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5 truncate">{p.phase}</p>
              </div>

              {/* Progress bar */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] text-muted-foreground">{p.progress}% complete</span>
                  <span className="text-[10px] text-muted-foreground">Target: {p.target}</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className={`h-full ${p.color} rounded-full transition-all duration-700`} style={{ width: `${p.progress}%` }} />
                </div>
              </div>

              {/* Budget */}
              <div className="hidden lg:block w-36 flex-shrink-0 text-right">
                <p className="text-xs font-semibold text-foreground">{p.spent} <span className="text-muted-foreground font-normal">/ {p.budget}</span></p>
                <div className="h-1 bg-muted rounded-full overflow-hidden mt-1">
                  <div
                    className="h-full bg-secondary rounded-full"
                    style={{ width: `${Math.round((parseFloat(p.spent.replace(/[₹Cr]/g, "")) / parseFloat(p.budget.replace(/[₹Cr]/g, ""))) * 100)}%` }}
                  />
                </div>
              </div>

              <Badge status={p.status} />
            </div>
          ))}
        </div>
      </div>

      {/* ─ Recent Bookings Table ─ */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-3.5 border-b border-border">
          <div>
            <h3 className="text-foreground">Recent Bookings</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Latest unit bookings across all projects</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-muted p-1 rounded-lg">
              {["All", "Active", "Completed", "Pending"].map(tab => (
                <button key={tab} onClick={() => setBookingsTab(tab)}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${bookingsTab === tab ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>
                  {tab}
                </button>
              ))}
            </div>
            <button className="flex items-center gap-1.5 border border-border text-xs font-medium px-2.5 py-1.5 rounded-lg hover:bg-muted transition-colors text-foreground">
              <Download size={12} /> CSV
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                {["Booking ID", "Customer", "Unit", "Project", "Type", "Amount", "Status", "Date", ""].map(h => (
                  <th key={h} className="px-4 py-2.5 text-left text-[10px] font-bold text-muted-foreground uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {recentBookings.map(row => (
                <tr key={row.id} className="hover:bg-muted/30 transition-colors group">
                  <td className="px-4 py-3"><span className="text-xs font-bold text-primary font-mono">{row.id}</span></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-[9px] font-bold text-primary">{row.customer.split(" ").map(n => n[0]).join("")}</span>
                      </div>
                      <span className="text-sm font-medium text-foreground whitespace-nowrap">{row.customer}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3"><span className="text-sm font-mono font-semibold text-foreground">{row.unit}</span></td>
                  <td className="px-4 py-3"><span className="text-sm text-foreground whitespace-nowrap">{row.project}</span></td>
                  <td className="px-4 py-3">
                    <span className="text-[11px] font-semibold text-muted-foreground bg-muted px-2 py-1 rounded-lg">{row.type}</span>
                  </td>
                  <td className="px-4 py-3"><span className="text-sm font-bold text-foreground whitespace-nowrap">{row.amount}</span></td>
                  <td className="px-4 py-3"><Badge status={row.status} /></td>
                  <td className="px-4 py-3"><span className="text-xs text-muted-foreground whitespace-nowrap">{row.date}</span></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="w-6 h-6 rounded flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground"><Eye size={12} /></button>
                      <button className="w-6 h-6 rounded flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground"><MoreHorizontal size={12} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between px-5 py-3 border-t border-border bg-muted/20">
          <p className="text-xs text-muted-foreground">Showing <span className="font-semibold text-foreground">1–8</span> of <span className="font-semibold text-foreground">284</span> bookings</p>
          <button className="flex items-center gap-1.5 text-xs text-primary font-semibold hover:underline">View all bookings <ArrowUpRight size={12} /></button>
        </div>
      </div>

      {/* ─ Overdue + RERA Bottom Row ─ */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">

        {/* Overdue Payments */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-border">
            <div>
              <h3 className="text-foreground flex items-center gap-2">
                Overdue Payments
                <span className="text-[10px] bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400 font-bold px-2 py-0.5 rounded-full border border-red-200 dark:border-red-900/40">
                  {overduePayments.length} accounts
                </span>
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">₹8.4 Cr total outstanding</p>
            </div>
            <button className="flex items-center gap-1.5 text-xs text-primary font-semibold hover:underline">
              Send Bulk Reminder <ArrowUpRight size={12} />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  {["Customer", "Unit / Project", "Amount Due", "Overdue", ""].map(h => (
                    <th key={h} className="px-4 py-2.5 text-left text-[10px] font-bold text-muted-foreground uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {overduePayments.map(row => (
                  <tr key={row.customer} className="hover:bg-muted/30 transition-colors group">
                    <td className="px-4 py-3">
                      <p className="text-sm font-semibold text-foreground whitespace-nowrap">{row.customer}</p>
                      <p className="text-[10px] text-muted-foreground">{row.mobile}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm font-mono font-semibold text-foreground">{row.unit}</p>
                      <p className="text-[10px] text-muted-foreground truncate max-w-[120px]">{row.project}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm font-bold text-red-500">{row.due}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-bold px-2 py-1 rounded-full ${row.days > 60 ? "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400" : row.days > 30 ? "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400" : "bg-yellow-100 text-yellow-700 dark:bg-yellow-950/40 dark:text-yellow-400"}`}>
                        {row.days}d overdue
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="text-[10px] font-semibold text-primary hover:underline whitespace-nowrap px-2 py-1 rounded hover:bg-muted">Send Reminder</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* RERA Alerts + Activity */}
        <div className="flex flex-col gap-4">
          {/* RERA Alerts */}
          <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm flex-1">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-border">
              <div>
                <h3 className="text-foreground flex items-center gap-2">
                  RERA Expiry Alerts
                  <span className="text-[10px] bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400 font-bold px-2 py-0.5 rounded-full border border-red-200 dark:border-red-900/40">
                    3 critical
                  </span>
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">RERA registration expiry tracker</p>
              </div>
              <button className="text-xs text-primary font-semibold hover:underline flex items-center gap-1">All <ArrowUpRight size={11} /></button>
            </div>
            <div className="divide-y divide-border">
              {reraAlerts.map(row => (
                <div key={row.project} className="flex items-center gap-3 px-5 py-3 hover:bg-muted/30 transition-colors group">
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${row.status === "Critical" ? "bg-red-500 animate-pulse" : row.status === "Expiring Soon" ? "bg-amber-500" : "bg-green-500"}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground">{row.project}</p>
                    <p className="text-[10px] text-muted-foreground truncate font-mono">{row.reraNo.slice(0, 28)}…</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs font-semibold text-foreground">{row.expiry}</p>
                    <p className={`text-[10px] font-bold ${row.daysLeft < 20 ? "text-red-500" : row.daysLeft < 90 ? "text-amber-500" : "text-muted-foreground"}`}>
                      {row.daysLeft}d left
                    </p>
                  </div>
                  <Badge status={row.status} />
                  <button className="opacity-0 group-hover:opacity-100 text-[10px] font-semibold text-primary hover:underline whitespace-nowrap transition-opacity ml-1">Renew</button>
                </div>
              ))}
            </div>
          </div>

          {/* Activity Feed */}
          <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
            <SectionHeader
              title="Recent Activity"
              sub="Platform-wide event log"
              action={<button className="text-xs text-primary font-semibold hover:underline flex items-center gap-1">Full log <ArrowUpRight size={11} /></button>}
            />
            <div className="space-y-0">
              {activities.slice(0, 5).map((a, i) => (
                <div key={i} className="flex gap-3 py-2.5 border-b border-border/60 last:border-0">
                  <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center flex-shrink-0 mt-0.5">{a.icon}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-foreground leading-snug">{a.text}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{a.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

// ─── Main Export ─────────────────────────────────────────────────────────────
export function SuperAdminDashboard({ isDark, onDarkToggle }: { isDark: boolean; onDarkToggle: () => void }) {
  const [activeItem, setActiveItem] = useState("Dashboard");
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [tenant, setTenant] = useState("SHG Central");

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <AdminSidebar
        activeItem={activeItem}
        onItemSelect={item => { setActiveItem(item); setMobileOpen(false); }}
        collapsed={collapsed}
        isMobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
        activeTenant={tenant}
        onTenantChange={setTenant}
      />

      <div className="flex-1 flex flex-col min-h-screen min-w-0 overflow-hidden">
        <AdminNavbar
          onMenuToggle={() => setMobileOpen(o => !o)}
          isDark={isDark}
          onDarkToggle={onDarkToggle}
          onCollapse={() => setCollapsed(c => !c)}
          collapsed={collapsed}
        />

        <main className="flex-1 overflow-y-auto bg-background pb-10">
          {activeItem === "Dashboard" ? (
            <DashboardContent />
          ) : activeItem === "All Projects" || activeItem === "Add Project" || activeItem === "Projects" ? (
            <ProjectManagementModule 
              isDark={isDark} 
              onDarkToggle={onDarkToggle} 
              initialView={activeItem === "Add Project" ? "create" : "listing"}
              tenantId={tenant === "Hari Heights Division" ? "hariheights" : tenant === "Green Valley Projects" ? "kmb-002" : "shg-001"} 
            />
          ) : (
            /* Placeholder for other sections */
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
              <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4 text-muted-foreground">
                <Activity size={28} />
              </div>
              <h3 className="text-foreground mb-1">{activeItem}</h3>
              <p className="text-sm text-muted-foreground max-w-sm">
                The <strong>{activeItem}</strong> module is part of the full ERP. Click <strong>Dashboard</strong> in the sidebar to return to the overview.
              </p>
              <button onClick={() => setActiveItem("Dashboard")} className="mt-4 flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-xl text-sm font-semibold hover:opacity-90 transition-all shadow-sm">
                Go to Dashboard
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
