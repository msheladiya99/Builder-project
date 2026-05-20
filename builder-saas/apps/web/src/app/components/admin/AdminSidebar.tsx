import { useState } from "react";
import {
  LayoutDashboard, Building2, TrendingUp, Layers, Users,
  IndianRupee, Package, HardHat, BarChart3, Bell, Settings,
  ChevronRight, ChevronDown, X, Shield, LogOut, Activity,
  FileText, Wrench, BookOpen, GitBranch
} from "lucide-react";

interface NavChild { label: string; badge?: number }
interface NavItem {
  icon: React.ElementType;
  label: string;
  badge?: number;
  children?: NavChild[];
}
interface NavGroup { group: string | null; items: NavItem[] }

const navGroups: NavGroup[] = [
  {
    group: null,
    items: [
      { icon: LayoutDashboard, label: "Dashboard" },
    ],
  },
  {
    group: "Real Estate",
    items: [
      {
        icon: Building2, label: "Projects",
        children: [{ label: "All Projects" }, { label: "Add Project" }, { label: "RERA Management", badge: 3 }],
      },
      {
        icon: TrendingUp, label: "Sales",
        children: [{ label: "Bookings", badge: 8 }, { label: "Pipeline" }, { label: "Agreements" }],
      },
      {
        icon: Layers, label: "Flats",
        children: [{ label: "All Units" }, { label: "Availability" }, { label: "Floor Plans" }],
      },
      {
        icon: Users, label: "Owners",
        children: [{ label: "All Owners" }, { label: "Leads & CRM" }, { label: "Documents" }],
      },
    ],
  },
  {
    group: "Finance",
    items: [
      {
        icon: IndianRupee, label: "Accounts",
        children: [{ label: "Collections" }, { label: "Expenses" }, { label: "Ledger" }, { label: "Bank Reconciliation" }],
      },
    ],
  },
  {
    group: "Operations",
    items: [
      {
        icon: Package, label: "Materials",
        children: [{ label: "Inventory" }, { label: "Purchase Orders" }, { label: "Vendors" }],
      },
      {
        icon: HardHat, label: "Labour",
        children: [{ label: "Workforce" }, { label: "Contractors" }, { label: "Timesheets" }],
      },
    ],
  },
  {
    group: "Analytics & System",
    items: [
      {
        icon: BarChart3, label: "Reports",
        children: [{ label: "MIS Reports" }, { label: "P&L Statement" }, { label: "Cash Flow" }, { label: "RERA Reports" }],
      },
      { icon: Bell, label: "Notifications", badge: 12 },
      {
        icon: Settings, label: "Settings",
        children: [{ label: "Platform Config" }, { label: "Users & Roles" }, { label: "Billing & Plans" }, { label: "Integrations" }],
      },
    ],
  },
];

interface AdminSidebarProps {
  activeItem: string;
  onItemSelect: (item: string) => void;
  collapsed: boolean;
  isMobileOpen: boolean;
  onMobileClose: () => void;
  activeTenant?: string;
  onTenantChange?: (tenant: string) => void;
}

