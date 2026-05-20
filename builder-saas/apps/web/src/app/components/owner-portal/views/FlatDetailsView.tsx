import { flat, owner, fmtINR, STATUS_CFG } from "../ownerPortalData";
import { MapPin, Phone, Mail, Car, Compass, Layers, Maximize2, CalendarCheck, Shield } from "lucide-react";

const PAID_PCT = Math.round((flat.paidAmount / flat.totalCost) * 100);
const REMAINING = flat.totalCost - flat.paidAmount;

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "12px 0", borderBottom: "1px solid #F1F5F9" }}>
      <div style={{ width: 32, height: 32, borderRadius: 9, background: "#F8FAFC", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
        {icon}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 10, color: "#94A3B8", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 2 }}>{label}</p>
        <p style={{ fontSize: 13, color: "#0F172A", fontWeight: 600 }}>{value}</p>
      </div>
    </div>
  );
}

export function FlatDetailsView() {
  const statusCfg = STATUS_CFG[flat.status];

  return (
    <div className="flex-1 overflow-y-auto">

      {/* Hero card */}
      <div style={{ margin: "12px 16px 0", borderRadius: 20, overflow: "hidden", boxShadow: "0 4px 20px rgba(27,58,107,0.15)" }}>
        {/* Illustration band */}
        <div style={{ background: "linear-gradient(135deg, #0A1628 0%, #1B3A6B 60%, #2563EB 100%)", padding: "24px 20px 0", position: "relative", overflow: "hidden" }}>
          {/* Abstract building silhouette */}
          <div style={{ position: "absolute", bottom: 0, right: 0, opacity: 0.06 }}>
            <svg width="160" height="120" viewBox="0 0 160 120" fill="white">
              <rect x="20" y="30" width="60" height="90" />
              <rect x="90" y="50" width="50" height="70" />
              <rect x="0" y="60" width="30" height="60" />
              <rect x="30" y="20" width="8" height="10" opacity="0.5"/>
              <rect x="42" y="20" width="8" height="10" opacity="0.5"/>
              <rect x="54" y="20" width="8" height="10" opacity="0.5"/>
            </svg>
          </div>

          <div style={{ marginBottom: 16 }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
              <div>
                <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4 }}>{flat.projectName}</p>
                <p style={{ color: "#fff", fontSize: 28, fontWeight: 900, lineHeight: 1 }}>Flat {flat.flatNo}</p>
                <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 13, fontWeight: 600, marginTop: 4 }}>{flat.tower} · Floor {flat.floor} · {flat.type}</p>
              </div>
              <span style={{
                background: statusCfg.bg, color: statusCfg.color,
                fontSize: 9, fontWeight: 800, padding: "5px 10px", borderRadius: 99,
                letterSpacing: "0.04em",
              }}>
                {statusCfg.label}
              </span>
            </div>
          </div>

          {/* Payment progress bar */}
          <div style={{ background: "rgba(255,255,255,0.08)", borderRadius: "16px 16px 0 0", padding: "14px 16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <div>
                <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 9, fontWeight: 700, textTransform: "uppercase" }}>Paid</p>
                <p style={{ color: "#C9922A", fontSize: 18, fontWeight: 900 }}>{fmtINR(flat.paidAmount)}</p>
              </div>
              <div style={{ textAlign: "center" }}>
                <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 9, fontWeight: 700, textTransform: "uppercase" }}>Progress</p>
                <p style={{ color: "#fff", fontSize: 18, fontWeight: 900 }}>{PAID_PCT}%</p>
              </div>
              <div style={{ textAlign: "right" }}>
                <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 9, fontWeight: 700, textTransform: "uppercase" }}>Total Cost</p>
                <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 18, fontWeight: 900 }}>{fmtINR(flat.totalCost)}</p>
              </div>
            </div>
            <div style={{ height: 6, background: "rgba(255,255,255,0.12)", borderRadius: 99, overflow: "hidden" }}>
              <div style={{ width: `${PAID_PCT}%`, height: "100%", background: "linear-gradient(90deg, #C9922A, #F59E0B)", borderRadius: 99 }} />
            </div>
            <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 10, marginTop: 6, textAlign: "right" }}>
              {fmtINR(REMAINING)} remaining
            </p>
          </div>
        </div>
      </div>

      {/* Quick chips */}
      <div style={{ display: "flex", gap: 8, padding: "12px 16px", overflowX: "auto" }}>
        {[
          { icon: "📐", label: `${flat.area} sq.ft` },
          { icon: "🧭", label: flat.facing.split(" ")[0] },
          { icon: "🚗", label: `Parking ${flat.parkingNo}` },
          { icon: "📅", label: `Possession ${flat.possessionDate}` },
        ].map(chip => (
          <div
            key={chip.label}
            style={{ flexShrink: 0, display: "flex", alignItems: "center", gap: 5, background: "#fff", border: "1.5px solid #E2E8F0", borderRadius: 99, padding: "6px 12px" }}
          >
            <span style={{ fontSize: 13 }}>{chip.icon}</span>
            <span style={{ fontSize: 11, color: "#1E293B", fontWeight: 700, whiteSpace: "nowrap" }}>{chip.label}</span>
          </div>
        ))}
      </div>

      {/* Details section */}
      <div style={{ margin: "0 16px", background: "#fff", borderRadius: 20, border: "1.5px solid #F1F5F9", padding: "4px 16px 4px", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
        <p style={{ fontSize: 11, fontWeight: 800, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.08em", padding: "14px 0 4px" }}>Flat Details</p>
        <InfoRow icon={<Layers size={15} color="#1B3A6B" />}      label="Type"            value={flat.type} />
        <InfoRow icon={<Maximize2 size={15} color="#1B3A6B" />}   label="Carpet Area"     value={`${flat.area} sq.ft`} />
        <InfoRow icon={<Compass size={15} color="#1B3A6B" />}     label="Facing"          value={flat.facing} />
        <InfoRow icon={<Car size={15} color="#1B3A6B" />}         label="Parking"         value={`Slot ${flat.parkingNo} (Covered)`} />
        <InfoRow icon={<CalendarCheck size={15} color="#1B3A6B" />} label="Possession"    value={flat.possessionDate} />
        <InfoRow icon={<Shield size={15} color="#7C3AED" />}      label="RERA No."        value={flat.reraNo} />
        <InfoRow icon={<MapPin size={15} color="#EF4444" />}      label="Project Address" value={flat.address} />
      </div>

      {/* Owner details */}
      <div style={{ margin: "12px 16px", background: "#fff", borderRadius: 20, border: "1.5px solid #F1F5F9", padding: "4px 16px 4px", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
        <p style={{ fontSize: 11, fontWeight: 800, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.08em", padding: "14px 0 4px" }}>Owner Information</p>
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 0", borderBottom: "1px solid #F1F5F9" }}>
          <div style={{ width: 44, height: 44, borderRadius: 99, background: "linear-gradient(135deg, #1B3A6B, #2563EB)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <span style={{ color: "#fff", fontWeight: 900, fontSize: 16 }}>{owner.avatar}</span>
          </div>
          <div>
            <p style={{ fontSize: 15, fontWeight: 800, color: "#0F172A" }}>{owner.name}</p>
            <p style={{ fontSize: 10, color: "#94A3B8" }}>Primary Owner</p>
          </div>
        </div>
        <InfoRow icon={<Phone size={15} color="#1B3A6B" />} label="Mobile" value={owner.phone} />
        <InfoRow icon={<Mail size={15} color="#1B3A6B" />}  label="Email"  value={owner.email} />
      </div>

      <div style={{ height: 16 }} />
    </div>
  );
}
