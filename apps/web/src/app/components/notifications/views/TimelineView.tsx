import { useState } from "react";
import {
  Search, Filter, ChevronDown, Check, AlertCircle, Clock, X,
} from "lucide-react";
import {
  mockNotifications, TYPE_CFG, CHANNEL_CFG, STATUS_CFG, SEVERITY_CFG,
  type NotifType, type Channel, type NotifStatus,
} from "../notificationData";

const ALL_TYPES: NotifType[] = ["payment", "loan", "rera", "stock", "diary"];
const ALL_CHANNELS: Channel[] = ["whatsapp", "sms", "email", "inapp"];
const ALL_STATUSES: NotifStatus[] = ["sent", "delivered", "failed", "pending", "read"];

const STATUS_ICON: Record<NotifStatus, JSX.Element> = {
  sent:      <Clock    size={11} />,
  delivered: <Check    size={11} />,
  failed:    <X        size={11} />,
  pending:   <Clock    size={11} />,
  read:      <Check    size={11} />,
};

export function TimelineView() {
  const [search, setSearch]         = useState("");
  const [typeFilter, setTypeFilter] = useState<NotifType | "all">("all");
  const [chanFilter, setChanFilter] = useState<Channel | "all">("all");
  const [showFilters, setShowFilters] = useState(false);
  const [expanded, setExpanded]     = useState<string | null>(null);

  const filtered = mockNotifications.filter(n => {
    if (typeFilter !== "all" && n.type !== typeFilter) return false;
    if (chanFilter !== "all" && n.channel !== chanFilter) return false;
    if (search && !n.title.toLowerCase().includes(search.toLowerCase()) && !n.recipient.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const grouped = ["today", "yesterday", "2 days ago"].map(date => ({
    date,
    items: filtered.filter(n => n.date === date),
  })).filter(g => g.items.length > 0);

  return (
    <div className="flex flex-col h-full">
      {/* Search + filter bar */}
      <div style={{ padding: "10px 12px 8px", borderBottom: "1px solid #E2E8F0", background: "#fff", flexShrink: 0 }}>
        <div style={{ display: "flex", gap: 8 }}>
          <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 8, background: "#F8FAFC", border: "1.5px solid #E2E8F0", borderRadius: 12, padding: "0 12px", height: 38 }}>
            <Search size={14} color="#94A3B8" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search notifications…"
              className="flex-1 bg-transparent outline-none"
              style={{ fontSize: 13, color: "#0F172A" }}
            />
            {search && (
              <button onClick={() => setSearch("")} className="active:opacity-60">
                <X size={12} color="#94A3B8" />
              </button>
            )}
          </div>
          <button
            onClick={() => setShowFilters(f => !f)}
            style={{
              width: 38, height: 38, borderRadius: 12, border: `1.5px solid ${showFilters ? "#1B3A6B" : "#E2E8F0"}`,
              background: showFilters ? "#EFF6FF" : "#F8FAFC", display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            <Filter size={14} color={showFilters ? "#1B3A6B" : "#64748B"} />
          </button>
        </div>

        {/* Filter chips */}
        {showFilters && (
          <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 6 }}>
            {/* Type filter */}
            <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
              {(["all", ...ALL_TYPES] as const).map(t => {
                const active = typeFilter === t;
                const cfg = t !== "all" ? TYPE_CFG[t] : null;
                return (
                  <button
                    key={t}
                    onClick={() => setTypeFilter(t as typeof typeFilter)}
                    style={{
                      padding: "4px 10px", borderRadius: 99, fontSize: 10, fontWeight: 700,
                      border: `1.5px solid ${active ? (cfg?.color ?? "#1B3A6B") : "#E2E8F0"}`,
                      background: active ? (cfg?.bg ?? "#EFF6FF") : "#fff",
                      color: active ? (cfg?.color ?? "#1B3A6B") : "#64748B",
                    }}
                  >
                    {t === "all" ? "All Types" : `${cfg!.icon} ${cfg!.label}`}
                  </button>
                );
              })}
            </div>
            {/* Channel filter */}
            <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
              {(["all", ...ALL_CHANNELS] as const).map(c => {
                const active = chanFilter === c;
                const cfg = c !== "all" ? CHANNEL_CFG[c] : null;
                return (
                  <button
                    key={c}
                    onClick={() => setChanFilter(c as typeof chanFilter)}
                    style={{
                      padding: "4px 10px", borderRadius: 99, fontSize: 10, fontWeight: 700,
                      border: `1.5px solid ${active ? (cfg?.color ?? "#1B3A6B") : "#E2E8F0"}`,
                      background: active ? (cfg?.bg ?? "#EFF6FF") : "#fff",
                      color: active ? (cfg?.color ?? "#1B3A6B") : "#64748B",
                    }}
                  >
                    {c === "all" ? "All Channels" : `${cfg!.icon} ${cfg!.label}`}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Timeline */}
      <div className="flex-1 overflow-y-auto" style={{ padding: "8px 12px 16px" }}>
        {grouped.length === 0 ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: 8 }}>
            <AlertCircle size={32} color="#CBD5E1" />
            <p style={{ fontSize: 13, color: "#94A3B8", fontWeight: 600 }}>No notifications found</p>
          </div>
        ) : grouped.map(group => (
          <div key={group.date} style={{ marginBottom: 16 }}>
            {/* Date label */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <span style={{ fontSize: 10, fontWeight: 800, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                {group.date.charAt(0).toUpperCase() + group.date.slice(1)}
              </span>
              <div style={{ flex: 1, height: 1, background: "#E2E8F0" }} />
              <span style={{ fontSize: 9, color: "#CBD5E1", fontWeight: 600 }}>{group.items.length}</span>
            </div>

            {/* Timeline items */}
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {group.items.map((n, idx) => {
                const typeCfg  = TYPE_CFG[n.type];
                const chanCfg  = CHANNEL_CFG[n.channel];
                const statCfg  = STATUS_CFG[n.status];
                const sevCfg   = SEVERITY_CFG[n.severity];
                const isOpen   = expanded === n.id;

                return (
                  <div key={n.id} style={{ position: "relative", paddingLeft: 20 }}>
                    {/* Timeline line */}
                    {idx < group.items.length - 1 && (
                      <div style={{ position: "absolute", left: 7, top: 20, bottom: -6, width: 2, background: "#E2E8F0" }} />
                    )}
                    {/* Timeline dot */}
                    <div style={{
                      position: "absolute", left: 0, top: 8,
                      width: 14, height: 14, borderRadius: 99,
                      background: sevCfg.dot, border: "2.5px solid #fff",
                      boxShadow: `0 0 0 1.5px ${sevCfg.dot}33`,
                    }} />

                    {/* Card */}
                    <button
                      onClick={() => setExpanded(isOpen ? null : n.id)}
                      className="w-full text-left active:opacity-90 transition-opacity"
                      style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 14, padding: "10px 12px", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}
                    >
                      <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                        {/* Type icon */}
                        <div style={{ width: 32, height: 32, borderRadius: 9, background: typeCfg.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 15 }}>
                          {typeCfg.icon}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 4 }}>
                            <p style={{ fontSize: 12, fontWeight: 700, color: "#0F172A", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{n.title}</p>
                            <span style={{ fontSize: 9, color: "#94A3B8", flexShrink: 0 }}>{n.time}</span>
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 4 }}>
                            {/* Channel badge */}
                            <span style={{ fontSize: 9, fontWeight: 700, color: chanCfg.color, background: chanCfg.bg, padding: "2px 6px", borderRadius: 99 }}>
                              {chanCfg.icon} {chanCfg.label}
                            </span>
                            {/* Status badge */}
                            <span style={{ fontSize: 9, fontWeight: 700, color: statCfg.color, background: statCfg.bg, padding: "2px 6px", borderRadius: 99, display: "flex", alignItems: "center", gap: 2 }}>
                              {STATUS_ICON[n.status]}{statCfg.label}
                            </span>
                            {/* Tags */}
                            {n.tags?.slice(0,1).map(tag => (
                              <span key={tag} style={{ fontSize: 9, color: "#94A3B8", background: "#F1F5F9", padding: "2px 6px", borderRadius: 99 }}>{tag}</span>
                            ))}
                          </div>
                        </div>
                        <ChevronDown size={14} color="#CBD5E1" style={{ flexShrink: 0, marginTop: 2, transform: isOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
                      </div>

                      {/* Expanded detail */}
                      {isOpen && (
                        <div style={{ marginTop: 10, paddingTop: 10, borderTop: "1px dashed #E2E8F0" }}>
                          <p style={{ fontSize: 11, color: "#475569", lineHeight: 1.5, marginBottom: 8 }}>{n.body}</p>
                          <div style={{ display: "flex", gap: 16 }}>
                            <div>
                              <p style={{ fontSize: 9, color: "#94A3B8", fontWeight: 700, marginBottom: 1 }}>RECIPIENT</p>
                              <p style={{ fontSize: 11, color: "#0F172A", fontWeight: 600 }}>{n.recipient}</p>
                              {n.recipientPhone && <p style={{ fontSize: 10, color: "#64748B" }}>{n.recipientPhone}</p>}
                            </div>
                            <div>
                              <p style={{ fontSize: 9, color: "#94A3B8", fontWeight: 700, marginBottom: 1 }}>SEVERITY</p>
                              <p style={{ fontSize: 11, fontWeight: 700, color: sevCfg.color }}>{sevCfg.label}</p>
                            </div>
                          </div>
                          {n.tags && n.tags.length > 1 && (
                            <div style={{ display: "flex", gap: 4, marginTop: 6, flexWrap: "wrap" }}>
                              {n.tags.map(tag => (
                                <span key={tag} style={{ fontSize: 9, color: "#64748B", background: "#F1F5F9", padding: "2px 7px", borderRadius: 99 }}>{tag}</span>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
