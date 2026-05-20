import { useState } from "react";
import {
  LayoutDashboard, Building2, Users, FileText, BarChart3,
  Settings, ChevronDown, ChevronRight, IndianRupee, HardHat,
  MapPin, ClipboardList, Wrench, Bell, LogOut, X, Layers
} from "lucide-react";

interface NavItem {
  icon: React.ReactNode;
  label: string;
  children?: { label: string; badge?: string }[];
  badge?: string;
}

const navGroups: { title: string; items: NavItem[] }[] = [
  {
    title: "Main",
    items: [
      { icon: <LayoutDashboard size={16} />, label: "Dashboard" },
      { icon: <Building2 size={16} />, label: "Projects", children: [{ label: "All Projects" }, { label: "Site Map" }, { label: "Phases & Wings" }] },
      { icon: <Layers size={16} />, label: "Units & Inventory", children: [{ label: "Unit Listing" }, { label: "Floor Plans" }, { label: "Availability" }] },
    ],
  },
  {
    title: "Sales & CRM",
    items: [
      { icon: <Users size={16} />, label: "Customers & Leads", children: [{ label: "All Leads" }, { label: "Pipeline" }, { label: "Customers" }] },
      { icon: <IndianRupee size={16} />, label: "Bookings & Sales", children: [{ label: "Bookings" }, { label: "Agreements" }, { label: "Cancellations" }] },
      { icon: <FileText size={16} />, label: "Demand & Collection", badge: "3", children: [{ label: "Payment Schedule" }, { label: "Receipts" }, { label: "Outstanding" }] },
    ],
  },
  {
    title: "Construction",
    items: [
      { icon: <HardHat size={16} />, label: "Progress Tracking" },
      { icon: <Wrench size={16} />, label: "Contractors", children: [{ label: "Contractor List" }, { label: "Work Orders" }, { label: "Payments" }] },
      { icon: <MapPin size={16} />, label: "Site Management" },
    ],
  },
  {
    title: "Finance",
    items: [
      { icon: <ClipboardList size={16} />, label: "Accounts", children: [{ label: "Ledger" }, { label: "JV Entries" }, { label: "Bank Reco" }] },
      { icon: <BarChart3 size={16} />, label: "Reports", children: [{ label: "MIS Reports" }, { label: "P&L Statement" }, { label: "Cash Flow" }] },
    ],
  },
  {
    title: "System",
    items: [
      { icon: <Bell size={16} />, label: "Notifications", badge: "9" },
      { icon: <Settings size={16} />, label: "Settings" },
    ],
  },
];

interface SidebarProps {
  activeSection: string;
  onSectionChange: (s: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ activeSection, onSectionChange, isOpen, onClose }: SidebarProps) {
  const [expanded, setExpanded] = useState<string[]>(["Projects", "Dashboard"]);

  const toggle = (label: string) => {
    setExpanded(prev =>
      prev.includes(label) ? prev.filter(l => l !== label) : [...prev, label]
    );
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed lg:relative inset-y-0 left-0 z-40 lg:z-auto
          flex flex-col w-64 min-h-screen
          bg-[var(--sidebar)] text-[var(--sidebar-foreground)]
          transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          shadow-2xl lg:shadow-none flex-shrink-0
        `}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-[var(--sidebar-border)]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[var(--shg-gold-600)] flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs font-bold tracking-tight">SHG</span>
            </div>
            <div>
              <p className="text-white text-sm font-semibold leading-none">Shri Hari Group</p>
              <p className="text-[var(--sidebar-foreground)]/50 text-[10px] leading-none mt-0.5">Real Estate ERP</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden text-white/60 hover:text-white p-1 rounded"
          >
            <X size={16} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-2 px-2">
          {navGroups.map(group => (
            <div key={group.title} className="mb-1">
              <p className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-[var(--sidebar-foreground)]/40">
                {group.title}
              </p>
              {group.items.map(item => (
                <div key={item.label}>
                  <button
                    onClick={() => {
                      if (item.children) {
                        toggle(item.label);
                      } else {
                        onSectionChange(item.label);
                      }
                    }}
                    className={`
                      w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-sm
                      transition-all duration-150 group mb-0.5
                      ${activeSection === item.label && !item.children
                        ? "bg-white/12 text-white font-medium"
                        : "text-[var(--sidebar-foreground)]/70 hover:bg-[var(--sidebar-accent)] hover:text-white"
                      }
                    `}
                  >
                    <span className={`flex-shrink-0 transition-colors ${activeSection === item.label ? "text-[var(--shg-gold-400)]" : "text-[var(--sidebar-foreground)]/50 group-hover:text-[var(--shg-gold-400)]"}`}>
                      {item.icon}
                    </span>
                    <span className="flex-1 text-left truncate">{item.label}</span>
                    {item.badge && (
                      <span className="bg-[var(--shg-gold-600)] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none">
                        {item.badge}
                      </span>
                    )}
                    {item.children && (
                      <span className="text-[var(--sidebar-foreground)]/40 transition-transform duration-200"
                        style={{ transform: expanded.includes(item.label) ? "rotate(90deg)" : "none" }}>
                        <ChevronRight size={13} />
                      </span>
                    )}
                  </button>
                  {item.children && expanded.includes(item.label) && (
                    <div className="ml-5 pl-3 border-l border-[var(--sidebar-border)] mb-1">
                      {item.children.map(child => (
                        <button
                          key={child.label}
                          onClick={() => onSectionChange(child.label)}
                          className={`
                            w-full flex items-center justify-between px-2 py-1.5 rounded text-xs
                            transition-colors duration-150 mb-0.5
                            ${activeSection === child.label
                              ? "text-[var(--shg-gold-400)] font-medium"
                              : "text-[var(--sidebar-foreground)]/55 hover:text-white"
                            }
                          `}
                        >
                          {child.label}
                          {child.badge && (
                            <span className="bg-destructive text-white text-[9px] font-bold px-1 py-0.5 rounded-full">
                              {child.badge}
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}
        </nav>

        {/* User footer */}
        <div className="border-t border-[var(--sidebar-border)] p-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[var(--shg-gold-700)] flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs font-bold">RK</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-xs font-medium truncate">Ramesh Kumar</p>
              <p className="text-[var(--sidebar-foreground)]/40 text-[10px] truncate">Super Admin</p>
            </div>
            <button className="text-[var(--sidebar-foreground)]/40 hover:text-red-400 transition-colors p-1">
              <LogOut size={14} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
