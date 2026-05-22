import { useState } from "react";
import {
  LayoutDashboard, FolderKanban, Building2, Users, HardHat, Layers,
  Calculator, FileText, Package, BarChart3, Bell, Smartphone, TabletSmartphone,
  ChevronDown, LogOut, Settings, HelpCircle, X, TrendingUp,
} from "lucide-react";
import { MODULE_GROUPS, currentTenant, currentUser, tenants } from "../saasData";
import { useAuthStore } from "../../../store/store";

type ModuleId = string;

const ICON_MAP: Record<string, React.ComponentType<{ size?: number; color?: string }>> = {
  LayoutDashboard, FolderKanban, Building2, Users, HardHat,
  Construction: Layers, Calculator, FileText, Package, BarChart3,
  Bell, Smartphone, TabletSmartphone, TrendingUp, Settings,
};

interface Props {
  activeModule: ModuleId;
  onModuleChange: (id: ModuleId) => void;
  isDark: boolean;
  onClose?: () => void;
  tenantId?: string;
  isStandalone?: boolean;
}

const S = {
  sidebar: { background: "#0F172A", height: "100%", display: "flex", flexDirection: "column" as const, overflow: "hidden" },
  header: { padding: "16px 14px 12px", borderBottom: "1px solid rgba(255,255,255,0.06)" },
  logo: { display: "flex", alignItems: "center", gap: 9, marginBottom: 10 },
  logoIcon: { width: 32, height: 32, borderRadius: 9, background: "linear-gradient(135deg, #1B3A6B, #2563EB)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 },
  orgChip: { display: "flex", alignItems: "center", gap: 7, background: "rgba(255,255,255,0.06)", borderRadius: 10, padding: "6px 10px", cursor: "pointer", border: "1px solid rgba(255,255,255,0.05)" },
  nav: { flex: 1, overflowY: "auto" as const, padding: "8px 0" },
  groupLabel: { padding: "10px 16px 4px", fontSize: 9, fontWeight: 800, color: "rgba(255,255,255,0.22)", textTransform: "uppercase" as const, letterSpacing: "0.1em" },
  footer: { borderTop: "1px solid rgba(255,255,255,0.06)", padding: "10px 12px" },
};

export function SaasSidebar({ activeModule, onModuleChange, isDark, onClose, tenantId, isStandalone }: Props) {
  const [orgOpen, setOrgOpen] = useState(false);
  const activeTenant = tenants.find(t => t.id === tenantId) || currentTenant;

  function handleNav(id: ModuleId) {
    onModuleChange(id);
    onClose?.();
  }

  return (
    <div style={S.sidebar}>

      {/* Header */}
      <div style={S.header}>
        <div style={{ display: "flex", alignItems: "center", justifyContext: "space-between" } as any}>
          <div style={S.logo}>
            <div style={S.logoIcon}>🏗️</div>
            <div>
              <p style={{ color: "#fff", fontWeight: 900, fontSize: 14, lineHeight: 1.1 }}>BuildERP</p>
              <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 9, fontWeight: 600, letterSpacing: "0.05em" }}>Enterprise Platform</p>
            </div>
          </div>
          {onClose && (
            <button onClick={onClose} style={{ width: 28, height: 28, borderRadius: 7, background: "rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <X size={14} color="rgba(255,255,255,0.5)" />
            </button>
          )}
        </div>

        {/* Org Switcher */}
        <button 
          onClick={() => !isStandalone && setOrgOpen(o => !o)} 
          style={{...S.orgChip, cursor: isStandalone ? "default" : "pointer"}} 
          className={`w-full ${!isStandalone ? "active:opacity-80 transition-opacity" : ""}`}
        >
          <span style={{ fontSize: 16 }}>{activeTenant.logo}</span>
          <div style={{ flex: 1, textAlign: "left", minWidth: 0 }}>
            <p style={{ color: "#fff", fontSize: 11, fontWeight: 800, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{activeTenant.name}</p>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <span style={{ fontSize: 8, color: "#C9922A", fontWeight: 800, background: "rgba(201,146,42,0.15)", padding: "1px 5px", borderRadius: 4, textTransform: "uppercase" }}>
                {activeTenant.plan}
              </span>
              <span style={{ fontSize: 9, color: "rgba(255,255,255,0.3)" }}>{activeTenant.city}</span>
            </div>
          </div>
          {!isStandalone && (
            <ChevronDown size={12} color="rgba(255,255,255,0.3)" style={{ transform: orgOpen ? "rotate(180deg)" : "none", transition: "0.2s" }} />
          )}
        </button>

        {/* Org dropdown */}
        {orgOpen && (
          <div style={{ marginTop: 6, background: "rgba(255,255,255,0.05)", borderRadius: 10, overflow: "hidden", border: "1px solid rgba(255,255,255,0.07)" }}>
            {tenants.map(t => (
              <button
                key={t.id}
                onClick={() => setOrgOpen(false)}
                className="w-full text-left active:opacity-70 transition-opacity"
                style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", borderBottom: "1px solid rgba(255,255,255,0.04)" }}
              >
                <span style={{ fontSize: 14 }}>{t.logo}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ color: "#fff", fontSize: 11, fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.name}</p>
                  <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 9 }}>{t.city} · {t.plan}</p>
                </div>
                {t.id === activeTenant.id && <span style={{ width: 6, height: 6, borderRadius: 99, background: "#22C55E" }} />}
              </button>
            ))}
            <button
              style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", width: "100%" }}
              className="active:opacity-70 transition-opacity"
            >
              <span style={{ fontSize: 14 }}>➕</span>
              <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 11, fontWeight: 700 }}>Add new organization</span>
            </button>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div style={S.nav}>
        {MODULE_GROUPS.map(group => (
          <div key={group.label}>
            <p style={S.groupLabel}>{group.label}</p>
            {group.items.map(item => {
              const IconComp = ICON_MAP[item.icon];
              const active   = activeModule === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.id)}
                  className="w-full text-left transition-all active:opacity-80"
                  style={{
                    display: "flex", alignItems: "center", gap: 9,
                    padding: "7px 14px", margin: "1px 0",
                    background: active ? "rgba(201,146,42,0.12)" : "transparent",
                    borderLeft: active ? "3px solid #C9922A" : "3px solid transparent",
                    borderRadius: "0 8px 8px 0",
                  }}
                >
                  {IconComp && (
                    <IconComp size={15} color={active ? "#C9922A" : "rgba(255,255,255,0.35)"} />
                  )}
                  <span style={{ flex: 1, fontSize: 12, fontWeight: active ? 800 : 600, color: active ? "#fff" : "rgba(255,255,255,0.5)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {item.label}
                  </span>
                  {item.badge && (
                    <span style={{
                      fontSize: 8, fontWeight: 800, padding: "2px 5px", borderRadius: 99,
                      background: active ? "#C9922A" : "rgba(255,255,255,0.1)",
                      color: active ? "#000" : "rgba(255,255,255,0.5)",
                      flexShrink: 0,
                    }}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ))}

        {/* Separator */}
        <div style={{ margin: "8px 14px", height: 1, background: "rgba(255,255,255,0.06)" }} />

        {/* Bottom items */}
        {[
          { icon: Settings, label: "Settings",     sub: "Coming soon" },
          { icon: HelpCircle, label: "Help & Support", sub: null       },
        ].map(({ icon: Icon, label, sub }) => (
          <button
            key={label}
            className="w-full text-left active:opacity-70 transition-opacity"
            style={{ display: "flex", alignItems: "center", gap: 9, padding: "7px 14px" }}
          >
            <Icon size={15} color="rgba(255,255,255,0.25)" />
            <span style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.3)" }}>{label}</span>
            {sub && <span style={{ fontSize: 8, color: "rgba(255,255,255,0.18)", marginLeft: "auto" }}>{sub}</span>}
          </button>
        ))}
      </div>

      {/* User footer */}
      <div style={S.footer}>
        <div style={{ display: "flex", alignItems: "center", gap: 9, padding: "8px 6px", borderRadius: 10, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.05)" }}>
          <div style={{ width: 30, height: 30, borderRadius: 99, background: "linear-gradient(135deg, #C9922A, #F59E0B)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <span style={{ color: "#fff", fontWeight: 900, fontSize: 11 }}>{currentUser.initials}</span>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ color: "#fff", fontSize: 11, fontWeight: 800, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{currentUser.name}</p>
            <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 9 }}>{currentUser.role}</p>
          </div>
          <button 
            onClick={() => useAuthStore.getState().logout()}
            style={{ width: 24, height: 24, borderRadius: 6, background: "rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }} 
            className="active:opacity-60 transition-opacity"
          >
            <LogOut size={11} color="rgba(255,255,255,0.3)" />
          </button>
        </div>
      </div>
    </div>
  );
}
