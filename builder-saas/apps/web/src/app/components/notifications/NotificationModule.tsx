import { useState } from "react";
import { Bell, Clock, AlertTriangle, FileText, Settings, RefreshCw } from "lucide-react";
import { notifStats } from "./notificationData";
import { TimelineView }       from "./views/TimelineView";
import { AlertCardsView }     from "./views/AlertCardsView";
import { TemplateEditorView } from "./views/TemplateEditorView";
import { ChannelSettingsView } from "./views/ChannelSettingsView";

type NotifTab = "timeline" | "alerts" | "templates" | "channels";

const TABS: { id: NotifTab; label: string; icon: typeof Bell }[] = [
  { id: "timeline",  label: "Timeline",  icon: Clock         },
  { id: "alerts",    label: "Alerts",    icon: AlertTriangle },
  { id: "templates", label: "Templates", icon: FileText      },
  { id: "channels",  label: "Channels",  icon: Settings      },
];

interface Props {
  onBack: () => void;
}

export function NotificationModule({ onBack }: Props) {
  const [tab, setTab]         = useState<NotifTab>("timeline");
  const [refreshing, setRefreshing] = useState(false);

  function handleRefresh() {
    if (refreshing) return;
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1200);
  }

  return (
    <div className="flex flex-col h-full" style={{ background: "#F8FAFC" }}>

      {/* Header */}
      <div style={{ flexShrink: 0, background: "linear-gradient(160deg, #0A1628 0%, #1B3A6B 100%)" }}>
        {/* Top bar */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px 10px" }}>
          <button
            onClick={onBack}
            className="active:opacity-70 transition-opacity"
            style={{ width: 32, height: 32, borderRadius: 10, background: "rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}
          >
            <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 16, lineHeight: 1 }}>←</span>
          </button>
          <div style={{ flex: 1 }}>
            <p style={{ color: "#fff", fontWeight: 900, fontSize: 17, lineHeight: 1.2 }}>Notifications</p>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 10, fontWeight: 600, marginTop: 1 }}>
              Shri Hari Group · All Towers
            </p>
          </div>
          <button
            onClick={handleRefresh}
            className="active:opacity-70 transition-opacity"
            style={{ width: 32, height: 32, borderRadius: 10, background: "rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            <RefreshCw size={15} color="rgba(255,255,255,0.6)" className={refreshing ? "animate-spin" : ""} />
          </button>
        </div>

        {/* KPI strip */}
        <div style={{ display: "flex", gap: 0, borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          {[
            { label: "Sent Today",    value: notifStats.totalToday, color: "#fff" },
            { label: "Unread",        value: notifStats.unread,     color: "#FBBF24" },
            { label: "Critical",      value: notifStats.critical,   color: "#F87171" },
            { label: "Delivery Rate", value: `${notifStats.deliveryRate}%`, color: "#34D399" },
          ].map((kpi, i) => (
            <div
              key={kpi.label}
              style={{
                flex: 1, textAlign: "center", padding: "9px 4px",
                borderRight: i < 3 ? "1px solid rgba(255,255,255,0.06)" : undefined,
              }}
            >
              <p style={{ fontSize: 17, fontWeight: 900, color: kpi.color, lineHeight: 1.1 }}>{kpi.value}</p>
              <p style={{ fontSize: 8.5, color: "rgba(255,255,255,0.38)", fontWeight: 600, marginTop: 1 }}>{kpi.label}</p>
            </div>
          ))}
        </div>

        {/* Tab bar */}
        <div style={{ display: "flex", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          {TABS.map(t => {
            const active = tab === t.id;
            const Icon   = t.icon;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className="flex-1 active:opacity-70 transition-opacity"
                style={{ padding: "8px 4px", display: "flex", flexDirection: "column", alignItems: "center", gap: 3, position: "relative" }}
              >
                {active && (
                  <span style={{ position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)", width: 28, height: 2.5, borderRadius: 99, background: "#C9922A" }} />
                )}
                <Icon size={15} color={active ? "#fff" : "rgba(255,255,255,0.35)"} />
                <span style={{ fontSize: 9, fontWeight: active ? 800 : 600, color: active ? "#fff" : "rgba(255,255,255,0.35)" }}>
                  {t.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {tab === "timeline"  && <TimelineView />}
        {tab === "alerts"    && <AlertCardsView />}
        {tab === "templates" && <TemplateEditorView />}
        {tab === "channels"  && (
          <div className="flex flex-col h-full overflow-hidden">
            <ChannelSettingsView />
          </div>
        )}
      </div>
    </div>
  );
}
