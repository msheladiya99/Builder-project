import { useState } from "react";
import { ToggleLeft, ToggleRight, CheckCircle2, AlertCircle, Clock } from "lucide-react";
import { channelInfos, type ChannelInfo } from "../notificationData";

interface ScheduleRule {
  id: string;
  label: string;
  time: string;
  enabled: boolean;
}

const INITIAL_SCHEDULE: ScheduleRule[] = [
  { id: "morning",   label: "Morning digest",     time: "9:00 AM",  enabled: true  },
  { id: "afternoon", label: "Afternoon alerts",   time: "2:00 PM",  enabled: true  },
  { id: "evening",   label: "End-of-day summary", time: "6:30 PM",  enabled: false },
  { id: "critical",  label: "Critical — instant", time: "Always",   enabled: true  },
];

const AUTO_RULES = [
  { id: "overdue7",  label: "Auto-remind if payment overdue 7+ days",  defaultOn: true  },
  { id: "rera30",    label: "Alert RERA expiry 30 days before",         defaultOn: true  },
  { id: "stock",     label: "Auto-PO suggestion on low stock",          defaultOn: false },
  { id: "diaryMiss", label: "Notify PM when diary missing by 8 PM",    defaultOn: true  },
  { id: "loanEmi",   label: "EMI reminder 5 days before due",           defaultOn: true  },
];

