import {
  FileSearch, Users, BarChart3, Building2, Inbox, SearchX,
  LayoutDashboard, IndianRupee, HardHat, ClipboardList,
  Bell, Settings, Home, Plus, ArrowRight, Wifi, WifiOff
} from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

function EmptyState({
  icon,
  title,
  description,
  action,
  actionLabel,
  size = "md",
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: () => void;
  actionLabel?: string;
  size?: "sm" | "md" | "lg";
}) {
  const sizes = {
    sm: { wrap: "py-8", icon: "w-10 h-10", text: "text-sm" },
    md: { wrap: "py-12", icon: "w-14 h-14", text: "text-sm" },
    lg: { wrap: "py-16", icon: "w-20 h-20", text: "text-base" },
  };
  const s = sizes[size];

  return (
    <div className={`flex flex-col items-center text-center ${s.wrap}`}>
      <div className={`${s.icon} rounded-2xl bg-muted flex items-center justify-center mb-4 text-muted-foreground`}>
        {icon}
      </div>
      <h4 className="text-foreground mb-1.5">{title}</h4>
      <p className={`${s.text} text-muted-foreground max-w-xs leading-relaxed`}>{description}</p>
      {action && actionLabel && (
        <Button
          onClick={action}
          className="mt-5"
        >
          <Plus size={15} className="mr-2" /> {actionLabel}
        </Button>
      )}
    </div>
  );
}

const navItems = [
  { icon: <LayoutDashboard size={20} />, label: "Dashboard", active: true },
  { icon: <Building2 size={20} />, label: "Projects" },
  { icon: <IndianRupee size={20} />, label: "Finance" },
  { icon: <HardHat size={20} />, label: "Construction" },
  { icon: <Bell size={20} />, label: "Alerts", badge: "9" },
  { icon: <Settings size={20} />, label: "Settings" },
];

const bottomNavItems = [
  { icon: <Home size={20} />, label: "Home", active: true },
  { icon: <Building2 size={20} />, label: "Projects" },
  { icon: <IndianRupee size={20} />, label: "Finance" },
  { icon: <Bell size={20} />, label: "Alerts", badge: "9" },
  { icon: <Settings size={20} />, label: "More" },
];

