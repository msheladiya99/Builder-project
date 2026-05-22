import { useState } from "react";
import {
  ArrowLeft, Home, MapPin, Maximize2, Car, CalendarDays,
  FileText, UserCheck, ChevronRight, BookOpen,
  Compass, Building2, Layers, IndianRupee, CheckCircle, Circle
} from "lucide-react";
import { mockFlats, statusConfig, fmt, type FlatStatus } from "./flatData";
import type { FlatView } from "./FlatManagementModule";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

interface FlatDetailsProps {
  flatId: string;
  onNavigate: (view: FlatView, flatId?: string) => void;
}

const statusSteps: { key: FlatStatus; label: string; desc: string }[] = [
  { key: "Available", label: "Available", desc: "Unit is open for booking" },
  { key: "Booked", label: "Booked", desc: "Token amount received" },
  { key: "Sold", label: "Agreement Signed", desc: "Sale agreement executed" },
  { key: "Registered", label: "Registered", desc: "Registration completed" },
];

const statusOrder: Record<FlatStatus, number> = {
  Available: 0,
  Booked: 1,
  Sold: 2,
  Registered: 3,
  Cancelled: -1,
};

export function FlatDetails({ flatId, onNavigate }: FlatDetailsProps) {
  const flat = mockFlats.find(f => f.id === flatId);
  const [activeTab, setActiveTab] = useState<"overview" | "pricing" | "timeline">("overview");

  if (!flat) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Unit not found.</p>
      </div>
    );
  }

  const sc = statusConfig[flat.status];
  const currentStep = flat.status === "Cancelled" ? -1 : statusOrder[flat.status];
  const gst = Math.round((flat.basePrice + flat.parkingPrice) * 0.05);
  const allInTotal = flat.basePrice + flat.parkingPrice + flat.clubMembership + flat.maintenanceDeposit + gst;

  const priceBreakdown = [
    { name: "Base Price", value: flat.basePrice, color: "var(--primary)" },
    { name: "Parking", value: flat.parkingPrice, color: "var(--warning)" },
    { name: "Club Membership", value: flat.clubMembership, color: "var(--success)" },
    { name: "Maintenance Deposit", value: flat.maintenanceDeposit, color: "var(--info)" },
    { name: "GST (5%)", value: gst, color: "var(--destructive)" },
  ];

  const similarFlats = mockFlats
    .filter(f => f.id !== flatId && f.wing === flat.wing && f.bhk === flat.bhk && f.status === "Available")
    .slice(0, 3);

  const milestones = [
    { label: "On Agreement", pct: 20, amount: Math.round(flat.basePrice * 0.2) },
    { label: "On Plinth", pct: 15, amount: Math.round(flat.basePrice * 0.15) },
    { label: "On Slab (1st)", pct: 15, amount: Math.round(flat.basePrice * 0.15) },
    { label: "On Slab (2nd)", pct: 15, amount: Math.round(flat.basePrice * 0.15) },
    { label: "On Slab (3rd)", pct: 15, amount: Math.round(flat.basePrice * 0.15) },
    { label: "On Possession", pct: 20, amount: Math.round(flat.basePrice * 0.2) },
  ];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-start gap-4 justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => onNavigate("inventory")} className="p-2 rounded-lg border border-border hover:bg-muted transition-colors">
            <ArrowLeft size={16} />
          </button>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl font-bold">Unit {flat.unitNo}</h1>
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${sc.bg} ${sc.color} ${sc.border}`}>
                {flat.status}
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                {flat.bhk}
              </span>
            </div>
            <p className="text-sm text-muted-foreground mt-0.5 flex items-center gap-1">
              <MapPin size={12} /> Wing {flat.wing} · {flat.floorLabel === "G" ? "Ground Floor" : `Floor ${flat.floorLabel}`} · {flat.facing} Facing
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {flat.status === "Available" && (
            <button
              onClick={() => onNavigate("booking", flat.id)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-success text-white text-sm font-semibold hover:bg-success/90 transition-colors"
            >
              <BookOpen size={15} /> Book This Unit
            </button>
          )}
          <button
            onClick={() => onNavigate("owner-assignment", flat.id)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border text-sm font-medium hover:bg-muted transition-colors"
          >
            <UserCheck size={15} /> {flat.ownerName ? "View Owner" : "Assign Owner"}
          </button>
          <button
            onClick={() => onNavigate("documents", flat.id)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border text-sm font-medium hover:bg-muted transition-colors"
          >
            <FileText size={15} /> Documents
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="grid lg:grid-cols-3 gap-5">
        {/* Left: Details */}
        <div className="lg:col-span-2 space-y-4">
          {/* Tabs */}
          <div className="flex items-center gap-1 bg-muted p-1 rounded-xl w-fit">
            {(["overview", "pricing", "timeline"] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                  activeTab === tab ? "bg-card shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {activeTab === "overview" && (
            <div className="space-y-4">
              {/* Unit Specs */}
              <div className="bg-card rounded-xl border border-border p-5">
                <h3 className="text-sm font-semibold mb-4">Unit Specifications</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {[
                    { icon: Home, label: "BHK Type", value: flat.bhk },
                    { icon: Maximize2, label: "Carpet Area", value: `${flat.carpetArea} sq.ft` },
                    { icon: Building2, label: "Super Built-up", value: `${flat.superArea} sq.ft` },
                    { icon: Layers, label: "Floor", value: flat.floorLabel === "G" ? "Ground Floor" : `Floor ${flat.floorLabel}` },
                    { icon: Compass, label: "Facing", value: flat.facing },
                    { icon: Car, label: "Parking", value: "1 Covered" },
                  ].map(spec => (
                    <div key={spec.label} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                        <spec.icon size={14} />
                      </div>
                      <div>
                        <p className="text-[10px] text-muted-foreground">{spec.label}</p>
                        <p className="text-sm font-semibold">{spec.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Amenities */}
              <div className="bg-card rounded-xl border border-border p-5">
                <h3 className="text-sm font-semibold mb-4">Amenities Included</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {["Swimming Pool", "Gymnasium", "Club House", "24x7 Security", "Power Backup", "Landscaped Gardens",
                    "Children's Play Area", "Visitor Parking", "Intercom"].map(a => (
                    <div key={a} className="flex items-center gap-2 text-xs">
                      <CheckCircle size={13} className="text-success shrink-0" />
                      {a}
                    </div>
                  ))}
                </div>
              </div>

              {/* Owner info if assigned */}
              {flat.ownerName && (
                <div className="bg-card rounded-xl border border-border p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold">Owner / Buyer</h3>
                    <button
                      onClick={() => onNavigate("owner-assignment", flat.id)}
                      className="text-xs text-primary hover:underline"
                    >
                      View Details
                    </button>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white font-bold text-sm shrink-0">
                      {flat.ownerName.split(" ").map(n => n[0]).join("").slice(0, 2)}
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{flat.ownerName}</p>
                      <p className="text-xs text-muted-foreground">{flat.ownerPhone} · {flat.ownerEmail}</p>
                    </div>
                    <div className="ml-auto">
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-success/10 text-success border border-success/30">
                        KYC Verified
                      </span>
                    </div>
                  </div>
                  {flat.bookingDate && (
                    <div className="mt-3 grid grid-cols-3 gap-3 text-xs">
                      <div className="bg-muted/50 rounded-lg p-2">
                        <p className="text-muted-foreground">Booking Date</p>
                        <p className="font-semibold mt-0.5">{flat.bookingDate}</p>
                      </div>
                      {flat.agreementDate && (
                        <div className="bg-muted/50 rounded-lg p-2">
                          <p className="text-muted-foreground">Agreement Date</p>
                          <p className="font-semibold mt-0.5">{flat.agreementDate}</p>
                        </div>
                      )}
                      {flat.registrationDate && (
                        <div className="bg-muted/50 rounded-lg p-2">
                          <p className="text-muted-foreground">Registration Date</p>
                          <p className="font-semibold mt-0.5">{flat.registrationDate}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === "pricing" && (
            <div className="space-y-4">
              <div className="bg-card rounded-xl border border-border p-5">
                <h3 className="text-sm font-semibold mb-4">Price Breakdown</h3>
                <div className="space-y-2">
                  {priceBreakdown.map(item => (
                    <div key={item.name} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-sm">{item.name}</span>
                      </div>
                      <span className="text-sm font-semibold">{fmt(item.value)}</span>
                    </div>
                  ))}
                  <div className="flex items-center justify-between py-3 bg-primary/5 rounded-lg px-3 mt-2">
                    <div className="flex items-center gap-2">
                      <IndianRupee size={14} className="text-primary" />
                      <span className="text-sm font-bold text-primary">All-Inclusive Total</span>
                    </div>
                    <span className="text-base font-bold text-primary">{fmt(allInTotal)}</span>
                  </div>
                </div>
              </div>

              {/* Payment Schedule */}
              <div className="bg-card rounded-xl border border-border p-5">
                <h3 className="text-sm font-semibold mb-4">Payment Schedule (Construction Linked)</h3>
                <div className="space-y-2">
                  {milestones.map((m, i) => (
                    <div key={m.label} className="flex items-center gap-3 py-2">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                        i <= currentStep ? "bg-primary text-white" : "bg-muted text-muted-foreground"
                      }`}>
                        {i + 1}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium">{m.label}</span>
                          <span className="text-xs font-semibold">{fmt(m.amount)}</span>
                        </div>
                        <div className="h-1 bg-muted rounded-full mt-1 overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full transition-all"
                            style={{ width: i <= currentStep ? "100%" : "0%" }}
                          />
                        </div>
                      </div>
                      <span className="text-[10px] text-muted-foreground w-8 text-right">{m.pct}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "timeline" && (
            <div className="bg-card rounded-xl border border-border p-5">
              <h3 className="text-sm font-semibold mb-6">Booking Status Timeline</h3>
              {flat.status === "Cancelled" ? (
                <div className="flex items-center gap-3 p-4 bg-destructive/10 rounded-xl border border-destructive/30">
                  <XCircle size={20} className="text-destructive shrink-0" />
                  <div>
                    <p className="font-semibold text-sm text-destructive">Booking Cancelled</p>
                    <p className="text-xs text-muted-foreground mt-0.5">This unit's booking was cancelled and is now available for re-booking after clearance.</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-0">
                  {statusSteps.map((step, i) => {
                    const done = i <= currentStep;
                    const active = i === currentStep;
                    return (
                      <div key={step.key} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-2 transition-all ${
                            done
                              ? "bg-primary border-primary text-white"
                              : "bg-muted border-border text-muted-foreground"
                          } ${active ? "ring-4 ring-primary/20" : ""}`}>
                            {done ? <CheckCircle size={14} /> : <Circle size={14} />}
                          </div>
                          {i < statusSteps.length - 1 && (
                            <div className={`w-0.5 flex-1 my-1 min-h-[32px] ${done && i < currentStep ? "bg-primary" : "bg-border"}`} />
                          )}
                        </div>
                        <div className="pb-6">
                          <p className={`text-sm font-semibold ${done ? "text-foreground" : "text-muted-foreground"}`}>
                            {step.label}
                            {active && <span className="ml-2 text-[10px] font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded-full">Current</span>}
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5">{step.desc}</p>
                          {done && step.key === "Booked" && flat.bookingDate && (
                            <p className="text-[10px] text-primary mt-1 flex items-center gap-1">
                              <CalendarDays size={10} /> {flat.bookingDate}
                            </p>
                          )}
                          {done && step.key === "Sold" && flat.agreementDate && (
                            <p className="text-[10px] text-primary mt-1 flex items-center gap-1">
                              <CalendarDays size={10} /> {flat.agreementDate}
                            </p>
                          )}
                          {done && step.key === "Registered" && flat.registrationDate && (
                            <p className="text-[10px] text-primary mt-1 flex items-center gap-1">
                              <CalendarDays size={10} /> {flat.registrationDate}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right: Price summary + Similar units */}
        <div className="space-y-4">
          {/* Price card */}
          <div className="bg-card rounded-xl border border-border p-5">
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-3">Pricing Summary</p>
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={priceBreakdown} dataKey="value" cx="50%" cy="50%" innerRadius={45} outerRadius={65} paddingAngle={2}>
                    {priceBreakdown.map((entry, i) => (
                      <Cell key={`cell-${i}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val: number) => fmt(val)}
                    contentStyle={{ backgroundColor: "var(--card)", borderColor: "var(--border)", borderRadius: 8, fontSize: 11 }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-1.5">
              {priceBreakdown.map(item => (
                <div key={item.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                    <span className="text-muted-foreground">{item.name}</span>
                  </div>
                  <span className="font-semibold">{fmt(item.value)}</span>
                </div>
              ))}
              <div className="border-t border-border pt-2 mt-2 flex items-center justify-between text-sm">
                <span className="font-bold">Total</span>
                <span className="font-bold text-primary">{fmt(allInTotal)}</span>
              </div>
            </div>
          </div>

          {/* Quick stats */}
          <div className="bg-card rounded-xl border border-border p-4 space-y-2">
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Price Per Sq.ft</p>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-muted/50 rounded-lg p-2 text-center">
                <p className="text-[10px] text-muted-foreground">On Carpet</p>
                <p className="text-sm font-bold text-primary">₹{Math.round(flat.basePrice / flat.carpetArea).toLocaleString("en-IN")}</p>
              </div>
              <div className="bg-muted/50 rounded-lg p-2 text-center">
                <p className="text-[10px] text-muted-foreground">On Super Area</p>
                <p className="text-sm font-bold">₹{Math.round(flat.basePrice / flat.superArea).toLocaleString("en-IN")}</p>
              </div>
            </div>
          </div>

          {/* Similar units */}
          {similarFlats.length > 0 && (
            <div className="bg-card rounded-xl border border-border p-4">
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Similar Available Units (Wing {flat.wing})
              </p>
              <div className="space-y-2">
                {similarFlats.map(sf => (
                  <button
                    key={sf.id}
                    onClick={() => onNavigate("details", sf.id)}
                    className="w-full flex items-center justify-between p-2.5 rounded-lg border border-border hover:bg-muted transition-colors text-left"
                  >
                    <div>
                      <p className="text-xs font-semibold">{sf.unitNo}</p>
                      <p className="text-[10px] text-muted-foreground">Floor {sf.floorLabel} · {sf.facing}</p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-primary">{fmt(sf.basePrice)}</span>
                      <ChevronRight size={12} className="text-muted-foreground" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function XCircle({ size, className }: { size: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={className}>
      <circle cx="12" cy="12" r="10" />
      <path d="m15 9-6 6M9 9l6 6" />
    </svg>
  );
}
