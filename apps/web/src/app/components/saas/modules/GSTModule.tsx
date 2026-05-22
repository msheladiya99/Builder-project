import { useState } from "react";
import { CheckCircle2, Clock, AlertCircle, Download, FileText, ExternalLink, TrendingUp } from "lucide-react";
import { gstInvoices, gstReturns, itcEntries, fmtINR, type GSTInvoice, type GSTReturn, type ITCEntry } from "../saasData";
import { DataTable, StatusBadge, EmptyState, type Column } from "../components/SharedUI";

type GSTTab = "overview" | "gstr1" | "gstr3b" | "itc" | "einvoice";

const TABS: { id: GSTTab; label: string }[] = [
  { id: "overview", label: "Overview"   },
  { id: "gstr1",    label: "GSTR-1"    },
  { id: "gstr3b",   label: "GSTR-3B"   },
  { id: "itc",      label: "Input Tax Credit" },
  { id: "einvoice", label: "E-Invoice" },
];

const RETURN_STATUS = {
  filed:   { color: "#22C55E", bg: "#F0FDF4", label: "Filed",   icon: <CheckCircle2 size={11} /> },
  pending: { color: "#F59E0B", bg: "#FFFBEB", label: "Pending", icon: <Clock size={11} /> },
  late:    { color: "#EF4444", bg: "#FEF2F2", label: "Late",    icon: <AlertCircle size={11} /> },
};

const INV_STATUS = {
  filed:   { color: "#22C55E", bg: "#F0FDF4", label: "Filed"   },
  pending: { color: "#F59E0B", bg: "#FFFBEB", label: "Pending" },
  amended: { color: "#7C3AED", bg: "#EDE9FE", label: "Amended" },
};

const ITC_ELGB = {
  eligible:   { color: "#22C55E", bg: "#F0FDF4", label: "Eligible"   },
  ineligible: { color: "#EF4444", bg: "#FEF2F2", label: "Ineligible" },
  blocked:    { color: "#64748B", bg: "#F8FAFC", label: "Blocked"    },
};

interface Props { isDark: boolean }

function SummaryCard({ label, value, sub, color, bg, icon }: { label: string; value: string; sub?: string; color: string; bg: string; icon: string }) {
  return (
    <div style={{ background: bg, borderRadius: 16, padding: 16, border: `1.5px solid ${color}20` }}>
      <div style={{ fontSize: 22, marginBottom: 6 }}>{icon}</div>
      <p style={{ fontSize: 20, fontWeight: 900, color }}>{value}</p>
      <p style={{ fontSize: 11, fontWeight: 700, color, marginTop: 2 }}>{label}</p>
      {sub && <p style={{ fontSize: 10, color: `${color}90`, marginTop: 2 }}>{sub}</p>}
    </div>
  );
}

