import { useState } from "react";
import { receipts, fmtINR } from "../ownerPortalData";
import { Download, CheckCircle2, Search, FileText } from "lucide-react";

const MODE_COLOR: Record<string, { color: string; bg: string }> = {
  NEFT:   { color: "#1B3A6B", bg: "#EFF6FF" },
  IMPS:   { color: "#7C3AED", bg: "#EDE9FE" },
  Cheque: { color: "#0D9488", bg: "#CCFBF1" },
  Cash:   { color: "#C9922A", bg: "#FEF3C7" },
  UPI:    { color: "#22C55E", bg: "#F0FDF4" },
};

export function PaymentReceiptsView() {
  const [downloading, setDownloading] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const filtered = receipts.filter(r =>
    !search ||
    r.receiptNo.toLowerCase().includes(search.toLowerCase()) ||
    r.installment.toLowerCase().includes(search.toLowerCase())
  );

  const totalPaid = receipts.reduce((s, r) => s + r.amount, 0);

  function handleDownload(id: string) {
    setDownloading(id);
    setTimeout(() => setDownloading(null), 1800);
  }

  return (
    <div className="flex-1 overflow-y-auto">

      {/* Summary */}
      <div style={{ margin: "12px 16px 0", background: "linear-gradient(135deg, #0A1628 0%, #1B3A6B 100%)", borderRadius: 20, padding: "18px 18px 16px" }}>
        <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Total Receipts</p>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
          <div>
            <p style={{ color: "#C9922A", fontSize: 28, fontWeight: 900, lineHeight: 1 }}>{fmtINR(totalPaid)}</p>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 11, marginTop: 4 }}>{receipts.length} receipts issued</p>
          </div>
          <div style={{ textAlign: "right" }}>
            <span style={{ background: "#F0FDF4", color: "#22C55E", fontSize: 10, fontWeight: 800, padding: "5px 10px", borderRadius: 99 }}>
              ✓ All Verified
            </span>
          </div>
        </div>
      </div>

      {/* Search */}
      <div style={{ padding: "10px 16px 0" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#fff", border: "1.5px solid #E2E8F0", borderRadius: 12, padding: "0 12px", height: 40 }}>
          <Search size={14} color="#94A3B8" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search receipts…"
            className="flex-1 bg-transparent outline-none"
            style={{ fontSize: 13, color: "#0F172A" }}
          />
        </div>
      </div>

      {/* Receipt list */}
      <div style={{ padding: "10px 16px 16px", display: "flex", flexDirection: "column", gap: 8 }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px 0" }}>
            <FileText size={32} color="#CBD5E1" style={{ margin: "0 auto 8px" }} />
            <p style={{ color: "#94A3B8", fontSize: 13, fontWeight: 600 }}>No receipts found</p>
          </div>
        ) : filtered.map(r => {
          const modeCfg  = MODE_COLOR[r.mode] ?? { color: "#64748B", bg: "#F8FAFC" };
          const isLoading = downloading === r.id;

          return (
            <div
              key={r.id}
              style={{ background: "#fff", border: "1.5px solid #F1F5F9", borderRadius: 18, padding: "14px 14px", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}
            >
              {/* Top row */}
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 10 }}>
                <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                  <div style={{ width: 38, height: 38, borderRadius: 11, background: "#F8FAFC", border: "1.5px solid #E2E8F0", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <FileText size={17} color="#1B3A6B" />
                  </div>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 800, color: "#0F172A" }}>{r.receiptNo}</p>
                    <p style={{ fontSize: 11, color: "#64748B", marginTop: 2 }}>{r.installment}</p>
                  </div>
                </div>
                <p style={{ fontSize: 16, fontWeight: 900, color: "#22C55E" }}>{fmtINR(r.amount)}</p>
              </div>

              {/* Detail row */}
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                <span style={{ fontSize: 10, color: "#94A3B8" }}>📅 {r.date}</span>
                <span style={{ width: 3, height: 3, borderRadius: 99, background: "#CBD5E1" }} />
                <span style={{ fontSize: 10, fontWeight: 700, color: modeCfg.color, background: modeCfg.bg, padding: "2px 8px", borderRadius: 99 }}>{r.mode}</span>
                <span style={{ fontSize: 10, color: "#94A3B8", fontFamily: "monospace", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  Ref: {r.refNo}
                </span>
              </div>

              {/* Action row */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 10, paddingTop: 10, borderTop: "1px dashed #F1F5F9" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <CheckCircle2 size={13} color="#22C55E" />
                  <span style={{ fontSize: 10, color: "#22C55E", fontWeight: 700 }}>Official Receipt Issued</span>
                </div>
                <button
                  onClick={() => handleDownload(r.id)}
                  className="active:scale-95 transition-transform"
                  style={{
                    display: "flex", alignItems: "center", gap: 5,
                    background: isLoading ? "#F0FDF4" : "#EFF6FF",
                    color: isLoading ? "#22C55E" : "#1B3A6B",
                    border: `1.5px solid ${isLoading ? "#86EFAC" : "#BFDBFE"}`,
                    borderRadius: 10, padding: "6px 12px", fontSize: 11, fontWeight: 800,
                  }}
                >
                  {isLoading
                    ? <><div style={{ width: 10, height: 10, borderRadius: 99, border: "2px solid #22C55E", borderTopColor: "transparent", animation: "spin 0.7s linear infinite" }} />Downloading…</>
                    : <><Download size={12} />Download PDF</>
                  }
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
