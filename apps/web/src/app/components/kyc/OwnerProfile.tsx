import { useState } from "react";
import {
  Phone, Mail, MapPin, Building2, Calendar, Edit2,
  MessageSquare, PhoneCall, Shield, CheckCircle, AlertCircle,
  Clock, ChevronRight, CreditCard, Banknote, User,
  FileText, Activity, Send
} from "lucide-react";
import {
  mockOwners, mockActivity, mockDocuments,
  kycStatusConfig, stepStatusConfig, kycScoreColor, kycScoreBg,
  maskAadhaar, maskPAN, maskAccount,
  type Owner, type CommType
} from "./kycData";
import type { KYCView } from "./KYCModule";
// recharts imported for future chart expansion

interface OwnerProfileProps {
  ownerId: string;
  onNavigate: (view: KYCView, ownerId?: string) => void;
}

const kycSteps = [
  { key: "aadhaar",     label: "Aadhaar",      view: "aadhaar" as KYCView },
  { key: "pan",         label: "PAN",          view: "pan" as KYCView },
  { key: "coApplicant", label: "Co-Applicant", view: "co-applicant" as KYCView },
  { key: "nominee",     label: "Nominee",      view: "nominee" as KYCView },
];

const activityIcons: Record<string, typeof Activity> = {
  call: PhoneCall, email: Mail, whatsapp: MessageSquare, sms: Send,
  visit: MapPin, note: FileText, document: FileText, payment: Banknote,
  kyc_update: Shield, system: Activity,
};
const activityColors: Record<string, string> = {
  call: "bg-primary/10 text-primary", email: "bg-info/10 text-info",
  whatsapp: "bg-success/10 text-success", sms: "bg-muted text-muted-foreground",
  visit: "bg-secondary/10 text-secondary", note: "bg-warning/10 text-warning",
  document: "bg-primary/10 text-primary", payment: "bg-success/10 text-success",
  kyc_update: "bg-success/10 text-success", system: "bg-muted text-muted-foreground",
};

