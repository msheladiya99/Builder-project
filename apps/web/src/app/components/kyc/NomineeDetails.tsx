import { useState } from "react";
import {
  ArrowLeft, Plus, User, Trash2, AlertCircle, CheckCircle,
  Info, Shield, X, AlertTriangle
} from "lucide-react";
import { mockOwners, type Nominee } from "./kycData";
import type { KYCView } from "./KYCModule";

interface NomineeDetailsProps {
  ownerId: string;
  onNavigate: (view: KYCView, ownerId?: string) => void;
}

const relations = ["Spouse", "Son", "Daughter", "Father", "Mother", "Brother", "Sister", "Grandson", "Granddaughter", "Other"];
const guardianRelations = ["Father", "Mother", "Grandfather", "Grandmother", "Uncle", "Aunt", "Brother", "Sister"];

const empty: Omit<Nominee, "id" | "isMinor"> = {
  name: "", relation: "Spouse", dob: "", share: 0, aadhar: "", phone: "",
};

function isMinorDOB(dob: string) {
  if (!dob) return false;
  const age = (Date.now() - new Date(dob).getTime()) / (1000 * 60 * 60 * 24 * 365.25);
  return age < 18;
}

function calcAge(dob: string) {
  if (!dob) return null;
  return Math.floor((Date.now() - new Date(dob).getTime()) / (1000 * 60 * 60 * 24 * 365.25));
}

