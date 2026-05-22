import { useState, useRef, useEffect } from "react";
import {
  Eye, EyeOff, ArrowLeft, Check, AlertCircle, Shield, Lock,
  Mail, Phone, Loader2, RefreshCw, CheckCircle2, Building2,
  Fingerprint, Globe, IndianRupee, Users, Star, Key,
  ChevronRight, Info, X, Layers, HardHat, Wifi
} from "lucide-react";

// ─── Types ──────────────────────────────────────────────────────────────────
type Screen =
  | "login" | "otp-login" | "forgot-password" | "reset-password"
  | "two-factor" | "subdomain" | "owner-portal" | "super-admin";

const BG_IMAGE = "https://images.unsplash.com/photo-1773470920361-4f6cbb702ce0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080";
const BG_GLASS = "https://images.unsplash.com/photo-1768555353297-76ad9b0ba91d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080";

// ─── OTP Input ───────────────────────────────────────────────────────────────
function OTPInput({ length = 6, onChange, hasError = false }: { length?: number; onChange: (v: string) => void; hasError?: boolean }) {
  const [vals, setVals] = useState<string[]>(Array(length).fill(""));
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  const handle = (i: number, raw: string) => {
    const v = raw.replace(/\D/g, "").slice(-1);
    const next = [...vals];
    next[i] = v;
    setVals(next);
    onChange(next.join(""));
    if (v && i < length - 1) refs.current[i + 1]?.focus();
  };

  const handleKey = (i: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !vals[i] && i > 0) {
      const next = [...vals]; next[i - 1] = "";
      setVals(next); onChange(next.join(""));
      refs.current[i - 1]?.focus();
    }
    if (e.key === "ArrowLeft" && i > 0) refs.current[i - 1]?.focus();
    if (e.key === "ArrowRight" && i < length - 1) refs.current[i + 1]?.focus();
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const digits = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length).split("");
    const next = Array(length).fill("");
    digits.forEach((d, i) => { next[i] = d; });
    setVals(next); onChange(next.join(""));
    refs.current[Math.min(digits.length, length - 1)]?.focus();
  };

  return (
    <div className="flex gap-2.5 justify-center">
      {vals.map((v, i) => (
        <input
          key={i} ref={el => { refs.current[i] = el; }}
          type="text" inputMode="numeric" maxLength={1} value={v}
          onChange={e => handle(i, e.target.value)}
          onKeyDown={e => handleKey(i, e)}
          onPaste={handlePaste}
          className={`
            w-12 h-14 text-center text-xl font-bold rounded-xl border-2 outline-none
            bg-white/5 backdrop-blur-sm transition-all duration-200
            ${hasError
              ? "border-red-400 text-red-300 bg-red-500/10"
              : v
                ? "border-[#C9922A] text-white bg-[#C9922A]/10"
                : "border-white/20 text-white focus:border-white/60 focus:bg-white/10"
            }
          `}
        />
      ))}
    </div>
  );
}

// ─── Password Strength ────────────────────────────────────────────────────────
function getStrength(pw: string) {
  let s = 0;
  if (pw.length >= 8) s++;
  if (pw.length >= 12) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  const map = [
    { label: "Too weak", color: "bg-red-500", pct: "20%" },
    { label: "Weak", color: "bg-orange-500", pct: "35%" },
    { label: "Fair", color: "bg-amber-400", pct: "55%" },
    { label: "Good", color: "bg-yellow-400", pct: "75%" },
    { label: "Strong", color: "bg-green-400", pct: "90%" },
    { label: "Very strong", color: "bg-emerald-400", pct: "100%" },
  ];
  return map[Math.min(s, 5)];
}

function StrengthBar({ password }: { password: string }) {
  if (!password) return null;
  const s = getStrength(password);
  return (
    <div className="mt-2 space-y-1.5">
      <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
        <div className={`h-full ${s.color} rounded-full transition-all duration-500`} style={{ width: s.pct }} />
      </div>
      <p className="text-xs text-white/60">Password strength: <span className="text-white/90 font-medium">{s.label}</span></p>
    </div>
  );
}

function Requirements({ password }: { password: string }) {
  const checks = [
    { label: "At least 8 characters", ok: password.length >= 8 },
    { label: "One uppercase letter", ok: /[A-Z]/.test(password) },
    { label: "One number", ok: /[0-9]/.test(password) },
    { label: "One special character", ok: /[^A-Za-z0-9]/.test(password) },
  ];
  return (
    <div className="grid grid-cols-2 gap-1.5 mt-2">
      {checks.map(c => (
        <div key={c.label} className={`flex items-center gap-1.5 text-xs transition-colors ${c.ok ? "text-emerald-400" : "text-white/40"}`}>
          {c.ok ? <Check size={11} strokeWidth={3} /> : <X size={11} strokeWidth={3} />}
          {c.label}
        </div>
      ))}
    </div>
  );
}

// ─── Shared Input ─────────────────────────────────────────────────────────────
function GlassInput({ label, type = "text", placeholder, value, onChange, icon, error, hint, prefix }: {
  label: string; type?: string; placeholder: string; value: string;
  onChange: (v: string) => void; icon?: React.ReactNode; error?: string; hint?: string; prefix?: string;
}) {
  const [show, setShow] = useState(false);
  const isPassword = type === "password";
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold text-white/70 uppercase tracking-wider">{label}</label>
      <div className={`relative flex items-center rounded-xl border transition-all duration-200
        ${error ? "border-red-400/70 bg-red-500/10" : "border-white/15 bg-white/8 focus-within:border-white/40 focus-within:bg-white/12"}`}>
        {(icon || prefix) && (
          <div className="pl-3.5 flex items-center gap-2 text-white/40">
            {icon && <span className="flex-shrink-0">{icon}</span>}
            {prefix && <span className="text-sm text-white/50 border-r border-white/15 pr-2">{prefix}</span>}
          </div>
        )}
        <input
          type={isPassword ? (show ? "text" : "password") : type}
          placeholder={placeholder}
          value={value}
          onChange={e => onChange(e.target.value)}
          className="flex-1 bg-transparent px-3.5 py-3 text-sm text-white placeholder:text-white/30 outline-none w-full"
        />
        {isPassword && (
          <button type="button" onClick={() => setShow(s => !s)} className="pr-3.5 text-white/30 hover:text-white/70 transition-colors">
            {show ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        )}
        {error && !isPassword && <AlertCircle size={15} className="mr-3.5 text-red-400 flex-shrink-0" />}
      </div>
      {error && <p className="text-xs text-red-400 flex items-center gap-1"><AlertCircle size={11} />{error}</p>}
      {hint && !error && <p className="text-xs text-white/40">{hint}</p>}
    </div>
  );
}