export function OwnerProfile({ ownerId, onNavigate }: OwnerProfileProps) {
  const owner = mockOwners.find(o => o.id === ownerId);
  const [showSensitive, setShowSensitive] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "activity" | "comms">("overview");

  if (!owner) return <div className="p-8 text-muted-foreground">Owner not found.</div>;

  const ksc = kycStatusConfig[owner.kycStatus];
  const ownerDocs = mockDocuments.filter(d => d.ownerId === ownerId);
  const activity = mockActivity.slice(0, 8);

  const docStats = {
    total: ownerDocs.length,
    verified: ownerDocs.filter(d => d.status === "Verified").length,
    pending: ownerDocs.filter(d => d.status === "Pending").length,
    review: ownerDocs.filter(d => d.status === "Under Review" || d.status === "Uploaded").length,
  };

  const scoreData = [{ name: "KYC Score", value: owner.kycScore, fill: owner.kycScore >= 80 ? "var(--success)" : owner.kycScore >= 50 ? "var(--warning)" : "var(--destructive)" }];

  const stepStatus = {
    aadhaar: owner.aadhaarStatus,
    pan: owner.panStatus,
    coApplicant: owner.coApplicants.length > 0 ? owner.coApplicants[0].kycStatus === "Verified" ? "Verified" as const : "Uploaded" as const : "Pending" as const,
    nominee: owner.nominees.length > 0 ? "Verified" as const : "Pending" as const,
  };

  return (
    <div className="space-y-6">
      {/* Profile Hero */}
      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        {/* Header gradient bar */}
        <div className="h-2 bg-gradient-to-r from-primary via-primary/70 to-secondary" />

        <div className="p-6">
          <div className="flex flex-col sm:flex-row items-start gap-5">
            {/* Avatar */}
            <div className="relative shrink-0">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white font-bold text-2xl shadow-md">
                {owner.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
              </div>
              {owner.kycStatus === "Verified" && (
                <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-success border-2 border-card flex items-center justify-center">
                  <CheckCircle size={12} className="text-white" />
                </div>
              )}
            </div>

            {/* Identity */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-start gap-2 mb-1">
                <h1 className="text-xl font-bold">{owner.salutation} {owner.name}</h1>
                <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border flex items-center gap-1 ${ksc.bg} ${ksc.color} ${ksc.border}`}>
                  <Shield size={10} />
                  {ksc.label}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mb-3 flex items-center gap-1">
                <Building2 size={11} /> {owner.relationship} · {owner.linkedFlats.length} unit(s) linked
              </p>
              <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5"><Phone size={11} />{owner.phone}</span>
                <span className="flex items-center gap-1.5"><Mail size={11} />{owner.email}</span>
                <span className="flex items-center gap-1.5"><MapPin size={11} />{owner.city}, {owner.state}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 shrink-0">
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-xs font-medium hover:bg-muted transition-colors">
                <PhoneCall size={12} /> Call
              </button>
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-success/30 bg-success/10 text-success text-xs font-medium hover:bg-success/20 transition-colors">
                <MessageSquare size={12} /> WhatsApp
              </button>
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-xs font-medium hover:bg-muted transition-colors">
                <Edit2 size={12} /> Edit
              </button>
            </div>
          </div>

          {/* Quick info row */}
          <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Date of Birth", value: new Date(owner.dob).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) },
              { label: "Occupation", value: owner.occupation },
              { label: "Annual Income", value: owner.annualIncome },
              { label: "RM Assigned", value: owner.rmName },
            ].map(item => (
              <div key={item.label} className="bg-muted/40 rounded-xl p-3">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{item.label}</p>
                <p className="text-sm font-semibold mt-0.5 truncate">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        {/* Left: KYC steps + sensitive info */}
        <div className="lg:col-span-2 space-y-4">
          {/* Tabs */}
          <div className="flex items-center gap-1 bg-muted p-1 rounded-xl w-fit">
            {(["overview", "activity", "comms"] as const).map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${activeTab === tab ? "bg-card shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
                {tab === "comms" ? "Communications" : tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {activeTab === "overview" && (
            <div className="space-y-4">
              {/* KYC Steps */}
              <div className="bg-card rounded-2xl border border-border p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold flex items-center gap-2">
                    <Shield size={14} className="text-primary" /> KYC Verification Steps
                  </h3>
                  <button onClick={() => onNavigate("document-vault", ownerId)} className="text-xs text-primary hover:underline flex items-center gap-1">
                    <FileText size={11} /> View All Docs
                  </button>
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  {kycSteps.map((step) => {
                    const status = stepStatus[step.key as keyof typeof stepStatus];
                    const ssc = stepStatusConfig[status];
                    return (
                      <button
                        key={step.key}
                        onClick={() => onNavigate(step.view, ownerId)}
                        className={`flex items-center justify-between p-3.5 rounded-xl border-2 text-left hover:shadow-sm transition-all group ${
                          status === "Verified"
                            ? "border-success/30 bg-success/5"
                            : status === "Under Review" || status === "Uploaded"
                            ? "border-warning/30 bg-warning/5"
                            : "border-border hover:border-primary/30"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${ssc.bg} ${ssc.color} border ${ssc.border}`}>
                            {status === "Verified" ? <CheckCircle size={15} /> : status === "Rejected" ? <AlertCircle size={15} /> : <Clock size={15} />}
                          </div>
                          <div>
                            <p className="text-sm font-semibold">{step.label}</p>
                            <span className={`text-[10px] font-semibold ${ssc.color}`}>{status}</span>
                          </div>
                        </div>
                        <ChevronRight size={14} className="text-muted-foreground group-hover:text-primary transition-colors" />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Sensitive Details */}
              <div className="bg-card rounded-2xl border border-border p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold">Identity & Financial Details</h3>
                  <button
                    onClick={() => setShowSensitive(s => !s)}
                    className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-lg border transition-all ${showSensitive ? "border-destructive/30 bg-destructive/5 text-destructive" : "border-border hover:bg-muted"}`}
                  >
                    {showSensitive ? "🔓 Hide" : "🔐 Show"} Sensitive Data
                  </button>
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  {[
                    { label: "Aadhaar Number", value: showSensitive ? owner.aadhar : maskAadhaar(owner.aadhar), mono: true, icon: Shield, status: owner.aadhaarStatus },
                    { label: "PAN Number", value: showSensitive ? owner.pan : maskPAN(owner.pan), mono: true, icon: CreditCard, status: owner.panStatus },
                    { label: "Bank Account", value: owner.bankAccount ? (showSensitive ? owner.bankAccount : maskAccount(owner.bankAccount)) : "Not Provided", mono: !!owner.bankAccount, icon: Banknote },
                    { label: "IFSC Code", value: owner.ifsc || "Not Provided", mono: !!owner.ifsc, icon: Building2 },
                  ].map(item => {
                    const ssc = item.status ? stepStatusConfig[item.status] : null;
                    return (
                      <div key={item.label} className="flex items-start gap-3 p-3 bg-muted/30 rounded-xl border border-border/50">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                          <item.icon size={14} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{item.label}</p>
                          <p className={`text-sm font-semibold mt-0.5 ${item.mono ? "font-mono tracking-wider" : ""}`}>{item.value}</p>
                        </div>
                        {ssc && (
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border ${ssc.bg} ${ssc.color} ${ssc.border} shrink-0 mt-0.5`}>
                            {item.status}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {owner.bankName && (
                  <div className="mt-3 flex items-center gap-2 px-3 py-2 bg-muted/30 rounded-xl border border-border/50">
                    <Banknote size={13} className="text-muted-foreground" />
                    <span className="text-xs font-medium">{owner.bankName}</span>
                    {owner.ifsc && <span className="text-xs text-muted-foreground">· {owner.ifsc}</span>}
                  </div>
                )}
              </div>

              {/* Document summary */}
              <div className="bg-card rounded-2xl border border-border p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold">Document Status</h3>
                  <button onClick={() => onNavigate("document-vault", ownerId)} className="text-xs text-primary hover:underline">View Vault →</button>
                </div>
                <div className="grid grid-cols-4 gap-2 mb-3">
                  {[
                    { label: "Total", val: docStats.total, color: "text-foreground", bg: "bg-muted/50" },
                    { label: "Verified", val: docStats.verified, color: "text-success", bg: "bg-success/10" },
                    { label: "In Review", val: docStats.review, color: "text-warning", bg: "bg-warning/10" },
                    { label: "Pending", val: docStats.pending, color: "text-muted-foreground", bg: "bg-muted" },
                  ].map(s => (
                    <div key={s.label} className={`${s.bg} rounded-xl p-2.5 text-center`}>
                      <p className={`text-lg font-bold ${s.color}`}>{s.val}</p>
                      <p className="text-[9px] text-muted-foreground uppercase tracking-wider">{s.label}</p>
                    </div>
                  ))}
                </div>
                <div className="h-1.5 rounded-full bg-muted overflow-hidden flex">
                  <div className="h-full bg-success transition-all" style={{ width: `${(docStats.verified / docStats.total) * 100}%` }} />
                  <div className="h-full bg-warning transition-all" style={{ width: `${(docStats.review / docStats.total) * 100}%` }} />
                </div>
                <p className="text-[10px] text-muted-foreground mt-1.5">{Math.round((docStats.verified / docStats.total) * 100)}% documents verified</p>
              </div>
            </div>
          )}

          {activeTab === "activity" && (
            <div className="bg-card rounded-2xl border border-border p-5">
              <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
                <Activity size={14} className="text-primary" /> Activity Timeline
              </h3>
              <div className="space-y-0">
                {activity.map((event, i) => {
                  const Icon = activityIcons[event.type] || Activity;
                  const colorCls = activityColors[event.type] || "bg-muted text-muted-foreground";
                  return (
                    <div key={event.id} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${colorCls}`}>
                          <Icon size={13} />
                        </div>
                        {i < activity.length - 1 && <div className="w-px flex-1 bg-border my-1 min-h-[20px]" />}
                      </div>
                      <div className="pb-5 flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm font-semibold leading-tight">{event.title}</p>
                          <span className="text-[10px] text-muted-foreground whitespace-nowrap shrink-0">{event.date}</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">{event.description}</p>
                        <div className="flex items-center gap-2 mt-1">
                          {event.agent && <span className="text-[10px] text-muted-foreground">{event.time} · {event.agent}</span>}
                          {event.duration && <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded-full">{event.duration}</span>}
                          {event.direction && (
                            <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full ${event.direction === "inbound" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                              {event.direction}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === "comms" && (
            <div className="space-y-3">
              {/* Add note / log call */}
              <div className="bg-card rounded-2xl border border-border p-4">
                <div className="flex gap-2">
                  <textarea rows={2} placeholder="Add a note or log a communication..." className="flex-1 px-3 py-2 text-sm rounded-xl border border-border bg-muted/30 focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none" />
                  <div className="flex flex-col gap-1.5">
                    {(["call", "email", "whatsapp", "note"] as const).map(t => (
                      <button key={t} className="px-2.5 py-1 rounded-lg text-[10px] font-semibold border border-border hover:bg-muted capitalize transition-colors">{t}</button>
                    ))}
                  </div>
                </div>
              </div>
              {activity.filter(a => ["call", "email", "whatsapp", "sms", "visit", "note"].includes(a.type)).map(event => {
                const Icon = activityIcons[event.type] || Activity;
                const colorCls = activityColors[event.type] || "bg-muted text-muted-foreground";
                return (
                  <div key={event.id} className="bg-card rounded-xl border border-border p-4 flex items-start gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${colorCls}`}>
                      <Icon size={15} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-semibold">{event.title}</p>
                        <div className="flex items-center gap-2 shrink-0">
                          {event.direction && (
                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border ${event.direction === "inbound" ? "bg-primary/10 text-primary border-primary/20" : "bg-muted text-muted-foreground border-border"}`}>
                              ↑↓ {event.direction}
                            </span>
                          )}
                          <span className="text-[10px] text-muted-foreground">{event.date}</span>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{event.description}</p>
                      <p className="text-[10px] text-muted-foreground mt-1">{event.time} · {event.agent} {event.duration && `· ${event.duration}`}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right: KYC Score + co-applicant + nominee */}
        <div className="space-y-4">
          {/* KYC Score card */}
          <div className="bg-card rounded-2xl border border-border p-5">
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">KYC Score</p>
            <div className="flex items-center gap-3">
              <div className="relative w-20 h-20">
                <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="var(--muted)" strokeWidth="3" />
                  <circle cx="18" cy="18" r="15.9" fill="none"
                    stroke={owner.kycScore >= 80 ? "var(--success)" : owner.kycScore >= 50 ? "var(--warning)" : "var(--destructive)"}
                    strokeWidth="3"
                    strokeDasharray={`${owner.kycScore} 100`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className={`text-lg font-bold ${kycScoreColor(owner.kycScore)}`}>{owner.kycScore}</span>
                </div>
              </div>
              <div>
                <p className={`text-2xl font-bold ${kycScoreColor(owner.kycScore)}`}>{owner.kycScore}/100</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {owner.kycScore >= 80 ? "Excellent — Fully compliant" : owner.kycScore >= 50 ? "Fair — Action required" : "Low — Critical items missing"}
                </p>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border mt-1 inline-block ${kycStatusConfig[owner.kycStatus].bg} ${kycStatusConfig[owner.kycStatus].color} ${kycStatusConfig[owner.kycStatus].border}`}>
                  {owner.kycStatus}
                </span>
              </div>
            </div>

            {/* Score breakdown bars */}
            <div className="mt-4 space-y-2">
              {[
                { label: "Identity Docs", pct: owner.aadhaarStatus === "Verified" ? 100 : owner.aadhaarStatus === "Under Review" ? 60 : 0 },
                { label: "Income Proof", pct: owner.panStatus === "Verified" ? 100 : owner.panStatus === "Under Review" ? 50 : 0 },
                { label: "Address Proof", pct: owner.kycScore > 70 ? 100 : 40 },
                { label: "Bank Details", pct: owner.bankAccount ? 100 : 0 },
              ].map(item => (
                <div key={item.label}>
                  <div className="flex items-center justify-between text-[10px] mb-0.5">
                    <span className="text-muted-foreground">{item.label}</span>
                    <span className={`font-bold ${item.pct === 100 ? "text-success" : item.pct > 0 ? "text-warning" : "text-muted-foreground"}`}>{item.pct}%</span>
                  </div>
                  <div className="h-1 rounded-full bg-muted overflow-hidden">
                    <div className={`h-full rounded-full transition-all ${item.pct === 100 ? "bg-success" : item.pct > 0 ? "bg-warning" : "bg-muted"}`} style={{ width: `${item.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Co-applicants */}
          <div className="bg-card rounded-2xl border border-border p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Co-Applicants</p>
              <button onClick={() => onNavigate("co-applicant", ownerId)} className="text-xs text-primary hover:underline">Manage →</button>
            </div>
            {owner.coApplicants.length === 0 ? (
              <div className="text-center py-3">
                <User size={18} className="mx-auto text-muted-foreground mb-1" />
                <p className="text-xs text-muted-foreground">None added</p>
                <button onClick={() => onNavigate("co-applicant", ownerId)} className="text-[11px] text-primary hover:underline mt-1">+ Add Co-Applicant</button>
              </div>
            ) : owner.coApplicants.map(ca => {
              const csc = kycStatusConfig[ca.kycStatus];
              return (
                <div key={ca.id} className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                    {ca.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold truncate">{ca.name}</p>
                    <p className="text-[10px] text-muted-foreground">{ca.relation}</p>
                  </div>
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border ${csc.bg} ${csc.color} ${csc.border}`}>{ca.kycStatus}</span>
                </div>
              );
            })}
          </div>

          {/* Nominees */}
          <div className="bg-card rounded-2xl border border-border p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Nominees</p>
              <button onClick={() => onNavigate("nominee", ownerId)} className="text-xs text-primary hover:underline">Manage →</button>
            </div>
            {owner.nominees.length === 0 ? (
              <div className="text-center py-3">
                <User size={18} className="mx-auto text-muted-foreground mb-1" />
                <p className="text-xs text-muted-foreground">None added</p>
              </div>
            ) : (
              <div className="space-y-2">
                {owner.nominees.map(n => (
                  <div key={n.id} className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-secondary/10 text-secondary flex items-center justify-center text-[10px] font-bold">
                      {n.name.split(" ").map(x => x[0]).join("").slice(0, 2)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold truncate">{n.name} {n.isMinor && <span className="text-[9px] text-warning">(Minor)</span>}</p>
                      <p className="text-[10px] text-muted-foreground">{n.relation}</p>
                    </div>
                    <div className="w-8 h-8 rounded-full border-2 border-primary/30 flex items-center justify-center">
                      <span className="text-[10px] font-bold text-primary">{n.share}%</span>
                    </div>
                  </div>
                ))}
                <div className="h-1.5 rounded-full bg-muted overflow-hidden flex mt-1">
                  {owner.nominees.map(n => (
                    <div key={n.id} className="h-full bg-primary/80 first:rounded-l-full last:rounded-r-full" style={{ width: `${n.share}%` }} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* RM Details */}
          <div className="bg-card rounded-2xl border border-border p-4">
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-3">Relationship Manager</p>
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary font-bold flex items-center justify-center text-xs">
                {owner.rmName.split(" ").map(n => n[0]).join("").slice(0, 2)}
              </div>
              <div>
                <p className="text-sm font-semibold">{owner.rmName}</p>
                <p className="text-xs text-muted-foreground">{owner.rmPhone}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