export function AdminSidebar({ activeItem, onItemSelect, collapsed, isMobileOpen, onMobileClose, activeTenant, onTenantChange }: AdminSidebarProps) {
  const [expanded, setExpanded] = useState<string[]>(["Projects", "Sales"]);
  const currentTenant = activeTenant || "SHG Central";

  const toggle = (label: string) =>
    setExpanded(prev => prev.includes(label) ? prev.filter(l => l !== label) : [...prev, label]);

  const tenants = ["SHG Central", "Hari Heights Division", "Green Valley Projects"];

  return (
    <>
      {isMobileOpen && (
        <div className="fixed inset-0 bg-black/60 z-30 lg:hidden backdrop-blur-sm" onClick={onMobileClose} />
      )}

      <aside
        className={`
          fixed lg:relative inset-y-0 left-0 z-40 lg:z-auto flex flex-col
          bg-[#0B1829] border-r border-white/6 text-white min-h-screen
          transition-all duration-300 ease-in-out flex-shrink-0
          ${collapsed ? "w-[68px]" : "w-[248px]"}
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          shadow-2xl shadow-black/40
        `}
      >
        {/* Logo */}
        <div className={`flex items-center border-b border-white/6 h-14 flex-shrink-0 ${collapsed ? "justify-center px-0" : "gap-3 px-4"}`}>
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#C9922A] to-[#E8B64C] flex items-center justify-center flex-shrink-0 shadow-lg shadow-amber-900/40">
            <span className="text-white text-[11px] font-black tracking-tight">SHG</span>
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-white text-[13px] font-bold leading-none truncate">Shri Hari Group</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <Shield size={9} className="text-[#C9922A]" />
                <p className="text-[#C9922A] text-[9px] font-bold uppercase tracking-widest">Super Admin</p>
              </div>
            </div>
          )}
          {isMobileOpen && !collapsed && (
            <button onClick={onMobileClose} className="ml-auto text-white/30 hover:text-white lg:hidden p-1">
              <X size={15} />
            </button>
          )}
        </div>

        {/* Tenant selector */}
        {!collapsed && (
          <div className="px-3 py-2.5 border-b border-white/6">
            <label className="text-[9px] font-bold uppercase tracking-widest text-white/25 block mb-1.5">Active Tenant</label>
            <div className="relative">
              <select
                value={currentTenant}
                onChange={e => onTenantChange?.(e.target.value)}
                className="w-full appearance-none bg-white/6 border border-white/10 rounded-lg px-3 py-2 text-xs text-white/70 outline-none cursor-pointer hover:bg-white/10 transition-colors pr-6"
              >
                {tenants.map(t => <option key={t} value={t} className="bg-[#0B1829] text-white">{t}</option>)}
              </select>
              <ChevronDown size={11} className="absolute right-2 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-2 px-1.5 space-y-0.5">
          {navGroups.map(group => (
            <div key={group.group || "__main"} className="mb-1">
              {group.group && !collapsed && (
                <p className="px-2.5 pt-3 pb-1 text-[9px] font-bold uppercase tracking-[0.15em] text-white/20 select-none">
                  {group.group}
                </p>
              )}
              {group.items.map(item => {
                const isActive = activeItem === item.label;
                const isExpanded = expanded.includes(item.label);
                const Icon = item.icon;

                return (
                  <div key={item.label}>
                    <button
                      onClick={() => item.children ? toggle(item.label) : onItemSelect(item.label)}
                      title={collapsed ? item.label : undefined}
                      className={`
                        w-full flex items-center rounded-lg mb-0.5 group relative
                        transition-all duration-150
                        ${collapsed ? "justify-center py-2.5 px-0" : "gap-2.5 px-2.5 py-2"}
                        ${isActive && !item.children
                          ? "bg-white/10 text-white shadow-sm"
                          : "text-white/50 hover:bg-white/6 hover:text-white"
                        }
                      `}
                    >
                      <span className={`flex-shrink-0 transition-colors ${isActive ? "text-[#C9922A]" : "text-white/35 group-hover:text-[#C9922A]"}`}>
                        <Icon size={15} />
                      </span>
                      {!collapsed && (
                        <>
                          <span className="flex-1 text-left text-[13px] font-medium truncate">{item.label}</span>
                          {item.badge && (
                            <span className="bg-red-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full leading-none min-w-[18px] text-center">
                              {item.badge}
                            </span>
                          )}
                          {item.children && (
                            <ChevronRight size={12} className={`text-white/20 transition-transform duration-200 flex-shrink-0 ${isExpanded ? "rotate-90" : ""}`} />
                          )}
                        </>
                      )}
                      {/* Collapsed badge */}
                      {collapsed && item.badge && (
                        <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-red-500 text-white text-[7px] font-black rounded-full flex items-center justify-center leading-none">
                          {item.badge > 9 ? "9+" : item.badge}
                        </span>
                      )}
                    </button>

                    {/* Sub-items */}
                    {!collapsed && item.children && isExpanded && (
                      <div className="ml-5 pl-2.5 border-l border-white/8 mb-1 space-y-0.5">
                        {item.children.map(child => (
                          <button
                            key={child.label}
                            onClick={() => onItemSelect(child.label)}
                            className={`
                              w-full flex items-center justify-between px-2.5 py-1.5 rounded-md
                              text-[12px] transition-colors duration-150
                              ${activeItem === child.label
                                ? "text-[#C9922A] font-semibold"
                                : "text-white/35 hover:text-white"
                              }
                            `}
                          >
                            <span>{child.label}</span>
                            {child.badge && (
                              <span className="bg-amber-500/80 text-white text-[8px] font-black px-1.5 py-0.5 rounded-full leading-none">
                                {child.badge}
                              </span>
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="border-t border-white/6 flex-shrink-0">
          {!collapsed ? (
            <div className="p-3 space-y-3">
              {/* System status */}
              <div className="flex items-center gap-2 px-1">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] text-white/25">All systems operational</span>
              </div>
              {/* User */}
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#C9922A] to-[#A87520] flex items-center justify-center flex-shrink-0 shadow-md">
                  <span className="text-white text-[11px] font-bold">SA</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-[12px] font-semibold truncate">Ramesh Kumar</p>
                  <p className="text-white/30 text-[10px] truncate">admin@shrihari.in</p>
                </div>
                <button className="text-white/25 hover:text-red-400 transition-colors p-1 rounded flex-shrink-0">
                  <LogOut size={13} />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3 py-3">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#C9922A] to-[#A87520] flex items-center justify-center">
                <span className="text-white text-[9px] font-bold">SA</span>
              </div>
              <button className="text-white/25 hover:text-red-400 transition-colors"><LogOut size={13} /></button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
