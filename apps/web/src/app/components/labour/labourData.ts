// ── Types ──────────────────────────────────────────────────────────────────────

export type AttendanceStatus = "P" | "A" | "H" | "S" | "—";
// P = Present  A = Absent  H = Half Day  S = Sunday/Weekly Off  — = Not marked

export type Trade =
  | "Mason" | "Carpenter" | "Electrician" | "Plumber"
  | "Helper" | "Bar Bender" | "Formwork" | "Supervisor"
  | "Welder" | "Painter";

export type AadhaarStatus = "Verified" | "Pending" | "Failed";

export interface Worker {
  id: string;
  code: string;
  name: string;
  aadhaar: string;
  aadhaarStatus: AadhaarStatus;
  trade: Trade;
  contractorId: string;
  dailyWage: number;
  phone: string;
  joinDate: string;
  status: "Active" | "Inactive";
  site: string;
  homeState: string;
  gender: "M" | "F";
  advanceBalance: number;
  bloodGroup: string;
  emergencyContact: string;
}

export interface Contractor {
  id: string;
  code: string;
  name: string;
  phone: string;
  pan: string;
  gstin?: string;
  speciality: string;
  workerCount: number;
  rateType: "Daily" | "Lump Sum" | "Monthly";
  totalBilled: number;
  totalPaid: number;
  status: "Active" | "Inactive";
  joinDate: string;
}

export type AttendanceMap = Record<string, Record<string, AttendanceStatus>>;

// ── Date constants ─────────────────────────────────────────────────────────────

export const TODAY = "2026-05-19";

export const PREV_WEEK = [
  { date: "2026-05-11", label: "Mon 11" },
  { date: "2026-05-12", label: "Tue 12" },
  { date: "2026-05-13", label: "Wed 13" },
  { date: "2026-05-14", label: "Thu 14" },
  { date: "2026-05-15", label: "Fri 15" },
  { date: "2026-05-16", label: "Sat 16" },
  { date: "2026-05-17", label: "Sun 17" },
];

export const CURR_WEEK = [
  { date: "2026-05-18", label: "Mon 18" },
  { date: "2026-05-19", label: "Tue 19" },
];

export const ALL_DATES = [...PREV_WEEK, ...CURR_WEEK];

// ── Helpers ───────────────────────────────────────────────────────────────────

export function fmtINR(n: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency", currency: "INR", maximumFractionDigits: 0,
  }).format(n);
}

export function maskAadhaar(a: string): string {
  return `XXXX-XXXX-${a.slice(-4)}`;
}

export function workerInitials(name: string): string {
  return name.split(" ").slice(0, 2).map(n => n[0]).join("").toUpperCase();
}

export function getContractorName(id: string): string {
  return mockContractors.find(c => c.id === id)?.name.split(" ")[0] ?? id;
}

export interface WageSummary {
  present: number;
  half: number;
  absent: number;
  gross: number;
  advance: number;
  net: number;
}

export function calcWage(worker: Worker, dayMap: Record<string, AttendanceStatus>): WageSummary {
  let present = 0, half = 0, absent = 0;
  Object.values(dayMap).forEach(s => {
    if (s === "P") present++;
    else if (s === "H") half++;
    else if (s === "A") absent++;
  });
  const gross = Math.round(present * worker.dailyWage + half * worker.dailyWage * 0.5);
  const advance = Math.min(worker.advanceBalance, Math.round(gross * 0.5));
  return { present, half, absent, gross, advance, net: gross - advance };
}

// ── Contractors ───────────────────────────────────────────────────────────────

