import { ReactNode, useState } from "react";
import { Menu, Sun, Moon } from "lucide-react";

export type NavItem = {
  id: string;
  label: string;
  icon: any;
  badge?: ReactNode;
};

export type NavGroup = {
  label?: string;
  items: NavItem[];
};

interface DashboardLayoutProps {
  title: string;
  subtitle: string;
  logoIcon: ReactNode;
  navGroups: NavGroup[];
  activeNav: string;
  onNavChange: (id: string) => void;
  headerContent?: ReactNode;
  topbarExtra?: ReactNode;
  isDark: boolean;
  onDarkToggle: () => void;
  children: ReactNode;
  sidebarTheme?: "dark" | "card"; // dark for Inventory, card for Accounting
  version?: string;
}

export function DashboardLayout({
  title,
  subtitle,
  logoIcon,
  navGroups,
  activeNav,
  onNavChange,
  headerContent,
  topbarExtra,
  isDark,
  onDarkToggle,
  children,
  sidebarTheme = "card",
  version = "v1.0.0",
}: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const activeLabel = navGroups.flatMap(g => g.items).find(i => i.id === activeNav)?.label ?? "";

  const isSidebarDark = sidebarTheme === "dark";
  const sidebarClasses = isSidebarDark
    ? "bg-[#0F1923] border-white/8 text-white"
    : "bg-card border-border text-foreground";
  
  const textMutedClasses = isSidebarDark ? "text-white/50 hover:text-white/80 hover:bg-white/6" : "text-muted-foreground hover:bg-muted/40 hover:text-foreground";
  const textMutedStatic = isSidebarDark ? "text-white/25" : "text-muted-foreground";
  const borderClasses = isSidebarDark ? "border-white/8" : "border-border";

  return (
    <div className="flex h-full bg-background overflow-hidden relative" style={{ height: "calc(100vh - 105px)" }}>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:relative inset-y-0 left-0 z-40 lg:z-auto
        w-60 flex flex-col border-r shrink-0
        transition-transform duration-200
        ${sidebarClasses}
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}>
        {/* Company block */}
        <div className={`px-4 py-4 border-b ${borderClasses}`}>
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${isSidebarDark ? "bg-orange-500" : "bg-primary"}`}>
              {logoIcon}
            </div>
            <div className="min-w-0">
              <p className={`text-xs font-black truncate ${isSidebarDark ? "text-white" : "text-foreground"}`}>{title}</p>
              <p className={`text-[9px] font-mono truncate ${isSidebarDark ? "text-white/40" : "text-muted-foreground"}`}>{subtitle}</p>
            </div>
          </div>

          {/* Header custom content (like Site/FY selector) */}
          {headerContent && (
            <div className="mt-3">
              {headerContent}
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-3 space-y-4">
          {navGroups.map((group, gIdx) => (
            <div key={gIdx}>
              {group.label && (
                <p className={`px-4 pb-1 text-[9px] font-black uppercase tracking-widest ${textMutedStatic}`}>
                  {group.label}
                </p>
              )}
              {group.items.map(item => {
                const Icon = item.icon;
                const active = activeNav === item.id;
                
                const activeClasses = isSidebarDark 
                  ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20" 
                  : "bg-primary text-white shadow-sm";

                return (
                  <button
                    key={item.id}
                    onClick={() => { onNavChange(item.id); setSidebarOpen(false); }}
                    className={`w-full flex items-center justify-between px-3 py-2 mx-1 rounded-xl transition-all text-left mb-0.5 ${
                      active ? activeClasses : textMutedClasses
                    }`}
                    style={{ width: "calc(100% - 8px)" }}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon size={14} />
                      <span className="text-xs font-semibold">{item.label}</span>
                    </div>
                    {item.badge}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Dark mode toggle */}
        <div className={`px-4 py-3 border-t ${borderClasses}`}>
          <button
            onClick={onDarkToggle}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl border transition-colors ${
              isSidebarDark 
                ? "bg-white/5 border-white/8 hover:bg-white/8" 
                : "border-border hover:bg-muted/40"
            }`}
          >
            <span className={`text-[11px] font-semibold ${isSidebarDark ? "text-white/50" : "text-foreground"}`}>
              {isDark ? "Dark Mode" : "Light Mode"}
            </span>
            {isDark ? <Moon size={12} className={isSidebarDark ? "text-blue-400" : "text-primary"} /> : <Sun size={12} className={isSidebarDark ? "text-yellow-400" : "text-warning"} />}
          </button>
          <p className={`text-center text-[9px] mt-2 font-mono ${isSidebarDark ? "text-white/20" : "text-muted-foreground/50"}`}>{version}</p>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-background relative z-0">
        {/* Top bar */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-card shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-1.5 rounded-lg hover:bg-muted/40 text-muted-foreground"
          >
            <Menu size={16} />
          </button>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-black text-foreground">{activeLabel}</p>
          </div>
          {topbarExtra}
        </div>

        {/* View content */}
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
