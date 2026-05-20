import { useState } from "react";
import { Menu, Search, Bell, Sun, Moon, ChevronDown, LogOut, Settings, User } from "lucide-react";
import { currentUser, currentTenant } from "../saasData";

interface Props {
  onMenuToggle: () => void;
  isDark: boolean;
  onDarkToggle: () => void;
  activeLabel: string;
  unreadCount?: number;
  onNotifClick?: () => void;
}

export function SaasTopBar({ onMenuToggle, isDark, onDarkToggle, activeLabel, unreadCount = 4, onNotifClick }: Props) {
  const [userOpen, setUserOpen] = useState(false);
  const [searchFocus, setSearchFocus] = useState(false);

  const bg     = isDark ? "#1E293B" : "#FFFFFF";
  const border = isDark ? "rgba(255,255,255,0.08)" : "#E2E8F0";
  const text   = isDark ? "#F1F5F9" : "#0F172A";
  const sub    = isDark ? "rgba(255,255,255,0.4)" : "#64748B";

  return (
    <div style={{ flexShrink: 0, height: 54, background: bg, borderBottom: `1px solid ${border}`, display: "flex", alignItems: "center", paddingInline: 16, gap: 12, position: "relative", zIndex: 20 }}>

      {/* Hamburger (mobile) */}
      <button onClick={onMenuToggle} className="lg:hidden active:opacity-60 transition-opacity" style={{ width: 34, height: 34, borderRadius: 9, background: isDark ? "rgba(255,255,255,0.06)" : "#F8FAFC", border: `1px solid ${border}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <Menu size={16} color={sub} />
      </button>

      {/* Breadcrumb */}
      <div className="hidden lg:flex items-center gap-2" style={{ flexShrink: 0 }}>
        <span style={{ fontSize: 11, color: sub }}>{currentTenant.shortName}</span>
        <span style={{ fontSize: 11, color: isDark ? "rgba(255,255,255,0.2)" : "#CBD5E1" }}>/</span>
        <span style={{ fontSize: 13, fontWeight: 800, color: text }}>{activeLabel}</span>
      </div>

      {/* Mobile title */}
      <p className="lg:hidden" style={{ fontSize: 14, fontWeight: 800, color: text }}>{activeLabel}</p>

      {/* Search bar */}
      <div
        style={{
          flex: 1, maxWidth: 400, display: "flex", alignItems: "center", gap: 8,
          background: isDark ? "rgba(255,255,255,0.06)" : "#F8FAFC",
          border: `1.5px solid ${searchFocus ? "#1B3A6B" : border}`,
          borderRadius: 10, padding: "0 12px", height: 36, transition: "border-color 0.2s",
          margin: "0 auto",
        }}
      >
        <Search size={13} color={sub} />
        <input
          placeholder="Search anything… (⌘K)"
          onFocus={() => setSearchFocus(true)}
          onBlur={() => setSearchFocus(false)}
          className="flex-1 bg-transparent outline-none"
          style={{ fontSize: 12, color: text }}
        />
        <kbd style={{ fontSize: 9, color: sub, background: isDark ? "rgba(255,255,255,0.08)" : "#F1F5F9", border: `1px solid ${border}`, borderRadius: 4, padding: "1px 5px", fontFamily: "monospace" }}>⌘K</kbd>
      </div>

      {/* Right actions */}
      <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
        {/* Theme toggle */}
        <button
          onClick={onDarkToggle}
          style={{ width: 34, height: 34, borderRadius: 9, background: isDark ? "rgba(255,255,255,0.06)" : "#F8FAFC", border: `1px solid ${border}`, display: "flex", alignItems: "center", justifyContent: "center" }}
          className="active:opacity-70 transition-opacity"
        >
          {isDark ? <Sun size={15} color="#F59E0B" /> : <Moon size={15} color={sub} />}
        </button>

        {/* Notifications */}
        <button
          onClick={onNotifClick}
          style={{ width: 34, height: 34, borderRadius: 9, background: isDark ? "rgba(255,255,255,0.06)" : "#F8FAFC", border: `1px solid ${border}`, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}
          className="active:opacity-70 transition-opacity"
        >
          <Bell size={15} color={sub} />
          {unreadCount > 0 && (
            <span style={{ position: "absolute", top: 5, right: 5, width: 8, height: 8, borderRadius: 99, background: "#EF4444", border: `2px solid ${bg}` }} />
          )}
        </button>

        {/* User menu */}
        <div style={{ position: "relative" }}>
          <button
            onClick={() => setUserOpen(o => !o)}
            className="active:opacity-70 transition-opacity"
            style={{ display: "flex", alignItems: "center", gap: 7, background: isDark ? "rgba(255,255,255,0.06)" : "#F8FAFC", border: `1px solid ${border}`, borderRadius: 10, padding: "4px 10px 4px 4px", height: 34 }}
          >
            <div style={{ width: 26, height: 26, borderRadius: 99, background: "linear-gradient(135deg, #C9922A, #F59E0B)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: "#fff", fontWeight: 900, fontSize: 10 }}>{currentUser.initials}</span>
            </div>
            <span className="hidden sm:block" style={{ fontSize: 11, fontWeight: 700, color: text }}>{currentUser.name.split(" ")[0]}</span>
            <ChevronDown size={11} color={sub} />
          </button>

          {userOpen && (
            <>
              <div style={{ position: "fixed", inset: 0, zIndex: 40 }} onClick={() => setUserOpen(false)} />
              <div style={{ position: "absolute", top: "calc(100% + 6px)", right: 0, width: 200, background: isDark ? "#1E293B" : "#fff", border: `1.5px solid ${border}`, borderRadius: 14, boxShadow: "0 8px 32px rgba(0,0,0,0.12)", zIndex: 50, overflow: "hidden" }}>
                <div style={{ padding: "12px 14px", borderBottom: `1px solid ${border}` }}>
                  <p style={{ fontSize: 12, fontWeight: 800, color: text }}>{currentUser.name}</p>
                  <p style={{ fontSize: 10, color: sub }}>{currentUser.email}</p>
                  <span style={{ fontSize: 9, fontWeight: 800, color: "#C9922A", background: "rgba(201,146,42,0.12)", padding: "2px 6px", borderRadius: 4, marginTop: 4, display: "inline-block" }}>{currentUser.role}</span>
                </div>
                {[
                  { icon: User,     label: "My Profile"   },
                  { icon: Settings, label: "Preferences"  },
                ].map(({ icon: Icon, label }) => (
                  <button key={label} onClick={() => setUserOpen(false)} className="w-full text-left active:opacity-70 transition-opacity" style={{ display: "flex", alignItems: "center", gap: 9, padding: "9px 14px", borderBottom: `1px solid ${border}` }}>
                    <Icon size={13} color={sub} />
                    <span style={{ fontSize: 12, color: text, fontWeight: 600 }}>{label}</span>
                  </button>
                ))}
                <button onClick={() => setUserOpen(false)} className="w-full text-left active:opacity-70 transition-opacity" style={{ display: "flex", alignItems: "center", gap: 9, padding: "9px 14px" }}>
                  <LogOut size={13} color="#EF4444" />
                  <span style={{ fontSize: 12, color: "#EF4444", fontWeight: 700 }}>Sign Out</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
