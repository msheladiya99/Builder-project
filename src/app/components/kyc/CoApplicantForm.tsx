import { useState } from "react";
import {
  ArrowLeft, Plus, User, Trash2, ChevronDown, ChevronUp,
  CheckCircle, AlertCircle, Shield, CreditCard, Phone,
  Mail, Calendar, Briefcase, Edit2, X
} from "lucide-react";
import { mockOwners, kycStatusConfig, stepStatusConfig, maskAadhaar, maskPAN, type CoApplicant } from "./kycData";
import type { KYCView } from "./KYCModule";

interface CoApplicantFormProps {
  ownerId: string;
  onNavigate: (view: KYCView, ownerId?: string) => void;
}

const relations = ["Spouse", "Parent", "Sibling", "Child", "Friend", "Other"] as const;
const occupations = ["Salaried - Private", "Salaried - Govt.", "Business Owner", "Professional", "Homemaker", "Student", "Retired"];

const emptyCA: Omit<CoApplicant, "id" | "kycStatus" | "aadhaarStatus" | "panStatus"> = {
  name: "", relation: "Spouse", phone: "", email: "", pan: "", aadhar: "", dob: "", occupation: "",
};

export function CoApplicantForm({ ownerId, onNavigate }: CoApplicantFormProps) {
  const owner = mockOwners.find(o => o.id === ownerId);
  const [coApplicants, setCoApplicants] = useState<CoApplicant[]>(owner?.coApplicants || []);
  const [addingNew, setAddingNew] = useState(false);
  const [newForm, setNewForm] = useState({ ...emptyCA });
  const [expandedId, setExpandedId] = useState<string | null>(coApplicants[0]?.id || null);
  const [saved, setSaved] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!owner) return null;

  const updateNew = (k: keyof typeof newForm, v: string) => {
    setNewForm(f => ({ ...f, [k]: v }));
    setErrors(e => ({ ...e, [k]: "" }));
  };

  const validateNew = () => {
    const e: Record<string, string> = {};
    if (!newForm.name.trim()) e.name = "Required";
    if (!/^[6-9]\d{9}$/.test(newForm.phone)) e.phone = "Invalid mobile";
    if (!/\S+@\S+\.\S+/.test(newForm.email)) e.email = "Invalid email";
    if (!/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(newForm.pan.toUpperCase())) e.pan = "Invalid PAN format";
    if (!newForm.aadhar.replace(/\s|-/g, "").match(/^\d{12}$/)) e.aadhar = "Invalid Aadhaar";
    if (!newForm.dob) e.dob = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleAdd = () => {
    if (!validateNew()) return;
    const newCA: CoApplicant = {
      id: `ca-${Date.now()}`,
      ...newForm,
      pan: newForm.pan.toUpperCase(),
      kycStatus: "Not Started",
      aadhaarStatus: "Pending",
      panStatus: "Pending",
    };
    setCoApplicants(prev => [...prev, newCA]);
    setNewForm({ ...emptyCA });
    setAddingNew(false);
    setExpandedId(newCA.id);
  };

  const handleRemove = (id: string) => {
    setCoApplicants(prev => prev.filter(ca => ca.id !== id));
    if (expandedId === id) setExpandedId(null);
  };

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  return (
    <div className="space-y-5 max-w-3xl">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={() => onNavigate("profile", ownerId)} className="p-2 rounded-xl border border-border hover:bg-muted transition-colors">
          <ArrowLeft size={15} />
        </button>
        <div>
          <h1 className="text-lg font-bold flex items-center gap-2">
            <User size={18} className="text-primary" /> Co-Applicant Management
          </h1>
          <p className="text-xs text-muted-foreground">{owner.salutation} {owner.name} · {coApplicants.length} co-applicant(s)</p>
        </div>
      </div>

      {/* Info banner */}
      <div className="flex items-start gap-3 p-4 bg-primary/5 border border-primary/20 rounded-2xl">
        <Shield size={15} className="text-primary mt-0.5 shrink-0" />
        <p className="text-xs text-muted-foreground">
          <span className="font-semibold text-foreground">Joint Ownership — </span>
          All co-applicants are equally liable for financial obligations. Each co-applicant must complete independent Aadhaar and PAN verification. Maximum 3 co-applicants allowed.
        </p>
      </div>

      {/* Existing co-applicants */}
      {coApplicants.map(ca => {
        const ksc = kycStatusConfig[ca.kycStatus];
        const isExpanded = expandedId === ca.id;
        return (
          <div key={ca.id} className="bg-card rounded-2xl border border-border overflow-hidden">
            {/* Header row */}
            <div
              className="flex items-center gap-3 p-4 cursor-pointer hover:bg-muted/30 transition-colors"
              onClick={() => setExpandedId(isExpanded ? null : ca.id)}
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary/80 to-secondary/80 flex items-center justify-center text-white font-bold shrink-0">
                {ca.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-semibold text-sm">{ca.name}</p>
                  <span className="text-[10px] bg-muted text-muted-foreground px-2 py-0.5 rounded-full">{ca.relation}</span>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${ksc.bg} ${ksc.color} ${ksc.border}`}>{ca.kycStatus}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{ca.phone} · {ca.email}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button onClick={e => { e.stopPropagation(); handleRemove(ca.id); }} className="p-1.5 rounded-lg hover:bg-destructive/10 hover:text-destructive transition-colors text-muted-foreground">
                  <Trash2 size={14} />
                </button>
                {isExpanded ? <ChevronUp size={16} className="text-muted-foreground" /> : <ChevronDown size={16} className="text-muted-foreground" />}
              </div>
            </div>

            {/* Expanded details */}
            {isExpanded && (
              <div className="border-t border-border p-5 space-y-4">
                {/* KYC steps for co-applicant */}
                <div className="grid sm:grid-cols-2 gap-3">
                  {[
                    { label: "Aadhaar Verification", status: ca.aadhaarStatus, icon: Shield },
                    { label: "PAN Verification", status: ca.panStatus, icon: CreditCard },
                  ].map(item => {
                    const ssc = stepStatusConfig[item.status];
                    return (
                      <div key={item.label} className={`flex items-center gap-3 p-3 rounded-xl border ${ssc.bg} ${ssc.border}`}>
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${ssc.bg} ${ssc.color} border ${ssc.border}`}>
                          <item.icon size={13} />
                        </div>
                        <div>
                          <p className="text-xs font-semibold">{item.label}</p>
                          <span className={`text-[10px] font-semibold ${ssc.color}`}>{item.status}</span>
                        </div>
                        {item.status === "Verified"
                          ? <CheckCircle size={14} className="text-success ml-auto" />
                          : <AlertCircle size={14} className="text-warning ml-auto" />}
                      </div>
                    );
                  })}
                </div>

                {/* Personal details grid */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <InfoRow icon={User} label="Full Name" value={ca.name} />
                  <InfoRow icon={Phone} label="Mobile" value={ca.phone} />
                  <InfoRow icon={Mail} label="Email" value={ca.email} />
                  <InfoRow icon={Calendar} label="Date of Birth" value={new Date(ca.dob).toLocaleDateString("en-IN")} />
                  <InfoRow icon={Briefcase} label="Occupation" value={ca.occupation} />
                  <InfoRow icon={Shield} label="Aadhaar" value={maskAadhaar(ca.aadhar)} mono />
                  <InfoRow icon={CreditCard} label="PAN" value={maskPAN(ca.pan)} mono />
                  <InfoRow icon={User} label="Relation to Owner" value={ca.relation} />
                </div>

                {/* Upload trigger for co-applicant */}
                {ca.kycStatus !== "Verified" && (
                  <div className="p-3 bg-warning/5 border border-warning/20 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs">
                      <AlertCircle size={13} className="text-warning" />
                      <span className="text-warning font-medium">KYC documents pending for this co-applicant</span>
                    </div>
                    <button className="text-xs font-semibold text-primary hover:underline">Upload Docs →</button>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}

      {/* Add new form */}
      {addingNew && (
        <div className="bg-card rounded-2xl border border-primary/30 ring-1 ring-primary/10 p-5 space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <Plus size={14} className="text-primary" /> New Co-Applicant
            </h3>
            <button onClick={() => setAddingNew(false)} className="p-1 rounded-lg hover:bg-muted">
              <X size={15} className="text-muted-foreground" />
            </button>
          </div>

          {/* Personal info */}
          <div className="grid sm:grid-cols-2 gap-4">
            <FormField label="Full Name *" error={errors.name}>
              <input value={newForm.name} onChange={e => updateNew("name", e.target.value)} placeholder="Sunita Sharma" className={fldCls(!!errors.name)} />
            </FormField>
            <FormField label="Relation to Owner *">
              <select value={newForm.relation} onChange={e => updateNew("relation", e.target.value)} className={fldCls(false)}>
                {relations.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </FormField>
            <FormField label="Mobile Number *" error={errors.phone}>
              <input value={newForm.phone} onChange={e => updateNew("phone", e.target.value)} placeholder="9876543210" maxLength={10} className={fldCls(!!errors.phone)} />
            </FormField>
            <FormField label="Email Address *" error={errors.email}>
              <input type="email" value={newForm.email} onChange={e => updateNew("email", e.target.value)} placeholder="email@gmail.com" className={fldCls(!!errors.email)} />
            </FormField>
            <FormField label="Date of Birth *" error={errors.dob}>
              <input type="date" value={newForm.dob} onChange={e => updateNew("dob", e.target.value)} className={fldCls(!!errors.dob)} />
            </FormField>
            <FormField label="Occupation">
              <select value={newForm.occupation} onChange={e => updateNew("occupation", e.target.value)} className={fldCls(false)}>
                <option value="">Select occupation</option>
                {occupations.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </FormField>
          </div>

          <div className="border-t border-border pt-4">
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-3">Identity Documents</p>
            <div className="grid sm:grid-cols-2 gap-4">
              <FormField label="Aadhaar Number *" error={errors.aadhar}>
                <input value={newForm.aadhar} onChange={e => updateNew("aadhar", e.target.value)} placeholder="1234 5678 9012" maxLength={14} className={`${fldCls(!!errors.aadhar)} font-mono tracking-wider`} />
              </FormField>
              <FormField label="PAN Number *" error={errors.pan}>
                <input value={newForm.pan} onChange={e => updateNew("pan", e.target.value.toUpperCase())} placeholder="ABCDE1234F" maxLength={10} className={`${fldCls(!!errors.pan)} font-mono tracking-widest`} />
              </FormField>
            </div>
          </div>

          {/* Declaration */}
          <div className="p-3 bg-muted/40 rounded-xl border border-border text-xs text-muted-foreground flex items-start gap-2">
            <Shield size={12} className="mt-0.5 shrink-0 text-primary" />
            Co-applicant has consented to KYC verification and sharing of their documents with Shri Hari Group for the purpose of this property transaction.
          </div>

          <div className="flex items-center gap-3 justify-end">
            <button onClick={() => setAddingNew(false)} className="px-4 py-2 rounded-xl border border-border text-sm font-medium hover:bg-muted transition-colors">Cancel</button>
            <button onClick={handleAdd} className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors">
              <Plus size={14} /> Add Co-Applicant
            </button>
          </div>
        </div>
      )}

      {/* Add button */}
      {!addingNew && coApplicants.length < 3 && (
        <button
          onClick={() => setAddingNew(true)}
          className="w-full flex items-center justify-center gap-2 p-4 rounded-2xl border-2 border-dashed border-border hover:border-primary/40 hover:bg-muted/30 transition-all text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <Plus size={16} /> Add Co-Applicant
          <span className="text-[10px] text-muted-foreground ml-1">({3 - coApplicants.length} remaining)</span>
        </button>
      )}

      {/* Save */}
      <div className="flex justify-end">
        <button onClick={handleSave} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${saved ? "bg-success text-white" : "bg-primary text-white hover:bg-primary/90"}`}>
          {saved ? <><CheckCircle size={15} /> Saved!</> : "Save Changes"}
        </button>
      </div>
    </div>
  );
}

function InfoRow({ icon: Icon, label, value, mono }: { icon: typeof User; label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-start gap-2.5">
      <div className="w-6 h-6 rounded-md bg-muted flex items-center justify-center shrink-0 mt-0.5">
        <Icon size={11} className="text-muted-foreground" />
      </div>
      <div>
        <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{label}</p>
        <p className={`text-xs font-semibold mt-0.5 ${mono ? "font-mono tracking-wider" : ""}`}>{value}</p>
      </div>
    </div>
  );
}

function FormField({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">{label}</label>
      {children}
      {error && <p className="text-[10px] text-destructive mt-1 flex items-center gap-1"><AlertCircle size={9} />{error}</p>}
    </div>
  );
}

function fldCls(hasError: boolean) {
  return `w-full px-3 py-2 text-sm rounded-xl border bg-background focus:outline-none focus:ring-2 transition-all ${hasError ? "border-destructive focus:ring-destructive/20" : "border-border focus:ring-primary/20"}`;
}
