import { useState } from "react";
import { ChevronDown, ChevronRight, Send, AlertTriangle, CheckCircle2 } from "lucide-react";
import {
  alertGroups, TYPE_CFG, SEVERITY_CFG, fmtINR,
  type NotifType, type AlertItem,
} from "../notificationData";

const TYPE_ORDER: NotifType[] = ["payment", "loan", "rera", "stock", "diary"];

export function AlertCardsView() {
  const [openGroups, setOpenGroups] = useState<NotifType[]>(["payment", "rera"]);
  const [actioned, setActioned]     = useState<Set<string>>(new Set());
  const [sending, setSending]       = useState<string | null>(null);

  function toggleGroup(type: NotifType) {
    setOpenGroups(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  }

  function handleAction(item: AlertItem) {
    if (actioned.has(item.id) || sending === item.id) return;
    setSending(item.id);
    setTimeout(() => {
      setSending(null);
      setActioned(prev => new Set([...prev, item.id]));
    }, 1400);
  }

  const totalUrgent = alertGroups.reduce((s, g) => s + g.urgent, 0);

  return (
    <div className="flex flex-col h-full">
      {/* Summary strip */}
      <div style={{ flexShrink: 0, padding: "10px 12px 8px", borderBottom: "1px solid #E2E8F0", background: "#fff" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <p style={{ fontSize: 10, fontWeight: 800, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.08em" }}>Action Required</p>
            <p style={{ fontSize: 22, fontWeight: 900, color: "#0F172A", lineHeight: 1.2 }}>
              {alertGroups.reduce((s, g) => s + g.count, 0)}
              <span style={{ fontSize: 12, fontWeight: 600, color: "#94A3B8", marginLeft: 4 }}>alerts</span>
            </p>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <div style={{ textAlign: "center", background: "#FEF2F2", borderRadius: 12, padding: "8px 14px" }}>
              <p style={{ fontSize: 18, fontWeight: 900, color: "#EF4444" }}>{totalUrgent}</p>
              <p style={{ fontSize: 9, color: "#EF4444", fontWeight: 700 }}>Urgent</p>
            </div>
            <div style={{ textAlign: "center", background: "#F0FDF4", borderRadius: 12, padding: "8px 14px" }}>
              <p style={{ fontSize: 18, fontWeight: 900, color: "#22C55E" }}>{actioned.size}</p>
              <p style={{ fontSize: 9, color: "#22C55E", fontWeight: 700 }}>Done</p>
            </div>
          </div>
        </div>
      </div>

      {/* Alert groups */}
      <div className="flex-1 overflow-y-auto" style={{ padding: "8px 12px 16px" }}>
        {TYPE_ORDER.map(type => {
          const group = alertGroups.find(g => g.type === type);
          if (!group) return null;
          const cfg     = TYPE_CFG[type];
          const isOpen  = openGroups.includes(type);
          const doneCount = group.items.filter(i => actioned.has(i.id)).length;

          return (
            <div key={type} style={{ marginBottom: 10 }}>
              {/* Group header */}
              <button
                onClick={() => toggleGroup(type)}
                className="w-full active:opacity-80 transition-opacity"
                style={{
                  background: "#fff", border: "1.5px solid #E2E8F0", borderRadius: isOpen ? "14px 14px 0 0" : 14,
                  padding: "10px 12px", display: "flex", alignItems: "center", gap: 10,
                }}
              >
                <div style={{ width: 36, height: 36, borderRadius: 10, background: cfg.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>
                  {cfg.icon}
                </div>
                <div style={{ flex: 1, textAlign: "left" }}>
                  <p style={{ fontSize: 13, fontWeight: 800, color: "#0F172A" }}>{cfg.label}</p>
                  <p style={{ fontSize: 10, color: "#94A3B8" }}>
                    {group.count} alerts
                    {group.urgent > 0 && <span style={{ color: "#EF4444", fontWeight: 700 }}> · {group.urgent} urgent</span>}
                    {doneCount > 0 && <span style={{ color: "#22C55E", fontWeight: 700 }}> · {doneCount} done</span>}
                  </p>
                </div>
                {group.urgent > 0 && (
                  <span style={{
                    width: 22, height: 22, borderRadius: 99, background: "#FEF2F2",
                    color: "#EF4444", fontSize: 10, fontWeight: 900,
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    {group.urgent}
                  </span>
                )}
                {isOpen
                  ? <ChevronDown size={16} color="#94A3B8" />
                  : <ChevronRight size={16} color="#CBD5E1" />
                }
              </button>

              {/* Items */}
              {isOpen && (
                <div style={{ border: "1.5px solid #E2E8F0", borderTop: "none", borderRadius: "0 0 14px 14px", overflow: "hidden" }}>
                  {group.items.map((item, idx) => {
                    const sevCfg  = SEVERITY_CFG[item.severity];
                    const done    = actioned.has(item.id);
                    const loading = sending === item.id;

                    return (
                      <div
                        key={item.id}
                        style={{
                          padding: "10px 12px",
                          borderTop: idx > 0 ? "1px solid #F1F5F9" : undefined,
                          background: done ? "#F0FDF4" : "#FAFAFA",
                          display: "flex", alignItems: "center", gap: 10,
                        }}
                      >
                        {/* Severity dot */}
                        <div style={{ flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                          <div style={{ width: 10, height: 10, borderRadius: 99, background: done ? "#22C55E" : sevCfg.dot }} />
                        </div>

                        {/* Content */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ fontSize: 12, fontWeight: 700, color: done ? "#166534" : "#0F172A", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {item.title}
                          </p>
                          <p style={{ fontSize: 10, color: "#94A3B8", marginTop: 1 }}>{item.sub}</p>
                          <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4 }}>
                            <span style={{
                              fontSize: 9, fontWeight: 800, color: done ? "#22C55E" : sevCfg.color,
                              background: done ? "#DCFCE7" : `${sevCfg.color}18`,
                              padding: "2px 6px", borderRadius: 99,
                            }}>
                              {done ? "✓ Done" : item.dueIn}
                            </span>
                            {item.amount && !done && (
                              <span style={{ fontSize: 9, color: "#64748B", fontWeight: 600 }}>{fmtINR(item.amount)}</span>
                            )}
                          </div>
                        </div>

                        {/* Action button */}
                        <button
                          onClick={() => handleAction(item)}
                          disabled={done || loading}
                          className="active:scale-95 transition-transform"
                          style={{
                            flexShrink: 0,
                            height: 32, padding: "0 12px", borderRadius: 10, fontSize: 10, fontWeight: 800,
                            background: done ? "#DCFCE7" : loading ? "#EFF6FF" : cfg.bg,
                            color: done ? "#166534" : loading ? "#1B3A6B" : cfg.color,
                            border: `1.5px solid ${done ? "#86EFAC" : loading ? "#93C5FD" : cfg.color}30`,
                            display: "flex", alignItems: "center", gap: 4,
                            cursor: done ? "default" : "pointer",
                          }}
                        >
                          {done
                            ? <><CheckCircle2 size={11} /> Done</>
                            : loading
                            ? <><div style={{ width: 10, height: 10, borderRadius: 99, border: "2px solid #1B3A6B", borderTopColor: "transparent", animation: "spin 0.7s linear infinite" }} />Sending…</>
                            : <><Send size={11} />{item.action}</>
                          }
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}

        {/* All done state */}
        {actioned.size === alertGroups.reduce((s, g) => s + g.items.length, 0) && (
          <div style={{ marginTop: 8, background: "#F0FDF4", border: "1.5px solid #86EFAC", borderRadius: 14, padding: "20px 16px", textAlign: "center" }}>
            <CheckCircle2 size={28} color="#22C55E" style={{ margin: "0 auto 8px" }} />
            <p style={{ fontSize: 13, fontWeight: 800, color: "#166534" }}>All alerts actioned!</p>
            <p style={{ fontSize: 10, color: "#4ADE80", marginTop: 2 }}>Great work — everything is handled.</p>
          </div>
        )}
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