// ─── Glass Button ─────────────────────────────────────────────────────────────
function GlassBtn({ children, onClick, loading = false, variant = "primary", className = "" }: {
  children: React.ReactNode; onClick?: () => void; loading?: boolean; variant?: "primary" | "outline" | "ghost"; className?: string;
}) {
  const base = "w-full py-3 px-6 rounded-xl font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 active:scale-[0.98]";
  const variants = {
    primary: "bg-gradient-to-r from-[#C9922A] to-[#E8B64C] text-white shadow-lg shadow-amber-900/30 hover:shadow-amber-900/50 hover:brightness-110",
    outline: "border border-white/20 text-white/80 hover:bg-white/8 hover:text-white",
    ghost: "text-white/60 hover:text-white hover:bg-white/5",
  };
  return (
    <button onClick={onClick} disabled={loading} className={`${base} ${variants[variant]} ${className} ${loading ? "opacity-80 cursor-not-allowed" : ""}`}>
      {loading ? <><Loader2 size={16} className="animate-spin" /> Processing…</> : children}
    </button>
  );
}

// ─── Error / Success Banner ───────────────────────────────────────────────────
function Banner({ type, message }: { type: "error" | "success" | "info"; message: string }) {
  const cfg = {
    error: { icon: <AlertCircle size={15} />, cls: "bg-red-500/15 border-red-400/30 text-red-300" },
    success: { icon: <CheckCircle2 size={15} />, cls: "bg-emerald-500/15 border-emerald-400/30 text-emerald-300" },
    info: { icon: <Info size={15} />, cls: "bg-blue-500/15 border-blue-400/30 text-blue-300" },
  }[type];
  return (
    <div className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border text-sm ${cfg.cls}`}>
      {cfg.icon}<span>{message}</span>
    </div>
  );
}

// ─── Divider ──────────────────────────────────────────────────────────────────
function OrDivider() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-px bg-white/10" />
      <span className="text-xs text-white/30 font-medium">OR</span>
      <div className="flex-1 h-px bg-white/10" />
    </div>
  );
}

// ─── Countdown Hook ───────────────────────────────────────────────────────────
function useCountdown(init: number) {
  const [count, setCount] = useState(init);
  const [active, setActive] = useState(false);
  useEffect(() => {
    if (!active) return;
    if (count <= 0) { setActive(false); return; }
    const t = setTimeout(() => setCount(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [count, active]);
  const start = () => { setCount(init); setActive(true); };
  return { count, active, start };
}

// ═══════════════════════════════════════════════════════════════════════════════
// LEFT BRAND PANELS
// ═══════════════════════════════════════════════════════════════════════════════

function BrandPanel({ screen }: { screen: Screen }) {
  const stats = [
    { icon: <Building2 size={16} />, val: "12+", label: "Live Projects" },
    { icon: <Layers size={16} />, val: "5,000+", label: "Units Managed" },
    { icon: <IndianRupee size={16} />, val: "₹500Cr+", label: "Revenue Tracked" },
    { icon: <Users size={16} />, val: "1,200+", label: "Happy Customers" },
  ];

  const features = [
    "Real-time booking & CRM management",
    "Automated demand & collection letters",
    "Construction milestone tracking",
    "RERA compliance & document vault",
    "Multi-project financial reports",
  ];

  const testimonial = {
    text: "SHG ERP transformed how we manage our 8 projects. Collection efficiency went up by 40% in 3 months.",
    name: "Arvind Menon",
    role: "CMD, Menon Builders",
  };

  if (screen === "owner-portal") {
    return (
      <div className="flex flex-col justify-between h-full p-10 lg:p-14">
        <div>
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-xl bg-[#C9922A] flex items-center justify-center">
              <span className="text-white text-sm font-bold">SHG</span>
            </div>
            <div>
              <p className="text-white font-bold text-lg leading-none">My SHG Home</p>
              <p className="text-white/40 text-xs mt-0.5">Owner Portal</p>
            </div>
          </div>
          <h1 className="text-white text-3xl lg:text-4xl font-bold leading-tight mb-4">
            Your Dream<br /><span className="text-[#C9922A]">Home Awaits.</span>
          </h1>
          <p className="text-white/50 text-sm leading-relaxed mb-8">
            Track your unit, view payment schedules, download documents, and stay updated on construction — all in one place.
          </p>
          <div className="space-y-3">
            {[
              { icon: <IndianRupee size={14} />, label: "View payment schedule & receipts" },
              { icon: <HardHat size={14} />, label: "Live construction progress updates" },
              { icon: <Key size={14} />, label: "Download agreements & documents" },
              { icon: <Wifi size={14} />, label: "Raise service requests instantly" },
            ].map(f => (
              <div key={f.label} className="flex items-center gap-3 text-sm text-white/60">
                <div className="w-7 h-7 rounded-lg bg-[#C9922A]/20 border border-[#C9922A]/30 flex items-center justify-center text-[#C9922A] flex-shrink-0">
                  {f.icon}
                </div>
                {f.label}
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
          <div className="flex gap-1 mb-3">
            {[1,2,3,4,5].map(s => <Star key={s} size={12} className="fill-[#C9922A] text-[#C9922A]" />)}
          </div>
          <p className="text-white/70 text-sm leading-relaxed italic">"{testimonial.text}"</p>
          <div className="flex items-center gap-2 mt-4">
            <div className="w-8 h-8 rounded-full bg-[#C9922A]/30 flex items-center justify-center">
              <span className="text-[#C9922A] text-xs font-bold">AM</span>
            </div>
            <div>
              <p className="text-white text-xs font-semibold">{testimonial.name}</p>
              <p className="text-white/40 text-[10px]">{testimonial.role}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (screen === "super-admin") {
    return (
      <div className="flex flex-col justify-between h-full p-10 lg:p-14">
        <div>
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-xl bg-red-600/80 border border-red-500/50 flex items-center justify-center">
              <Shield size={18} className="text-white" />
            </div>
            <div>
              <p className="text-white font-bold text-lg leading-none">SHG Command</p>
              <p className="text-red-400/80 text-xs mt-0.5">Restricted Access</p>
            </div>
          </div>
          <div className="inline-flex items-center gap-2 bg-red-500/15 border border-red-500/30 rounded-full px-4 py-2 mb-6">
            <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
            <span className="text-red-300 text-xs font-semibold uppercase tracking-wider">Authorized Personnel Only</span>
          </div>
          <h1 className="text-white text-3xl lg:text-4xl font-bold leading-tight mb-4">
            Super Admin<br /><span className="text-red-400">Control Center.</span>
          </h1>
          <p className="text-white/50 text-sm leading-relaxed mb-8">
            This portal provides unrestricted access to all platform data, tenant management, and system configuration. All actions are logged.
          </p>
          <div className="space-y-3">
            {[
              { icon: <Shield size={13} />, label: "256-bit AES encrypted session" },
              { icon: <Globe size={13} />, label: "IP allowlist enforced" },
              { icon: <Fingerprint size={13} />, label: "Multi-factor auth required" },
              { icon: <RefreshCw size={13} />, label: "Session expires in 60 minutes" },
            ].map(f => (
              <div key={f.label} className="flex items-center gap-3 text-sm text-white/50">
                <span className="text-red-400/70">{f.icon}</span>
                {f.label}
              </div>
            ))}
          </div>
        </div>
        <div className="bg-red-900/20 border border-red-500/20 rounded-2xl p-4">
          <p className="text-red-300 text-xs font-semibold mb-1">⚠ Security Notice</p>
          <p className="text-white/40 text-xs leading-relaxed">
            Unauthorized access attempts are reported to the system owner and local authorities. By continuing you agree to the Acceptable Use Policy.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-between h-full p-10 lg:p-14">
      <div>
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 rounded-xl bg-[#C9922A] flex items-center justify-center shadow-lg shadow-amber-900/30">
            <span className="text-white text-sm font-bold tracking-tight">SHG</span>
          </div>
          <div>
            <p className="text-white font-bold text-lg leading-none">Shri Hari Group</p>
            <p className="text-white/40 text-xs mt-0.5">Builder ERP Platform</p>
          </div>
        </div>
        <h1 className="text-white text-3xl lg:text-4xl font-bold leading-tight mb-4">
          India's Most Trusted<br /><span className="text-[#C9922A]">Real Estate ERP.</span>
        </h1>
        <p className="text-white/50 text-sm leading-relaxed mb-8">
          Manage bookings, collections, construction, and compliance — all from a single, powerful platform built for Indian real estate.
        </p>
        <div className="grid grid-cols-2 gap-3 mb-8">
          {stats.map(s => (
            <div key={s.label} className="bg-white/5 border border-white/8 rounded-xl p-3.5">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[#C9922A]">{s.icon}</span>
                <span className="text-white font-bold">{s.val}</span>
              </div>
              <p className="text-white/40 text-xs">{s.label}</p>
            </div>
          ))}
        </div>
        <div className="space-y-2.5">
          {features.map(f => (
            <div key={f} className="flex items-center gap-2.5 text-sm text-white/55">
              <div className="w-4 h-4 rounded-full bg-[#C9922A]/20 border border-[#C9922A]/40 flex items-center justify-center flex-shrink-0">
                <Check size={9} strokeWidth={3} className="text-[#C9922A]" />
              </div>
              {f}
            </div>
          ))}
        </div>
      </div>
      <div className="mt-8 pt-6 border-t border-white/10">
        <div className="flex gap-1 mb-2">
          {[1,2,3,4,5].map(s => <Star key={s} size={11} className="fill-[#C9922A] text-[#C9922A]" />)}
          <span className="text-white/30 text-xs ml-1">4.9 / 5 · 200+ builders</span>
        </div>
        <p className="text-white/50 text-xs italic leading-relaxed">"{testimonial.text}"</p>
        <p className="text-white/30 text-[10px] mt-1.5">— {testimonial.name}, {testimonial.role}</p>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SCREEN COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════

// ── 1. Login ──────────────────────────────────────────────────────────────────
function LoginScreen({ onNavigate }: { onNavigate: (s: Screen) => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [emailErr, setEmailErr] = useState("");
  const [passErr, setPassErr] = useState("");

  const validate = () => {
    let ok = true;
    if (!email.includes("@")) { setEmailErr("Enter a valid email address"); ok = false; } else setEmailErr("");
    if (password.length < 6) { setPassErr("Password must be at least 6 characters"); ok = false; } else setPassErr("");
    return ok;
  };

  const submit = async () => {
    setError("");
    if (!validate()) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 2000));
    setLoading(false);
    setError("Invalid email or password. Please try again.");
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-white text-2xl font-bold">Welcome back</h2>
        <p className="text-white/50 text-sm mt-1">Sign in to your SHG ERP account</p>
      </div>

      {error && <Banner type="error" message={error} />}

      <div className="space-y-4">
        <GlassInput label="Email address" type="email" placeholder="you@company.in" value={email} onChange={setEmail} icon={<Mail size={15} />} error={emailErr} />
        <GlassInput label="Password" type="password" placeholder="Enter your password" value={password} onChange={setPassword} icon={<Lock size={15} />} error={passErr} />
      </div>

      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 cursor-pointer">
          <div
            onClick={() => setRemember(r => !r)}
            className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all cursor-pointer ${remember ? "bg-[#C9922A] border-[#C9922A]" : "border-white/25 hover:border-white/50"}`}
          >
            {remember && <Check size={9} strokeWidth={3} className="text-white" />}
          </div>
          <span className="text-sm text-white/60 select-none">Remember me</span>
        </label>
        <button onClick={() => onNavigate("forgot-password")} className="text-sm text-[#C9922A] hover:text-[#E8B64C] font-medium transition-colors">
          Forgot password?
        </button>
      </div>

      <GlassBtn loading={loading} onClick={submit}>Sign In <ChevronRight size={15} /></GlassBtn>

      <div className="flex items-center gap-2">
        <button onClick={() => onNavigate("otp-login")} className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-white/12 text-sm text-white/60 hover:bg-white/6 hover:text-white transition-all">
          <Phone size={14} /> Login with OTP
        </button>
        <button className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-white/12 text-sm text-white/60 hover:bg-white/6 hover:text-white transition-all">
          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
          Continue with Google
        </button>
      </div>

      <p className="text-center text-xs text-white/30">
        New to the platform? <span className="text-[#C9922A] cursor-pointer hover:underline">Contact your admin</span>
      </p>
    </div>
  );
}

