import { useState } from "react";
import {
  Home, Grid3X3, BookOpen, UserCheck, FileText,
  Moon, Sun, Bell, ChevronRight, BarChart3, TrendingUp
} from "lucide-react";
import { FlatInventoryGrid } from "./FlatInventoryGrid";
import { FlatDetails } from "./FlatDetails";
import { FlatBooking } from "./FlatBooking";
import { FlatAvailabilityMap } from "./FlatAvailabilityMap";
import { OwnerAssignment } from "./OwnerAssignment";
import { FlatDocuments } from "./FlatDocuments";
import { mockFlats, statusConfig, fmt } from "./flatData";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer
} from "recharts";

export type FlatView = "inventory" | "details" | "booking" | "availability-map" | "owner-assignment" | "documents";

interface FlatManagementModuleProps {
  isDark: boolean;
  onDarkToggle: () => void;
}

const navItems: { view: FlatView; icon: typeof Home; label: string; desc: string }[] = [
  { view: "inventory",         icon: Home,      label: "Flat Inventory",    desc: "All units & filters" },
  { view: "availability-map",  icon: Grid3X3,   label: "Floor Plan Map",    desc: "Visual floor layout" },
  { view: "booking",           icon: BookOpen,  label: "New Booking",       desc: "Book a flat" },
  { view: "owner-assignment",  icon: UserCheck, label: "Owner Assignment",  desc: "Assign buyers" },
  { view: "documents",         icon: FileText,  label: "Documents",         desc: "Upload & manage docs" },
];

const wings = ["A", "B", "C", "D"];

