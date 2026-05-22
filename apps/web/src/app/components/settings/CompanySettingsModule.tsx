import { useState, useRef, useEffect } from "react";
import { useCompanyStore } from "../../store/store";

interface Props { isDark: boolean; }

// ── Audit history mock data ────────────────────────────────────────────────────
const AUDIT_LOG = [
  { id: "A001", user: "Rajesh Sharma", role: "Super Admin",   action: "Updated GSTIN",          field: "GSTIN",           old: "27AAFCS1234J1Z5",    ts: "Today, 11:24 AM",   avatar: "RS", color: "#1B3A6B" },
  { id: "A002", user: "Priya Desai",   role: "Finance Admin", action: "Uploaded company logo",  field: "Company Logo",    old: "—",                  ts: "Today, 10:05 AM",   avatar: "PD", color: "#7C3AED" },
  { id: "A003", user: "Rajesh Sharma", role: "Super Admin",   action: "Updated office address", field: "Address",         old: "Old address",        ts: "Yesterday, 4:15 PM", avatar: "RS", color: "#1B3A6B" },
  { id: "A004", user: "Suresh Kumar",  role: "Admin",         action: "Updated mobile number",  field: "Mobile",          old: "+91 98XXX XXXXX",    ts: "May 17, 2:10 PM",   avatar: "SK", color: "#0D9488" },
  { id: "A005", user: "Priya Desai",   role: "Finance Admin", action: "Updated PAN number",     field: "PAN",             old: "AAFCS1234J",         ts: "May 16, 9:55 AM",   avatar: "PD", color: "#7C3AED" },
  { id: "A006", user: "Rajesh Sharma", role: "Super Admin",   action: "Changed company name",   field: "Company Name",    old: "Shri Hari Builders", ts: "May 15, 3:30 PM",   avatar: "RS", color: "#1B3A6B" },
  { id: "A007", user: "Suresh Kumar",  role: "Admin",         action: "Uploaded letterhead",    field: "Letterhead",      old: "—",                  ts: "May 14, 11:00 AM",  avatar: "SK", color: "#0D9488" },
  { id: "A008", user: "Rajesh Sharma", role: "Super Admin",   action: "Updated RERA number",    field: "RERA No.",        old: "—",                  ts: "May 12, 5:20 PM",   avatar: "RS", color: "#1B3A6B" },
  { id: "A009", user: "Priya Desai",   role: "Finance Admin", action: "Uploaded digital sign",  field: "Digital Sign.",   old: "—",                  ts: "May 10, 2:00 PM",   avatar: "PD", color: "#7C3AED" },
  { id: "A010", user: "Rajesh Sharma", role: "Super Admin",   action: "Updated CIN",            field: "CIN",             old: "—",                  ts: "May 8, 10:45 AM",   avatar: "RS", color: "#1B3A6B" },
];

// ── Section divider ────────────────────────────────────────────────────────────
function Section({ title, icon, children, border }: { title: string; icon: string; children: React.ReactNode; border: string }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
        <span style={{ fontSize: 16 }}>{icon}</span>
        <span style={{ fontSize: 13, fontWeight: 800, color: "#1B3A6B", textTransform: "uppercase", letterSpacing: "0.06em" }}>{title}</span>
        <div style={{ flex: 1, height: 1, background: border, marginLeft: 8 }} />
      </div>
      {children}
    </div>
  );
}

// ── Field row ─────────────────────────────────────────────────────────────────
function Field({ label, children, required, hint }: { label: string; children: React.ReactNode; required?: boolean; hint?: string }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>
        {label}{required && <span style={{ color: "#EF4444", marginLeft: 3 }}>*</span>}
      </label>
      {children}
      {hint && <div style={{ fontSize: 10, color: "#94A3B8", marginTop: 4 }}>{hint}</div>}
    </div>
  );
}