// ── 2. OTP Login ──────────────────────────────────────────────────────────────
function OTPLoginScreen({ onNavigate }: { onNavigate: (s: Screen) => void }) {
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [otpError, setOtpError] = useState(false);
  const { count, active, start } = useCountdown(30);

  const sendOTP = async () => {
    if (phone.length !== 10) { setError("Enter a valid 10-digit mobile number"); return; }
    setError(""); setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    setLoading(false); setStep("otp"); start();
  };

  const verifyOTP = async () => {
    if (otp.length !== 6) return;
    setLoading(true); setOtpError(false);
    await new Promise(r => setTimeout(r, 1500));
    setLoading(false);
    if (otp !== "123456") { setOtpError(true); } // demo
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        {step === "otp" && (
          <button onClick={() => setStep("phone")} className="w-8 h-8 rounded-lg border border-white/15 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/8 transition-all">
            <ArrowLeft size={15} />
          </button>
        )}
        <div>
          <h2 className="text-white text-2xl font-bold">{step === "phone" ? "Login with OTP" : "Verify OTP"}</h2>
          <p className="text-white/50 text-sm mt-0.5">
            {step === "phone" ? "Enter your registered mobile number" : `Sent to +91 ${phone.slice(0, 2)}****${phone.slice(-2)}`}
          </p>
        </div>
      </div>

      {step === "phone" ? (
        <>
          {error && <Banner type="error" message={error} />}
          <GlassInput label="Mobile number" type="tel" placeholder="98765 43210" value={phone} onChange={v => setPhone(v.replace(/\D/g, "").slice(0, 10))} icon={<Phone size={15} />} prefix="+91" />
          <GlassBtn loading={loading} onClick={sendOTP}>Send OTP <ChevronRight size={15} /></GlassBtn>
          <OrDivider />
          <GlassBtn variant="outline" onClick={() => onNavigate("login")}>
            <Mail size={14} /> Sign in with email instead
          </GlassBtn>
        </>
      ) : (
        <>
          {otpError && <Banner type="error" message="Incorrect OTP. Please try again. (Hint: 123456)" />}
          <div className="space-y-3">
            <label className="text-xs font-semibold text-white/70 uppercase tracking-wider block">Enter 6-digit OTP</label>
            <OTPInput length={6} onChange={setOtp} hasError={otpError} />
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-white/40">
              {active ? <span>Resend in <span className="text-white/70 font-mono font-semibold">0:{String(count).padStart(2,"0")}</span></span> : "Didn't receive it?"}
            </span>
            {!active && (
              <button onClick={() => { start(); setOtpError(false); }} className="text-[#C9922A] hover:text-[#E8B64C] font-medium flex items-center gap-1 transition-colors">
                <RefreshCw size={12} /> Resend OTP
              </button>
            )}
          </div>
          <GlassBtn loading={loading} onClick={verifyOTP}>Verify & Sign In <ChevronRight size={15} /></GlassBtn>
        </>
      )}
      <p className="text-center text-xs text-white/30">
        By signing in you agree to our <span className="text-[#C9922A] cursor-pointer hover:underline">Terms of Service</span>
      </p>
    </div>
  );
}

