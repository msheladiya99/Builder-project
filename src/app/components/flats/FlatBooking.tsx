import { useState } from "react";
import {
  ArrowLeft, User, FileText,
  ChevronRight, CheckCircle, IndianRupee, Building2,
  Banknote, AlertCircle, Check
} from "lucide-react";
import { mockFlats, statusConfig, fmt } from "./flatData";
import type { FlatView } from "./FlatManagementModule";

interface FlatBookingProps {
  flatId: string;
  onNavigate: (view: FlatView, flatId?: string) => void;
}

type Step = 1 | 2 | 3;
type PaymentMode = "Cash" | "Cheque" | "NEFT/RTGS" | "UPI";

interface BookingForm {
  customerName: string;
  phone: string;
  email: string;
  pan: string;
  aadhar: string;
  address: string;
  city: string;
  pincode: string;
  nomineeeName: string;
  nomineeRelation: string;
  paymentMode: PaymentMode;
  bookingAmount: string;
  chequeNo: string;
  bankName: string;
  transactionRef: string;
  remarks: string;
}

const initialForm: BookingForm = {
  customerName: "", phone: "", email: "", pan: "", aadhar: "",
  address: "", city: "", pincode: "", nomineeeName: "", nomineeRelation: "",
  paymentMode: "NEFT/RTGS", bookingAmount: "50000",
  chequeNo: "", bankName: "", transactionRef: "", remarks: "",
};

const milestones = [
  { label: "On Booking", pct: 5 },
  { label: "On Agreement", pct: 20 },
  { label: "On Plinth", pct: 15 },
  { label: "On Slab (1st)", pct: 15 },
  { label: "On Slab (2nd)", pct: 15 },
  { label: "On Slab (3rd)", pct: 15 },
  { label: "On Possession", pct: 15 },
];