function OverviewTab({ isDark }: { isDark: boolean }) {
  const totalTax     = gstReturns.filter(r => r.status === "filed").reduce((s, r) => s + r.taxLiability, 0);
  const totalITC     = gstReturns.filter(r => r.status === "filed").reduce((s, r) => s + r.itcClaimed, 0);
  const totalPayable = gstReturns.filter(r => r.status === "filed").reduce((s, r) => s + r.netPayable, 0);
  const pendingCount = gstReturns.filter(r => r.status === "pending").length;

  const card = isDark ? "rgba(255,255,255,0.04)" : "#fff";
  const bdr  = isDark ? "rgba(255,255,255,0.07)" : "#F1F5F9";
  const text = isDark ? "#F1F5F9"                 : "#0F172A";
  const sub  = isDark ? "rgba(255,255,255,0.4)"   : "#64748B";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* KPI row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 14 }}>
        <SummaryCard label="Total Tax Liability"   value={fmtINR(totalTax)}     sub="FY 2025-26 (filed)"     color="#1B3A6B" bg="#EFF6FF" icon="💰" />
        <SummaryCard label="ITC Claimed"           value={fmtINR(totalITC)}     sub="Input tax credit"       color="#22C55E" bg="#F0FDF4" icon="✅" />
        <SummaryCard label="Net Tax Paid"          value={fmtINR(totalPayable)} sub="After ITC adjustment"   color="#7C3AED" bg="#EDE9FE" icon="🏦" />
        <SummaryCard label="Returns Pending"       value={String(pendingCount)} sub="Action required"        color="#EF4444" bg="#FEF2F2" icon="⚠️" />
      </div>

      {/* Filing calendar */}
      <div style={{ background: card, border: `1.5px solid ${bdr}`, borderRadius: 18, padding: 20 }}>
        <p style={{ fontSize: 13, fontWeight: 900, color: text, marginBottom: 14 }}>Filing Calendar — FY 2025–26</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {gstReturns.map((r, i) => {
            const cfg = RETURN_STATUS[r.status];
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", background: isDark ? "rgba(255,255,255,0.03)" : "#F8FAFC", borderRadius: 12, border: `1px solid ${bdr}` }}>
                <span style={{ fontSize: 11, fontWeight: 800, color: "#7C3AED", background: "#EDE9FE", padding: "4px 10px", borderRadius: 8, flexShrink: 0 }}>{r.type}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 12, fontWeight: 700, color: text }}>{r.period}</p>
                  <p style={{ fontSize: 10, color: sub }}>Due: {r.dueDate}{r.filedDate ? ` · Filed: ${r.filedDate}` : ""}</p>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <p style={{ fontSize: 12, fontWeight: 900, color: text }}>{fmtINR(r.netPayable)}</p>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 3, fontSize: 9, fontWeight: 800, color: cfg.color, background: cfg.bg, padding: "2px 7px", borderRadius: 99 }}>
                    {cfg.icon} {cfg.label}
                  </span>
                </div>
                {r.status === "pending" && (
                  <button style={{ flexShrink: 0, padding: "6px 14px", background: "#1B3A6B", color: "#fff", borderRadius: 9, fontSize: 11, fontWeight: 800 }} className="active:scale-95 transition-transform">
                    File Now
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* GSTIN info */}
      <div style={{ background: "linear-gradient(135deg, #1B3A6B, #7C3AED)", borderRadius: 18, padding: 20 }}>
        <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>Registered GST Details</p>
        <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
          {[
            { label: "GSTIN",             value: "27AABCS1234A1Z5"      },
            { label: "Legal Name",        value: "Shri Hari Group LLP"  },
            { label: "State",             value: "Maharashtra (27)"     },
            { label: "Registration Type", value: "Regular"              },
            { label: "Effective From",    value: "01 Apr 2019"          },
          ].map(item => (
            <div key={item.label}>
              <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 9, fontWeight: 700, textTransform: "uppercase" }}>{item.label}</p>
              <p style={{ color: "#fff", fontSize: 12, fontWeight: 800 }}>{item.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function GSTR1Tab({ isDark }: { isDark: boolean }) {
  const invoiceCols: Column<GSTInvoice>[] = [
    { key: "invoiceNo", header: "Invoice No.",   width: "160px", render: r => <span style={{ fontFamily: "monospace", fontSize: 11 }}>{r.invoiceNo}</span> },
    { key: "date",      header: "Date",          width: "100px", render: r => r.date },
    { key: "buyer",     header: "Buyer",                        render: r => <div><p style={{ fontWeight: 700 }}>{r.buyer}</p>{r.gstin && <p style={{ fontSize: 9, opacity: 0.6 }}>{r.gstin}</p>}</div> },
    { key: "flatNo",    header: "Flat",          width: "100px", render: r => r.flatNo },
    { key: "taxable",   header: "Taxable (₹)",   align: "right", render: r => fmtINR(r.taxableAmount) },
    { key: "cgst",      header: "CGST (₹)",      align: "right", render: r => r.igst > 0 ? "—" : fmtINR(r.cgst) },
    { key: "sgst",      header: "SGST (₹)",      align: "right", render: r => r.igst > 0 ? "—" : fmtINR(r.sgst) },
    { key: "igst",      header: "IGST (₹)",      align: "right", render: r => r.igst > 0 ? fmtINR(r.igst) : "—" },
    { key: "total",     header: "Total (₹)",     align: "right", render: r => <strong>{fmtINR(r.total)}</strong> },
    { key: "type",      header: "Type",          width: "60px",  render: r => <StatusBadge label={r.type} color={r.type === "B2B" ? "#1B3A6B" : "#0D9488"} bg={r.type === "B2B" ? "#EFF6FF" : "#CCFBF1"} dot={false} /> },
    { key: "status",    header: "Status",                        render: r => <StatusBadge {...INV_STATUS[r.status]} /> },
  ];

  const totalTax = gstInvoices.reduce((s, i) => s + i.cgst + i.sgst + i.igst, 0);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Summary strip */}
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        {[
          { label: "Total Invoices",    value: gstInvoices.length,                     color: "#1B3A6B", bg: "#EFF6FF" },
          { label: "Total Taxable",     value: fmtINR(gstInvoices.reduce((s,i)=>s+i.taxableAmount,0)), color: "#C9922A", bg: "#FEF3C7" },
          { label: "Total GST",         value: fmtINR(totalTax),                       color: "#22C55E", bg: "#F0FDF4" },
          { label: "Pending E-Invoice", value: gstInvoices.filter(i=>i.status==="pending").length, color: "#EF4444", bg: "#FEF2F2" },
        ].map(s => (
          <div key={s.label} style={{ background: s.bg, border: `1.5px solid ${s.color}20`, borderRadius: 14, padding: "12px 16px", flex: 1, minWidth: 140 }}>
            <p style={{ fontSize: 18, fontWeight: 900, color: s.color }}>{s.value}</p>
            <p style={{ fontSize: 10, fontWeight: 700, color: s.color, marginTop: 2 }}>{s.label}</p>
          </div>
        ))}
        <button style={{ padding: "10px 16px", background: "#1B3A6B", color: "#fff", borderRadius: 12, fontSize: 11, fontWeight: 800, display: "flex", alignItems: "center", gap: 6 }} className="active:scale-95 transition-transform">
          <Download size={14} />Export GSTR-1
        </button>
      </div>
      <DataTable columns={invoiceCols} data={gstInvoices} isDark={isDark} />
    </div>
  );
}

function GSTR3BTab({ isDark }: { isDark: boolean }) {
  const pending = gstReturns.filter(r => r.type === "GSTR-3B" && r.status === "pending")[0];
  const text  = isDark ? "#F1F5F9" : "#0F172A";
  const sub   = isDark ? "rgba(255,255,255,0.4)" : "#64748B";
  const card  = isDark ? "rgba(255,255,255,0.04)" : "#fff";
  const bdr   = isDark ? "rgba(255,255,255,0.07)" : "#F1F5F9";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Pending action card */}
      {pending && (
        <div style={{ background: "#FEF2F2", border: "1.5px solid #FECACA", borderRadius: 18, padding: 20 }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                <AlertCircle size={18} color="#EF4444" />
                <p style={{ fontSize: 14, fontWeight: 900, color: "#991B1B" }}>GSTR-3B Due: {pending.period}</p>
              </div>
              <p style={{ fontSize: 12, color: "#EF4444" }}>Due date: {pending.dueDate} · Net payable: {fmtINR(pending.netPayable)}</p>
            </div>
            <button style={{ padding: "10px 20px", background: "#EF4444", color: "#fff", borderRadius: 12, fontSize: 12, fontWeight: 800, display: "flex", alignItems: "center", gap: 6 }} className="active:scale-95 transition-transform">
              <ExternalLink size={14} />File on GST Portal
            </button>
          </div>
          <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
            {[
              { label: "Tax Liability",     value: fmtINR(pending.taxLiability) },
              { label: "ITC to be Claimed", value: fmtINR(pending.itcClaimed)   },
              { label: "Net Tax Payable",   value: fmtINR(pending.netPayable)   },
            ].map(s => (
              <div key={s.label} style={{ background: "rgba(239,68,68,0.08)", borderRadius: 10, padding: "10px 12px" }}>
                <p style={{ fontSize: 16, fontWeight: 900, color: "#991B1B" }}>{s.value}</p>
                <p style={{ fontSize: 10, color: "#EF4444", fontWeight: 700, marginTop: 2 }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filed returns history */}
      <div style={{ background: card, border: `1.5px solid ${bdr}`, borderRadius: 18, padding: 20 }}>
        <p style={{ fontSize: 13, fontWeight: 900, color: text, marginBottom: 14 }}>GSTR-3B History</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {gstReturns.filter(r => r.type === "GSTR-3B").map((r, i) => {
            const cfg = RETURN_STATUS[r.status];
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", background: isDark ? "rgba(255,255,255,0.03)" : "#F8FAFC", borderRadius: 10, border: `1px solid ${bdr}` }}>
                <div style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 8, alignItems: "center" }}>
                  <div>
                    <p style={{ fontSize: 12, fontWeight: 800, color: text }}>{r.period}</p>
                    <p style={{ fontSize: 10, color: sub }}>GSTR-3B</p>
                  </div>
                  <div><p style={{ fontSize: 11, color: sub }}>Liability</p><p style={{ fontSize: 12, fontWeight: 700, color: text }}>{fmtINR(r.taxLiability)}</p></div>
                  <div><p style={{ fontSize: 11, color: sub }}>ITC</p><p style={{ fontSize: 12, fontWeight: 700, color: "#22C55E" }}>-{fmtINR(r.itcClaimed)}</p></div>
                  <div><p style={{ fontSize: 11, color: sub }}>Net Paid</p><p style={{ fontSize: 12, fontWeight: 800, color: text }}>{fmtINR(r.netPayable)}</p></div>
                </div>
                <StatusBadge {...cfg} />
                {r.status === "filed" && (
                  <button style={{ flexShrink: 0, width: 30, height: 30, borderRadius: 8, background: "#EFF6FF", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Download size={13} color="#1B3A6B" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function ITCTab({ isDark }: { isDark: boolean }) {
  const eligible   = itcEntries.filter(e => e.eligibility === "eligible");
  const totalITC   = eligible.reduce((s, e) => s + e.igst + e.cgst + e.sgst, 0);

  const cols: Column<ITCEntry>[] = [
    { key: "vendor",    header: "Vendor",                      render: r => <div><p style={{ fontWeight: 700 }}>{r.vendor}</p><p style={{ fontSize: 9, opacity: 0.6 }}>{r.gstin}</p></div> },
    { key: "invoice",   header: "Invoice",   width: "110px",   render: r => <span style={{ fontFamily: "monospace", fontSize: 11 }}>{r.invoiceNo}</span> },
    { key: "date",      header: "Date",      width: "95px",    render: r => r.date },
    { key: "taxable",   header: "Taxable",   align: "right",   render: r => fmtINR(r.taxableValue) },
    { key: "cgst",      header: "CGST",      align: "right",   render: r => r.cgst > 0 ? fmtINR(r.cgst) : "—" },
    { key: "sgst",      header: "SGST",      align: "right",   render: r => r.sgst > 0 ? fmtINR(r.sgst) : "—" },
    { key: "igst",      header: "IGST",      align: "right",   render: r => r.igst > 0 ? fmtINR(r.igst) : "—" },
    { key: "category",  header: "Category",                    render: r => <span style={{ fontSize: 10, color: "#64748B" }}>{r.category}</span> },
    { key: "eligibility", header: "Eligibility",              render: r => <StatusBadge {...ITC_ELGB[r.eligibility]} /> },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        {[
          { label: "Total ITC Available",  value: fmtINR(totalITC),                                                   color: "#22C55E", bg: "#F0FDF4" },
          { label: "Eligible Invoices",    value: eligible.length,                                                     color: "#1B3A6B", bg: "#EFF6FF" },
          { label: "Ineligible",           value: itcEntries.filter(e=>e.eligibility==="ineligible").length,           color: "#EF4444", bg: "#FEF2F2" },
        ].map(s => (
          <div key={s.label} style={{ background: s.bg, border: `1.5px solid ${s.color}20`, borderRadius: 14, padding: "12px 16px", flex: 1, minWidth: 140 }}>
            <p style={{ fontSize: 20, fontWeight: 900, color: s.color }}>{s.value}</p>
            <p style={{ fontSize: 10, fontWeight: 700, color: s.color, marginTop: 2 }}>{s.label}</p>
          </div>
        ))}
      </div>
      <DataTable columns={cols} data={itcEntries} isDark={isDark} />
    </div>
  );
}

function EInvoiceTab({ isDark }: { isDark: boolean }) {
  const text = isDark ? "#F1F5F9" : "#0F172A";
  const sub  = isDark ? "rgba(255,255,255,0.4)" : "#64748B";
  const card = isDark ? "rgba(255,255,255,0.04)" : "#fff";
  const bdr  = isDark ? "rgba(255,255,255,0.07)" : "#F1F5F9";
  const filed   = gstInvoices.filter(i => i.irnNo);
  const pending = gstInvoices.filter(i => !i.irnNo);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 12 }}>
        <SummaryCard label="IRN Generated"  value={String(filed.length)}   color="#22C55E" bg="#F0FDF4" icon="✅" />
        <SummaryCard label="Pending IRN"    value={String(pending.length)} color="#F59E0B" bg="#FFFBEB" icon="⏳" sub="Generate before filing" />
        <SummaryCard label="E-Invoice Turnover" value="₹5 Cr+" color="#1B3A6B" bg="#EFF6FF" icon="📋" sub="Threshold applicable" />
      </div>
      <div style={{ background: card, border: `1.5px solid ${bdr}`, borderRadius: 18, padding: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
          <p style={{ fontSize: 13, fontWeight: 900, color: text }}>Invoice Register</p>
          <button style={{ display: "flex", alignItems: "center", gap: 5, padding: "7px 14px", background: "#1B3A6B", color: "#fff", borderRadius: 9, fontSize: 11, fontWeight: 800 }} className="active:scale-95 transition-transform">
            <TrendingUp size={12} />Generate Bulk IRN
          </button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {gstInvoices.map(inv => (
            <div key={inv.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", background: isDark ? "rgba(255,255,255,0.03)" : "#F8FAFC", borderRadius: 10, border: `1px solid ${bdr}` }}>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: text }}>{inv.invoiceNo}</p>
                <p style={{ fontSize: 9, color: sub }}>{inv.buyer} · {inv.flatNo} · {inv.date}</p>
              </div>
              <p style={{ fontSize: 12, fontWeight: 800, color: text }}>{fmtINR(inv.total)}</p>
              {inv.irnNo ? (
                <div style={{ textAlign: "right" }}>
                  <span style={{ fontSize: 9, fontWeight: 800, color: "#22C55E", background: "#F0FDF4", padding: "2px 7px", borderRadius: 99, display: "block", marginBottom: 2 }}>✓ IRN Generated</span>
                  <span style={{ fontSize: 8, color: sub, fontFamily: "monospace" }}>{inv.irnNo}</span>
                </div>
              ) : (
                <button style={{ flexShrink: 0, padding: "6px 12px", background: "#FEF3C7", color: "#C9922A", borderRadius: 8, fontSize: 10, fontWeight: 800, border: "1.5px solid #FCD34D" }} className="active:scale-95 transition-transform">
                  Generate IRN
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function GSTModule({ isDark }: Props) {
  const [tab, setTab] = useState<GSTTab>("overview");

  const bg    = isDark ? "#0F172A" : "#F1F5F9";
  const card  = isDark ? "rgba(255,255,255,0.04)" : "#fff";
  const bdr   = isDark ? "rgba(255,255,255,0.07)" : "#F1F5F9";
  const text  = isDark ? "#F1F5F9" : "#0F172A";
  const sub   = isDark ? "rgba(255,255,255,0.4)" : "#64748B";

  return (
    <div className="flex flex-col h-full" style={{ background: bg }}>
      {/* Module header */}
      <div style={{ flexShrink: 0, background: card, borderBottom: `1px solid ${bdr}`, padding: "14px 24px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 38, height: 38, borderRadius: 11, background: "#EDE9FE", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>📋</div>
            <div>
              <p style={{ fontSize: 16, fontWeight: 900, color: text }}>GST & Compliance</p>
              <p style={{ fontSize: 10, color: sub }}>GSTIN: 27AABCS1234A1Z5 · Maharashtra · Regular</p>
            </div>
          </div>
          <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", background: "#7C3AED", color: "#fff", borderRadius: 10, fontSize: 12, fontWeight: 800 }} className="active:scale-95 transition-transform">
            <ExternalLink size={13} />GST Portal
          </button>
        </div>
        {/* Tabs */}
        <div style={{ display: "flex", gap: 4, overflowX: "auto" }}>
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                padding: "6px 14px", borderRadius: 8, fontSize: 12, fontWeight: 700, flexShrink: 0,
                background: tab === t.id ? "#7C3AED" : "transparent",
                color: tab === t.id ? "#fff" : sub,
              }}
              className="active:opacity-80 transition-opacity"
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto" style={{ padding: 24 }}>
        {tab === "overview"  && <OverviewTab isDark={isDark} />}
        {tab === "gstr1"     && <GSTR1Tab   isDark={isDark} />}
        {tab === "gstr3b"    && <GSTR3BTab  isDark={isDark} />}
        {tab === "itc"       && <ITCTab     isDark={isDark} />}
        {tab === "einvoice"  && <EInvoiceTab isDark={isDark} />}
      </div>
    </div>
  );
}
