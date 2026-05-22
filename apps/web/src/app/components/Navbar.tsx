import { useState } from "react";
import {
  Menu, Search, Bell, Sun, Moon, ChevronDown,
  Building2, Settings, LogOut, User, HelpCircle
} from "lucide-react";
import { useAuthStore } from "../store/store";

interface NavbarProps {
  onMenuToggle: () => void;
  isDark: boolean;
  onDarkToggle: () => void;
  activeSection: string;
}

export function Navbar({ onMenuToggle, isDark, onDarkToggle, activeSection }: NavbarProps) {
  const [searchFocused, setSearchFocused] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const notifications = [
    { id: 1, title: "New booking received", desc: "Unit B-204, Hari Heights", time: "2m ago", dot: "bg-blue-500" },
    { id: 2, title: "Payment overdue", desc: "₹2.4L pending — Suresh Nair", time: "1h ago", dot: "bg-red-500" },
    { id: 3, title: "Construction update", desc: "Phase 2 slab work completed", time: "3h ago", dot: "bg-green-500" },
    { id: 4, title: "Document uploaded", desc: "Agreement signed — A-101", time: "5h ago", dot: "bg-amber-500" },
  ];

  return (
    <header className="h-14 bg-card border-b border-border flex items-center px-4 gap-3 sticky top-0 z-20 shadow-sm">
      {/* Hamburger */}
      <button
        onClick={onMenuToggle}
        className="p-2 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors lg:hidden"
      >
        <Menu size={18} />
      </button>

      {/* Desktop menu toggle */}
      <button
        onClick={onMenuToggle}
        className="p-2 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors hidden lg:flex"
      >
        <Menu size={18} />
      </button>

      {/* Breadcrumb */}
      <div className="hidden sm:flex items-center gap-1 text-sm text-muted-foreground">
        <Building2 size={13} className="text-primary" />
        <span className="text-primary font-medium">SHG</span>
        <span className="text-border">/</span>
        <span className="text-foreground font-medium truncate max-w-48">{activeSection}</span>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Search */}
      <div className={`hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all duration-200 ${searchFocused ? "border-primary bg-card shadow-sm w-72" : "border-border bg-muted w-52"}`}>
        <Search size={14} className="text-muted-foreground flex-shrink-0" />
        <input
          type="text"
          placeholder="Search units, customers..."
          className="bg-transparent text-sm outline-none w-full text-foreground placeholder:text-muted-foreground"
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
        />
        {!searchFocused && (
          <kbd className="text-[10px] text-muted-foreground border border-border rounded px-1 py-0.5 hidden lg:block">⌘K</kbd>
        )}
      </div>

      {/* Dark mode */}
      <button
        onClick={onDarkToggle}
        className="p-2 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors relative"
        title="Toggle theme"
      >
        {isDark ? <Sun size={16} /> : <Moon size={16} />}
      </button>

      {/* Notifications */}
      <div className="relative">
        <button
          onClick={() => { setNotifOpen(!notifOpen); setUserOpen(false); }}
          className="p-2 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors relative"
        >
          <Bell size={16} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full"></span>
        </button>

        {notifOpen && (
          <>
            <div className="fixed inset-0 z-30" onClick={() => setNotifOpen(false)} />
            <div className="absolute right-0 top-11 w-80 bg-card border border-border rounded-xl shadow-2xl z-40 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                <span className="text-sm font-semibold text-foreground">Notifications</span>
                <span className="text-xs text-primary font-medium cursor-pointer hover:underline">Mark all read</span>
              </div>
              <div className="divide-y divide-border max-h-80 overflow-y-auto">
                {notifications.map(n => (
                  <div key={n.id} className="flex gap-3 px-4 py-3 hover:bg-muted/50 cursor-pointer transition-colors">
                    <div className={`w-2 h-2 rounded-full ${n.dot} mt-1.5 flex-shrink-0`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground leading-tight">{n.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5 truncate">{n.desc}</p>
                      <p className="text-[10px] text-muted-foreground/60 mt-1">{n.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-4 py-2.5 border-t border-border">
                <button className="text-xs text-primary font-medium hover:underline w-full text-center">View all notifications</button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* User menu */}
      <div className="relative">
        <button
          onClick={() => { setUserOpen(!userOpen); setNotifOpen(false); }}
          className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-muted transition-colors"
        >
          <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
            <span className="text-white text-[11px] font-bold">RK</span>
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-xs font-semibold text-foreground leading-tight">Ramesh Kumar</p>
            <p className="text-[10px] text-muted-foreground leading-tight">Super Admin</p>
          </div>
          <ChevronDown size={12} className="text-muted-foreground hidden sm:block" />
        </button>

        {userOpen && (
          <>
            <div className="fixed inset-0 z-30" onClick={() => setUserOpen(false)} />
            <div className="absolute right-0 top-11 w-52 bg-card border border-border rounded-xl shadow-2xl z-40 overflow-hidden py-1">
              <div className="px-4 py-3 border-b border-border">
                <p className="text-sm font-semibold text-foreground">Ramesh Kumar</p>
                <p className="text-xs text-muted-foreground">ramesh@shrihari.in</p>
              </div>
              {[
                { icon: <User size={14} />, label: "My Profile" },
                { icon: <Settings size={14} />, label: "Settings" },
                { icon: <HelpCircle size={14} />, label: "Help & Support" },
              ].map(item => (
                <button
                  key={item.label}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors"
                >
                  <span className="text-muted-foreground">{item.icon}</span>
                  {item.label}
                </button>
              ))}
              <div className="border-t border-border mt-1">
                <button 
                  onClick={() => {
                    setUserOpen(false);
                    useAuthStore.getState().logout();
                  }}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                >
                  <LogOut size={14} />
                  Sign out
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </header>
  );
}