// ── 3. Forgot Password ────────────────────────────────────────────────────────
function ForgotPasswordScreen({ onNavigate }: { onNavigate: (s: Screen) => void }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const submit = async () => {
    if (!email.includes("@")) { setError("Enter a valid email address"); return; }
    setError(""); setLoading(true);
    await new Promise(r => setTimeout(r, 1800));
    setLoading(false); setSent(true);
  };

  if (sent) return (
    <div className="space-y-6 text-center">
      <div className="w-20 h-20 rounded-full bg-emerald-500/15 border border-emerald-400/30 flex items-center justify-center mx-auto">
        <CheckCircle2 size={40} className="text-emerald-400" />
      </div>
      <div>
        <h2 className="text-white text-2xl font-bold">Check your inbox</h2>
        <p className="text-white/50 text-sm mt-2 leading-relaxed">
          We've sent a password reset link to<br /><strong className="text-white/80">{email}</strong>
        </p>
      </div>
      <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-left space-y-2">
        {["Check spam/junk folder if not found", "Link expires in 30 minutes", "Contact admin if issue persists"].map(t => (
          <div key={t} className="flex items-center gap-2 text-xs text-white/50">
            <Check size={11} className="text-emerald-400 flex-shrink-0" strokeWidth={3} /> {t}
          </div>
        ))}
      </div>
      <GlassBtn variant="outline" onClick={() => onNavigate("login")}><ArrowLeft size={14} /> Back to Sign In</GlassBtn>
    </div>
  );

  return (
    <div className="space-y-5">
      <div>
        <button onClick={() => onNavigate("login")} className="flex items-center gap-1.5 text-white/40 hover:text-white text-sm mb-4 transition-colors">
          <ArrowLeft size={14} /> Back to sign in
        </button>
        <h2 className="text-white text-2xl font-bold">Forgot password?</h2>
        <p className="text-white/50 text-sm mt-1">No worries, we'll send you reset instructions.</p>
      </div>
      {error && <Banner type="error" message={error} />}
      <GlassInput label="Email address" type="email" placeholder="you@company.in" value={email} onChange={setEmail} icon={<Mail size={15} />} />
      <GlassBtn loading={loading} onClick={submit}>Send Reset Link <ChevronRight size={15} /></GlassBtn>
      <p className="text-center text-xs text-white/30">
        Remembered it? <button onClick={() => onNavigate("login")} className="text-[#C9922A] hover:underline">Sign in</button>
      </p>
    </div>
  );
}