export function FlatBooking({ flatId, onNavigate }: FlatBookingProps) {
  const flat = mockFlats.find(f => f.id === flatId);
  const [step, setStep] = useState<Step>(1);
  const [form, setForm] = useState<BookingForm>(initialForm);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof BookingForm, string>>>({});

  if (!flat) return <div className="text-muted-foreground p-8">Unit not found.</div>;

  const sc = statusConfig[flat.status];

  const update = (key: keyof BookingForm, val: string) => {
    setForm(f => ({ ...f, [key]: val }));
    setErrors(e => ({ ...e, [key]: "" }));
  };

  const validateStep1 = () => {
    const e: Partial<Record<keyof BookingForm, string>> = {};
    if (!form.customerName.trim()) e.customerName = "Required";
    if (!/^[6-9]\d{9}$/.test(form.phone)) e.phone = "Invalid mobile number";
    if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Invalid email";
    if (!/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(form.pan.toUpperCase())) e.pan = "Invalid PAN format";
    if (!form.aadhar.replace(/\s/g, "").match(/^\d{12}$/)) e.aadhar = "Invalid Aadhar (12 digits)";
    if (!form.address.trim()) e.address = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStep2 = () => {
    const e: Partial<Record<keyof BookingForm, string>> = {};
    const amount = parseInt(form.bookingAmount);
    if (!amount || amount < 10000) e.bookingAmount = "Minimum booking amount ₹10,000";
    if (form.paymentMode === "Cheque" && !form.chequeNo) e.chequeNo = "Required";
    if (form.paymentMode === "NEFT/RTGS" && !form.transactionRef) e.transactionRef = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) setStep(2);
    else if (step === 2 && validateStep2()) setStep(3);
  };

  const handleSubmit = () => setSubmitted(true);

  if (submitted) {
    return (
      <div className="max-w-lg mx-auto text-center py-16 space-y-5">
        <div className="w-20 h-20 rounded-full bg-success/10 border-4 border-success/30 flex items-center justify-center mx-auto">
          <CheckCircle size={36} className="text-success" />
        </div>
        <div>
          <h2 className="text-xl font-bold">Booking Confirmed!</h2>
          <p className="text-muted-foreground text-sm mt-1">
            Unit {flat.unitNo} has been successfully booked for <span className="font-semibold text-foreground">{form.customerName}</span>.
          </p>
        </div>
        <div className="bg-card rounded-xl border border-border p-4 text-left space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Booking ID</span>
            <span className="font-semibold">BK-2024-{Math.floor(Math.random() * 9000 + 1000)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Unit</span>
            <span className="font-semibold">{flat.unitNo}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Token Amount</span>
            <span className="font-semibold">₹{parseInt(form.bookingAmount).toLocaleString("en-IN")}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Payment Mode</span>
            <span className="font-semibold">{form.paymentMode}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Date</span>
            <span className="font-semibold">{new Date().toLocaleDateString("en-IN")}</span>
          </div>
        </div>
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => onNavigate("inventory")}
            className="px-5 py-2 rounded-xl border border-border text-sm font-medium hover:bg-muted transition-colors"
          >
            Back to Inventory
          </button>
          <button
            onClick={() => onNavigate("details", flat.id)}
            className="px-5 py-2 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors"
          >
            View Unit Details
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={() => onNavigate("details", flat.id)} className="p-2 rounded-lg border border-border hover:bg-muted transition-colors">
          <ArrowLeft size={16} />
        </button>
        <div>
          <h1 className="text-lg font-bold">Book Unit {flat.unitNo}</h1>
          <p className="text-xs text-muted-foreground">
            Wing {flat.wing} · {flat.floorLabel === "G" ? "Ground Floor" : `Floor ${flat.floorLabel}`} · {flat.bhk} · {fmt(flat.basePrice)}
          </p>
        </div>
        <div className="ml-auto">
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${sc.bg} ${sc.color} ${sc.border}`}>
            {flat.status}
          </span>
        </div>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-0">
        {[
          { n: 1, label: "Customer Info" },
          { n: 2, label: "Payment Details" },
          { n: 3, label: "Review & Confirm" },
        ].map((s, i) => (
          <div key={s.n} className="flex items-center flex-1">
            <div className="flex flex-col items-center gap-1 flex-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${
                step > s.n
                  ? "bg-success border-success text-white"
                  : step === s.n
                  ? "bg-primary border-primary text-white"
                  : "border-border text-muted-foreground"
              }`}>
                {step > s.n ? <Check size={14} /> : s.n}
              </div>
              <span className={`text-[10px] font-semibold whitespace-nowrap ${step === s.n ? "text-primary" : "text-muted-foreground"}`}>
                {s.label}
              </span>
            </div>
            {i < 2 && (
              <div className={`h-0.5 flex-1 -mt-4 mx-1 ${step > s.n ? "bg-success" : "bg-border"}`} />
            )}
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        {/* Form area */}
        <div className="lg:col-span-2">
          {step === 1 && (
            <div className="bg-card rounded-xl border border-border p-5 space-y-5">
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <User size={15} className="text-primary" /> Customer Information
              </h3>

              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Full Name *" error={errors.customerName}>
                  <input placeholder="Rajesh Kumar Sharma" value={form.customerName} onChange={e => update("customerName", e.target.value)}
                    className={inputCls(!!errors.customerName)} />
                </Field>
                <Field label="Mobile Number *" error={errors.phone}>
                  <input placeholder="9876543210" value={form.phone} onChange={e => update("phone", e.target.value)}
                    className={inputCls(!!errors.phone)} maxLength={10} />
                </Field>
                <Field label="Email Address *" error={errors.email}>
                  <input type="email" placeholder="rajesh@gmail.com" value={form.email} onChange={e => update("email", e.target.value)}
                    className={inputCls(!!errors.email)} />
                </Field>
                <Field label="PAN Number *" error={errors.pan}>
                  <input placeholder="ABCDE1234F" value={form.pan} onChange={e => update("pan", e.target.value.toUpperCase())}
                    className={inputCls(!!errors.pan)} maxLength={10} />
                </Field>
                <Field label="Aadhar Number *" error={errors.aadhar}>
                  <input placeholder="1234 5678 9012" value={form.aadhar} onChange={e => update("aadhar", e.target.value)}
                    className={inputCls(!!errors.aadhar)} maxLength={14} />
                </Field>
              </div>

              <div className="border-t border-border pt-4">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Address</h4>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <Field label="Street Address *" error={errors.address}>
                      <input placeholder="12, MG Road, Near City Centre" value={form.address} onChange={e => update("address", e.target.value)}
                        className={inputCls(!!errors.address)} />
                    </Field>
                  </div>
                  <Field label="City">
                    <input placeholder="Pune" value={form.city} onChange={e => update("city", e.target.value)} className={inputCls(false)} />
                  </Field>
                  <Field label="PIN Code">
                    <input placeholder="411001" value={form.pincode} onChange={e => update("pincode", e.target.value)} className={inputCls(false)} maxLength={6} />
                  </Field>
                </div>
              </div>

              <div className="border-t border-border pt-4">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Nominee Details (Optional)</h4>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Nominee Name">
                    <input placeholder="Sita Sharma" value={form.nomineeeName} onChange={e => update("nomineeeName", e.target.value)} className={inputCls(false)} />
                  </Field>
                  <Field label="Relation">
                    <select value={form.nomineeRelation} onChange={e => update("nomineeRelation", e.target.value)} className={inputCls(false)}>
                      <option value="">Select relation</option>
                      {["Spouse", "Father", "Mother", "Son", "Daughter", "Brother", "Sister"].map(r => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                  </Field>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="bg-card rounded-xl border border-border p-5 space-y-5">
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <IndianRupee size={15} className="text-primary" /> Payment Details
              </h3>

              <Field label="Booking / Token Amount (₹) *" error={errors.bookingAmount}>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">₹</span>
                  <input
                    type="number"
                    value={form.bookingAmount}
                    onChange={e => update("bookingAmount", e.target.value)}
                    className={`${inputCls(!!errors.bookingAmount)} pl-7`}
                    min={10000}
                  />
                </div>
                <p className="text-[10px] text-muted-foreground mt-1">Minimum ₹10,000 | Recommended 5% = {fmt(flat.basePrice * 0.05)}</p>
              </Field>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-2">Payment Mode *</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(["Cash", "Cheque", "NEFT/RTGS", "UPI"] as PaymentMode[]).map(m => (
                    <button
                      key={m}
                      onClick={() => update("paymentMode", m)}
                      className={`px-3 py-2.5 rounded-xl border text-xs font-semibold transition-all ${
                        form.paymentMode === m
                          ? "bg-primary/10 border-primary/50 text-primary"
                          : "border-border text-muted-foreground hover:bg-muted"
                      }`}
                    >
                      <div className="flex items-center justify-center gap-1.5">
                        {m === "Cash" && <Banknote size={13} />}
                        {m === "Cheque" && <FileText size={13} />}
                        {m === "NEFT/RTGS" && <Building2 size={13} />}
                        {m === "UPI" && <Phone size={13} />}
                        {m}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {form.paymentMode === "Cheque" && (
                <div className="grid sm:grid-cols-2 gap-4 p-4 bg-muted/50 rounded-xl border border-border">
                  <Field label="Cheque Number *" error={errors.chequeNo}>
                    <input placeholder="123456" value={form.chequeNo} onChange={e => update("chequeNo", e.target.value)} className={inputCls(!!errors.chequeNo)} />
                  </Field>
                  <Field label="Bank Name">
                    <input placeholder="HDFC Bank, Baner Branch" value={form.bankName} onChange={e => update("bankName", e.target.value)} className={inputCls(false)} />
                  </Field>
                </div>
              )}

              {(form.paymentMode === "NEFT/RTGS" || form.paymentMode === "UPI") && (
                <div className="p-4 bg-muted/50 rounded-xl border border-border">
                  <Field label={`${form.paymentMode} Reference No. *`} error={errors.transactionRef}>
                    <input placeholder={form.paymentMode === "UPI" ? "UPI Txn ID" : "NEFT/RTGS UTR No."} value={form.transactionRef} onChange={e => update("transactionRef", e.target.value)} className={inputCls(!!errors.transactionRef)} />
                  </Field>
                </div>
              )}

              <Field label="Remarks / Notes">
                <textarea
                  rows={3}
                  placeholder="Any special instructions or notes..."
                  value={form.remarks}
                  onChange={e => update("remarks", e.target.value)}
                  className={`${inputCls(false)} resize-none`}
                />
              </Field>

              {/* Payment schedule preview */}
              <div className="border-t border-border pt-4">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Payment Schedule Preview</p>
                <div className="space-y-1.5">
                  {milestones.map(m => (
                    <div key={m.label} className="flex items-center justify-between text-xs p-2 rounded-lg hover:bg-muted/50">
                      <span className="text-muted-foreground">{m.label}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-muted-foreground">{m.pct}%</span>
                        <span className="font-semibold w-20 text-right">{fmt(flat.basePrice * m.pct / 100)}</span>
                      </div>
                    </div>
                  ))}
                  <div className="flex items-center justify-between text-xs p-2 rounded-lg bg-primary/5 font-bold text-primary">
                    <span>Total</span>
                    <span>{fmt(flat.basePrice)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="bg-card rounded-xl border border-border p-5">
                <h3 className="text-sm font-semibold mb-4">Review Booking Summary</h3>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="bg-muted/50 rounded-xl p-4 space-y-2">
                    <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Unit Details</p>
                    <div className="space-y-1.5 text-xs">
                      <div className="flex justify-between"><span className="text-muted-foreground">Unit No.</span><span className="font-semibold">{flat.unitNo}</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">BHK</span><span className="font-semibold">{flat.bhk}</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">Floor</span><span className="font-semibold">{flat.floorLabel === "G" ? "Ground" : `Floor ${flat.floorLabel}`}</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">Wing</span><span className="font-semibold">Wing {flat.wing}</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">Area</span><span className="font-semibold">{flat.carpetArea} sq.ft (Carpet)</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">Base Price</span><span className="font-semibold text-primary">{fmt(flat.basePrice)}</span></div>
                    </div>
                  </div>

                  <div className="bg-muted/50 rounded-xl p-4 space-y-2">
                    <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Customer Details</p>
                    <div className="space-y-1.5 text-xs">
                      <div className="flex justify-between"><span className="text-muted-foreground">Name</span><span className="font-semibold">{form.customerName}</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">Mobile</span><span className="font-semibold">{form.phone}</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">Email</span><span className="font-semibold truncate max-w-[100px]">{form.email}</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">PAN</span><span className="font-semibold">{form.pan}</span></div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 bg-success/5 border border-success/20 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Token / Booking Amount</p>
                      <p className="text-xl font-bold text-success mt-0.5">₹{parseInt(form.bookingAmount).toLocaleString("en-IN")}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-muted-foreground">Payment Mode</p>
                      <p className="text-sm font-semibold mt-0.5">{form.paymentMode}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-warning/5 border border-warning/20 rounded-xl flex items-start gap-2">
                  <AlertCircle size={14} className="text-warning mt-0.5 shrink-0" />
                  <p className="text-xs text-muted-foreground">
                    By confirming this booking, you acknowledge that this is a provisional booking. The full Agreement for Sale shall be executed within 30 days of booking.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right: Unit summary */}
        <div className="space-y-4">
          <div className="bg-card rounded-xl border border-border p-4 sticky top-4">
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-3">Unit Summary</p>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                {flat.wing}
              </div>
              <div>
                <p className="font-bold text-sm">{flat.unitNo}</p>
                <p className="text-[10px] text-muted-foreground">{flat.bhk} · {flat.carpetArea} sq.ft</p>
              </div>
            </div>
            <div className="space-y-2 text-xs">
              {[
                ["Wing", `Wing ${flat.wing}`],
                ["Floor", flat.floorLabel === "G" ? "Ground" : `Floor ${flat.floorLabel}`],
                ["Facing", flat.facing],
                ["Carpet Area", `${flat.carpetArea} sq.ft`],
                ["Super Area", `${flat.superArea} sq.ft`],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between">
                  <span className="text-muted-foreground">{k}</span>
                  <span className="font-semibold">{v}</span>
                </div>
              ))}
              <div className="border-t border-border pt-2 mt-1 flex justify-between">
                <span className="text-muted-foreground">Base Price</span>
                <span className="font-bold text-primary">{fmt(flat.basePrice)}</span>
              </div>
              {form.bookingAmount && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Token Amount</span>
                  <span className="font-bold text-success">₹{parseInt(form.bookingAmount || "0").toLocaleString("en-IN")}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer actions */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={() => step > 1 ? setStep((step - 1) as Step) : onNavigate("details", flat.id)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border text-sm font-medium hover:bg-muted transition-colors"
        >
          <ArrowLeft size={14} /> {step > 1 ? "Back" : "Cancel"}
        </button>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Step {step} of 3</span>
          {step < 3 ? (
            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors"
            >
              Continue <ChevronRight size={14} />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-success text-white text-sm font-semibold hover:bg-success/90 transition-colors"
            >
              <Check size={14} /> Confirm Booking
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-muted-foreground mb-1">{label}</label>
      {children}
      {error && <p className="text-[10px] text-destructive mt-1 flex items-center gap-1"><AlertCircle size={10} />{error}</p>}
    </div>
  );
}

function inputCls(hasError: boolean) {
  return `w-full px-3 py-2 text-sm rounded-lg border bg-background focus:outline-none focus:ring-2 transition-all ${
    hasError
      ? "border-destructive focus:ring-destructive/20"
      : "border-border focus:ring-primary/20"
  }`;
}

function Phone({ size, className }: { size: number; className?: string }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={className}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>;
}
