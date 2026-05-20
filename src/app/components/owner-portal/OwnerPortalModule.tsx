import { useState } from "react";
import {
  Home, CreditCard, Receipt, FolderOpen, HardHat, MessageCircle, Bell, ChevronRight,
} from "lucide-react";
import { owner, flat, fmtINR, emiSchedule } from "./ownerPortalData";
import { FlatDetailsView }          from "./views/FlatDetailsView";
import { EMIScheduleView }          from "./views/EMIScheduleView";
import { PaymentReceiptsView }      from "./views/PaymentReceiptsView";
import { DocumentsView }            from "./views/DocumentsView";
import { ConstructionProgressView } from "./views/ConstructionProgressView";
import { ComplaintsView }           from "./views/ComplaintsView";

type PortalTab = "home" | "emi" | "receipts" | "docs" | "progress" | "complaints";

const TABS: { id: PortalTab; label: string; icon: typeof Home; badge?: number }[] = [
  { id: "home",       label: "Home",      icon: Home         },
  { id: "emi",        label: "Schedule",  icon: CreditCard   },
  { id: "receipts",   label: "Receipts",  icon: Receipt      },
  { id: "docs",       label: "Documents", icon: FolderOpen   },
  { id: "progress",   label: "Progress",  icon: HardHat      },
  { id: "complaints", label: "Support",   icon: MessageCircle, badge: 1 },
];

const OVERDUE_COUNT = emiSchedule.filter(e => e.status === "overdue").length;

interface Props { onBack: () => void; }

export function OwnerPortalModule({ onBack }: Props) {
  const [tab, setTab] = useState<PortalTab>("home");

  const activeTab = TABS.find(t => t.id === tab)!;

  return (
    <div className="flex flex-col h-full" style={{ background: "#F8FAFC", maxWidth: 430, margin: "0 auto", width: "100%" }}>

      {/* Status bar simulation */}
      <div style={{ flexShrink: 0, background: "#0A1628", padding: "10px 16px 6px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 11, fontWeight: 700 }}>9:41</span>
        <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
          <span style={{ color: "rgba(255,255,255,0.35)", fontSize: 9 }}>●●●</span>
          <span style={{ color: "rgba(255,255,255,0.35)", fontSize: 9 }}>WiFi</span>
          <span style={{ color: "rgba(255,255,255,0.35)", fontSize: 9 }}>84%</span>
        </div>
      </div>

      {/* App header */}
      <div style={{ flexShrink: 0, background: "linear-gradient(160deg, #0A1628 0%, #1B3A6B 100%)", padding: "8px 16px 14px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {/* Back button */}
          <button
            onClick={onBack}
            style={{ width: 34, height: 34, borderRadius: 10, background: "rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}
            className="active:opacity-70 transition-opacity"
          >
            <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 14 }}>←</span>
          </button>

          {/* Branding */}
          <div style={{ flex: 1 }}>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em" }}>Shri Hari Group</p>
            <p style={{ color: "#fff", fontSize: 16, fontWeight: 900, lineHeight: 1.1 }}>Owner Portal</p>
          </div>

          {/* Notification bell */}
          <button
            style={{ width: 34, height: 34, borderRadius: 10, background: "rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}
            className="active:opacity-70 transition-opacity"
          >
            <Bell size={16} color="rgba(255,255,255,0.6)" />
            {OVERDUE_COUNT > 0 && (
              <span style={{ position: "absolute", top: 5, right: 5, width: 8, height: 8, borderRadius: 99, background: "#EF4444", border: "1.5px solid #0A1628" }} />
            )}
          </button>
        </div>

        {/* Owner chip */}
        <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.07)", borderRadius: 14, padding: "8px 12px" }}>
          <div style={{ width: 32, height: 32, borderRadius: 99, background: "linear-gradient(135deg, #C9922A, #F59E0B)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <span style={{ color: "#fff", fontWeight: 900, fontSize: 12 }}>{owner.avatar}</span>
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ color: "#fff", fontSize: 12, fontWeight: 800 }}>{owner.name}</p>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 10 }}>
              Flat {flat.flatNo}, {flat.tower} · {flat.type}
            </p>
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ color: "#C9922A", fontSize: 12, fontWeight: 900 }}>{fmtINR(flat.paidAmount)}</p>
            <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 9 }}>paid</p>
          </div>
        </div>

        {/* Overdue alert */}
        {OVERDUE_COUNT > 0 && (
          <button
            onClick={() => setTab("emi")}
            style={{ marginTop: 8, width: "100%", background: "#FEF2F2", border: "1.5px solid #FECACA", borderRadius: 12, padding: "8px 12px", display: "flex", alignItems: "center", gap: 8 }}
            className="active:opacity-80 transition-opacity"
          >
            <span style={{ fontSize: 14 }}>⚠️</span>
            <span style={{ flex: 1, fontSize: 11, color: "#991B1B", fontWeight: 700, textAlign: "left" }}>
              Payment overdue — tap to pay now
            </span>
            <ChevronRight size={14} color="#EF4444" />
          </button>
        )}
      </div>

      {/* Page title bar */}
      {tab !== "home" && (
        <div style={{ flexShrink: 0, background: "#fff", borderBottom: "1px solid #F1F5F9", padding: "10px 16px" }}>
          <p style={{ fontSize: 16, fontWeight: 900, color: "#0F172A" }}>{activeTab.label}</p>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {tab === "home"       && <FlatDetailsView />}
        {tab === "emi"        && <EMIScheduleView />}
        {tab === "receipts"   && <PaymentReceiptsView />}
        {tab === "docs"       && <DocumentsView />}
        {tab === "progress"   && <ConstructionProgressView />}
        {tab === "complaints" && <ComplaintsView />}
      </div>

      {/* Bottom nav */}
      <div style={{ flexShrink: 0, background: "#fff", borderTop: "1px solid #F1F5F9", paddingBottom: 4, boxShadow: "0 -4px 16px rgba(0,0,0,0.04)" }}>
        <div style={{ display: "flex" }}>
          {TABS.map(t => {
            const active = tab === t.id;
            const Icon   = t.icon;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className="flex-1 flex flex-col items-center pt-2 pb-1 gap-0.5 relative active:bg-slate-50 transition-colors"
              >
                {/* Active indicator */}
                {active && (
                  <span style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: 28, height: 3, borderRadius: 99, background: "#1B3A6B" }} />
                )}
                {/* Icon + badge */}
                <span style={{ position: "relative", display: "flex" }}>
                  <Icon size={19} color={active ? "#1B3A6B" : "#94A3B8"} />
                  {t.badge && !active && (
                    <span style={{ position: "absolute", top: -4, right: -6, width: 14, height: 14, borderRadius: 99, background: "#EF4444", color: "#fff", fontSize: 7, fontWeight: 900, display: "flex", alignItems: "center", justifyContent: "center", border: "1.5px solid #fff" }}>
                      {t.badge}
                    </span>
                  )}
                </span>
                <span style={{ fontSize: 9, fontWeight: active ? 800 : 600, color: active ? "#1B3A6B" : "#94A3B8" }}>
                  {t.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
