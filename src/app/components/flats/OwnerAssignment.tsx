import { useState } from "react";
import {
  ArrowLeft, Search, UserCheck, User, CreditCard,
  CheckCircle, AlertCircle, Plus,
  Edit2, Calendar
} from "lucide-react";
import { mockFlats, mockCustomers, statusConfig, fmt, type Customer } from "./flatData";
import type { FlatView } from "./FlatManagementModule";

interface OwnerAssignmentProps {
  flatId: string;
  onNavigate: (view: FlatView, flatId?: string) => void;
}

const kycIcon: Record<Customer["kycStatus"], (props: { size: number; className?: string }) => JSX.Element> = {
  Verified: CheckCircle,
  Pending: Clock,
  Rejected: XCircle,
};
const kycColor: Record<Customer["kycStatus"], string> = {
  Verified: "text-success",
  Pending: "text-warning",
  Rejected: "text-destructive",
};
const kycBg: Record<Customer["kycStatus"], string> = {
  Verified: "bg-success/10 border-success/30",
  Pending: "bg-warning/10 border-warning/30",
  Rejected: "bg-destructive/10 border-destructive/30",
};

export function OwnerAssignment({ flatId, onNavigate }: OwnerAssignmentProps) {
  const flat = mockFlats.find(f => f.id === flatId);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Customer | null>(
    flat?.ownerId ? mockCustomers.find(c => c.id === flat.ownerId) || null : null
  );
  const [showSearch, setShowSearch] = useState(!flat?.ownerId);
  const [assignMode, setAssignMode] = useState<"search" | "new">("search");
  const [assigned, setAssigned] = useState(false);

  if (!flat) return <div className="text-muted-foreground p-8">Unit not found.</div>;

  const sc = statusConfig[flat.status];

  const filtered = mockCustomers.filter(c => {
    if (!search) return true;
    const q = search.toLowerCase();
    return c.name.toLowerCase().includes(q) || c.phone.includes(q) || c.email.toLowerCase().includes(q) || c.pan.toLowerCase().includes(q);
  });

  const handleAssign = () => {
    if (selected) setAssigned(true);
  };

  if (assigned) {
    return (
      <div className="max-w-md mx-auto text-center py-16 space-y-5">
        <div className="w-16 h-16 rounded-full bg-success/10 border-4 border-success/30 flex items-center justify-center mx-auto">
          <UserCheck size={28} className="text-success" />
        </div>
        <div>
          <h2 className="text-lg font-bold">Owner Assigned!</h2>
          <p className="text-sm text-muted-foreground mt-1">
            <span className="font-semibold text-foreground">{selected?.name}</span> has been assigned to unit {flat.unitNo}.
          </p>
        </div>
        <div className="flex gap-3 justify-center">
          <button onClick={() => onNavigate("inventory")} className="px-4 py-2 rounded-xl border border-border text-sm font-medium hover:bg-muted transition-colors">
            Back to Inventory
          </button>
          <button onClick={() => onNavigate("details", flat.id)} className="px-4 py-2 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors">
            View Unit
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-3 flex-wrap">
        <button onClick={() => onNavigate("details", flat.id)} className="p-2 rounded-lg border border-border hover:bg-muted transition-colors">
          <ArrowLeft size={16} />
        </button>
        <div>
          <h1 className="text-lg font-bold">Owner Assignment — {flat.unitNo}</h1>
          <p className="text-xs text-muted-foreground">Wing {flat.wing} · {flat.bhk} · {fmt(flat.basePrice)}</p>
        </div>
        <span className={`ml-auto text-xs font-semibold px-2.5 py-1 rounded-full border ${sc.bg} ${sc.color} ${sc.border}`}>
          {flat.status}
        </span>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        {/* Left: Search / Form */}
        <div className="lg:col-span-2 space-y-4">
          {/* Current owner if exists */}
          {flat.ownerName && !showSearch && (
            <div className="bg-card rounded-xl border border-border p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold">Current Owner</h3>
                <button
                  onClick={() => setShowSearch(true)}
                  className="flex items-center gap-1.5 text-xs text-primary hover:underline"
                >
                  <Edit2 size={12} /> Change Owner
                </button>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white font-bold shrink-0">
                  {flat.ownerName.split(" ").map(n => n[0]).join("").slice(0, 2)}
                </div>
                <div className="flex-1">
                  <p className="font-semibold">{flat.ownerName}</p>
                  <p className="text-xs text-muted-foreground">{flat.ownerPhone} · {flat.ownerEmail}</p>
                </div>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-success/10 text-success border border-success/30">
                  KYC Verified
                </span>
              </div>
              {flat.bookingDate && (
                <div className="mt-4 grid grid-cols-3 gap-3">
                  {[
                    { label: "Booking Date", val: flat.bookingDate },
                    ...(flat.agreementDate ? [{ label: "Agreement", val: flat.agreementDate }] : []),
                    ...(flat.registrationDate ? [{ label: "Registration", val: flat.registrationDate }] : []),
                  ].map(item => (
                    <div key={item.label} className="bg-muted/50 rounded-lg p-2.5">
                      <p className="text-[10px] text-muted-foreground flex items-center gap-1"><Calendar size={9} /> {item.label}</p>
                      <p className="text-xs font-semibold mt-0.5">{item.val}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Search / Assign */}
          {(showSearch || !flat.ownerName) && (
            <div className="bg-card rounded-xl border border-border p-5 space-y-4">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold flex-1">Assign Owner</h3>
                <div className="flex items-center gap-1 bg-muted p-0.5 rounded-lg">
                  <button
                    onClick={() => setAssignMode("search")}
                    className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${assignMode === "search" ? "bg-card shadow-sm text-foreground" : "text-muted-foreground"}`}
                  >
                    Search Existing
                  </button>
                  <button
                    onClick={() => setAssignMode("new")}
                    className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${assignMode === "new" ? "bg-card shadow-sm text-foreground" : "text-muted-foreground"}`}
                  >
                    New Customer
                  </button>
                </div>
              </div>

              {assignMode === "search" && (
                <>
                  <div className="relative">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                      placeholder="Search by name, phone, email, or PAN..."
                      className="w-full pl-8 pr-3 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>

                  <div className="space-y-2 max-h-80 overflow-y-auto">
                    {filtered.map(c => {
                      const KycIcon = kycIcon[c.kycStatus];
                      const isSelected = selected?.id === c.id;
                      return (
                        <button
                          key={c.id}
                          onClick={() => setSelected(isSelected ? null : c)}
                          className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                            isSelected
                              ? "bg-primary/5 border-primary/50 ring-2 ring-primary/20"
                              : "border-border hover:bg-muted/50"
                          }`}
                        >
                          <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-primary/80 to-secondary/80 flex items-center justify-center text-white font-bold text-xs shrink-0">
                            {c.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-semibold">{c.name}</p>
                              <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full border ${kycBg[c.kycStatus]} ${kycColor[c.kycStatus]}`}>
                                {c.kycStatus}
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground truncate">{c.phone} · {c.email}</p>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="text-[10px] text-muted-foreground">PAN</p>
                            <p className="text-xs font-mono font-semibold">{c.pan}</p>
                          </div>
                          {isSelected && <CheckCircle size={16} className="text-primary shrink-0" />}
                        </button>
                      );
                    })}
                    {filtered.length === 0 && (
                      <div className="text-center py-6 text-muted-foreground text-sm">No customers found</div>
                    )}
                  </div>
                </>
              )}

              {assignMode === "new" && (
                <NewCustomerForm onSelect={c => { setSelected(c); setAssignMode("search"); }} />
              )}
            </div>
          )}
        </div>

        {/* Right: Selected customer card */}
        <div className="space-y-4">
          {selected ? (
            <div className="bg-card rounded-xl border border-primary/30 p-5 space-y-4">
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Selected Owner</p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white font-bold">
                  {selected.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                </div>
                <div>
                  <p className="font-bold">{selected.name}</p>
                  <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full border ${kycBg[selected.kycStatus]} ${kycColor[selected.kycStatus]}`}>
                    KYC {selected.kycStatus}
                  </span>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                {[
                  { icon: Phone, label: "Mobile", val: selected.phone },
                  { icon: Mail, label: "Email", val: selected.email },
                  { icon: CreditCard, label: "PAN", val: selected.pan },
                  { icon: Shield, label: "Aadhar", val: selected.aadhar },
                  { icon: User, label: "Address", val: selected.address },
                ].map(item => (
                  <div key={item.label} className="flex items-start gap-2">
                    <div className="w-5 h-5 rounded bg-muted flex items-center justify-center shrink-0 mt-0.5">
                      <item.icon size={10} className="text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground">{item.label}</p>
                      <p className="font-semibold">{item.val}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-border pt-3">
                <p className="text-[10px] text-muted-foreground mb-2">Unit being assigned</p>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Unit</span><span className="font-semibold">{flat.unitNo}</span>
                </div>
                <div className="flex justify-between text-xs mt-1">
                  <span className="text-muted-foreground">Price</span><span className="font-semibold text-primary">{fmt(flat.basePrice)}</span>
                </div>
              </div>

              <button
                onClick={handleAssign}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors"
              >
                <UserCheck size={15} /> Assign as Owner
              </button>
            </div>
          ) : (
            <div className="bg-card rounded-xl border border-border p-5 flex flex-col items-center text-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
                <User size={20} className="text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm font-semibold">No owner selected</p>
                <p className="text-xs text-muted-foreground mt-1">Search and select a customer from the list to assign them as the unit owner.</p>
              </div>
            </div>
          )}

          {/* KYC Requirements */}
          <div className="bg-card rounded-xl border border-border p-4">
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-3">KYC Requirements</p>
            <div className="space-y-2">
              {["PAN Card (Mandatory)", "Aadhar Card (Mandatory)", "Photo ID Proof", "Address Proof", "Income Proof (Optional)"].map(doc => (
                <div key={doc} className="flex items-center gap-2 text-xs">
                  <CheckCircle size={12} className="text-success shrink-0" />
                  <span>{doc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function NewCustomerForm({ onSelect }: { onSelect: (c: Customer) => void }) {
  const [form, setForm] = useState({ name: "", phone: "", email: "", pan: "", aadhar: "", address: "" });
  const update = (k: keyof typeof form, v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleAdd = () => {
    if (form.name && form.phone && form.pan) {
      onSelect({
        id: `new-${Date.now()}`,
        name: form.name,
        phone: form.phone,
        email: form.email,
        pan: form.pan.toUpperCase(),
        aadhar: form.aadhar,
        address: form.address,
        kycStatus: "Pending",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="p-3 bg-warning/5 border border-warning/20 rounded-xl flex items-start gap-2">
        <AlertCircle size={13} className="text-warning mt-0.5 shrink-0" />
        <p className="text-xs text-muted-foreground">New customer KYC will be marked as Pending until verified by the compliance team.</p>
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        {[
          { k: "name", label: "Full Name *", placeholder: "Rajesh Sharma" },
          { k: "phone", label: "Mobile *", placeholder: "9876543210" },
          { k: "email", label: "Email", placeholder: "email@gmail.com" },
          { k: "pan", label: "PAN *", placeholder: "ABCDE1234F" },
          { k: "aadhar", label: "Aadhar", placeholder: "1234 5678 9012" },
          { k: "address", label: "Address", placeholder: "City, State" },
        ].map(field => (
          <div key={field.k}>
            <label className="block text-[10px] font-semibold text-muted-foreground mb-1">{field.label}</label>
            <input
              value={form[field.k as keyof typeof form]}
              onChange={e => update(field.k as keyof typeof form, e.target.value)}
              placeholder={field.placeholder}
              className="w-full px-3 py-2 text-xs rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        ))}
      </div>
      <button
        onClick={handleAdd}
        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors"
      >
        <Plus size={14} /> Add & Select Customer
      </button>
    </div>
  );
}

function Clock({ size, className }: { size: number; className?: string }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={className}><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>;
}
function XCircle({ size, className }: { size: number; className?: string }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={className}><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6M9 9l6 6"/></svg>;
}
function Shield({ size, className }: { size: number; className?: string }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={className}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;
}
function Phone({ size, className }: { size: number; className?: string }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={className}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>;
}
function Mail({ size, className }: { size: number; className?: string }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={className}><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>;
}
