import { useState, useMemo } from "react";
import { Download, AlertCircle, CheckCircle2, FileText } from "lucide-react";
import { mockGSTEntries, mockExpenses, fmtINR, formatDate, FinancialYear } from "../accountingData";

interface Props { fy: FinancialYear; }

type GSTTab = "gstr1" | "gstr3b" | "hsn" | "itc";

export function GSTReportsView({ fy }: Props) {
  const [tab, setTab] = useState<GSTTab>("gstr1");

  const entries = useMemo(() => mockGSTEntries.filter(g => g.fy === fy), [fy]);
  const expenses = useMemo(() => mockExpenses.filter(e => e.fy === fy && e.gst > 0), [fy]);

  const b2b = entries.filter(e => e.type === "B2B");
  const b2cl = entries.filter(e => e.type === "B2CL");
  const b2cs = entries.filter(e => e.type === "B2CS");

  const totalOutputCGST = entries.reduce((s, e) => s + e.cgst, 0);
  const totalOutputSGST = entries.reduce((s, e) => s + e.sgst, 0);
  const totalOutputIGST = entries.reduce((s, e) => s + e.igst, 0);
  const totalOutputTax = totalOutputCGST + totalOutputSGST + totalOutputIGST;
  const totalTaxableValue = entries.reduce((s, e) => s + e.taxableValue, 0);

  const totalInputCGST = expenses.reduce((s, e) => s + e.gst / 2, 0);
  const totalInputSGST = expenses.reduce((s, e) => s + e.gst / 2, 0);
  const totalITC = expenses.reduce((s, e) => s + e.gst, 0);
  const netTaxPayable = totalOutputTax - totalITC;

  const hsnGroups: Record<string, { taxable: number; cgst: number; sgst: number; igst: number; count: number }> = {};
  entries.forEach(e => {
    const hsn = e.invoiceNo.includes("008") ? "997222" : "995411";
    if (!hsnGroups[hsn]) hsnGroups[hsn] = { taxable: 0, cgst: 0, sgst: 0, igst: 0, count: 0 };
    hsnGroups[hsn].taxable += e.taxableValue;
    hsnGroups[hsn].cgst += e.cgst;
    hsnGroups[hsn].sgst += e.sgst;
    hsnGroups[hsn].igst += e.igst;
    hsnGroups[hsn].count++;
  });

  const tabs: { id: GSTTab; label: string }[] = [
    { id: "gstr1", label: "GSTR-1 (Outward)" },
    { id: "gstr3b", label: "GSTR-3B Summary" },
    { id: "hsn", label: "HSN-wise Summary" },
    { id: "itc", label: "ITC Reconciliation" },
  ];

  const TH = ({ children, right }: { children: React.ReactNode; right?: boolean }) => (
    <th className={`px-4 py-3 text-[11px] font-bold text-muted-foreground uppercase tracking-wider ${right ? "text-right" : "text-left"}`}>{children}</th>
  );
  const TD = ({ children, right, bold, cls }: { children: React.ReactNode; right?: boolean; bold?: boolean; cls?: string }) => (
    <td className={`px-4 py-3 text-xs ${right ? "text-right" : "text-left"} ${bold ? "font-bold" : ""} ${cls ?? "text-foreground"}`}>{children}</td>
  );

  return (
    <div className="p-4 lg:p-6 space-y-5">
      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Output Tax Liability", value: fmtINR(totalOutputTax, true), sub: `Taxable: ${fmtINR(totalTaxableValue, true)}`, color: "border-l-destructive" },
          { label: "ITC Available", value: fmtINR(totalITC, true), sub: `${expenses.length} purchase invoices`, color: "border-l-success" },
          { label: "Net GST Payable", value: fmtINR(Math.max(0, netTaxPayable), true), sub: "After ITC set-off", color: "border-l-warning" },
          { label: "GSTR-1 Status", value: "Filed", sub: `Due: 11th every month`, color: "border-l-primary" },
        ].map(k => (
          <div key={k.label} className={`bg-card border border-border rounded-2xl p-4 border-l-4 ${k.color}`}>
            <p className="text-[11px] font-semibold text-muted-foreground">{k.label}</p>
            <p className="text-xl font-bold text-foreground mt-1">{k.value}</p>
            <p className="text-[10px] text-muted-foreground">{k.sub}</p>
          </div>
        ))}
      </div>

      {/* GST breakdown mini cards */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "CGST (Central)", output: totalOutputCGST, input: totalInputCGST, color: "bg-blue-500" },
          { label: "SGST (State)", output: totalOutputSGST, input: totalInputSGST, color: "bg-green-500" },
          { label: "IGST (Integrated)", output: totalOutputIGST, input: 0, color: "bg-purple-500" },
        ].map(g => (
          <div key={g.label} className="bg-card border border-border rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <span className={`w-2.5 h-2.5 rounded-full ${g.color}`} />
              <p className="text-xs font-bold text-foreground">{g.label}</p>
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs"><span className="text-muted-foreground">Output Tax</span><span className="font-semibold text-foreground">{fmtINR(g.output)}</span></div>
              <div className="flex justify-between text-xs"><span className="text-muted-foreground">Input Credit</span><span className="font-semibold text-success">-{fmtINR(g.input)}</span></div>
              <div className="flex justify-between text-xs border-t border-border pt-1.5"><span className="font-bold text-foreground">Net Payable</span><span className="font-bold text-foreground">{fmtINR(Math.max(0, g.output - g.input))}</span></div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="border-b border-border">
        <div className="flex gap-0 overflow-x-auto scrollbar-none">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`px-4 py-2.5 text-xs font-semibold border-b-2 whitespace-nowrap transition-all ${tab === t.id ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border bg-card text-xs font-semibold hover:bg-muted">
          <Download size={13} /> Export {tab === "gstr1" ? "GSTR-1" : tab === "gstr3b" ? "GSTR-3B" : tab === "hsn" ? "HSN" : "ITC"} Data
        </button>
      </div>

      {/* GSTR-1 */}
      {tab === "gstr1" && (
        <div className="space-y-4">
          {[
            { label: "B2B — Business to Business Supplies", rows: b2b, hasGSTIN: true },
            { label: "B2CL — B2C Large (> ₹2.5L, inter-state)", rows: b2cl, hasGSTIN: false },
            { label: "B2CS — B2C Small Supplies", rows: b2cs, hasGSTIN: false },
          ].map(section => (
            <div key={section.label} className="bg-card border border-border rounded-2xl overflow-hidden">
              <div className="px-4 py-3 border-b border-border bg-muted/30 flex items-center justify-between">
                <p className="text-xs font-bold text-foreground">{section.label}</p>
                <div className="flex gap-3 text-xs text-muted-foreground">
                  <span>{section.rows.length} invoices</span>
                  <span className="font-semibold text-foreground">{fmtINR(section.rows.reduce((s, e) => s + e.total, 0), true)}</span>
                </div>
              </div>
              {section.rows.length === 0 ? (
                <p className="px-4 py-6 text-xs text-muted-foreground text-center">No {section.label.split(" — ")[0]} supplies in FY {fy}</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border bg-muted/20">
                        <TH>Invoice No</TH>
                        <TH>Date</TH>
                        <TH>Party</TH>
                        {section.hasGSTIN && <TH>GSTIN</TH>}
                        <TH right>Taxable Value</TH>
                        <TH right>CGST</TH>
                        <TH right>SGST</TH>
                        <TH right>IGST</TH>
                        <TH right>Total</TH>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {section.rows.map(r => (
                        <tr key={r.id} className="hover:bg-muted/30">
                          <TD><span className="font-mono font-semibold">{r.invoiceNo}</span></TD>
                          <TD>{formatDate(r.date)}</TD>
                          <TD>{r.party}</TD>
                          {section.hasGSTIN && <TD><span className="font-mono text-[11px]">{r.gstin}</span></TD>}
                          <TD right>{fmtINR(r.taxableValue)}</TD>
                          <TD right>{fmtINR(r.cgst)}</TD>
                          <TD right>{fmtINR(r.sgst)}</TD>
                          <TD right>{r.igst > 0 ? fmtINR(r.igst) : "—"}</TD>
                          <TD right bold>{fmtINR(r.total)}</TD>
                        </tr>
                      ))}
                      <tr className="border-t-2 border-border bg-muted/30 font-bold">
                        <td colSpan={section.hasGSTIN ? 4 : 3} className="px-4 py-3 text-xs font-bold text-foreground">Total</td>
                        <TD right bold>{fmtINR(section.rows.reduce((s, e) => s + e.taxableValue, 0))}</TD>
                        <TD right bold>{fmtINR(section.rows.reduce((s, e) => s + e.cgst, 0))}</TD>
                        <TD right bold>{fmtINR(section.rows.reduce((s, e) => s + e.sgst, 0))}</TD>
                        <TD right bold>{fmtINR(section.rows.reduce((s, e) => s + e.igst, 0))}</TD>
                        <TD right bold>{fmtINR(section.rows.reduce((s, e) => s + e.total, 0))}</TD>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* GSTR-3B */}
      {tab === "gstr3b" && (
        <div className="space-y-4">
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <div className="px-4 py-3 border-b border-border bg-muted/30">
              <p className="text-xs font-bold text-foreground">3.1 — Details of Outward Supplies and Inward Supplies liable to Reverse Charge</p>
            </div>
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border bg-muted/20"><TH>Nature of Supply</TH><TH right>Taxable Value</TH><TH right>IGST</TH><TH right>CGST</TH><TH right>SGST/UTGST</TH><TH right>Cess</TH></tr></thead>
              <tbody className="divide-y divide-border">
                <tr className="hover:bg-muted/30"><TD>(a) Outward taxable supplies (other than zero rated, nil & exempted)</TD><TD right>{fmtINR(totalTaxableValue)}</TD><TD right>{fmtINR(totalOutputIGST)}</TD><TD right>{fmtINR(totalOutputCGST)}</TD><TD right>{fmtINR(totalOutputSGST)}</TD><TD right>—</TD></tr>
                <tr className="hover:bg-muted/30"><TD>(b) Outward taxable supplies (zero rated)</TD><TD right>—</TD><TD right>—</TD><TD right>—</TD><TD right>—</TD><TD right>—</TD></tr>
                <tr className="hover:bg-muted/30"><TD>(c) Other outward supplies (Nil rated, exempted)</TD><TD right>—</TD><TD right>—</TD><TD right>—</TD><TD right>—</TD><TD right>—</TD></tr>
                <tr className="hover:bg-muted/30"><TD>(d) Inward supplies (liable to reverse charge)</TD><TD right>—</TD><TD right>—</TD><TD right>—</TD><TD right>—</TD><TD right>—</TD></tr>
                <tr className="bg-muted/30 font-bold"><TD bold>(e) Non-GST outward supplies</TD><TD right bold>—</TD><TD right bold>—</TD><TD right bold>—</TD><TD right bold>—</TD><TD right bold>—</TD></tr>
              </tbody>
            </table>
          </div>

          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <div className="px-4 py-3 border-b border-border bg-muted/30">
              <p className="text-xs font-bold text-foreground">4 — Eligible ITC (Input Tax Credit)</p>
            </div>
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border bg-muted/20"><TH>Details</TH><TH right>IGST</TH><TH right>CGST</TH><TH right>SGST/UTGST</TH><TH right>Cess</TH></tr></thead>
              <tbody className="divide-y divide-border">
                <tr className="hover:bg-muted/30"><TD>(A) ITC Available — Imports of Goods</TD><TD right>—</TD><TD right>—</TD><TD right>—</TD><TD right>—</TD></tr>
                <tr className="hover:bg-muted/30"><TD>(B) ITC Available — Imports of Services</TD><TD right>—</TD><TD right>—</TD><TD right>—</TD><TD right>—</TD></tr>
                <tr className="hover:bg-muted/30"><TD>(C) ITC Available — Inward supplies from ISD</TD><TD right>—</TD><TD right>—</TD><TD right>—</TD><TD right>—</TD></tr>
                <tr className="hover:bg-muted/30"><TD>(D) ITC Available — All other ITC</TD><TD right>—</TD><TD right>{fmtINR(totalInputCGST)}</TD><TD right>{fmtINR(totalInputSGST)}</TD><TD right>—</TD></tr>
                <tr className="bg-muted/30"><TD bold>Total ITC Available</TD><TD right bold>—</TD><TD right bold>{fmtINR(totalInputCGST)}</TD><TD right bold>{fmtINR(totalInputSGST)}</TD><TD right bold>—</TD></tr>
              </tbody>
            </table>
          </div>

          <div className="bg-card border border-border rounded-2xl p-5">
            <p className="text-xs font-bold text-foreground mb-4">5 — Net Tax Payable Summary</p>
            <div className="grid grid-cols-3 gap-4">
              {["CGST", "SGST", "IGST"].map((tax, i) => {
                const output = i === 0 ? totalOutputCGST : i === 1 ? totalOutputSGST : totalOutputIGST;
                const input = i === 0 ? totalInputCGST : i === 1 ? totalInputSGST : 0;
                const net = Math.max(0, output - input);
                return (
                  <div key={tax} className="bg-muted/30 rounded-xl p-4">
                    <p className="text-xs font-bold text-muted-foreground mb-3">{tax}</p>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs"><span className="text-muted-foreground">Output Tax</span><span className="font-semibold text-foreground">{fmtINR(output)}</span></div>
                      <div className="flex justify-between text-xs"><span className="text-muted-foreground">Less: ITC</span><span className="font-semibold text-success">-{fmtINR(input)}</span></div>
                      <div className="flex justify-between text-xs border-t border-border pt-2">
                        <span className="font-bold text-foreground">Net Payable</span>
                        <span className={`font-bold ${net > 0 ? "text-destructive" : "text-success"}`}>{fmtINR(net)}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 flex items-center justify-between px-4 py-3 bg-primary/5 border border-primary/20 rounded-xl">
              <span className="text-sm font-bold text-foreground">Total Net GST Payable (Cash Ledger)</span>
              <span className="text-lg font-black text-primary">{fmtINR(Math.max(0, netTaxPayable), true)}</span>
            </div>
          </div>
        </div>
      )}

      {/* HSN Summary */}
      {tab === "hsn" && (
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="px-4 py-3 border-b border-border bg-muted/30">
            <p className="text-xs font-bold text-foreground">HSN/SAC-wise Summary of Outward Supplies</p>
          </div>
          <table className="w-full text-sm">
            <thead><tr className="border-b border-border bg-muted/20"><TH>HSN/SAC</TH><TH>Description</TH><TH>UOM</TH><TH right>Total Qty</TH><TH right>Taxable Value</TH><TH right>GST Rate</TH><TH right>CGST</TH><TH right>SGST</TH><TH right>IGST</TH></tr></thead>
            <tbody className="divide-y divide-border">
              {Object.entries(hsnGroups).map(([hsn, g]) => (
                <tr key={hsn} className="hover:bg-muted/30">
                  <TD><span className="font-mono font-bold">{hsn}</span></TD>
                  <TD>{hsn === "995411" ? "Construction of Residential Buildings" : "Real Estate Maintenance Services"}</TD>
                  <TD>NOS</TD>
                  <TD right>{g.count}</TD>
                  <TD right>{fmtINR(g.taxable)}</TD>
                  <TD right>{hsn === "995411" ? "5%" : "18%"}</TD>
                  <TD right>{fmtINR(g.cgst)}</TD>
                  <TD right>{fmtINR(g.sgst)}</TD>
                  <TD right>{fmtINR(g.igst)}</TD>
                </tr>
              ))}
              <tr className="bg-muted/30 border-t-2 border-border">
                <td colSpan={4} className="px-4 py-3 text-xs font-bold text-foreground">Grand Total</td>
                <TD right bold>{fmtINR(totalTaxableValue)}</TD>
                <TD right>—</TD>
                <TD right bold>{fmtINR(totalOutputCGST)}</TD>
                <TD right bold>{fmtINR(totalOutputSGST)}</TD>
                <TD right bold>{fmtINR(totalOutputIGST)}</TD>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* ITC Reconciliation */}
      {tab === "itc" && (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "ITC Available (GSTR-2B)", value: fmtINR(totalITC, true), icon: CheckCircle2, color: "text-success" },
              { label: "ITC Utilized", value: fmtINR(totalITC, true), icon: FileText, color: "text-primary" },
              { label: "ITC Balance", value: fmtINR(0, true), icon: AlertCircle, color: "text-muted-foreground" },
            ].map(k => (
              <div key={k.label} className="bg-card border border-border rounded-2xl p-4 flex items-center gap-3">
                <k.icon size={20} className={k.color} />
                <div><p className="text-[10px] font-semibold text-muted-foreground">{k.label}</p><p className="text-lg font-bold text-foreground">{k.value}</p></div>
              </div>
            ))}
          </div>
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <div className="px-4 py-3 border-b border-border bg-muted/30">
              <p className="text-xs font-bold text-foreground">Purchase Invoice ITC Details</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-border bg-muted/20"><TH>Vendor</TH><TH>GSTIN</TH><TH>Bill No</TH><TH>Category</TH><TH right>Taxable</TH><TH right>GST Rate</TH><TH right>CGST</TH><TH right>SGST</TH><TH right>Total ITC</TH></tr></thead>
                <tbody className="divide-y divide-border">
                  {expenses.map(e => (
                    <tr key={e.id} className="hover:bg-muted/30">
                      <TD>{e.vendor}</TD>
                      <TD><span className="font-mono text-[10px]">{e.vendorGSTIN || "—"}</span></TD>
                      <TD><span className="font-mono">{e.billNo}</span></TD>
                      <TD>{e.category}</TD>
                      <TD right>{fmtINR(e.amount)}</TD>
                      <TD right>{e.gstRate}%</TD>
                      <TD right>{fmtINR(e.gst / 2)}</TD>
                      <TD right>{fmtINR(e.gst / 2)}</TD>
                      <TD right bold>{fmtINR(e.gst)}</TD>
                    </tr>
                  ))}
                  <tr className="border-t-2 border-border bg-muted/30">
                    <td colSpan={6} className="px-4 py-3 text-xs font-bold text-foreground">Total ITC Available</td>
                    <TD right bold>{fmtINR(totalInputCGST)}</TD>
                    <TD right bold>{fmtINR(totalInputSGST)}</TD>
                    <TD right bold cls="text-success font-bold">{fmtINR(totalITC)}</TD>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
