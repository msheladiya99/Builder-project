import { useState } from "react";
import {
  ArrowUpFromLine, Plus, Search, CheckCircle2, Clock,
  XCircle, AlertTriangle, Filter, Eye, RotateCcw, Package
} from "lucide-react";
import { mockMaterialIssues, fmtINR, Site, IssueStatus } from "../inventoryData";

interface Props { site: Site; }

const statusConfig: Record<IssueStatus, { color: string; bg: string; icon: any; border: string }> = {
  Requested:        { color: "text-slate-700 dark:text-slate-300", bg: "bg-slate-100 dark:bg-slate-800/60", icon: Clock, border: "border-slate-200 dark:border-slate-700" },
  "Pending Approval":{ color: "text-amber-700 dark:text-amber-400", bg: "bg-amber-100/80 dark:bg-amber-900/30", icon: AlertTriangle, border: "border-amber-200 dark:border-amber-800" },
  Approved:         { color: "text-blue-700 dark:text-blue-400",   bg: "bg-blue-100/80 dark:bg-blue-900/30", icon: CheckCircle2, border: "border-blue-200 dark:border-blue-800" },
  Issued:           { color: "text-green-700 dark:text-green-400", bg: "bg-green-100/80 dark:bg-green-900/30", icon: CheckCircle2, border: "border-green-200 dark:border-green-800" },
  Returned:         { color: "text-purple-700 dark:text-purple-400", bg: "bg-purple-100/80 dark:bg-purple-900/30", icon: RotateCcw, border: "border-purple-200 dark:border-purple-800" },
  Cancelled:        { color: "text-red-700 dark:text-red-400",     bg: "bg-red-100/80 dark:bg-red-900/30", icon: XCircle, border: "border-red-200 dark:border-red-800" },
};

const approvalStages: IssueStatus[] = ["Requested", "Pending Approval", "Approved", "Issued"];