export function NomineeDetails({ ownerId, onNavigate }: NomineeDetailsProps) {
  const owner = mockOwners.find(o => o.id === ownerId);
  const [nominees, setNominees] = useState<Nominee[]>(owner?.nominees || []);
  const [addingNew, setAddingNew] = useState(false);
  const [newForm, setNewForm] = useState({ ...empty, guardian: "", guardianRelation: "" as string });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  if (!owner) return null;

  const totalShare = nominees.reduce((s, n) => s + n.share, 0);
  const remainingShare = 100 - totalShare;

  const updateNew = (k: string, v: string | number) => {
    setNewForm(f => ({ ...f, [k]: v }));
    setErrors(e => ({ ...e, [k]: "" }));
  };

  const validateNew = () => {
    const e: Record<string, string> = {};
    if (!newForm.name.trim()) e.name = "Required";
    if (!newForm.dob) e.dob = "Required";
    if (!newForm.share || newForm.share <= 0) e.share = "Must be > 0";
    if (newForm.share > remainingShare) e.share = `Max ${remainingShare}% available`;
    if (isMinorDOB(newForm.dob) && !newForm.guardian?.trim()) e.guardian = "Guardian required for minor nominee";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleAdd = () => {
    if (!validateNew()) return;
    const isMinor = isMinorDOB(newForm.dob);
    const n: Nominee = {
      id: `n-${Date.now()}`,
      name: newForm.name,
      relation: newForm.relation,
      dob: newForm.dob,
      share: Number(newForm.share),
      isMinor,
      aadhar: newForm.aadhar,
      phone: newForm.phone,
      guardian: isMinor ? newForm.guardian : undefined,
      guardianRelation: isMinor ? newForm.guardianRelation : undefined,
    };
    setNominees(prev => [...prev, n]);
    setNewForm({ ...empty, guardian: "", guardianRelation: "" });
    setAddingNew(false);
  };

  const handleRemove = (id: string) => setNominees(prev => prev.filter(n => n.id !== id));

  const updateShare = (id: string, val: number) => {
    setNominees(prev => prev.map(n => n.id === id ? { ...n, share: val } : n));
  };

  const shareColors = ["bg-primary", "bg-secondary", "bg-success", "bg-warning", "bg-info"];

  return (
    <div className="space-y-5 max-w-3xl">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={() => onNavigate("profile", ownerId)} className="p-2 rounded-xl border border-border hover:bg-muted transition-colors">
          <ArrowLeft size={15} />
        </button>
        <div>
          <h1 className="text-lg font-bold flex items-center gap-2">
            <User size={18} className="text-primary" /> Nominee Details
          </h1>
          <p className="text-xs text-muted-foreground">{owner.salutation} {owner.name} · {nominees.length} nominee(s)</p>
        </div>
      </div>

      {/* Share allocation bar */}
      <div className="bg-card rounded-2xl border border-border p-5">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-semibold">Share Allocation</p>
          <div className="flex items-center gap-2">
            <span className={`text-xs font-bold ${totalShare === 100 ? "text-success" : totalShare > 100 ? "text-destructive" : "text-warning"}`}>
              {totalShare}% allocated
            </span>
            {totalShare < 100 && (
              <span className="text-xs text-muted-foreground">· {100 - totalShare}% remaining</span>
            )}
          </div>
        </div>

        <div className="h-3 rounded-full bg-muted overflow-hidden flex mb-3">
          {nominees.map((n, i) => (
            <div
              key={n.id}
              className={`h-full ${shareColors[i % shareColors.length]} transition-all first:rounded-l-full`}
              style={{ width: `${n.share}%` }}
              title={`${n.name}: ${n.share}%`}
            />
          ))}
          {totalShare < 100 && (
            <div className="h-full bg-border/50 flex-1 last:rounded-r-full" />
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {nominees.map((n, i) => (
            <div key={n.id} className="flex items-center gap-1.5 text-xs">
              <div className={`w-2 h-2 rounded-full ${shareColors[i % shareColors.length]}`} />
              <span className="font-medium">{n.name.split(" ")[0]}</span>
              <span className="text-muted-foreground">{n.share}%</span>
            </div>
          ))}
          {totalShare < 100 && (
            <div className="flex items-center gap-1.5 text-xs">
              <div className="w-2 h-2 rounded-full bg-muted-foreground/30" />
              <span className="text-muted-foreground">Unallocated {100 - totalShare}%</span>
            </div>
          )}
        </div>

        {totalShare !== 100 && nominees.length > 0 && (
          <div className="mt-3 flex items-center gap-2 text-xs p-2.5 bg-warning/5 border border-warning/20 rounded-xl">
            <AlertTriangle size={12} className="text-warning shrink-0" />
            <span className="text-warning font-medium">
              {totalShare > 100 ? "Total exceeds 100% — please adjust" : `${100 - totalShare}% unallocated — all shares must total exactly 100%`}
            </span>
          </div>
        )}
        {totalShare === 100 && nominees.length > 0 && (
          <div className="mt-3 flex items-center gap-2 text-xs p-2.5 bg-success/5 border border-success/20 rounded-xl">
            <CheckCircle size={12} className="text-success shrink-0" />
            <span className="text-success font-medium">Share allocation complete — 100%</span>
          </div>
        )}
      </div>

      {/* Existing nominees */}
      {nominees.map((n, i) => {
        const age = calcAge(n.dob);
        return (
          <div key={n.id} className="bg-card rounded-2xl border border-border p-5">
            <div className="flex items-start justify-between gap-3 mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl ${shareColors[i % shareColors.length]} flex items-center justify-center text-white font-bold text-sm shrink-0`}>
                  {n.name.split(" ").map(x => x[0]).join("").slice(0, 2)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-sm">{n.name}</p>
                    {n.isMinor && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-warning/10 text-warning border border-warning/30">Minor</span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{n.relation} · Age {age}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {/* Share editor */}
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    value={n.share}
                    onChange={e => updateShare(n.id, Math.max(0, Math.min(100, Number(e.target.value))))}
                    className="w-14 px-2 py-1 text-sm font-bold text-center rounded-lg border border-border bg-muted focus:outline-none focus:ring-1 focus:ring-primary/30"
                  />
                  <span className="text-xs font-bold text-muted-foreground">%</span>
                </div>
                <button onClick={() => handleRemove(n.id)} className="p-1.5 rounded-lg hover:bg-destructive/10 hover:text-destructive text-muted-foreground transition-colors">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>

            <div className="grid sm:grid-cols-3 gap-3 text-xs">
              <div className="bg-muted/40 rounded-xl p-2.5">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Date of Birth</p>
                <p className="font-semibold mt-0.5">{new Date(n.dob).toLocaleDateString("en-IN")}</p>
              </div>
              {n.aadhar && (
                <div className="bg-muted/40 rounded-xl p-2.5">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Aadhaar</p>
                  <p className="font-mono font-semibold mt-0.5">{n.aadhar.slice(0, 4) + " XXXX " + n.aadhar.slice(-4)}</p>
                </div>
              )}
              {n.phone && (
                <div className="bg-muted/40 rounded-xl p-2.5">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Mobile</p>
                  <p className="font-semibold mt-0.5">{n.phone}</p>
                </div>
              )}
            </div>

            {n.isMinor && n.guardian && (
              <div className="mt-3 p-3 bg-warning/5 border border-warning/20 rounded-xl">
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">Guardian (for Minor Nominee)</p>
                <div className="flex items-center gap-2 text-xs">
                  <User size={11} className="text-warning" />
                  <span className="font-semibold">{n.guardian}</span>
                  {n.guardianRelation && <span className="text-muted-foreground">· {n.guardianRelation}</span>}
                </div>
              </div>
            )}
          </div>
        );
      })}

      {/* Add new nominee form */}
      {addingNew && (
        <div className="bg-card rounded-2xl border border-primary/30 ring-1 ring-primary/10 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold flex items-center gap-2"><Plus size={14} className="text-primary" /> New Nominee</h3>
            <button onClick={() => setAddingNew(false)} className="p-1 rounded-lg hover:bg-muted"><X size={15} className="text-muted-foreground" /></button>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <FormField label="Full Name *" error={errors.name}>
              <input value={newForm.name} onChange={e => updateNew("name", e.target.value)} placeholder="Aryan Sharma" className={fldCls(!!errors.name)} />
            </FormField>
            <FormField label="Relation *">
              <select value={newForm.relation} onChange={e => updateNew("relation", e.target.value)} className={fldCls(false)}>
                {relations.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </FormField>
            <FormField label="Date of Birth *" error={errors.dob}>
              <input type="date" value={newForm.dob} onChange={e => updateNew("dob", e.target.value)} className={fldCls(!!errors.dob)} />
            </FormField>
            <FormField label={`Share % (${remainingShare}% available) *`} error={errors.share}>
              <input type="number" min={1} max={remainingShare} value={newForm.share || ""} onChange={e => updateNew("share", Number(e.target.value))} placeholder={String(remainingShare)} className={fldCls(!!errors.share)} />
            </FormField>
            <FormField label="Mobile Number">
              <input value={newForm.phone} onChange={e => updateNew("phone", e.target.value)} placeholder="9876543210" className={fldCls(false)} />
            </FormField>
            <FormField label="Aadhaar Number">
              <input value={newForm.aadhar} onChange={e => updateNew("aadhar", e.target.value)} placeholder="1234 5678 9012" className={`${fldCls(false)} font-mono tracking-wider`} />
            </FormField>
          </div>

          {/* Minor indicator */}
          {newForm.dob && isMinorDOB(newForm.dob) && (
            <div className="p-3 bg-warning/5 border border-warning/20 rounded-xl">
              <div className="flex items-center gap-2 text-xs text-warning font-semibold mb-3">
                <AlertTriangle size={13} /> This nominee is a minor (age {calcAge(newForm.dob)}) — guardian details required
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <FormField label="Guardian Name *" error={errors.guardian}>
                  <input value={newForm.guardian} onChange={e => updateNew("guardian", e.target.value)} placeholder="Sunita Sharma" className={fldCls(!!errors.guardian)} />
                </FormField>
                <FormField label="Guardian Relation">
                  <select value={newForm.guardianRelation} onChange={e => updateNew("guardianRelation", e.target.value)} className={fldCls(false)}>
                    <option value="">Select relation</option>
                    {guardianRelations.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </FormField>
              </div>
            </div>
          )}

          <div className="flex items-center gap-3 justify-end pt-2 border-t border-border">
            <button onClick={() => setAddingNew(false)} className="px-4 py-2 rounded-xl border border-border text-sm font-medium hover:bg-muted transition-colors">Cancel</button>
            <button onClick={handleAdd} className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors">
              <Plus size={14} /> Add Nominee
            </button>
          </div>
        </div>
      )}

      {/* Add button */}
      {!addingNew && nominees.length < 4 && totalShare < 100 && (
        <button
          onClick={() => setAddingNew(true)}
          className="w-full flex items-center justify-center gap-2 p-4 rounded-2xl border-2 border-dashed border-border hover:border-primary/40 hover:bg-muted/30 transition-all text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <Plus size={16} /> Add Nominee
          <span className="text-[10px] text-muted-foreground ml-1">({remainingShare}% remaining)</span>
        </button>
      )}

      {/* Legal note */}
      <div className="flex items-start gap-2 p-4 bg-muted/40 rounded-xl border border-border text-xs text-muted-foreground">
        <Info size={13} className="shrink-0 mt-0.5" />
        <span>Nominee details are registered as per Section 6AA of the Transfer of Property Act. In case of minor nominees, the guardian shall act on their behalf until the nominee attains 18 years of age. All nominees must be natural persons — corporations or trusts are not permitted.</span>
      </div>

      {/* Save */}
      <div className="flex justify-end">
        <button
          onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2000); }}
          disabled={totalShare !== 100 && nominees.length > 0}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
            saved ? "bg-success text-white" : totalShare !== 100 && nominees.length > 0 ? "bg-muted text-muted-foreground cursor-not-allowed" : "bg-primary text-white hover:bg-primary/90"
          }`}
        >
          {saved ? <><CheckCircle size={15} /> Saved!</> : "Save Nominees"}
        </button>
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

