import { useState, useEffect } from "react";
import { SaasSidebar }  from "./components/SaasSidebar";
import { SaasTopBar }   from "./components/SaasTopBar";
import { SaasDashboard } from "./SaasDashboard";
import { GSTModule }     from "./modules/GSTModule";
import { LabourModule }  from "./modules/LabourModule";
import { MODULE_GROUPS } from "./saasData";

// Existing modules — embedded inside the SaaS shell
import { ProjectManagementModule }    from "../projects/ProjectManagementModule";
import { FlatManagementModule }       from "../flats/FlatManagementModule";
import { KYCModule }                  from "../kyc/KYCModule";
import { AccountingModule }           from "../accounting/AccountingModule";
import { InventoryModule }            from "../inventory/InventoryModule";
import { ConstructionProgressModule } from "../construction-progress/ConstructionProgressModule";
import { ReportsModule }              from "../reports/ReportsModule";
import { MobileERPModule }            from "../pwa/MobileERPModule";
import { NotificationModule }         from "../notifications/NotificationModule";
import { OwnerPortalModule }          from "../owner-portal/OwnerPortalModule";
import { CompanySettingsModule }      from "../settings/CompanySettingsModule";

type ModuleId = string;

function getModuleLabel(id: ModuleId): string {
  for (const group of MODULE_GROUPS) {
    const found = group.items.find(i => i.id === id);
    if (found) return found.label;
  }
  if (id === "dashboard") return "Dashboard";
  return id.charAt(0).toUpperCase() + id.slice(1);
}

interface Props {
  onExit: () => void;
  isStandalone?: boolean;
  tenantId?: string;
}

export function SaasPlatform({ onExit, isStandalone = false, tenantId }: Props) {
  const [activeModule, setActiveModule] = useState<ModuleId>("dashboard");
  const [isDark, setIsDark]             = useState(false);
  const [sidebarOpen, setSidebarOpen]   = useState(false);

  useEffect(() => {
    if (isDark) document.documentElement.classList.add("dark");
    else        document.documentElement.classList.remove("dark");
    return () => document.documentElement.classList.remove("dark");
  }, [isDark]);

  const bg   = isDark ? "#0F172A" : "#F1F5F9";
  const bdr  = isDark ? "rgba(255,255,255,0.07)" : "#E2E8F0";

  function renderModule() {
    const commonProps = { isDark, onDarkToggle: () => setIsDark(d => !d) };

    switch (activeModule) {
      case "dashboard":     return <SaasDashboard isDark={isDark} onNavigate={setActiveModule} tenantId={tenantId} />;
      case "projects":      return <ProjectManagementModule    {...commonProps} tenantId={tenantId} isStandalone={isStandalone} />;
      case "flats":         return <FlatManagementModule       {...commonProps} />;
      case "crm":           return <KYCModule                  {...commonProps} />;
      case "accounting":    return <AccountingModule            {...commonProps} />;
      case "gst":           return <GSTModule                   isDark={isDark} />;
      case "inventory":     return <InventoryModule             {...commonProps} />;
      case "labour":        return <LabourModule                isDark={isDark} />;
      case "construction":  return <ConstructionProgressModule  {...commonProps} />;
      case "reports":       return <ReportsModule               {...commonProps} />;
      case "notifications": return <NotificationModule onBack={() => setActiveModule("dashboard")} />;
      case "settings":      return <CompanySettingsModule isDark={isDark} />;
      case "owner-portal":  return (
        <div className="flex-1 overflow-hidden flex items-center justify-center" style={{ background: "#111827" }}>
          <div className="relative w-full max-w-[430px] h-full max-h-[860px] rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-[#1a1a1a]" style={{ boxShadow: "0 0 0 8px #111, 0 40px 80px rgba(0,0,0,0.8)" }}>
            <OwnerPortalModule onBack={() => setActiveModule("dashboard")} />
          </div>
        </div>
      );
      case "pwa": return (
        <div className="flex-1 overflow-hidden flex items-center justify-center" style={{ background: "#111827" }}>
          <div className="relative w-full max-w-[390px] h-full max-h-[820px] rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-[#1a1a1a]" style={{ boxShadow: "0 0 0 8px #111, 0 40px 80px rgba(0,0,0,0.8)" }}>
            <MobileERPModule {...commonProps} />
          </div>
        </div>
      );
      default: return (
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", background: bg }}>
          <div style={{ textAlign: "center" }}>
            <p style={{ fontSize: 32, marginBottom: 8 }}>🚧</p>
            <p style={{ fontSize: 15, fontWeight: 800, color: isDark ? "#F1F5F9" : "#0F172A" }}>Coming Soon</p>
            <p style={{ fontSize: 12, color: isDark ? "rgba(255,255,255,0.4)" : "#94A3B8", marginTop: 4 }}>
              {getModuleLabel(activeModule)} module is under development
            </p>
          </div>
        </div>
      );
    }
  }

  const needsFlexCol = ["owner-portal", "pwa"].includes(activeModule);
  const needsPhoneFrame = needsFlexCol;

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden", background: bg }}>

      {/* ── Desktop sidebar ── */}
      <div
        className="hidden lg:block"
        style={{ width: 240, flexShrink: 0, height: "100%", borderRight: `1px solid ${bdr}` }}
      >
        <SaasSidebar activeModule={activeModule} onModuleChange={setActiveModule} isDark={isDark} tenantId={tenantId} isStandalone={isStandalone} />
      </div>

      {/* ── Mobile sidebar overlay ── */}
      {sidebarOpen && (
        <>
          <div
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 40 }}
            onClick={() => setSidebarOpen(false)}
          />
          <div style={{ position: "fixed", left: 0, top: 0, bottom: 0, width: 260, zIndex: 50 }}>
            <SaasSidebar activeModule={activeModule} onModuleChange={setActiveModule} isDark={isDark} onClose={() => setSidebarOpen(false)} tenantId={tenantId} isStandalone={isStandalone} />
          </div>
        </>
      )}

      {/* ── Main content ── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, overflow: "hidden" }}>
        {/* Top bar */}
        <SaasTopBar
          onMenuToggle={() => setSidebarOpen(o => !o)}
          isDark={isDark}
          onDarkToggle={() => setIsDark(d => !d)}
          activeLabel={getModuleLabel(activeModule)}
          unreadCount={4}
          onNotifClick={() => setActiveModule("notifications")}
        />

        {/* "Back to Old Demo" exit bar (shown as tiny hint) */}
        {!isStandalone && (
          <div style={{ flexShrink: 0, background: isDark ? "rgba(255,255,255,0.04)" : "#FEF3C7", borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "#FCD34D"}`, padding: "4px 20px", display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 10, color: isDark ? "rgba(255,255,255,0.3)" : "#92400E" }}>
              🏗️ BuildERP SaaS Demo · Multi-tenant enterprise platform
            </span>
            <button
              onClick={onExit}
              style={{ marginLeft: "auto", fontSize: 10, color: isDark ? "rgba(255,255,255,0.3)" : "#92400E", fontWeight: 700, textDecoration: "underline" }}
              className="active:opacity-60 transition-opacity"
            >
              Exit to design system →
            </button>
          </div>
        )}

        {/* Module content */}
        <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
          {renderModule()}
        </div>
      </div>
    </div>
  );
}
