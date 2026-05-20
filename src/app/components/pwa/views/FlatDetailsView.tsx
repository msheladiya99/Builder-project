import { useState } from "react";
import { Search, Phone, MessageSquare, ChevronRight, Home, AlertCircle, X } from "lucide-react";
import { flats, fmtINR, initials, FLAT_STATUS, type Flat } from "../pwaData";

const TOWERS = ["All","A","B","C"] as const;

export function FlatDetailsView() {
  const [search, setSearch]   = useState("");
  const [tower, setTower]     = useState<string>("All");
  const [detail, setDetail]   = useState<Flat | null>(null);

  const visible = flats.filter(f => {
    const matchT = tower === "All" || f.tower === tower;
    const q = search.toLowerCase();
    const matchS = f.no.toLowerCase().includes(q) || f.owner.toLowerCase().includes(q) || f.type.toLowerCase().includes(q);
    return matchT && matchS;
  });

  /* ── Detail panel ── */
  if (detail) {
    const pct = Math.round((detail.paid / detail.value) * 100);
    const due = detail.value - detail.paid;
    const ss  = FLAT_STATUS[detail.status];
    return (
      <div className="flex flex-col h-full" style={{ background: "#F8FAFC" }}>
        {/* Hero */}
        <div style={{ background: detail.color, padding: "16px 16px 20px" }}>
          <button onClick={() => setDetail(null)} className="active:opacity-60 transition-opacity" style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 12 }}>
            <ChevronRight size={14} color="rgba(255,255,255,0.55)" style={{ transform: "rotate(180deg)" }} />
            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.55)", fontWeight: 700 }}>All Flats</span>
          </button>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
            <div>
              <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 11, fontWeight: 600 }}>Tower {detail.tower} · Floor {detail.floor}</p>
              <p style={{ color: "#fff", fontWeight: 900, fontSize: 26, lineHeight: 1.1, marginTop: 2 }}>{detail.no}</p>
              <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 12, marginTop: 3 }}>{detail.type} · {detail.area} sq.ft</p>
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={{ color: "#fff", fontWeight: 900, fontSize: 20 }}>{fmtINR(detail.value)}</p>
              <span style={{ background: "rgba(255,255,255,0.2)", color: "#fff", fontSize: 9, fontWeight: 800, padding: "3px 10px", borderRadius: 99 }}>{detail.status}</span>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div style={{ padding: "14px 14px 24px", display: "flex", flexDirection: "column", gap: 12 }}>

            {/* Payment progress */}
            <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 18, padding: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                <p style={{ fontSize: 13, fontWeight: 800, color: "#0F172A" }}>Payment Progress</p>
                <span style={{ fontSize: 11, fontWeight: 800, color: ss.color }}>{pct}%</span>
              </div>
              <div style={{ height: 10, borderRadius: 99, background: "#F1F5F9", overflow: "hidden", marginBottom: 10 }}>
                <div style={{ height: "100%", borderRadius: 99, background: detail.color, width: `${pct}%`, transition: "width 0.4s" }} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {[
                  { label: "Total Value",  val: fmtINR(detail.value), color: "#0F172A"  },
                  { label: "Amount Paid",  val: fmtINR(detail.paid),  color: "#16A34A"  },
                  { label: "Balance Due",  val: fmtINR(due),          color: due > 0 ? "#EF4444" : "#16A34A" },
                  { label: "Status",       val: detail.status,        color: ss.color    },
                ].map(r => (
                  <div key={r.label} style={{ background: "#F8FAFC", borderRadius: 10, padding: "8px 10px" }}>
                    <p style={{ fontSize: 9, color: "#94A3B8", fontWeight: 700 }}>{r.label}</p>
                    <p style={{ fontSize: 13, fontWeight: 800, color: r.color, marginTop: 2 }}>{r.val}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Owner actions */}
            {detail.owner !== "—" && (
              <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 18, padding: 14 }}>
                <p style={{ fontSize: 10, fontWeight: 800, color: "#94A3B8", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 12 }}>Owner</p>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: detail.color, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 900, fontSize: 14, flexShrink: 0 }}>
                    {initials(detail.owner)}
                  </div>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 800, color: "#0F172A" }}>{detail.owner}</p>
                    <p style={{ fontSize: 11, color: "#64748B", marginTop: 2 }}>{detail.phone}</p>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <a href={`tel:${detail.phone.replace(/\s/g,"")}`}
                    style={{ flex: 1, height: 42, borderRadius: 12, border: "1.5px solid #E2E8F0", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, fontSize: 12, fontWeight: 800, color: "#0F172A", textDecoration: "none" }}
                    className="active:scale-95 transition-transform"
                  >
                    <Phone size={14} /> Call
                  </a>
                  <button
                    style={{ flex: 1, height: 42, borderRadius: 12, background: "#16A34A", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, fontSize: 12, fontWeight: 800, color: "#fff" }}
                    className="active:scale-95 transition-transform"
                  >
                    <MessageSquare size={14} /> WhatsApp
                  </button>
                </div>
              </div>
            )}

            {/* High balance alert */}
            {due > 1_000_000 && (
              <div style={{ background: "#FFFBEB", border: "1.5px solid #FCD34D", borderRadius: 14, padding: "12px 14px", display: "flex", gap: 10 }}>
                <AlertCircle size={16} color="#F59E0B" style={{ flexShrink: 0, marginTop: 1 }} />
                <div>
                  <p style={{ fontSize: 12, fontWeight: 800, color: "#92400E" }}>High Outstanding Balance</p>
                  <p style={{ fontSize: 10, color: "#B45309", marginTop: 2 }}>{fmtINR(due)} due · Consider sending demand notice</p>
                </div>
              </div>
            )}

            {/* Specs table */}
            <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 18, overflow: "hidden" }}>
              <p style={{ fontSize: 10, fontWeight: 800, color: "#94A3B8", letterSpacing: "0.08em", textTransform: "uppercase", padding: "12px 16px", borderBottom: "1px solid #F1F5F9" }}>Flat Specs</p>
              {[
                ["Flat No",       detail.no],
                ["Tower",         `Tower ${detail.tower}`],
                ["Floor",         `${detail.floor}`],
                ["Configuration", detail.type],
                ["Carpet Area",   `${detail.area} sq.ft`],
                ["Total Value",   fmtINR(detail.value)],
              ].map(([l, v]) => (
                <div key={l} style={{ display: "flex", justifyContent: "space-between", padding: "10px 16px", borderBottom: "1px solid #F8FAFC" }}>
                  <span style={{ fontSize: 12, color: "#64748B" }}>{l}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#0F172A" }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ── List ── */
  const totalValue = visible.reduce((s, f) => s + f.value, 0);
  const totalDue   = visible.reduce((s, f) => s + (f.value - f.paid), 0);

  return (
    <div className="flex flex-col h-full" style={{ background: "#F8FAFC" }}>
      {/* Search + tower filter */}
      <div style={{ flexShrink: 0, padding: "4px 12px 8px", display: "flex", flexDirection: "column", gap: 8 }}>
        <div style={{ background: "#fff", border: "1.5px solid #E2E8F0", borderRadius: 14, height: 40, display: "flex", alignItems: "center", paddingInline: 12, gap: 8 }}>
          <Search size={13} color="#94A3B8" style={{ flexShrink: 0 }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search flat no, owner, type…"
            className="flex-1 bg-transparent outline-none"
            style={{ fontSize: 13, color: "#0F172A" }}
          />
          {search && <button onClick={() => setSearch("")}><X size={13} color="#94A3B8" /></button>}
        </div>
        {/* Tower tabs */}
        <div style={{ display: "flex", gap: 6 }}>
          {TOWERS.map(t => (
            <button
              key={t}
              onClick={() => setTower(t)}
              className="active:scale-95 transition-transform"
              style={{
                height: 32, paddingInline: 14, borderRadius: 99,
                background: tower === t ? "#1B3A6B" : "#fff",
                color: tower === t ? "#fff" : "#64748B",
                border: `1.5px solid ${tower === t ? "#1B3A6B" : "#E2E8F0"}`,
                fontSize: 11, fontWeight: 800,
              }}
            >
              {t === "All" ? "All Towers" : `Tower ${t}`}
            </button>
          ))}
        </div>
      </div>

      {/* Summary strip */}
      <div style={{ flexShrink: 0, marginInline: 12, marginBottom: 8, background: "#fff", border: "1px solid #E2E8F0", borderRadius: 14, padding: "10px 16px", display: "flex", justifyContent: "space-between" }}>
        <div>
          <p style={{ fontSize: 11, color: "#94A3B8", fontWeight: 600 }}>{visible.length} flats · {visible.filter(f=>f.status!=="Available").length} sold</p>
          <p style={{ fontSize: 14, fontWeight: 900, color: "#0F172A" }}>{fmtINR(totalValue)}</p>
        </div>
        <div style={{ textAlign: "right" }}>
          <p style={{ fontSize: 11, color: "#94A3B8", fontWeight: 600 }}>Outstanding</p>
          <p style={{ fontSize: 14, fontWeight: 900, color: "#EF4444" }}>{fmtINR(totalDue)}</p>
        </div>
      </div>

      {/* Flat cards */}
      <div className="flex-1 overflow-y-auto" style={{ paddingInline: 12 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, paddingBottom: 16 }}>
          {visible.map(f => {
            const pct = Math.round((f.paid / f.value) * 100);
            const ss  = FLAT_STATUS[f.status];
            return (
              <button
                key={f.id}
                onClick={() => setDetail(f)}
                className="w-full text-left active:scale-[0.98] transition-transform"
                style={{ background: "#fff", border: "1.5px solid #E2E8F0", borderRadius: 18, padding: "12px 14px", display: "flex", alignItems: "center", gap: 12 }}
              >
                {/* Badge */}
                <div style={{ width: 48, height: 48, borderRadius: 14, background: f.color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <p style={{ color: "#fff", fontWeight: 900, fontSize: 13, lineHeight: 1 }}>{f.no.split("-")[1]}</p>
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                    <p style={{ fontSize: 13, fontWeight: 800, color: "#0F172A" }}>{f.no}</p>
                    <span style={{ fontSize: 8, fontWeight: 800, padding: "2px 7px", borderRadius: 99, background: ss.bg, color: ss.color }}>{f.status}</span>
                  </div>
                  <p style={{ fontSize: 10, color: "#64748B", marginBottom: 4 }}>{f.type} · {f.area} sq.ft · Fl.{f.floor}</p>
                  {f.owner !== "—" && <p style={{ fontSize: 10, fontWeight: 600, color: "#475569" }}>{f.owner}</p>}
                  {/* Payment bar */}
                  <div style={{ height: 3, borderRadius: 99, background: "#F1F5F9", overflow: "hidden", marginTop: 5 }}>
                    <div style={{ height: "100%", borderRadius: 99, background: f.color, width: `${pct}%` }} />
                  </div>
                </div>

                {/* Right */}
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <p style={{ fontSize: 13, fontWeight: 900, color: "#0F172A" }}>{fmtINR(f.value)}</p>
                  <p style={{ fontSize: 10, fontWeight: 700, color: "#16A34A" }}>{pct}% paid</p>
                  <ChevronRight size={14} color="#CBD5E1" style={{ marginLeft: "auto", marginTop: 4 }} />
                </div>
              </button>
            );
          })}
          {visible.length === 0 && (
            <div style={{ textAlign: "center", padding: "48px 0" }}>
              <Home size={32} color="#CBD5E1" style={{ margin: "0 auto 8px" }} />
              <p style={{ fontSize: 13, color: "#94A3B8" }}>No flats found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