export const mockContractors: Contractor[] = [
  { id: "C01", code: "CTR-001", name: "Rameshwar Construction Co.", phone: "9821045678", pan: "AAAFR2345P", gstin: "27AAAFR2345P1ZX", speciality: "Masonry & Concrete",    workerCount: 8, rateType: "Daily",    totalBilled: 1240000, totalPaid: 980000,  status: "Active", joinDate: "2024-04-01" },
  { id: "C02", code: "CTR-002", name: "Sai Steel Works",            phone: "9867234501", pan: "ABCSS5678R", gstin: "27ABCSS5678R1ZM", speciality: "Bar Bending & Formwork", workerCount: 5, rateType: "Daily",    totalBilled: 680000,  totalPaid: 620000,  status: "Active", joinDate: "2024-04-01" },
  { id: "C03", code: "CTR-003", name: "Joshi Electricals Pvt. Ltd.",phone: "9745123456", pan: "AAAJJ1234P", gstin: "27AAAJJ1234P1ZQ", speciality: "Electrical Works",      workerCount: 3, rateType: "Daily",    totalBilled: 390000,  totalPaid: 390000,  status: "Active", joinDate: "2024-06-15" },
  { id: "C04", code: "CTR-004", name: "Prabha Plumbing Services",   phone: "9632012345", pan: "AAGFP3456Q",                           speciality: "Plumbing & Sanitation",  workerCount: 2, rateType: "Lump Sum", totalBilled: 185000,  totalPaid: 120000,  status: "Active", joinDate: "2024-09-01" },
  { id: "C05", code: "CTR-005", name: "Mehta Carpentry Works",      phone: "9512345670", pan: "AAGFM7890R",                           speciality: "Carpentry & Woodwork",   workerCount: 2, rateType: "Daily",    totalBilled: 210000,  totalPaid: 210000,  status: "Active", joinDate: "2025-01-10" },
  { id: "C06", code: "CTR-006", name: "Direct (Shri Hari Group)",   phone: "9820000001", pan: "AABCS1234K", gstin: "27AABCS1234K1Z5", speciality: "Site Supervision",       workerCount: 2, rateType: "Monthly",  totalBilled: 480000,  totalPaid: 480000,  status: "Active", joinDate: "2024-04-01" },
];

// ── Workers ───────────────────────────────────────────────────────────────────

