import { useState } from "react";
import { boqItems, BOQ_CATEGORIES, getBOQSummary, fmtINR } from "../constructionData";
import type { BOQStatus } from "../constructionData";

interface Props { isDark: boolean; }

const STATUS_STYLE: Record<BOQStatus, { label: string; color: string; bg: string }> = {
  "completed":   { label: "Completed",   color: "#22C55E", bg: "#F0FDF4" },
  "in-progress": { label: "In Progress", color: "#3B82F6", bg: "#EFF6FF" },
  "not-started": { label: "Not Started", color: "#94A3B8", bg: "#F8FAFC" },
};

export function BOQView({ isDark }: Props) {
  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");
  const bg     = isDark ? "#0F172A" : "#F1F5F9";
  const card   = isDark ? "#1E293B" : "#FFFFFF";
  const border = isDark ? "rgba(255,255,255,0.08)" : "#E2E8F0";
  const txt    = isDark ? "#F1F5F9" : "#0F172A";
  const sub    = isDark ? "#94A3B8" : "#64748B";

  const boq = getBOQSummary();
  const boqPct = Math.round((boq.executedAmt / boq.totalAmt) * 100);

  const filtered = boqItems.filter(item => {
    const matchCat = activeCategory === "all" || item.category === activeCategory;
    const matchSearch = !search || item.description.toLowerCase().includes(search.toLowerCase()) || item.code.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  function execPct(item: typeof boqItems[0]) {
    if (item.unit === "lot") return Math.round(item.executedQty * 100);
    return Math.round((item.executedQty / item.quantity) * 100);
  }

  function execAmt(item: typeof boqItems[0]) {
    if (item.unit === "lot") return item.amount * item.executedQty;
    return item.executedQty * item.rate;
  }

  const catTotals: Record<string, { total: number; exec: number }> = {};
  for (const item of boqItems) {
    if (!catTotals[item.category]) catTotals[item.category] = { total: 0, exec: 0 };
    catTotals[item.category].total += item.amount;
    catTotals[item.category].exec  += execAmt(item);
  }

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", background: bg }}>

      {/* Summary Strip */}
      <div style={{ padding: "16px 20px", background: card, borderBottom: `1px solid ${border}`, flexShrink: 0 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12, marginBottom: 12 }}>
          {[
            { label: "Total Contract Value", value: fmtINR(boq.totalAmt), color: txt },
            { label: "Executed Value",        value: fmtINR(boq.executedAmt), color: "#1B3A6B" },
            { label: "BOQ Completion",        value: `${boqPct}%`, color: "#22C55E" },
            { label: "Items Completed",       value: `${boq.completedCount}/${boq.totalItems}`, color: "#22C55E" },
            { label: "In Progress / Pending", value: `${boq.inProgressCount} / ${boq.notStartedCount}`, color: "#F97316" },
          ].map(s => (
            <div key={s.label}>
              <div style={{ fontSize: 10, color: sub, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 2 }}>{s.label}</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: s.color }}>{s.value}</div>
            </div>
          ))}
        </div>
        <div style={{ height: 8, background: isDark ? "#334155" : "#E2E8F0", borderRadius: 6, overflow: "hidden" }}>
          <div style={{ width: `${boqPct}%`, height: "100%", background: "linear-gradient(90deg, #1B3A6B, #22C55E)", borderRadius: 6 }} />
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div style={{ padding: "0 20px", background: card, borderBottom: `1px solid ${border}`, flexShrink: 0 }}>
        <div style={{ display: "flex", gap: 0, overflowX: "auto" }}>
          {BOQ_CATEGORIES.map(cat => {
            const tot  = cat.id === "all" ? boq.totalAmt    : (catTotals[cat.id]?.total ?? 0);
            const exec = cat.id === "all" ? boq.executedAmt : (catTotals[cat.id]?.exec  ?? 0);
            const pct  = tot > 0 ? Math.round((exec / tot) * 100) : 0;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                style={{
                  padding: "10px 14px", whiteSpace: "nowrap", border: "none", cursor: "pointer",
                  background: "transparent", borderBottom: isActive ? `2px solid ${cat.color}` : "2px solid transparent",
                  color: isActive ? cat.color : sub, fontSize: 12, fontWeight: isActive ? 700 : 400,
                  display: "flex", alignItems: "center", gap: 5,
                }}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
                {cat.id !== "all" && tot > 0 && (
                  <span style={{ fontSize: 9, fontWeight: 700, color: cat.color, background: cat.bg, borderRadius: 8, padding: "1px 5px" }}>{pct}%</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Search */}
      <div style={{ padding: "10px 20px", flexShrink: 0 }}>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by description or code…"
          style={{
            width: "100%", padding: "8px 12px", borderRadius: 8,
            border: `1px solid ${border}`, background: card, color: txt,
            fontSize: 12, outline: "none",
          }}
        />
      </div>

      {/* BOQ Table */}
      <div style={{ flex: 1, overflowY: "auto", padding: "0 20px 20px" }}>
        {/* Header */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "80px 1fr 60px 80px 80px 80px 80px 100px",
          gap: 8, padding: "8px 12px",
          background: isDark ? "#0F172A" : "#F8FAFC",
          borderRadius: "8px 8px 0 0", border: `1px solid ${border}`, borderBottom: "none",
          fontSize: 10, fontWeight: 700, color: sub, textTransform: "uppercase", letterSpacing: "0.05em",
        }}>
          <div>Code</div>
          <div>Description</div>
          <div style={{ textAlign: "right" }}>Unit</div>
          <div style={{ textAlign: "right" }}>Quantity</div>
          <div style={{ textAlign: "right" }}>Executed</div>
          <div style={{ textAlign: "right" }}>Rate (₹)</div>
          <div style={{ textAlign: "right" }}>Amount</div>
          <div>Status</div>
        </div>

        {/* Rows */}
        {filtered.map((item, idx) => {
          const pct    = execPct(item);
          const styCfg = STATUS_STYLE[item.status];
          const cat    = BOQ_CATEGORIES.find(c => c.id === item.category)!;
          return (
            <div
              key={item.id}
              style={{
                display: "grid",
                gridTemplateColumns: "80px 1fr 60px 80px 80px 80px 80px 100px",
                gap: 8, padding: "10px 12px",
                background: idx % 2 === 0 ? card : (isDark ? "#172033" : "#FAFBFC"),
                border: `1px solid ${border}`, borderTop: "none",
                borderRadius: idx === filtered.length - 1 ? "0 0 8px 8px" : 0,
                alignItems: "center",
              }}
            >
              <div style={{ fontSize: 10, fontWeight: 700, color: cat.color }}>{item.code}</div>
              <div>
                <div style={{ fontSize: 12, color: txt, lineHeight: 1.3 }}>{item.description}</div>
                {item.remarks && <div style={{ fontSize: 10, color: "#F97316", marginTop: 2 }}>{item.remarks}</div>}
                <div style={{ marginTop: 4, height: 4, background: isDark ? "#334155" : "#E2E8F0", borderRadius: 3, overflow: "hidden" }}>
                  <div style={{ width: `${pct}%`, height: "100%", background: cat.color, borderRadius: 3 }} />
                </div>
              </div>
              <div style={{ fontSize: 11, color: sub, textAlign: "right" }}>{item.unit}</div>
              <div style={{ fontSize: 11, color: txt, textAlign: "right" }}>{item.quantity.toLocaleString("en-IN")}</div>
              <div style={{ fontSize: 11, textAlign: "right" }}>
                <span style={{ color: pct === 100 ? "#22C55E" : txt }}>{item.unit === "lot" ? `${Math.round(item.executedQty * 100)}%` : item.executedQty.toLocaleString("en-IN")}</span>
              </div>
              <div style={{ fontSize: 11, color: sub, textAlign: "right" }}>
                {item.unit === "lot" ? "—" : `₹${item.rate.toLocaleString("en-IN")}`}
              </div>
              <div style={{ fontSize: 11, color: txt, textAlign: "right" }}>{fmtINR(item.amount)}</div>
              <div>
                <span style={{ fontSize: 10, fontWeight: 700, color: styCfg.color, background: styCfg.bg, borderRadius: 10, padding: "3px 8px", display: "block", textAlign: "center" }}>
                  {pct > 0 && pct < 100 ? `${pct}%  ` : ""}{styCfg.label}
                </span>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: 40, color: sub, background: card, border: `1px solid ${border}`, borderRadius: "0 0 8px 8px", borderTop: "none" }}>
            No items match your search.
          </div>
        )}
      </div>
    </div>
  );
}