export function CompanySettingsModule({ isDark }: Props) {
  const bg     = isDark ? "#0F172A" : "#F1F5F9";
  const card   = isDark ? "#1E293B" : "#FFFFFF";
  const border = isDark ? "rgba(255,255,255,0.08)" : "#E2E8F0";
  const txt    = isDark ? "#F1F5F9" : "#0F172A";
  const sub    = isDark ? "#94A3B8" : "#64748B";
  const input  = isDark ? "#0F172A" : "#F8FAFC";

  // ── Company Store ─────────────────────────────────────────────────────────────
  const { company, fetchCompany, updateCompany } = useCompanyStore();

  // ── Form state ───────────────────────────────────────────────────────────────
  const [companyName, setCompanyName]   = useState("Shri Hari Group Pvt. Ltd.");
  const [gstin, setGstin]               = useState("27AAFCS5678J1Z5");
  const [pan, setPan]                   = useState("AAFCS5678J");
  const [cin, setCin]                   = useState("U45200MH2018PTC312456");
  const [reraNo, setReraNo]             = useState("P51800047896");
  const [reraExpiry, setReraExpiry]     = useState("2027-03-31");
  const [reraState, setReraState]       = useState("Maharashtra");
  const [address1, setAddress1]         = useState("Office 401, Solitaire Corporate Park");
  const [address2, setAddress2]         = useState("Andheri - Kurla Road, Andheri East");
  const [city, setCity]                 = useState("Mumbai");
  const [state, setState]               = useState("Maharashtra");
  const [pincode, setPincode]           = useState("400093");
  const [mobile, setMobile]             = useState("+91 98765 43210");
  const [altMobile, setAltMobile]       = useState("+91 22 6789 0000");
  const [email, setEmail]               = useState("info@shriharisgroup.com");
  const [website, setWebsite]           = useState("https://www.shriharisgroup.com");
  const [gstVerified, setGstVerified]   = useState(true);

  // Bank Info
  const [bankName, setBankName]         = useState("HDFC Bank Ltd.");
  const [bankBranch, setBankBranch]     = useState("Andheri East, Mumbai");
  const [bankAccount, setBankAccount]   = useState("50200078901234");
  const [bankIfsc, setBankIfsc]         = useState("HDFC0001234");

  const [dirty, setDirty]               = useState(false);
  const [saving, setSaving]             = useState(false);
  const [saved, setSaved]               = useState(false);
  const [error, setError]               = useState<string | null>(null);

  // ── Upload state ─────────────────────────────────────────────────────────────
  const [logoDrag, setLogoDrag]           = useState(false);
  const [letterheadDrag, setLetterheadDrag] = useState(false);
  const [signDrag, setSignDrag]           = useState(false);
  const [logoUploaded, setLogoUploaded]   = useState(true);
  const [letterheadUploaded, setLetterheadUploaded] = useState(true);
  const [signUploaded, setSignUploaded]   = useState(false);

  // ── Sidebar ───────────────────────────────────────────────────────────────────
  const [auditOpen, setAuditOpen]         = useState(true);

  function mark() { setDirty(true); setSaved(false); }

  // Load company data from DB on mount
  useEffect(() => {
    fetchCompany();
  }, [fetchCompany]);

  // Sync state values when company object is loaded/updated from store
  useEffect(() => {
    if (company) {
      if (company.name) setCompanyName(company.name);
      
      const s = company.settings || {};
      if (s.gstin) setGstin(s.gstin);
      if (s.pan) setPan(s.pan);
      if (s.cin) setCin(s.cin);
      if (s.reraNo) setReraNo(s.reraNo);
      if (s.reraExpiry) setReraExpiry(s.reraExpiry);
      if (s.reraState) setReraState(s.reraState);
      if (s.address1) setAddress1(s.address1);
      if (s.address2) setAddress2(s.address2);
      if (s.city) setCity(s.city);
      if (s.state) setState(s.state);
      if (s.pincode) setPincode(s.pincode);
      if (s.mobile) setMobile(s.mobile);
      if (s.altMobile) setAltMobile(s.altMobile);
      if (s.email) setEmail(s.email);
      if (s.website) setWebsite(s.website);
      if (s.gstVerified !== undefined) setGstVerified(s.gstVerified);
      
      if (s.bankName) setBankName(s.bankName);
      if (s.bankBranch) setBankBranch(s.bankBranch);
      if (s.bankAccount) setBankAccount(s.bankAccount);
      if (s.bankIfsc) setBankIfsc(s.bankIfsc);

      if (s.logoUploaded !== undefined) setLogoUploaded(s.logoUploaded);
      if (s.letterheadUploaded !== undefined) setLetterheadUploaded(s.letterheadUploaded);
      if (s.signUploaded !== undefined) setSignUploaded(s.signUploaded);
    }
  }, [company]);

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    setError(null);
    try {
      await updateCompany({
        name: companyName,
        settings: {
          gstin,
          pan,
          cin,
          reraNo,
          reraExpiry,
          reraState,
          address1,
          address2,
          city,
          state,
          pincode,
          mobile,
          altMobile,
          email,
          website,
          gstVerified,
          bankName,
          bankBranch,
          bankAccount,
          bankIfsc,
          logoUploaded,
          letterheadUploaded,
          signUploaded
        }
      });
      setSaved(true);
      setDirty(false);
      setTimeout(() => setSaved(false), 3000);
    } catch (e: any) {
      console.error("Failed to save company settings:", e);
      setError(e.message || "Failed to save company settings");
    } finally {
      setSaving(false);
    }
  };

  function inp(value: string, setter: (v: string) => void, placeholder?: string, mono?: boolean) {
    return (
      <input
        value={value}
        onChange={e => { setter(e.target.value); mark(); }}
        placeholder={placeholder}
        style={{
          width: "100%", padding: "9px 12px", borderRadius: 8,
          border: `1px solid ${border}`, background: input, color: txt,
          fontSize: 13, outline: "none", boxSizing: "border-box",
          fontFamily: mono ? "monospace" : "inherit",
        }}
      />
    );
  }

  function UploadZone({ label, icon, uploaded, dragging, onDrag, onDrop, onRemove, hint, accept }:
    { label: string; icon: string; uploaded: boolean; dragging: boolean; onDrag: (v: boolean) => void; onDrop: () => void; onRemove: () => void; hint: string; accept: string }) {
    return (
      <div
        onDragOver={e => { e.preventDefault(); onDrag(true); }}
        onDragLeave={() => onDrag(false)}
        onDrop={e => { e.preventDefault(); onDrag(false); onDrop(); mark(); }}
        style={{
          border: `2px dashed ${dragging ? "#1B3A6B" : uploaded ? "#22C55E" : border}`,
          borderRadius: 12, padding: "20px 16px", textAlign: "center",
          background: dragging ? (isDark ? "rgba(27,58,107,0.15)" : "#EFF6FF") : uploaded ? (isDark ? "rgba(34,197,94,0.05)" : "#F0FDF4") : input,
          transition: "all 0.2s ease", cursor: "pointer",
          position: "relative",
        }}
        onClick={onDrop}
      >
        {uploaded ? (
          <div>
            <div style={{ fontSize: 28, marginBottom: 6 }}>✅</div>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#22C55E" }}>{label} uploaded</div>
            <div style={{ fontSize: 11, color: sub, marginTop: 4 }}>Click or drag to replace</div>
            <button
              onClick={e => { e.stopPropagation(); onRemove(); mark(); }}
              style={{ marginTop: 8, fontSize: 10, color: "#EF4444", background: "none", border: "1px solid #FECACA", borderRadius: 6, padding: "3px 10px", cursor: "pointer" }}
            >
              Remove
            </button>
          </div>
        ) : (
          <div>
            <div style={{ fontSize: 32, marginBottom: 8 }}>{icon}</div>
            <div style={{ fontSize: 12, fontWeight: 700, color: txt }}>
              {dragging ? "Drop to upload" : `Drag & drop ${label}`}
            </div>
            <div style={{ fontSize: 11, color: sub, marginTop: 4 }}>or click to browse · {hint}</div>
            <div style={{ marginTop: 8, fontSize: 10, color: sub }}>Accepts: {accept}</div>
          </div>
        )}
      </div>
    );
  }

  const inputGrid2 = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 } as const;
  const inputGrid3 = { display: "grid", gridTemplateColumns: "1fr 1fr 100px", gap: 16 } as const;

  return (
    <div style={{ display: "flex", height: "100%", overflow: "hidden", background: bg }}>

      {/* ── Main scrollable area ─────────────────────────────────────────────── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 0 }}>
        <div style={{ flex: 1, overflowY: "auto", padding: "24px 28px 100px" }}>

          {/* ── Profile Preview Card ──────────────────────────────────────────── */}
          <div style={{ marginBottom: 28, background: "linear-gradient(135deg, #0F1C2E 0%, #1B3A6B 100%)", borderRadius: 16, padding: "20px 24px", display: "flex", gap: 20, alignItems: "center" }}>
            {/* Logo placeholder */}
            <div style={{ width: 72, height: 72, borderRadius: 14, background: logoUploaded ? "#C9922A" : "rgba(255,255,255,0.1)", border: "2px solid rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              {logoUploaded ? (
                <span style={{ fontSize: 24, fontWeight: 900, color: "#fff" }}>SH</span>
              ) : (
                <span style={{ fontSize: 24 }}>🏗️</span>
              )}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 20, fontWeight: 900, color: "#fff", marginBottom: 4 }}>{companyName || "Company Name"}</div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {gstin && (
                  <div style={{ display: "flex", alignItems: "center", gap: 5, background: gstVerified ? "rgba(34,197,94,0.15)" : "rgba(239,68,68,0.15)", border: `1px solid ${gstVerified ? "rgba(34,197,94,0.3)" : "rgba(239,68,68,0.3)"}`, borderRadius: 8, padding: "3px 10px" }}>
                    <span style={{ fontSize: 10 }}>{gstVerified ? "✓" : "!"}</span>
                    <span style={{ fontSize: 11, color: gstVerified ? "#86EFAC" : "#FCA5A5", fontWeight: 700 }}>GSTIN {gstin}</span>
                  </div>
                )}
                {reraNo && (
                  <div style={{ display: "flex", alignItems: "center", gap: 5, background: "rgba(201,146,42,0.15)", border: "1px solid rgba(201,146,42,0.3)", borderRadius: 8, padding: "3px 10px" }}>
                    <span style={{ fontSize: 10 }}>🏛</span>
                    <span style={{ fontSize: 11, color: "#FCD34D", fontWeight: 700 }}>RERA {reraNo}</span>
                  </div>
                )}
                {pan && (
                  <div style={{ display: "flex", alignItems: "center", gap: 5, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 8, padding: "3px 10px" }}>
                    <span style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", fontWeight: 700 }}>PAN {pan}</span>
                  </div>
                )}
              </div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", marginTop: 6 }}>
                {[address1, city, state, pincode].filter(Boolean).join(", ")}
              </div>
            </div>
            <div style={{ flexShrink: 0, textAlign: "right" }}>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", marginBottom: 4 }}>PLAN</div>
              <div style={{ fontSize: 12, fontWeight: 800, color: "#C9922A", background: "rgba(201,146,42,0.15)", border: "1px solid rgba(201,146,42,0.3)", borderRadius: 8, padding: "4px 12px" }}>ENTERPRISE</div>
              {website && <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", marginTop: 8 }}>{website}</div>}
            </div>
          </div>

          {/* ── Company Information ───────────────────────────────────────────── */}
          <Section title="Company Information" icon="🏢" border={border}>
            <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 12, padding: "20px 20px 4px" }}>
              <Field label="Company / Legal Name" required>
                {inp(companyName, setCompanyName, "As per MCA registration")}
              </Field>

              {/* GSTIN with verification */}
              <Field label="GSTIN" required hint="15-character alphanumeric GST Identification Number">
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <div style={{ flex: 1, position: "relative" }}>
                    {inp(gstin, setGstin, "e.g. 27AAFCS1234J1Z5", true)}
                  </div>
                  <div style={{ display: "flex", gap: 6 }}>
                    {gstVerified ? (
                      <div style={{ display: "flex", alignItems: "center", gap: 5, padding: "8px 12px", background: "#F0FDF4", border: "1px solid #86EFAC", borderRadius: 8, whiteSpace: "nowrap" }}>
                        <span style={{ fontSize: 14 }}>✓</span>
                        <span style={{ fontSize: 11, fontWeight: 700, color: "#22C55E" }}>GST Verified</span>
                      </div>
                    ) : (
                      <button
                        onClick={() => setGstVerified(true)}
                        style={{ padding: "8px 14px", background: "#1B3A6B", color: "#fff", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 12, fontWeight: 700, whiteSpace: "nowrap" }}
                      >
                        Verify via GST
                      </button>
                    )}
                  </div>
                </div>
                {gstVerified && (
                  <div style={{ marginTop: 8, padding: "8px 12px", background: isDark ? "rgba(34,197,94,0.08)" : "#F0FDF4", border: "1px solid #BBF7D0", borderRadius: 8, display: "flex", gap: 16, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 10, color: "#16A34A" }}><strong>Legal Name:</strong> SHRI HARI GROUP PVT LTD</span>
                    <span style={{ fontSize: 10, color: "#16A34A" }}><strong>Status:</strong> Active</span>
                    <span style={{ fontSize: 10, color: "#16A34A" }}><strong>State:</strong> Maharashtra (27)</span>
                    <span style={{ fontSize: 10, color: "#16A34A" }}><strong>Type:</strong> Regular</span>
                    <span style={{ fontSize: 10, color: "#16A34A" }}><strong>Reg. Date:</strong> 01-Apr-2018</span>
                  </div>
                )}
              </Field>

              <div style={inputGrid2}>
                <Field label="PAN Number" required hint="10-character Permanent Account Number">
                  {inp(pan, setPan, "e.g. AAFCS1234J", true)}
                </Field>
                <Field label="CIN Number" hint="Corporate Identification Number">
                  {inp(cin, setCin, "e.g. U45200MH2018PTC312456", true)}
                </Field>
              </div>
            </div>
          </Section>

          {/* ── RERA Details ──────────────────────────────────────────────────── */}
          <Section title="RERA Registration" icon="🏛️" border={border}>
            <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 12, padding: "20px 20px 4px" }}>
              <div style={inputGrid3}>
                <Field label="RERA Registration No." required>
                  {inp(reraNo, setReraNo, "e.g. P51800047896", true)}
                </Field>
                <Field label="Registered State">
                  <select
                    value={reraState}
                    onChange={e => { setReraState(e.target.value); mark(); }}
                    style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: `1px solid ${border}`, background: input, color: txt, fontSize: 13, outline: "none" }}
                  >
                    {["Maharashtra","Gujarat","Karnataka","Telangana","Delhi","Tamil Nadu","Rajasthan","Uttar Pradesh"].map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Expiry Date">
                  <input
                    type="date" value={reraExpiry}
                    onChange={e => { setReraExpiry(e.target.value); mark(); }}
                    style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: `1px solid ${border}`, background: input, color: txt, fontSize: 13, outline: "none" }}
                  />
                </Field>
              </div>

              {/* RERA status bar */}
              <div style={{ marginBottom: 16, padding: "10px 14px", background: isDark ? "rgba(201,146,42,0.08)" : "#FFFBEB", border: "1px solid #FCD34D", borderRadius: 8, display: "flex", gap: 16, alignItems: "center" }}>
                <span style={{ fontSize: 16 }}>📋</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#B45309" }}>RERA {reraNo} — Active</div>
                  <div style={{ fontSize: 10, color: "#92400E" }}>Registered in {reraState} · Expires {reraExpiry ? new Date(reraExpiry).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—"}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 10, color: "#22C55E", fontWeight: 700, background: "#F0FDF4", borderRadius: 6, padding: "2px 8px" }}>635 days left</div>
                </div>
              </div>
            </div>
          </Section>

          {/* ── Office Address ────────────────────────────────────────────────── */}
          <Section title="Registered / Office Address" icon="📍" border={border}>
            <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 12, padding: "20px 20px 4px" }}>
              <Field label="Address Line 1" required>
                {inp(address1, setAddress1, "Building name, floor, unit")}
              </Field>
              <Field label="Address Line 2">
                {inp(address2, setAddress2, "Street, landmark")}
              </Field>
              <div style={inputGrid3}>
                <Field label="City" required>
                  {inp(city, setCity, "e.g. Mumbai")}
                </Field>
                <Field label="State" required>
                  <select
                    value={state}
                    onChange={e => { setState(e.target.value); mark(); }}
                    style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: `1px solid ${border}`, background: input, color: txt, fontSize: 13, outline: "none" }}
                  >
                    {["Maharashtra","Gujarat","Karnataka","Telangana","Delhi","Tamil Nadu","Rajasthan","Uttar Pradesh"].map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </Field>
                <Field label="PIN Code" required>
                  {inp(pincode, setPincode, "6-digit")}
                </Field>
              </div>
            </div>
          </Section>

          {/* ── Contact Details ───────────────────────────────────────────────── */}
          <Section title="Contact Details" icon="📞" border={border}>
            <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 12, padding: "20px 20px 4px" }}>
              <div style={inputGrid2}>
                <Field label="Primary Mobile" required>
                  {inp(mobile, setMobile, "+91 XXXXX XXXXX")}
                </Field>
                <Field label="Alternate / Office Number">
                  {inp(altMobile, setAltMobile, "+91 22 XXXX XXXX")}
                </Field>
              </div>
              <div style={inputGrid2}>
                <Field label="Official Email" required>
                  {inp(email, setEmail, "info@company.com")}
                </Field>
                <Field label="Website URL">
                  {inp(website, setWebsite, "https://www.company.com")}
                </Field>
              </div>
            </div>
          </Section>

          {/* ── Document Uploads ─────────────────────────────────────────────── */}
          <Section title="Documents & Brand Assets" icon="📁" border={border}>
            <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 12, padding: 20 }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: sub, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>Company Logo</div>
                  <UploadZone
                    label="Company Logo" icon="🖼️" uploaded={logoUploaded} dragging={logoDrag}
                    onDrag={setLogoDrag}
                    onDrop={() => setLogoUploaded(true)}
                    onRemove={() => setLogoUploaded(false)}
                    hint="Max 2MB · Square" accept="PNG, JPG, SVG"
                  />
                  <div style={{ fontSize: 10, color: sub, marginTop: 6, textAlign: "center" }}>Appears on invoices, receipts & portal</div>
                </div>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: sub, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>Letterhead</div>
                  <UploadZone
                    label="Letterhead Template" icon="📄" uploaded={letterheadUploaded} dragging={letterheadDrag}
                    onDrag={setLetterheadDrag}
                    onDrop={() => setLetterheadUploaded(true)}
                    onRemove={() => setLetterheadUploaded(false)}
                    hint="A4 · Max 5MB" accept="PDF, PNG, JPG"
                  />
                  <div style={{ fontSize: 10, color: sub, marginTop: 6, textAlign: "center" }}>Used for quotations, letters, reports</div>
                </div>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: sub, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>Digital Signature</div>
                  <UploadZone
                    label="Digital Signature" icon="✍️" uploaded={signUploaded} dragging={signDrag}
                    onDrag={setSignDrag}
                    onDrop={() => setSignUploaded(true)}
                    onRemove={() => setSignUploaded(false)}
                    hint="Transparent BG · Max 500KB" accept="PNG, JPG"
                  />
                  <div style={{ fontSize: 10, color: sub, marginTop: 6, textAlign: "center" }}>Auto-applied on authorised documents</div>
                </div>
              </div>

              {/* Upload guidelines */}
              <div style={{ marginTop: 16, padding: "10px 14px", background: isDark ? "rgba(255,255,255,0.03)" : "#F8FAFC", border: `1px solid ${border}`, borderRadius: 8, display: "flex", gap: 16, flexWrap: "wrap" }}>
                <div style={{ fontSize: 10, color: sub }}>📐 <strong>Logo:</strong> Min 200×200px, square ratio preferred</div>
                <div style={{ fontSize: 10, color: sub }}>📄 <strong>Letterhead:</strong> A4 (2480×3508px) at 300 DPI</div>
                <div style={{ fontSize: 10, color: sub }}>✍️ <strong>Signature:</strong> Transparent background PNG, min 400×200px</div>
              </div>
            </div>
          </Section>

          {/* ── Bank Details (bonus) ──────────────────────────────────────────── */}
          <Section title="Primary Bank Account" icon="🏦" border={border}>
            <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 12, padding: "20px 20px 4px" }}>
              <div style={inputGrid2}>
                <Field label="Bank Name">
                  {inp(bankName, setBankName)}
                </Field>
                <Field label="Branch">
                  {inp(bankBranch, setBankBranch)}
                </Field>
              </div>
              <div style={inputGrid2}>
                <Field label="Account Number" hint="Used on invoices and receipts">
                  <input
                    type="password" value={bankAccount}
                    onChange={e => { setBankAccount(e.target.value); mark(); }}
                    style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: `1px solid ${border}`, background: input, color: txt, fontSize: 13, outline: "none", fontFamily: "monospace", boxSizing: "border-box" }}
                  />
                </Field>
                <Field label="IFSC Code">
                  {inp(bankIfsc, setBankIfsc, undefined, true)}
                </Field>
              </div>
            </div>
          </Section>
        </div>

        {/* ── Sticky Save Footer ──────────────────────────────────────────────── */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: auditOpen ? 320 : 0,
          background: isDark ? "#1E293B" : "#fff",
          borderTop: `1px solid ${border}`,
          padding: "14px 28px",
          display: "flex", alignItems: "center", gap: 16,
          boxShadow: "0 -4px 16px rgba(0,0,0,0.06)",
          zIndex: 20,
        }}>
          {dirty && (
            <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#F59E0B" }}>
              <span style={{ fontSize: 14 }}>●</span>
              <span style={{ fontSize: 12, fontWeight: 600 }}>Unsaved changes</span>
            </div>
          )}
          {saved && (
            <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#22C55E" }}>
              <span style={{ fontSize: 14 }}>✓</span>
              <span style={{ fontSize: 12, fontWeight: 600 }}>All changes saved</span>
            </div>
          )}
          {error && (
            <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#EF4444" }}>
              <span style={{ fontSize: 14 }}>⚠️</span>
              <span style={{ fontSize: 12, fontWeight: 600, color: "#EF4444" }}>{error}</span>
            </div>
          )}
          <div style={{ marginLeft: "auto", display: "flex", gap: 10 }}>
            <button
              onClick={() => { setDirty(false); setSaved(false); }}
              style={{ padding: "9px 20px", background: "transparent", color: sub, border: `1px solid ${border}`, borderRadius: 8, cursor: "pointer", fontSize: 12, fontWeight: 600 }}
            >
              Discard
            </button>
            <button
              onClick={handleSave}
              disabled={!dirty || saving}
              style={{
                padding: "9px 28px",
                background: dirty ? "#1B3A6B" : (isDark ? "#334155" : "#E2E8F0"),
                color: dirty ? "#fff" : sub,
                border: "none", borderRadius: 8, cursor: dirty ? "pointer" : "default",
                fontSize: 12, fontWeight: 700, display: "flex", alignItems: "center", gap: 8,
                transition: "all 0.2s",
              }}
            >
              {saving ? (
                <><span style={{ display: "inline-block", animation: "spin 0.8s linear infinite" }}>⟳</span> Saving…</>
              ) : "Save Changes"}
            </button>
          </div>
        </div>
      </div>

      {/* ── Audit History Sidebar ────────────────────────────────────────────── */}
      <div style={{
        width: auditOpen ? 320 : 0, flexShrink: 0,
        borderLeft: auditOpen ? `1px solid ${border}` : "none",
        background: card, overflow: "hidden",
        transition: "width 0.25s ease",
        display: "flex", flexDirection: "column",
      }}>
        {auditOpen && (
          <>
            <div style={{ padding: "16px 20px 12px", borderBottom: `1px solid ${border}`, display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
              <span style={{ fontSize: 16 }}>🕐</span>
              <span style={{ fontSize: 13, fontWeight: 800, color: txt }}>Audit History</span>
              <span style={{ fontSize: 10, color: sub, marginLeft: 2, background: isDark ? "#334155" : "#F1F5F9", borderRadius: 8, padding: "2px 8px" }}>{AUDIT_LOG.length} changes</span>
              <button
                onClick={() => setAuditOpen(false)}
                style={{ marginLeft: "auto", width: 28, height: 28, borderRadius: 8, background: isDark ? "#334155" : "#F1F5F9", border: "none", cursor: "pointer", color: sub, fontSize: 14 }}
              >
                ✕
              </button>
            </div>

            {/* Filter row */}
            <div style={{ padding: "8px 16px", borderBottom: `1px solid ${border}`, display: "flex", gap: 6, flexShrink: 0 }}>
              {["All", "Today", "This week"].map(f => (
                <button key={f} style={{ padding: "3px 10px", borderRadius: 12, border: `1px solid ${border}`, background: f === "All" ? "#1B3A6B" : "transparent", color: f === "All" ? "#fff" : sub, fontSize: 10, fontWeight: f === "All" ? 700 : 400, cursor: "pointer" }}>{f}</button>
              ))}
            </div>

            <div style={{ flex: 1, overflowY: "auto", padding: "8px 0" }}>
              {AUDIT_LOG.map((log, i) => (
                <div
                  key={log.id}
                  style={{
                    padding: "12px 16px",
                    borderBottom: i < AUDIT_LOG.length - 1 ? `1px solid ${border}` : "none",
                    display: "flex", gap: 10,
                  }}
                >
                  {/* Avatar */}
                  <div style={{
                    width: 32, height: 32, borderRadius: 10,
                    background: log.color, color: "#fff",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 11, fontWeight: 800, flexShrink: 0,
                  }}>
                    {log.avatar}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: txt }}>{log.action}</div>
                    <div style={{ display: "flex", gap: 6, marginTop: 3, flexWrap: "wrap", alignItems: "center" }}>
                      <span style={{ fontSize: 10, fontWeight: 700, color: "#1B3A6B", background: "#EFF6FF", borderRadius: 4, padding: "1px 6px" }}>{log.field}</span>
                      {log.old !== "—" && <span style={{ fontSize: 10, color: sub }}>was: <span style={{ textDecoration: "line-through" }}>{log.old}</span></span>}
                    </div>
                    <div style={{ display: "flex", gap: 4, marginTop: 4, alignItems: "center" }}>
                      <span style={{ fontSize: 10, color: sub }}>{log.user}</span>
                      <span style={{ fontSize: 8, color: sub }}>·</span>
                      <span style={{ fontSize: 9, color: sub, background: isDark ? "#334155" : "#F1F5F9", borderRadius: 4, padding: "1px 5px" }}>{log.role}</span>
                    </div>
                    <div style={{ fontSize: 10, color: sub, marginTop: 2 }}>{log.ts}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Export footer */}
            <div style={{ padding: "12px 16px", borderTop: `1px solid ${border}`, flexShrink: 0 }}>
              <button style={{ width: "100%", padding: "8px 0", background: "transparent", border: `1px solid ${border}`, borderRadius: 8, color: sub, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                ↓ Export Audit Log (CSV)
              </button>
            </div>
          </>
        )}
      </div>

      {/* Audit toggle button when closed */}
      {!auditOpen && (
        <button
          onClick={() => setAuditOpen(true)}
          style={{
            position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)",
            background: "#1B3A6B", color: "#fff", border: "none", borderRadius: "8px 0 0 8px",
            padding: "10px 8px", cursor: "pointer", fontSize: 11, fontWeight: 700,
            writingMode: "vertical-rl", letterSpacing: "0.05em",
          }}
        >
          Audit Log
        </button>
      )}
    </div>
  );
}