function WorkflowTracker({ status }: { status: IssueStatus }) {
  const stages = ["Requested", "Pending Approval", "Approved", "Issued"];
  const currentIdx = stages.indexOf(status);
  if (status === "Cancelled") return (
    <div className="flex items-center gap-1.5 text-[10px] text-red-600 dark:text-red-400">
      <XCircle size={11} /> <span className="font-bold">Cancelled</span>
    </div>
  );
  return (
    <div className="flex items-center gap-0">
      {stages.map((stage, idx) => {
        const done = idx <= currentIdx;
        const active = idx === currentIdx;
        const isLast = idx === stages.length - 1;
        return (
          <div key={stage} className="flex items-center">
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
              done ? "border-orange-500 bg-orange-500" : "border-border bg-muted/20"
            } ${active ? "ring-2 ring-orange-500/30" : ""}`}>
              {done && <CheckCircle2 size={10} className="text-white" />}
            </div>
            {!isLast && <div className={`h-0.5 w-8 ${done && idx < currentIdx ? "bg-orange-500" : "bg-border"}`} />}
          </div>
        );
      })}
    </div>
  );
}

export function MaterialIssueView({ site }: Props) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<IssueStatus | "All">("All");
  const [expandedId, setExpandedId] = useState<string | null>("MI001");

  const filtered = mockMaterialIssues.filter(issue => {
    const matchSite = site === "All Sites" || issue.site === site;
    const matchSearch = issue.issueNo.toLowerCase().includes(search.toLowerCase()) ||
      issue.requestedBy.toLowerCase().includes(search.toLowerCase()) ||
      issue.purpose.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "All" || issue.status === statusFilter;
    return matchSite && matchSearch && matchStatus;
  });

  const pendingCount = mockMaterialIssues.filter(i => i.status === "Pending Approval" || i.status === "Requested").length;
  const issuedValue = mockMaterialIssues.filter(i => i.status === "Issued").reduce((s, i) => s + i.total, 0);
  const totalIssued = mockMaterialIssues.filter(i => i.status === "Issued").length;

  return (
    <div className="p-4 lg:p-5 space-y-4">
      {/* KPI */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Total Requests", value: mockMaterialIssues.length, sub: "FY 2025-26", color: "border-l-primary" },
          { label: "Pending Action", value: pendingCount, sub: "Requires approval", color: "border-l-warning" },
          { label: "Issues Completed", value: totalIssued, sub: "Issued to sites", color: "border-l-success" },
          { label: "Total Value Issued", value: fmtINR(issuedValue, true), sub: "At stock rates", color: "border-l-info" },
        ].map(k => (
          <div key={k.label} className={`bg-card border border-border rounded-2xl p-4 border-l-4 ${k.color}`}>
            <p className="text-[10px] font-semibold text-muted-foreground">{k.label}</p>
            <p className="text-xl font-black text-foreground mt-1">{k.value}</p>
            <p className="text-[10px] text-muted-foreground">{k.sub}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-card border border-border rounded-2xl p-3 flex flex-wrap gap-2 items-center">
        <div className="flex items-center gap-2 flex-1 min-w-[180px] px-3 py-2 rounded-xl border border-border bg-muted/20">
          <Search size={13} className="text-muted-foreground shrink-0" />
          <input
            className="flex-1 text-xs bg-transparent outline-none text-foreground placeholder:text-muted-foreground"
            placeholder="Search issue no., requester, purpose..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        {(["All","Requested","Pending Approval","Approved","Issued","Cancelled"] as const).map(s => (
          <button key={s} onClick={() => setStatusFilter(s)}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all border whitespace-nowrap ${statusFilter === s ? "bg-orange-500 border-orange-500 text-white" : "border-border text-muted-foreground hover:bg-muted/40"}`}>
            {s}
          </button>
        ))}
        <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-orange-500 text-white text-xs font-bold hover:bg-orange-600 ml-auto">
          <Plus size={13} /> New Request
        </button>
      </div>

      {/* Issue cards */}
      <div className="space-y-3">
        {filtered.map(issue => {
          const sc = statusConfig[issue.status];
          const StatusIcon = sc.icon;
          const expanded = expandedId === issue.id;
          return (
            <div
              key={issue.id}
              className={`bg-card border rounded-2xl overflow-hidden transition-all ${expanded ? "border-orange-500 shadow-orange-500/10 shadow-lg" : "border-border"}`}
            >
              {/* Header */}
              <div
                className="px-4 py-3 flex items-center justify-between cursor-pointer hover:bg-muted/10"
                onClick={() => setExpandedId(expanded ? null : issue.id)}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${sc.bg}`}>
                    <ArrowUpFromLine size={13} className={sc.color} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-black text-foreground">{issue.issueNo}</p>
                      <span className="text-[9px] text-muted-foreground">{issue.date}</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground truncate max-w-xs">{issue.purpose}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="hidden lg:block">
                    <WorkflowTracker status={issue.status} />
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1 ${sc.bg} ${sc.color}`}>
                    <StatusIcon size={9} />
                    {issue.status}
                  </span>
                </div>
              </div>

              {/* Summary */}
              <div className="px-4 pb-3 grid grid-cols-2 lg:grid-cols-5 gap-3 border-b border-border/60">
                <div><p className="text-[9px] text-muted-foreground">Site</p><p className="text-[10px] font-bold text-foreground">{issue.site}</p></div>
                <div><p className="text-[9px] text-muted-foreground">From Warehouse</p><p className="text-[10px] font-bold text-foreground">{issue.issuedFrom}</p></div>
                <div><p className="text-[9px] text-muted-foreground">Requested By</p><p className="text-[10px] font-bold text-foreground">{issue.requestedBy}</p></div>
                <div><p className="text-[9px] text-muted-foreground">Approved By</p><p className="text-[10px] font-bold text-foreground">{issue.approvedBy ?? "—"}</p></div>
                <div><p className="text-[9px] text-muted-foreground">Total Value</p><p className="text-[10px] font-black text-foreground">{fmtINR(issue.total, true)}</p></div>
              </div>

              {/* Expanded */}
              {expanded && (
                <>
                  <table className="w-full text-[10px]">
                    <thead>
                      <tr className="bg-muted/20 text-muted-foreground">
                        <th className="text-left px-4 py-2 font-bold">Material</th>
                        <th className="text-right px-3 py-2 font-bold">Requested</th>
                        <th className="text-right px-3 py-2 font-bold">Issued</th>
                        <th className="text-right px-3 py-2 font-bold">Rate</th>
                        <th className="text-right px-4 py-2 font-bold">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/40">
                      {issue.items.map((item, idx) => (
                        <tr key={idx} className="hover:bg-muted/10">
                          <td className="px-4 py-2">
                            <p className="font-semibold text-foreground">{item.material}</p>
                            <p className="text-muted-foreground font-mono">{item.materialCode}</p>
                          </td>
                          <td className="px-3 py-2 text-right text-foreground">{item.requestedQty} {item.unit}</td>
                          <td className="px-3 py-2 text-right">
                            <span className={item.issuedQty > 0 ? "text-green-600 dark:text-green-400 font-bold" : "text-muted-foreground"}>
                              {item.issuedQty > 0 ? `${item.issuedQty} ${item.unit}` : "—"}
                            </span>
                          </td>
                          <td className="px-3 py-2 text-right text-muted-foreground">{fmtINR(item.rate)}/{item.unit}</td>
                          <td className="px-4 py-2 text-right font-bold text-foreground">{fmtINR(item.amount, true)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {/* Action bar */}
                  <div className="px-4 py-3 bg-muted/10 border-t border-border/60 flex items-center justify-between">
                    <div className="text-[10px] text-muted-foreground italic">
                      {issue.remarks && <span>"{issue.remarks}"</span>}
                    </div>
                    <div className="flex items-center gap-2">
                      {issue.status === "Pending Approval" && (
                        <>
                          <button className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-[10px] font-bold hover:bg-red-50 dark:hover:bg-red-900/20">
                            <XCircle size={10} /> Reject
                          </button>
                          <button className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-orange-500 text-white text-[10px] font-bold hover:bg-orange-600">
                            <CheckCircle2 size={10} /> Approve & Issue
                          </button>
                        </>
                      )}
                      {issue.status === "Issued" && (
                        <button className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-border text-[10px] font-semibold hover:bg-muted/40">
                          <RotateCcw size={10} /> Record Return
                        </button>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="bg-card border border-border rounded-2xl p-10 text-center">
            <Package size={32} className="mx-auto mb-2 text-muted-foreground/30" />
            <p className="text-sm font-semibold text-muted-foreground">No material issues found</p>
          </div>
        )}
      </div>
    </div>
  );
}