// ── 4. Reset Password ─────────────────────────────────────────────────────────
function ResetPasswordScreen({ onNavigate }: { onNavigate: (s: Screen) => void }) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const submit = async () => {
    if (password.length < 8) { setError("Password must be at least 8 characters"); return; }
    if (password !== confirm) { setError("Passwords do not match"); return; }
    setError(""); setLoading(true);
    await new Promise(r => setTimeout(r, 1800));
    setLoading(false); setSuccess(true);
  };

  if (success) return (
    <div className="space-y-6 text-center">
      <div className="w-20 h-20 rounded-full bg-emerald-500/15 border border-emerald-400/30 flex items-center justify-center mx-auto">
        <CheckCircle2 size={40} className="text-emerald-400" />
      </div>
      <div>
        <h2 className="text-white text-2xl font-bold">Password reset!</h2>
        <p className="text-white/50 text-sm mt-2">Your password has been updated successfully.</p>
      </div>
      <GlassBtn onClick={() => onNavigate("login")}>Continue to Sign In <ChevronRight size={15} /></GlassBtn>
    </div>
  );

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-white text-2xl font-bold">Set new password</h2>
        <p className="text-white/50 text-sm mt-1">Must be different from your previous password.</p>
      </div>
      {error && <Banner type="error" message={error} />}
      <div className="space-y-4">
        <div>
          <GlassInput label="New password" type="password" placeholder="Enter new password" value={password} onChange={setPassword} icon={<Lock size={15} />} />
          {password && <>
            <StrengthBar password={password} />
            <Requirements password={password} />
          </>}
        </div>
        <div>
          <GlassInput label="Confirm password" type="password" placeholder="Re-enter password" value={confirm} onChange={setConfirm} icon={<Lock size={15} />}
            error={confirm && confirm !== password ? "Passwords do not match" : ""}
          />
          {confirm && confirm === password && password.length >= 8 && (
            <p className="text-xs text-emerald-400 flex items-center gap-1 mt-1.5"><Check size={11} strokeWidth={3} /> Passwords match</p>
          )}
        </div>
      </div>
      <GlassBtn loading={loading} onClick={submit}>Reset Password <ChevronRight size={15} /></GlassBtn>
    </div>
  );
}