export function EmptyNavSection() {
  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-foreground">Empty States & Navigation</h1>
        <p className="text-sm text-muted-foreground mt-1">Placeholder screens and mobile navigation components</p>
      </div>

      {/* Empty States */}
      <section>
        <h3 className="text-foreground mb-4">Empty States</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {/* No Data */}
          <Card className="gap-0 p-0 overflow-hidden shadow-sm">
            <div className="px-4 py-3 border-b border-border bg-muted/30">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">No Data</p>
            </div>
            <EmptyState
              icon={<BarChart3 size={24} />}
              title="No reports yet"
              description="Reports will appear here once you have recorded transactions."
              size="sm"
            />
          </Card>

          {/* No Results */}
          <Card className="gap-0 p-0 overflow-hidden shadow-sm">
            <div className="px-4 py-3 border-b border-border bg-muted/30">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">No Search Results</p>
            </div>
            <div className="flex flex-col items-center text-center py-10">
              <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center mb-3 text-muted-foreground">
                <SearchX size={22} />
              </div>
              <h4 className="text-foreground mb-1">No results found</h4>
              <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
                No matches for <strong className="text-foreground">"Tower C"</strong>. Try a different search term.
              </p>
              <Button variant="link" className="mt-4 gap-1 text-primary">
                Clear search <ArrowRight size={13} />
              </Button>
            </div>
          </Card>

          {/* No Leads */}
          <Card className="gap-0 p-0 overflow-hidden shadow-sm">
            <div className="px-4 py-3 border-b border-border bg-muted/30">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">No Leads</p>
            </div>
            <EmptyState
              icon={<Users size={24} />}
              title="No leads captured"
              description="Start adding customer leads to grow your sales pipeline."
              actionLabel="Add First Lead"
              action={() => {}}
              size="sm"
            />
          </Card>

          {/* No Notifications */}
          <Card className="gap-0 p-0 overflow-hidden shadow-sm">
            <div className="px-4 py-3 border-b border-border bg-muted/30">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">All Clear</p>
            </div>
            <div className="flex flex-col items-center text-center py-10">
              <div className="w-12 h-12 rounded-full bg-green-50 dark:bg-green-950/30 flex items-center justify-center mb-3">
                <Bell size={22} className="text-success" />
              </div>
              <h4 className="text-foreground mb-1">All caught up!</h4>
              <p className="text-sm text-muted-foreground">No new notifications at this time.</p>
            </div>
          </Card>

          {/* Error state */}
          <Card className="gap-0 p-0 overflow-hidden shadow-sm">
            <div className="px-4 py-3 border-b border-border bg-muted/30">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Connection Error</p>
            </div>
            <div className="flex flex-col items-center text-center py-10">
              <div className="w-12 h-12 rounded-2xl bg-red-50 dark:bg-red-950/30 flex items-center justify-center mb-3">
                <WifiOff size={22} className="text-destructive" />
              </div>
              <h4 className="text-foreground mb-1">Connection lost</h4>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
                Unable to connect to the server. Check your internet connection.
              </p>
              <Button variant="outline" className="mt-4 text-destructive border-destructive/30 hover:bg-destructive/10">
                Retry
              </Button>
            </div>
          </Card>

          {/* No projects */}
          <Card className="gap-0 p-0 overflow-hidden shadow-sm">
            <div className="px-4 py-3 border-b border-border bg-muted/30">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">First Project</p>
            </div>
            <EmptyState
              icon={<Building2 size={24} />}
              title="No projects yet"
              description="Create your first real estate project to get started with SHG ERP."
              actionLabel="Create Project"
              action={() => {}}
              size="sm"
            />
          </Card>
        </div>
      </section>

      {/* Mobile Bottom Navigation */}
      <section>
        <h3 className="text-foreground mb-4">Mobile Bottom Navigation</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Light mode preview */}
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Light Mode</p>
            <div className="bg-white border border-border rounded-2xl overflow-hidden shadow-xl max-w-sm mx-auto">
              {/* Phone screen */}
              <div className="bg-[#F4F6FA] min-h-52 p-4 relative">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-[10px] font-semibold text-[#64748B] uppercase tracking-wide">Good morning</p>
                    <p className="text-sm font-bold text-[#1E293B]">Ramesh Kumar</p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-[#1B3A6B] flex items-center justify-center">
                    <span className="text-white text-[10px] font-bold">RK</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 mb-3">
                  {[
                    { label: "Revenue", val: "₹24.8Cr" },
                    { label: "Bookings", val: "142" },
                  ].map(s => (
                    <div key={s.label} className="bg-white rounded-xl p-3 shadow-sm">
                      <p className="text-[10px] text-[#64748B]">{s.label}</p>
                      <p className="text-sm font-bold text-[#1E293B]">{s.val}</p>
                    </div>
                  ))}
                </div>
                <div className="bg-white rounded-xl p-3 shadow-sm">
                  <p className="text-[10px] font-semibold text-[#64748B] uppercase tracking-wide mb-2">Recent</p>
                  {["Booking B-204 confirmed", "Payment ₹8.5L received"].map(item => (
                    <p key={item} className="text-[11px] text-[#1E293B] py-1 border-b border-[#E2E8F0] last:border-0">{item}</p>
                  ))}
                </div>
              </div>

              {/* Bottom nav bar */}
              <div className="bg-white border-t border-[#E2E8F0] flex items-center px-2 py-2 safe-area-inset-bottom">
                {bottomNavItems.map(item => (
                  <button key={item.label} className="flex-1 flex flex-col items-center gap-1 py-1 relative">
                    <div className={`w-10 h-7 flex items-center justify-center rounded-full transition-all ${item.active ? "bg-[#EEF3FF]" : ""}`}>
                      <span className={item.active ? "text-[#1B3A6B]" : "text-[#94A3B8]"}>{item.icon}</span>
                      {item.badge && (
                        <span className="absolute top-0 right-2 w-4 h-4 bg-[#DC2626] text-white text-[8px] font-bold rounded-full flex items-center justify-center">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <span className={`text-[9px] font-semibold ${item.active ? "text-[#1B3A6B]" : "text-[#94A3B8]"}`}>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Dark mode preview */}
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Dark Mode</p>
            <div className="bg-[#0D1523] border border-[#1E3352] rounded-2xl overflow-hidden shadow-xl max-w-sm mx-auto">
              {/* Phone screen */}
              <div className="min-h-52 p-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-[10px] font-semibold text-[#94A3B8] uppercase tracking-wide">Good morning</p>
                    <p className="text-sm font-bold text-[#E2E8F0]">Ramesh Kumar</p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-[#4A7FD4] flex items-center justify-center">
                    <span className="text-white text-[10px] font-bold">RK</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 mb-3">
                  {[
                    { label: "Revenue", val: "₹24.8Cr" },
                    { label: "Bookings", val: "142" },
                  ].map(s => (
                    <div key={s.label} className="bg-[#1A2B44] border border-[#1E3352] rounded-xl p-3">
                      <p className="text-[10px] text-[#94A3B8]">{s.label}</p>
                      <p className="text-sm font-bold text-[#E2E8F0]">{s.val}</p>
                    </div>
                  ))}
                </div>
                <div className="bg-[#1A2B44] border border-[#1E3352] rounded-xl p-3">
                  <p className="text-[10px] font-semibold text-[#94A3B8] uppercase tracking-wide mb-2">Recent</p>
                  {["Booking B-204 confirmed", "Payment ₹8.5L received"].map(item => (
                    <p key={item} className="text-[11px] text-[#E2E8F0] py-1 border-b border-[#1E3352] last:border-0">{item}</p>
                  ))}
                </div>
              </div>

              {/* Bottom nav bar */}
              <div className="bg-[#0F1F3D] border-t border-[#1E3352] flex items-center px-2 py-2">
                {bottomNavItems.map(item => (
                  <button key={item.label} className="flex-1 flex flex-col items-center gap-1 py-1 relative">
                    <div className={`w-10 h-7 flex items-center justify-center rounded-full transition-all ${item.active ? "bg-[#1E3352]" : ""}`}>
                      <span className={item.active ? "text-[#4A7FD4]" : "text-[#475569]"}>{item.icon}</span>
                      {item.badge && (
                        <span className="absolute top-0 right-2 w-4 h-4 bg-[#EF4444] text-white text-[8px] font-bold rounded-full flex items-center justify-center">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <span className={`text-[9px] font-semibold ${item.active ? "text-[#4A7FD4]" : "text-[#475569]"}`}>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skeleton / Loading States */}
      <section>
        <h3 className="text-foreground mb-4">Loading Skeletons</h3>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {/* Card skeleton */}
          <Card className="gap-4 p-5 shadow-sm">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Card Skeleton</p>
            <div className="flex items-center gap-3">
              <Skeleton className="w-10 h-10 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-3 w-3/4" />
                <Skeleton className="h-2.5 w-1/2" />
              </div>
            </div>
            <div className="space-y-2">
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-5/6" />
              <Skeleton className="h-3 w-4/6" />
            </div>
            <div className="flex gap-2 pt-2">
              <Skeleton className="h-8 flex-1" />
              <Skeleton className="h-8 w-20" />
            </div>
          </Card>

          {/* Table skeleton */}
          <Card className="gap-0 p-0 overflow-hidden shadow-sm">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide px-5 py-3 border-b border-border bg-muted/30">Table Skeleton</p>
            <div className="divide-y divide-border">
              {[1, 2, 3, 4].map(row => (
                <div key={row} className="flex items-center gap-4 px-5 py-3.5">
                  <Skeleton className="w-4 h-4" />
                  <div className="flex-1 flex items-center gap-3">
                    <Skeleton className="w-7 h-7 rounded-full" />
                    <div className="flex-1 space-y-1.5">
                      <Skeleton className="h-2.5 w-32" />
                      <Skeleton className="h-2 w-20" />
                    </div>
                  </div>
                  <Skeleton className="h-2.5 w-20" />
                  <Skeleton className="h-6 w-16 rounded-full" />
                </div>
              ))}
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}