export const mockWorkers: Worker[] = [
  { id: "W01", code: "WRK-001", name: "Raju Yadav",    aadhaar: "234567891011", aadhaarStatus: "Verified", trade: "Mason",       contractorId: "C01", dailyWage: 650, phone: "9012345678", joinDate: "2024-04-02", status: "Active", site: "Tower A",    homeState: "Uttar Pradesh",   gender: "M", advanceBalance: 2000, bloodGroup: "O+",  emergencyContact: "9012345679" },
  { id: "W02", code: "WRK-002", name: "Suresh Kumar",  aadhaar: "345678912300", aadhaarStatus: "Verified", trade: "Mason",       contractorId: "C01", dailyWage: 650, phone: "9123456780", joinDate: "2024-04-02", status: "Active", site: "Tower A",    homeState: "Bihar",           gender: "M", advanceBalance: 0,    bloodGroup: "B+",  emergencyContact: "9123456781" },
  { id: "W03", code: "WRK-003", name: "Bhaiya Lal",    aadhaar: "456789023410", aadhaarStatus: "Verified", trade: "Mason",       contractorId: "C01", dailyWage: 650, phone: "9234567801", joinDate: "2024-05-15", status: "Active", site: "Tower B",    homeState: "Rajasthan",       gender: "M", advanceBalance: 1500, bloodGroup: "A+",  emergencyContact: "9234567802" },
  { id: "W04", code: "WRK-004", name: "Ram Prasad",    aadhaar: "567890134521", aadhaarStatus: "Verified", trade: "Helper",      contractorId: "C01", dailyWage: 450, phone: "9345678012", joinDate: "2024-04-02", status: "Active", site: "Tower A",    homeState: "Madhya Pradesh",  gender: "M", advanceBalance: 3000, bloodGroup: "AB+", emergencyContact: "9345678013" },
  { id: "W05", code: "WRK-005", name: "Mohan Das",     aadhaar: "678901245632", aadhaarStatus: "Verified", trade: "Helper",      contractorId: "C01", dailyWage: 450, phone: "9456780123", joinDate: "2024-08-01", status: "Active", site: "Tower B",    homeState: "Odisha",          gender: "M", advanceBalance: 0,    bloodGroup: "O-",  emergencyContact: "9456780124" },
  { id: "W06", code: "WRK-006", name: "Sunita Devi",   aadhaar: "789012356743", aadhaarStatus: "Verified", trade: "Helper",      contractorId: "C01", dailyWage: 420, phone: "9567801234", joinDate: "2024-09-10", status: "Active", site: "Tower A",    homeState: "Jharkhand",       gender: "F", advanceBalance: 0,    bloodGroup: "B-",  emergencyContact: "9567801235" },
  { id: "W07", code: "WRK-007", name: "Rekha Bai",     aadhaar: "890123467854", aadhaarStatus: "Pending",  trade: "Helper",      contractorId: "C01", dailyWage: 420, phone: "9678012345", joinDate: "2025-02-01", status: "Active", site: "Tower C",    homeState: "Chhattisgarh",    gender: "F", advanceBalance: 500,  bloodGroup: "A-",  emergencyContact: "9678012346" },
  { id: "W08", code: "WRK-008", name: "Girish Yadav",  aadhaar: "901234578965", aadhaarStatus: "Verified", trade: "Mason",       contractorId: "C01", dailyWage: 650, phone: "9789012456", joinDate: "2024-04-02", status: "Active", site: "Tower C",    homeState: "Uttar Pradesh",   gender: "M", advanceBalance: 0,    bloodGroup: "O+",  emergencyContact: "9789012457" },
  { id: "W09", code: "WRK-009", name: "Santosh Kadam", aadhaar: "012345689076", aadhaarStatus: "Verified", trade: "Bar Bender",  contractorId: "C02", dailyWage: 600, phone: "9890123567", joinDate: "2024-04-05", status: "Active", site: "Tower B",    homeState: "Maharashtra",     gender: "M", advanceBalance: 0,    bloodGroup: "B+",  emergencyContact: "9890123568" },
  { id: "W10", code: "WRK-010", name: "Manoj Shinde",  aadhaar: "123456790187", aadhaarStatus: "Verified", trade: "Bar Bender",  contractorId: "C02", dailyWage: 600, phone: "9901234678", joinDate: "2024-04-05", status: "Active", site: "Tower A",    homeState: "Maharashtra",     gender: "M", advanceBalance: 2500, bloodGroup: "AB-", emergencyContact: "9901234679" },
  { id: "W11", code: "WRK-011", name: "Prakash Wagh",  aadhaar: "234567801298", aadhaarStatus: "Verified", trade: "Formwork",    contractorId: "C02", dailyWage: 580, phone: "9012356789", joinDate: "2024-06-01", status: "Active", site: "Tower B",    homeState: "Maharashtra",     gender: "M", advanceBalance: 0,    bloodGroup: "O+",  emergencyContact: "9012356790" },
  { id: "W12", code: "WRK-012", name: "Dinesh Rawat",  aadhaar: "345678912309", aadhaarStatus: "Verified", trade: "Formwork",    contractorId: "C02", dailyWage: 580, phone: "9123457890", joinDate: "2024-07-15", status: "Active", site: "Tower C",    homeState: "Uttarakhand",     gender: "M", advanceBalance: 1000, bloodGroup: "A+",  emergencyContact: "9123457891" },
  { id: "W13", code: "WRK-013", name: "Rajesh Thakur", aadhaar: "456789023411", aadhaarStatus: "Pending",  trade: "Bar Bender",  contractorId: "C02", dailyWage: 600, phone: "9234568901", joinDate: "2025-03-01", status: "Active", site: "Tower A",    homeState: "Himachal Pradesh",gender: "M", advanceBalance: 0,    bloodGroup: "B+",  emergencyContact: "9234568902" },
  { id: "W14", code: "WRK-014", name: "Anil Verma",    aadhaar: "567890134522", aadhaarStatus: "Verified", trade: "Electrician", contractorId: "C03", dailyWage: 700, phone: "9345679012", joinDate: "2024-06-15", status: "Active", site: "Tower C",    homeState: "Uttar Pradesh",   gender: "M", advanceBalance: 0,    bloodGroup: "O+",  emergencyContact: "9345679013" },
  { id: "W15", code: "WRK-015", name: "Vijay Nair",    aadhaar: "678901245633", aadhaarStatus: "Verified", trade: "Electrician", contractorId: "C03", dailyWage: 700, phone: "9456790123", joinDate: "2024-06-15", status: "Active", site: "Tower B",    homeState: "Kerala",          gender: "M", advanceBalance: 0,    bloodGroup: "A+",  emergencyContact: "9456790124" },
  { id: "W16", code: "WRK-016", name: "Ganesh Pandey", aadhaar: "789012356744", aadhaarStatus: "Failed",   trade: "Electrician", contractorId: "C03", dailyWage: 650, phone: "9567901234", joinDate: "2025-01-20", status: "Active", site: "Tower A",    homeState: "Bihar",           gender: "M", advanceBalance: 0,    bloodGroup: "B-",  emergencyContact: "9567901235" },
  { id: "W17", code: "WRK-017", name: "Suresh Nair",   aadhaar: "890123467855", aadhaarStatus: "Verified", trade: "Plumber",     contractorId: "C04", dailyWage: 650, phone: "9678012345", joinDate: "2024-09-01", status: "Active", site: "Basement",   homeState: "Kerala",          gender: "M", advanceBalance: 0,    bloodGroup: "O+",  emergencyContact: "9678012346" },
  { id: "W18", code: "WRK-018", name: "Ramesh Gupta",  aadhaar: "901234578966", aadhaarStatus: "Verified", trade: "Plumber",     contractorId: "C04", dailyWage: 620, phone: "9789023456", joinDate: "2024-09-01", status: "Active", site: "Basement",   homeState: "Uttar Pradesh",   gender: "M", advanceBalance: 1500, bloodGroup: "AB+", emergencyContact: "9789023457" },
  { id: "W19", code: "WRK-019", name: "Harish Mehta",  aadhaar: "012345689077", aadhaarStatus: "Verified", trade: "Carpenter",   contractorId: "C05", dailyWage: 620, phone: "9890134567", joinDate: "2025-01-10", status: "Active", site: "Club House", homeState: "Rajasthan",       gender: "M", advanceBalance: 0,    bloodGroup: "B+",  emergencyContact: "9890134568" },
  { id: "W20", code: "WRK-020", name: "Krishna Das",   aadhaar: "123456790188", aadhaarStatus: "Verified", trade: "Carpenter",   contractorId: "C05", dailyWage: 600, phone: "9901245678", joinDate: "2025-01-10", status: "Active", site: "Club House", homeState: "West Bengal",     gender: "M", advanceBalance: 0,    bloodGroup: "O-",  emergencyContact: "9901245679" },
];

