import { useState } from "react";
import { Search, Phone, X, Shield, Clock, AlertTriangle, ChevronRight, UserPlus } from "lucide-react";
import {
  mockWorkers, mockContractors, mockAttendance, TODAY,
  tradeColor, contractorColor, workerInitials, fmtINR, maskAadhaar,
  calcWage, mockAttendance as att, PREV_WEEK, CURR_WEEK,
} from "../labourData";

// ── Aadhaar badge config ───────────────────────────────────────────────────────
const aadhaarCfg = {
  Verified: { label: "Aadhaar ✓", icon: Shield,        cls: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800" },
  Pending:  { label: "KYC Pending", icon: Clock,        cls: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800" },
  Failed:   { label: "KYC Failed",  icon: AlertTriangle, cls: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800" },
};

const todayDot = {
  "P": "bg-green-500", "A": "bg-red-500",
  "H": "bg-amber-400", "S": "bg-slate-300 dark:bg-slate-600",
  "—": "bg-muted-foreground/30",
};

// ── Worker profile bottom sheet ────────────────────────────────────────────────
function ProfileSheet({ workerId, onClose }: { workerId: string; onClose: () => void }) {
  const w = mockWorkers.find(x => x.id === workerId)!;
  const contractor = mockContractors.find(c => c.id === w.contractorId);
  const { hex } = contractorColor[w.contractorId] ?? { hex: "#1B3A6B" };
  const ab = aadhaarCfg[w.aadhaarStatus];
  const Icon = ab.icon;

  // Last-week wage
  const prevMap = Object.fromEntries(PREV_WEEK.map(d => [d.date, att[w.id]?.[d.date] ?? "—"]));
  const prevWage = calcWage(w, prevMap);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md bg-card rounded-t-3xl overflow-hidden shadow-2xl">

        {/* Coloured header */}
        <div className="relative px-5 pt-6 pb-5 text-white" style={{ background: hex }}>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/20 flex items-center justify-center active:scale-95"
          >
            <X size={16} />
          </button>

          {/* Avatar */}
          <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center mb-3">
            <span className="text-2xl font-black">{workerInitials(w.name)}</span>
          </div>
          <p className="text-xl font-black leading-tight">{w.name}</p>
          <p className="text-sm text-white/70 mt-0.5">{w.code} · {w.trade}</p>

          {/* Aadhaar badge */}
          <span className={`inline-flex items-center gap-1 mt-3 text-[11px] font-bold px-2.5 py-1 rounded-full border ${ab.cls}`}>
            <Icon size={10} /> {ab.label}
          </span>
        </div>

        <div className="p-5 space-y-4 overflow-y-auto" style={{ maxHeight: "60vh" }}>

          {/* Info grid */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Daily Wage",   value: fmtINR(w.dailyWage) },
              { label: "Aadhaar",      value: maskAadhaar(w.aadhaar) },
              { label: "Phone",        value: w.phone },
              { label: "Blood Group",  value: w.bloodGroup },
              { label: "Home State",   value: w.homeState },
              { label: "Site",         value: w.site },
            ].map(f => (
              <div key={f.label} className="bg-muted/30 rounded-xl p-3">
                <p className="text-[10px] text-muted-foreground">{f.label}</p>
                <p className="text-sm font-bold text-foreground mt-0.5">{f.value}</p>
              </div>
            ))}
          </div>

          {/* Contractor */}
          <div className="flex items-center gap-3 bg-muted/20 rounded-xl p-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-black" style={{ background: hex }}>
              {contractor?.name[0]}
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground">Contractor</p>
              <p className="text-sm font-bold text-foreground">{contractor?.name}</p>
            </div>
          </div>

          {/* Last week earnings */}
          <div className="rounded-xl p-4 border border-primary/20" style={{ background: "color-mix(in srgb, var(--primary) 5%, transparent)" }}>
            <p className="text-[10px] text-muted-foreground mb-1">Last Week (11–17 May)</p>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-2xl font-black text-[#1B3A6B]">{fmtINR(prevWage.gross)}</p>
                <p className="text-xs text-muted-foreground">{prevWage.present}P + {prevWage.half}½ days</p>
              </div>
              {w.advanceBalance > 0 && (
                <div className="text-right">
                  <p className="text-[10px] text-amber-600">Advance due</p>
                  <p className="text-sm font-black text-amber-600">{fmtINR(w.advanceBalance)}</p>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <a
              href={`tel:${w.phone}`}
              className="flex-1 h-14 rounded-2xl border-2 border-[#1B3A6B] text-[#1B3A6B] font-black flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
            >
              <Phone size={16} /> Call
            </a>
            <button
              onClick={onClose}
              className="flex-1 h-14 rounded-2xl text-white font-black flex items-center justify-center active:scale-[0.98] transition-all"
              style={{ background: "#1B3A6B" }}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main view ─────────────────────────────────────────────────────────────────
export function WorkerListingView() {
  const [search, setSearch] = useState("");
  const [cFilter, setCFilter] = useState("All");
  const [profileId, setProfileId] = useState<string | null>(null);

  const active = mockWorkers.filter(w => w.status === "Active");
  const filtered = active.filter(w => {
    const q = search.toLowerCase();
    const matchSearch = !q || w.name.toLowerCase().includes(q) || w.code.toLowerCase().includes(q) || w.trade.toLowerCase().includes(q);
    const matchC = cFilter === "All" || w.contractorId === cFilter;
    return matchSearch && matchC;
  });

  const todayPresent = active.filter(w => mockAttendance[w.id]?.[TODAY] === "P").length;
  const kycPending   = active.filter(w => w.aadhaarStatus !== "Verified").length;

  return (
    <div className="p-4 pb-6 space-y-4 max-w-2xl mx-auto">
      {profileId && <ProfileSheet workerId={profileId} onClose={() => setProfileId(null)} />}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "On Roll",       value: active.length, color: "#1B3A6B" },
          { label: "Present Today", value: todayPresent,  color: "#16A34A" },
          { label: "KYC Pending",   value: kycPending,    color: "#D97706" },
        ].map(s => (
          <div key={s.label} className="bg-card border border-border rounded-2xl p-3 text-center">
            <p className="text-2xl font-black" style={{ color: s.color }}>{s.value}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5 leading-tight">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Search bar */}
      <div className="flex items-center gap-3 px-4 h-14 bg-card border border-border rounded-2xl">
        <Search size={18} className="text-muted-foreground shrink-0" />
        <input
          className="flex-1 bg-transparent outline-none text-foreground placeholder:text-muted-foreground"
          placeholder="Search name, trade, code…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        {search && (
          <button onClick={() => setSearch("")} className="text-muted-foreground hover:text-foreground">
            <X size={16} />
          </button>
        )}
      </div>

      {/* Contractor filter chips */}
      <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1">
        {[{ id: "All", name: "All" }, ...mockContractors.map(c => ({ id: c.id, name: c.name.split(" ")[0] }))].map(c => {
          const active2 = cFilter === c.id;
          const hex = c.id === "All" ? "#1B3A6B" : (contractorColor[c.id]?.hex ?? "#1B3A6B");
          return (
            <button
              key={c.id}
              onClick={() => setCFilter(c.id)}
              className="shrink-0 h-10 px-4 rounded-full border font-bold text-sm transition-all"
              style={active2
                ? { background: hex, color: "#fff", borderColor: hex }
                : { background: "transparent", color: "var(--muted-foreground)", borderColor: "var(--border)" }}
            >
              {c.name}
            </button>
          );
        })}
      </div>

      {/* Add worker */}
      <button className="w-full h-14 flex items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-border text-muted-foreground hover:border-[#1B3A6B] hover:text-[#1B3A6B] transition-all font-semibold">
        <UserPlus size={18} /> Add New Worker
      </button>

      {/* Worker cards */}
      <div className="space-y-3">
        {filtered.map(w => {
          const { hex } = contractorColor[w.contractorId] ?? { hex: "#1B3A6B" };
          const ab = aadhaarCfg[w.aadhaarStatus];
          const AIcon = ab.icon;
          const todayStatus = mockAttendance[w.id]?.[TODAY] ?? "—";
          const dotCls = todayDot[todayStatus] ?? "bg-muted-foreground/30";

          return (
            <button
              key={w.id}
              onClick={() => setProfileId(w.id)}
              className="w-full bg-card border border-border rounded-2xl p-4 flex items-center gap-4 text-left hover:border-[#1B3A6B]/30 hover:shadow-md active:scale-[0.99] transition-all"
            >
              {/* Avatar with today-status dot */}
              <div className="relative shrink-0">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-black text-lg" style={{ background: hex }}>
                  {workerInitials(w.name)}
                </div>
                <span className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-card ${dotCls}`} />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-black text-foreground text-base leading-tight truncate">{w.name}</p>
                  {w.gender === "F" && (
                    <span className="shrink-0 text-[9px] bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-400 px-1.5 py-0.5 rounded-full font-bold border border-pink-200 dark:border-pink-800">F</span>
                  )}
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${tradeColor[w.trade]}`}>{w.trade}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border flex items-center gap-0.5 ${ab.cls}`}>
                    <AIcon size={8} /> {ab.label}
                  </span>
                </div>
                <div className="flex items-center gap-3 mt-1.5">
                  <span className="text-xs font-bold text-muted-foreground">{fmtINR(w.dailyWage)}/day</span>
                  <span className="text-[10px] text-muted-foreground">{w.code}</span>
                </div>
              </div>

              <ChevronRight size={16} className="text-muted-foreground/40 shrink-0" />
            </button>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="py-16 text-center">
          <p className="text-muted-foreground font-semibold">No workers found</p>
        </div>
      )}

      <p className="text-center text-xs text-muted-foreground">
        {filtered.length} of {active.length} workers
      </p>
    </div>
  );
}