export function FlatManagementModule({ isDark, onDarkToggle }: FlatManagementModuleProps) {
  const [currentView, setCurrentView] = useState<FlatView>("inventory");
  const [selectedFlatId, setSelectedFlatId] = useState<string | null>(null);

  const navigateTo = (view: FlatView, flatId?: string) => {
    setCurrentView(view);
    if (flatId !== undefined) setSelectedFlatId(flatId);
  };

  const wingData = wings.map(w => {
    const wf = mockFlats.filter(f => f.wing === w);
    return {
      wing: `Wing ${w}`,
      Available: wf.filter(f => f.status === "Available").length,
      Booked: wf.filter(f => f.status === "Booked").length,
      Sold: wf.filter(f => f.status === "Sold").length,
      Registered: wf.filter(f => f.status === "Registered").length,
    };
  });

  const totalAvailable = mockFlats.filter(f => f.status === "Available").length;
  const totalRevenue = mockFlats
    .filter(f => ["Booked", "Sold", "Registered"].includes(f.status))
    .reduce((sum, f) => sum + f.basePrice, 0);

  const breadcrumb = () => {
    const selectedFlat = selectedFlatId ? mockFlats.find(f => f.id === selectedFlatId) : null;
    return (
      <div className="flex items-center gap-1.5 text-sm flex-wrap">
        <span className="text-muted-foreground">Flat Management</span>
        <ChevronRight size={13} className="text-muted-foreground" />
        <span className="capitalize font-medium">
          {currentView === "inventory" && "Inventory"}
          {currentView === "availability-map" && "Floor Plan Map"}
          {currentView === "booking" && `Book — ${selectedFlat?.unitNo || "Unit"}`}
          {currentView === "details" && `Unit ${selectedFlat?.unitNo || ""}`}
          {currentView === "owner-assignment" && `Owner — ${selectedFlat?.unitNo || ""}`}
          {currentView === "documents" && `Docs — ${selectedFlat?.unitNo || ""}`}
        </span>
      </div>
    );
  };

  return (
    <div className="flex h-full bg-background overflow-hidden">
      {/* Module Sidebar */}
      <div className="w-64 border-r border-border bg-card flex flex-col hidden md:flex shrink-0">
        {/* Sidebar header */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center shrink-0">
              <Home size={16} className="text-white" />
            </div>
            <div>
              <p className="text-sm font-bold">Flat Management</p>
              <p className="text-[10px] text-muted-foreground">Shri Hari Group ERP</p>
            </div>
          </div>
        </div>

        {/* Quick stats in sidebar */}
        <div className="p-3 border-b border-border space-y-2">
          <div className="bg-success/10 border border-success/20 rounded-lg p-2.5 flex items-center justify-between">
            <div>
              <p className="text-[10px] text-muted-foreground">Available Units</p>
              <p className="text-lg font-bold text-success">{totalAvailable}</p>
            </div>
            <TrendingUp size={18} className="text-success" />
          </div>
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-2.5 flex items-center justify-between">
            <div>
              <p className="text-[10px] text-muted-foreground">Booked Revenue</p>
              <p className="text-sm font-bold text-primary">{fmt(totalRevenue)}</p>
            </div>
            <BarChart3 size={18} className="text-primary" />
          </div>
        </div>

        {/* Mini wing chart */}
        <div className="px-3 pt-3 pb-1">
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-1">Wing Availability</p>
          <div className="h-20">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={wingData} barSize={14} margin={{ top: 0, right: 0, left: -30, bottom: 0 }}>
                <XAxis dataKey="wing" tick={{ fontSize: 9, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 9 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: "var(--card)", borderColor: "var(--border)", borderRadius: 8, fontSize: 10 }}
                  cursor={{ fill: "var(--muted)", opacity: 0.5 }}
                />
                <Bar dataKey="Available" fill="var(--success)" radius={[3, 3, 0, 0]} opacity={0.85} />
                <Bar dataKey="Booked" fill="var(--warning)" radius={[3, 3, 0, 0]} opacity={0.85} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Nav items */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-2 mt-2">Views</p>
          {navItems.map(item => (
            <button
              key={item.view}
              onClick={() => navigateTo(item.view)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-left transition-all ${
                currentView === item.view
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <item.icon size={15} className="shrink-0" />
              <div>
                <p className="leading-none">{item.label}</p>
                <p className="text-[10px] opacity-60 mt-0.5 leading-none">{item.desc}</p>
              </div>
            </button>
          ))}

          {/* Status color legend */}
          <div className="mt-6 pt-4 border-t border-border">
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-2">Status Colors</p>
            {(["Available", "Booked", "Sold", "Registered", "Cancelled"] as const).map(s => (
              <div key={s} className="flex items-center gap-2 px-2 py-1">
                <div className={`w-2.5 h-2.5 rounded-full ${statusConfig[s].dot} shrink-0`} />
                <span className="text-xs text-muted-foreground">{s}</span>
              </div>
            ))}
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Module header */}
        <header className="h-14 border-b border-border bg-card/80 backdrop-blur-md flex items-center justify-between px-4 sm:px-6 shrink-0 z-10">
          {breadcrumb()}
          <div className="flex items-center gap-2">
            <button
              onClick={onDarkToggle}
              className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-muted"
            >
              {isDark ? <Sun size={17} /> : <Moon size={17} />}
            </button>
            <button className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-muted relative">
              <Bell size={17} />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-destructive border border-card" />
            </button>
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-secondary p-[2px]">
              <div className="w-full h-full rounded-full bg-card flex items-center justify-center text-[10px] font-bold">
                AD
              </div>
            </div>
          </div>
        </header>

        {/* Mobile tab bar */}
        <div className="md:hidden flex items-center gap-1 px-3 py-2 border-b border-border bg-card overflow-x-auto scrollbar-none">
          {navItems.map(item => (
            <button
              key={item.view}
              onClick={() => navigateTo(item.view)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all shrink-0 ${
                currentView === item.view
                  ? "bg-primary/10 text-primary border border-primary/30"
                  : "text-muted-foreground hover:bg-muted"
              }`}
            >
              <item.icon size={12} />
              {item.label}
            </button>
          ))}
        </div>

        {/* Scrollable content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="max-w-7xl mx-auto">
            {currentView === "inventory" && (
              <FlatInventoryGrid onNavigate={navigateTo} />
            )}
            {currentView === "details" && selectedFlatId && (
              <FlatDetails flatId={selectedFlatId} onNavigate={navigateTo} />
            )}
            {currentView === "details" && !selectedFlatId && (
              <FlatInventoryGrid onNavigate={navigateTo} />
            )}
            {currentView === "booking" && selectedFlatId && (
              <FlatBooking flatId={selectedFlatId} onNavigate={navigateTo} />
            )}
            {currentView === "booking" && !selectedFlatId && (
              <FlatInventoryGrid onNavigate={navigateTo} />
            )}
            {currentView === "availability-map" && (
              <FlatAvailabilityMap onNavigate={navigateTo} />
            )}
            {currentView === "owner-assignment" && selectedFlatId && (
              <OwnerAssignment flatId={selectedFlatId} onNavigate={navigateTo} />
            )}
            {currentView === "owner-assignment" && !selectedFlatId && (
              <FlatInventoryGrid onNavigate={navigateTo} />
            )}
            {currentView === "documents" && selectedFlatId && (
              <FlatDocuments flatId={selectedFlatId} onNavigate={navigateTo} />
            )}
            {currentView === "documents" && !selectedFlatId && (
              <FlatInventoryGrid onNavigate={navigateTo} />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