// ── Attendance ─────────────────────────────────────────────────────────────────

const prevSeed: Record<string, AttendanceStatus[]> = {
  W01: ["P","P","P","P","P","P","S"], W02: ["P","P","P","A","P","P","S"],
  W03: ["P","P","H","P","P","P","S"], W04: ["A","P","P","P","P","H","S"],
  W05: ["P","P","P","P","A","P","S"], W06: ["P","P","P","P","P","P","S"],
  W07: ["P","A","P","P","P","A","S"], W08: ["P","P","P","P","P","P","S"],
  W09: ["P","P","P","P","P","H","S"], W10: ["P","P","A","P","P","P","S"],
  W11: ["P","P","P","H","P","P","S"], W12: ["A","P","P","P","P","P","S"],
  W13: ["P","P","P","P","H","P","S"], W14: ["P","P","P","P","P","P","S"],
  W15: ["P","A","P","P","P","P","S"], W16: ["P","P","P","P","P","P","S"],
  W17: ["P","P","P","P","P","P","S"], W18: ["P","P","H","P","P","A","S"],
  W19: ["P","P","P","P","P","P","S"], W20: ["P","P","P","A","P","P","S"],
};

const currSeed: Record<string, AttendanceStatus[]> = {
  W01: ["P","P"], W02: ["P","P"], W03: ["P","A"], W04: ["P","P"],
  W05: ["P","P"], W06: ["P","H"], W07: ["A","P"], W08: ["P","P"],
  W09: ["P","P"], W10: ["P","—"], W11: ["P","P"], W12: ["P","P"],
  W13: ["P","P"], W14: ["P","P"], W15: ["P","P"], W16: ["P","P"],
  W17: ["P","P"], W18: ["P","P"], W19: ["P","P"], W20: ["P","P"],
};

function buildAttendance(): AttendanceMap {
  const out: AttendanceMap = {};
  for (const w of mockWorkers) {
    out[w.id] = {};
    PREV_WEEK.forEach(({ date }, i) => { out[w.id][date] = prevSeed[w.id]?.[i] ?? "—"; });
    CURR_WEEK.forEach(({ date }, i) => { out[w.id][date] = currSeed[w.id]?.[i] ?? "—"; });
  }
  return out;
}

export const mockAttendance: AttendanceMap = buildAttendance();

// ── Style maps ────────────────────────────────────────────────────────────────

export const tradeColor: Record<Trade, string> = {
  Mason:        "bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300",
  Helper:       "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300",
  "Bar Bender": "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
  Formwork:     "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  Electrician:  "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300",
  Plumber:      "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  Carpenter:    "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
  Supervisor:   "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
  Welder:       "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
  Painter:      "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
};

export const contractorColor: Record<string, { hex: string }> = {
  C01: { hex: "#2563EB" },
  C02: { hex: "#EA580C" },
  C03: { hex: "#CA8A04" },
  C04: { hex: "#0891B2" },
  C05: { hex: "#16A34A" },
  C06: { hex: "#7C3AED" },
};