// ── 5. Two-Factor ─────────────────────────────────────────────────────────────
function TwoFactorScreen({ onNavigate }: { onNavigate: (s: Screen) => void }) {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [trust, setTrust] = useState(false);
  const [useBackup, setUseBackup] = useState(false);
  const [backupCode, setBackupCode] = useState("");
  const { count, active, start } = useCountdown(30);

  useEffect(() => { start(); }, []);

  const verify = async () => {
    setLoading(true); setError(false);
    await new Promise(r => setTimeout(r, 1500));
    setLoading(false);
    if (code !== "123456") setError(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-[#1B3A6B]/60 border border-white/15 flex items-center justify-center">
          <Fingerprint size={22} className="text-[#C9922A]" />
        </div>
        <div>
          <h2 className="text-white text-2xl font-bold">Two-step verification</h2>
          <p className="text-white/50 text-sm mt-0.5">Signed in as <strong className="text-white/70">ramesh@shrihari.in</strong></p>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-xl p-4">
        <p className="text-white/60 text-sm leading-relaxed">
          {useBackup
            ? "Enter one of your saved backup recovery codes."
            : "Enter the 6-digit code from your authenticator app (Google Authenticator / Authy)."}
        </p>
      </div>

      {error && <Banner type="error" message="Invalid code. Check your authenticator app and try again. (Hint: 123456)" />}

      {!useBackup ? (
        <>
          <div className="space-y-3">
            <label className="text-xs font-semibold text-white/70 uppercase tracking-wider block">Authentication code</label>
            <OTPInput length={6} onChange={setCode} hasError={error} />
            <div className="flex items-center justify-between text-sm">
              <span className="text-white/40">
                {active ? <span>Code valid for <span className="font-mono text-white/70">0:{String(count).padStart(2,"0")}</span></span> : "Code expired"}
              </span>
            </div>
          </div>
          <label className="flex items-center gap-2.5 cursor-pointer">
            <div onClick={() => setTrust(t => !t)} className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all cursor-pointer ${trust ? "bg-[#C9922A] border-[#C9922A]" : "border-white/25"}`}>
              {trust && <Check size={9} strokeWidth={3} className="text-white" />}
            </div>
            <span className="text-sm text-white/60 select-none">Trust this device for 30 days</span>
          </label>
        </>
      ) : (
        <GlassInput label="Backup recovery code" placeholder="XXXX-XXXX-XXXX" value={backupCode} onChange={setBackupCode} icon={<Key size={15} />} hint="Format: four groups of four characters" />
      )}

      <GlassBtn loading={loading} onClick={verify}>Verify Identity <ChevronRight size={15} /></GlassBtn>

      <div className="text-center space-y-2">
        <button onClick={() => setUseBackup(u => !u)} className="text-sm text-[#C9922A] hover:text-[#E8B64C] font-medium transition-colors block w-full">
          {useBackup ? "Use authenticator app instead" : "Use a backup code"}
        </button>
        <button onClick={() => onNavigate("login")} className="text-sm text-white/30 hover:text-white/60 transition-colors">
          Sign in with a different account
        </button>
      </div>
    </div>
  );
}

// ── 6. Subdomain Login ────────────────────────────────────────────────────────
function SubdomainScreen({ onNavigate, onLogin, subdomain }: { onNavigate: (s: Screen) => void, onLogin?: () => void, subdomain?: string }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async () => {
    if (!email || !password) { setError("Please fill in all fields"); return; }
    setError(""); setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setLoading(false); 
    
    if (email === `user@${displayDomain}.in` && password === "password123") {
      if (onLogin) onLogin();
    } else {
      setError("Invalid credentials for this workspace. Hint: use user@" + displayDomain + ".in / password123");
    }
  };

  const displayDomain = subdomain || "hariheights";
  const displayName = subdomain ? subdomain.charAt(0).toUpperCase() + subdomain.slice(1).replace(/-/g, " ") : "Hari Heights";
  const baseDomain = window.location.hostname.includes("localhost") ? "localhost" : "mycafile.xyz";

  return (
    <div className="space-y-5">
      {/* URL bar mockup */}
      <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-3 py-2">
        <Globe size={13} className="text-emerald-400 flex-shrink-0" />
        <span className="text-xs font-mono text-white/40">
          <span className="text-emerald-400 font-semibold">{displayDomain}</span>.{baseDomain}/login
        </span>
        <div className="ml-auto flex items-center gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span className="text-[10px] text-emerald-400">Secure</span>
        </div>
      </div>

      {/* Project branding */}
      <div className="flex items-center gap-4 py-2">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#1B3A6B] to-[#2B5BA8] border border-white/20 flex items-center justify-center flex-shrink-0 shadow-xl">
          <Building2 size={24} className="text-white" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <p className="text-white font-bold text-lg">{displayName}</p>
            <span className="text-[10px] bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 px-2 py-0.5 rounded-full font-semibold">RERA Approved</span>
          </div>
          <p className="text-white/40 text-xs">Koramangala, Bengaluru · 240 Units</p>
          <p className="text-white/30 text-[10px]">Powered by Shri Hari Group ERP</p>
        </div>
      </div>

      {error && <Banner type="error" message={error} />}

      <div className="space-y-4">
        <GlassInput label="Work email" type="email" placeholder={`you@${displayDomain}.in`} value={email} onChange={setEmail} icon={<Mail size={15} />} />
        <GlassInput label="Password" type="password" placeholder="Your workspace password" value={password} onChange={setPassword} icon={<Lock size={15} />} />
      </div>

      <GlassBtn loading={loading} onClick={submit}>Sign In to Hari Heights <ChevronRight size={15} /></GlassBtn>

      <OrDivider />

      <button className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-white/12 text-sm text-white/60 hover:bg-white/6 hover:text-white transition-all">
        <Building2 size={14} /> Sign in with SHG Central account
      </button>

      <div className="text-center">
        <p className="text-xs text-white/20">Not your workspace?</p>
        <button className="text-xs text-[#C9922A] hover:underline">Find your project login →</button>
      </div>
    </div>
  );
}

// ── 7. Owner Portal ───────────────────────────────────────────────────────────
function OwnerPortalScreen({ onNavigate }: { onNavigate: (s: Screen) => void }) {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { count, active, start } = useCountdown(30);

  const sendOTP = async () => {
    if (phone.length !== 10) { setError("Enter a valid 10-digit mobile number"); return; }
    setError(""); setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    setLoading(false); setStep("otp"); start();
  };

  return (
    <div className="space-y-5">
      <div className="text-center">
        <div className="inline-flex items-center gap-2 bg-[#C9922A]/15 border border-[#C9922A]/30 rounded-full px-4 py-1.5 mb-4">
          <Key size={12} className="text-[#C9922A]" />
          <span className="text-[#C9922A] text-xs font-semibold">Homebuyer Portal</span>
        </div>
        <h2 className="text-white text-2xl font-bold">Access Your Home</h2>
        <p className="text-white/50 text-sm mt-1">
          {step === "phone" ? "Enter your registered mobile number to sign in" : `Enter the OTP sent to +91 ${phone.slice(0,2)}****${phone.slice(-2)}`}
        </p>
      </div>

      {error && <Banner type="error" message={error} />}

      {step === "phone" ? (
        <>
          <GlassInput label="Registered mobile number" placeholder="98765 43210" value={phone} onChange={v => setPhone(v.replace(/\D/g, "").slice(0, 10))} icon={<Phone size={15} />} prefix="+91" hint="Use the number registered at the time of booking" />
          <GlassBtn loading={loading} onClick={sendOTP}>Send OTP <ChevronRight size={15} /></GlassBtn>
        </>
      ) : (
        <>
          <div className="space-y-3">
            <label className="text-xs font-semibold text-white/70 uppercase tracking-wider block text-center">Enter OTP</label>
            <OTPInput length={6} onChange={setOtp} />
            <div className="text-center">
              {active
                ? <span className="text-sm text-white/40">Resend in <span className="text-white/70 font-mono font-semibold">0:{String(count).padStart(2,"0")}</span></span>
                : <button onClick={() => { start(); }} className="text-sm text-[#C9922A] hover:text-[#E8B64C] font-medium flex items-center gap-1 mx-auto transition-colors"><RefreshCw size={12} /> Resend OTP</button>
              }
            </div>
          </div>
          <GlassBtn loading={loading} onClick={() => {}}>Verify & Access Portal <ChevronRight size={15} /></GlassBtn>
          <button onClick={() => setStep("phone")} className="w-full text-sm text-white/40 hover:text-white/60 transition-colors text-center">
            ← Change mobile number
          </button>
        </>
      )}

      <div className="bg-white/4 border border-white/8 rounded-xl p-4">
        <p className="text-white/40 text-xs text-center leading-relaxed">
          Having trouble? Call <span className="text-[#C9922A]">1800-XXX-XXXX</span> (toll-free) or email <span className="text-[#C9922A]">support@shrihari.in</span>
        </p>
      </div>
    </div>
  );
}

// ── 8. Super Admin ────────────────────────────────────────────────────────────
function SuperAdminScreen({ onNavigate, onLogin }: { onNavigate: (s: Screen) => void, onLogin?: () => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [secCode, setSecCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState<"creds" | "2fa">("creds");

  const submitCreds = async () => {
    if (!username || !password) { setError("All fields are required"); return; }
    setError(""); setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setLoading(false);
    
    if (username === "admin@shrihari.in" && password === "password123") {
      setStep("2fa");
    } else {
      setError("Invalid admin credentials");
    }
  };

  const submitAdmin = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setLoading(false);
    if (secCode === "123456") {
      if (onLogin) onLogin();
    } else {
      setError("Invalid security code");
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-red-600/30 border border-red-500/40 flex items-center justify-center">
            <Shield size={15} className="text-red-400" />
          </div>
          <span className="text-red-400 text-xs font-bold uppercase tracking-widest">Restricted Access</span>
        </div>
        <h2 className="text-white text-2xl font-bold">Super Admin Login</h2>
        <p className="text-white/50 text-sm mt-1">
          {step === "creds" ? "Enter your admin credentials to continue" : "Enter your security code to verify identity"}
        </p>
      </div>

      {error && <Banner type="error" message={error} />}

      {step === "creds" ? (
        <>
          <Banner type="info" message="Your IP (103.XX.XX.XX) and login time are being recorded." />
          <div className="space-y-4">
            <GlassInput label="Admin username" placeholder="admin@shrihari.in" value={username} onChange={setUsername} icon={<Mail size={15} />} />
            <GlassInput label="Master password" type="password" placeholder="Super admin password" value={password} onChange={setPassword} icon={<Lock size={15} />} />
          </div>
          <button className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-red-600/20 border border-red-500/30 text-sm text-red-300 hover:bg-red-600/30 transition-all font-semibold" onClick={submitCreds}>
            {loading ? <><Loader2 size={15} className="animate-spin" /> Authenticating…</> : <><Shield size={14} /> Authenticate as Super Admin</>}
          </button>
        </>
      ) : (
        <>
          <div className="bg-emerald-500/10 border border-emerald-500/25 rounded-xl p-4 flex items-center gap-3">
            <CheckCircle2 size={18} className="text-emerald-400 flex-shrink-0" />
            <div>
              <p className="text-emerald-300 text-sm font-semibold">Credentials verified</p>
              <p className="text-emerald-400/60 text-xs">Enter your hardware token or authenticator code</p>
            </div>
          </div>
          <div className="space-y-3">
            <label className="text-xs font-semibold text-white/70 uppercase tracking-wider block">Security code</label>
            <OTPInput length={6} onChange={setSecCode} hasError={!!error} />
          </div>
          <button className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-red-600/20 border border-red-500/30 text-sm text-red-300 hover:bg-red-600/30 transition-all font-semibold" onClick={submitAdmin}>
            {loading ? <><Loader2 size={15} className="animate-spin" /> Verifying…</> : <><Fingerprint size={14} /> Enter Admin Panel</>}
          </button>
          <button onClick={() => { setStep("creds"); setError(""); }} className="w-full text-sm text-white/30 hover:text-white/60 transition-colors">← Back to credentials</button>
        </>
      )}

      <p className="text-center text-[10px] text-white/20 leading-relaxed">
        All admin sessions are logged, monitored, and auditable.<br />Unauthorized access is a criminal offence.
      </p>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// LAYOUT WRAPPER
// ═══════════════════════════════════════════════════════════════════════════════

type LayoutType = "split" | "fullglass";

function getLayout(screen: Screen): LayoutType {
  return ["subdomain", "owner-portal", "super-admin"].includes(screen) ? "fullglass" : "split";
}

function getOverlay(screen: Screen): string {
  if (screen === "super-admin") return "from-black/97 via-[#1a0a0a]/95 to-[#0F1F3D]/90";
  if (screen === "owner-portal") return "from-[#1a1200]/95 via-[#7C5316]/85 to-[#1B3A6B]/80";
  if (screen === "subdomain") return "from-[#0F1F3D]/96 via-[#1B3A6B]/92 to-[#1B3A6B]/85";
  return "from-[#0F1F3D]/96 via-[#1B3A6B]/90 to-[#1B3A6B]/80";
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN AUTH PAGE
// ═══════════════════════════════════════════════════════════════════════════════

const SCREENS: { key: Screen; label: string; badge?: string }[] = [
  { key: "login", label: "Login" },
  { key: "otp-login", label: "OTP Login" },
  { key: "forgot-password", label: "Forgot Password" },
  { key: "reset-password", label: "Reset Password" },
  { key: "two-factor", label: "2FA Verify" },
  { key: "subdomain", label: "Subdomain", badge: "Project" },
  { key: "owner-portal", label: "Owner Portal", badge: "Customer" },
  { key: "super-admin", label: "Super Admin", badge: "Admin" },
];

export function AuthPage({ defaultScreen = "login", onLogin, subdomain }: { defaultScreen?: Screen, onLogin?: () => void, subdomain?: string }) {
  const [screen, setScreen] = useState<Screen>(defaultScreen);
  const layout = getLayout(screen);
  const overlay = getOverlay(screen);
  const bgImage = ["subdomain", "owner-portal"].includes(screen) ? BG_GLASS : BG_IMAGE;

  const renderScreen = () => {
    const props = { onNavigate: setScreen, onLogin };
    switch (screen) {
      case "login": return <LoginScreen {...props} />;
      case "otp-login": return <OTPLoginScreen {...props} />;
      case "forgot-password": return <ForgotPasswordScreen {...props} />;
      case "reset-password": return <ResetPasswordScreen {...props} />;
      case "two-factor": return <TwoFactorScreen {...props} />;
      case "subdomain": return <SubdomainScreen {...props} subdomain={subdomain} />;
      case "owner-portal": return <OwnerPortalScreen {...props} />;
      case "super-admin": return <SuperAdminScreen {...props} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0F1F3D]">
      {/* Screen picker */}
      <div className="bg-[#0A1628] border-b border-white/8 px-4 py-2.5 flex items-center gap-2 overflow-x-auto shrink-0 z-50">
        <span className="text-white/30 text-[10px] font-bold uppercase tracking-widest whitespace-nowrap pr-2 border-r border-white/10">Auth Screens</span>
        <div className="flex items-center gap-1.5 pl-2">
          {SCREENS.map(s => (
            <button
              key={s.key}
              onClick={() => setScreen(s.key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all
                ${screen === s.key
                  ? "bg-[#C9922A] text-white shadow-md shadow-amber-900/30"
                  : "text-white/40 hover:text-white/70 hover:bg-white/6"
                }`}
            >
              {s.label}
              {s.badge && (
                <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold
                  ${screen === s.key ? "bg-white/20 text-white" : "bg-white/8 text-white/40"}`}>
                  {s.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Auth Layout */}
      <div className="flex-1 relative">
        {layout === "split" ? (
          /* ─ Split Layout ─ */
          <div className="flex h-full min-h-[calc(100vh-48px)]">
            {/* Left — brand panel */}
            <div className="hidden lg:flex lg:w-[45%] xl:w-[48%] relative flex-col overflow-hidden">
              <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${bgImage})` }} />
              <div className={`absolute inset-0 bg-gradient-to-br ${overlay}`} />
              {/* Subtle noise texture */}
              <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E\")" }} />
              <div className="relative z-10 flex-1">
                <BrandPanel screen={screen} />
              </div>
              {/* Bottom fade */}
              <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
            </div>

            {/* Right — form panel */}
            <div className="flex-1 flex items-center justify-center bg-[#0D1523] px-4 py-10 min-h-screen lg:min-h-0">
              {/* Mobile brand strip */}
              <div className="absolute top-0 left-0 right-0 h-40 lg:hidden overflow-hidden">
                <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${bgImage})` }} />
                <div className={`absolute inset-0 bg-gradient-to-br ${overlay}`} />
              </div>

              <div className="relative z-10 w-full max-w-md">
                {/* Mobile logo */}
                <div className="flex items-center gap-2.5 mb-8 lg:hidden">
                  <div className="w-9 h-9 rounded-xl bg-[#C9922A] flex items-center justify-center shadow-lg">
                    <span className="text-white text-xs font-bold">SHG</span>
                  </div>
                  <div>
                    <p className="text-white font-bold leading-none">Shri Hari Group</p>
                    <p className="text-white/40 text-xs mt-0.5">Builder ERP Platform</p>
                  </div>
                </div>

                {/* Form card */}
                <div className="bg-white/4 backdrop-blur-xl border border-white/10 rounded-3xl p-7 shadow-2xl shadow-black/50">
                  {renderScreen()}
                </div>

                <p className="text-center text-[10px] text-white/20 mt-6">
                  © 2026 Shri Hari Group · <span className="hover:text-white/40 cursor-pointer">Privacy</span> · <span className="hover:text-white/40 cursor-pointer">Terms</span> · v2.4.1
                </p>
              </div>
            </div>
          </div>
        ) : (
          /* ─ Full Glass Layout (screens 6, 7, 8) ─ */
          <div className="relative min-h-[calc(100vh-48px)] flex items-center justify-center p-4 py-10">
            {/* Background */}
            <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${bgImage})` }} />
            <div className={`absolute inset-0 bg-gradient-to-br ${overlay}`} />

            {/* Blurred blobs */}
            <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-[#1B3A6B]/30 blur-3xl pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full bg-[#C9922A]/15 blur-3xl pointer-events-none" />

            <div className="relative z-10 w-full max-w-md">
              {/* Glass card */}
              <div className="bg-white/8 backdrop-blur-2xl border border-white/15 rounded-3xl p-8 shadow-2xl shadow-black/50">
                {/* Logo header */}
                <div className="flex items-center justify-center gap-3 mb-8 pb-6 border-b border-white/10">
                  <div className="w-10 h-10 rounded-xl bg-[#C9922A] flex items-center justify-center shadow-lg shadow-amber-900/30">
                    <span className="text-white text-sm font-bold tracking-tight">SHG</span>
                  </div>
                  <div>
                    <p className="text-white font-bold leading-none">Shri Hari Group</p>
                    <p className="text-white/40 text-xs mt-0.5">Builder ERP Platform</p>
                  </div>
                </div>
                {renderScreen()}
              </div>

              <p className="text-center text-[10px] text-white/20 mt-5">
                © 2026 Shri Hari Group · <span className="hover:text-white/40 cursor-pointer">Privacy</span> · <span className="hover:text-white/40 cursor-pointer">Terms</span>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