function DeliveryBar({ delivered, total }: { delivered: number; total: number }) {
  const pct = total > 0 ? Math.round((delivered / total) * 100) : 0;
  const color = pct >= 95 ? "#22C55E" : pct >= 80 ? "#F59E0B" : "#EF4444";
  return (
    <div style={{ marginTop: 6 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
        <span style={{ fontSize: 9, color: "#94A3B8" }}>Delivery rate</span>
        <span style={{ fontSize: 9, fontWeight: 800, color }}>{pct}%</span>
      </div>
      <div style={{ height: 4, background: "#F1F5F9", borderRadius: 99, overflow: "hidden" }}>
        <div style={{ width: `${pct}%`, height: "100%", background: color, borderRadius: 99 }} />
      </div>
    </div>
  );
}

export function ChannelSettingsView() {
  const [channels, setChannels] = useState<ChannelInfo[]>(channelInfos);
  const [schedule, setSchedule] = useState<ScheduleRule[]>(INITIAL_SCHEDULE);
  const [autoRules, setAutoRules] = useState<Record<string, boolean>>(
    Object.fromEntries(AUTO_RULES.map(r => [r.id, r.defaultOn]))
  );
  const [testSent, setTestSent] = useState<string | null>(null);

  function toggleChannel(id: string) {
    setChannels(prev => prev.map(c => c.id === id ? { ...c, enabled: !c.enabled } : c));
  }

  function toggleSchedule(id: string) {
    setSchedule(prev => prev.map(s => s.id === id ? { ...s, enabled: !s.enabled } : s));
  }

  function handleTest(id: string) {
    setTestSent(id);
    setTimeout(() => setTestSent(null), 2000);
  }

  return (
    <div className="flex-1 overflow-y-auto" style={{ padding: "8px 12px 16px" }}>
      {/* Channel cards — 2×2 grid */}
      <p style={{ fontSize: 10, fontWeight: 800, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Channels</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 16 }}>
        {channels.map(ch => (
          <div
            key={ch.id}
            style={{
              background: ch.enabled ? "#fff" : "#F8FAFC",
              border: `1.5px solid ${ch.enabled ? ch.color + "40" : "#E2E8F0"}`,
              borderRadius: 16, padding: 12,
              opacity: ch.enabled ? 1 : 0.65,
              transition: "all 0.2s",
            }}
          >
            {/* Header row */}
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 6 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                <div style={{ width: 32, height: 32, borderRadius: 9, background: ch.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>
                  {ch.icon}
                </div>
                <div>
                  <p style={{ fontSize: 11, fontWeight: 800, color: "#0F172A", lineHeight: 1.1 }}>{ch.label}</p>
                  <p style={{ fontSize: 9, color: "#94A3B8" }}>{ch.provider}</p>
                </div>
              </div>
              <button onClick={() => toggleChannel(ch.id)} style={{ flexShrink: 0 }}>
                {ch.enabled
                  ? <ToggleRight size={22} color={ch.color} />
                  : <ToggleLeft  size={22} color="#CBD5E1" />
                }
              </button>
            </div>

            {/* Stats row */}
            <div style={{ display: "flex", gap: 6, marginBottom: 2 }}>
              <div style={{ flex: 1, background: "#F8FAFC", borderRadius: 8, padding: "5px 7px", textAlign: "center" }}>
                <p style={{ fontSize: 14, fontWeight: 900, color: "#0F172A" }}>{ch.sentToday}</p>
                <p style={{ fontSize: 8, color: "#94A3B8" }}>Sent</p>
              </div>
              <div style={{ flex: 1, background: "#F0FDF4", borderRadius: 8, padding: "5px 7px", textAlign: "center" }}>
                <p style={{ fontSize: 14, fontWeight: 900, color: "#22C55E" }}>{ch.delivered}</p>
                <p style={{ fontSize: 8, color: "#22C55E" }}>Delivered</p>
              </div>
              <div style={{ flex: 1, background: ch.failed > 0 ? "#FEF2F2" : "#F0FDF4", borderRadius: 8, padding: "5px 7px", textAlign: "center" }}>
                <p style={{ fontSize: 14, fontWeight: 900, color: ch.failed > 0 ? "#EF4444" : "#22C55E" }}>{ch.failed}</p>
                <p style={{ fontSize: 8, color: ch.failed > 0 ? "#EF4444" : "#94A3B8" }}>Failed</p>
              </div>
            </div>

            <DeliveryBar delivered={ch.delivered} total={ch.sentToday} />

            {/* Cost + test */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 8 }}>
              <span style={{ fontSize: 9, color: "#64748B" }}>
                {ch.costPerMsg}/msg
              </span>
              <button
                onClick={() => ch.enabled && handleTest(ch.id)}
                disabled={!ch.enabled}
                style={{
                  fontSize: 9, fontWeight: 800,
                  color: testSent === ch.id ? "#22C55E" : ch.enabled ? ch.color : "#CBD5E1",
                  background: testSent === ch.id ? "#F0FDF4" : ch.bg,
                  padding: "3px 8px", borderRadius: 99,
                  border: `1px solid ${testSent === ch.id ? "#86EFAC" : ch.color + "40"}`,
                  cursor: ch.enabled ? "pointer" : "default",
                  display: "flex", alignItems: "center", gap: 3,
                }}
              >
                {testSent === ch.id ? <><CheckCircle2 size={10} />Sent!</> : "Test"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Schedule */}
      <p style={{ fontSize: 10, fontWeight: 800, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Dispatch Schedule</p>
      <div style={{ background: "#fff", border: "1.5px solid #E2E8F0", borderRadius: 14, overflow: "hidden", marginBottom: 16 }}>
        {schedule.map((rule, idx) => (
          <div
            key={rule.id}
            style={{
              display: "flex", alignItems: "center", gap: 10, padding: "10px 12px",
              borderBottom: idx < schedule.length - 1 ? "1px solid #F1F5F9" : undefined,
              background: rule.enabled ? "#fff" : "#F8FAFC",
            }}
          >
            <div style={{ width: 32, height: 32, borderRadius: 9, background: rule.enabled ? "#EFF6FF" : "#F1F5F9", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Clock size={15} color={rule.enabled ? "#1B3A6B" : "#CBD5E1"} />
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: rule.enabled ? "#0F172A" : "#94A3B8" }}>{rule.label}</p>
              <p style={{ fontSize: 10, color: "#94A3B8" }}>{rule.time}</p>
            </div>
            <button onClick={() => toggleSchedule(rule.id)}>
              {rule.enabled
                ? <ToggleRight size={22} color="#1B3A6B" />
                : <ToggleLeft  size={22} color="#CBD5E1" />
              }
            </button>
          </div>
        ))}
      </div>

      {/* Auto rules */}
      <p style={{ fontSize: 10, fontWeight: 800, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Automation Rules</p>
      <div style={{ background: "#fff", border: "1.5px solid #E2E8F0", borderRadius: 14, overflow: "hidden" }}>
        {AUTO_RULES.map((rule, idx) => {
          const on = autoRules[rule.id];
          return (
            <div
              key={rule.id}
              style={{
                display: "flex", alignItems: "center", gap: 10, padding: "10px 12px",
                borderBottom: idx < AUTO_RULES.length - 1 ? "1px solid #F1F5F9" : undefined,
                background: on ? "#fff" : "#F8FAFC",
              }}
            >
              <div style={{ width: 8, height: 8, borderRadius: 99, background: on ? "#22C55E" : "#E2E8F0", flexShrink: 0 }} />
              <p style={{ flex: 1, fontSize: 11, fontWeight: 600, color: on ? "#0F172A" : "#94A3B8", lineHeight: 1.4 }}>{rule.label}</p>
              <button onClick={() => setAutoRules(prev => ({ ...prev, [rule.id]: !prev[rule.id] }))}>
                {on
                  ? <ToggleRight size={22} color="#22C55E" />
                  : <ToggleLeft  size={22} color="#CBD5E1" />
                }
              </button>
            </div>
          );
        })}
      </div>

      {/* Footer status */}
      <div style={{ marginTop: 12, padding: "10px 12px", background: "#F0FDF4", border: "1.5px solid #86EFAC", borderRadius: 12, display: "flex", alignItems: "center", gap: 8 }}>
        <CheckCircle2 size={15} color="#22C55E" />
        <p style={{ fontSize: 11, color: "#166534", fontWeight: 600 }}>
          {channels.filter(c => c.enabled).length} channels active · {schedule.filter(s => s.enabled).length} schedules · {Object.values(autoRules).filter(Boolean).length} automation rules
        </p>
      </div>
    </div>
  );
}
