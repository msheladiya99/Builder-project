// ── Types ──────────────────────────────────────────────────────────────────────

export type ProjectId = "TA" | "TB" | "TC";
export type BOQCategory = "Civil" | "MEP" | "Finishing" | "External";
export type MilestoneStatus = "Completed" | "In Progress" | "Upcoming" | "Delayed";
export type UpdateCategory = "Civil" | "MEP" | "Finishing" | "Safety" | "Quality" | "General";
export type WeatherCondition = "Sunny" | "Partly Cloudy" | "Cloudy" | "Rainy";
export type GanttStatus = "Completed" | "In Progress" | "Upcoming" | "Delayed";

export interface Project {
  id: ProjectId;
  name: string;
  type: string;
  totalFloors: number;
  floorsComplete: number;
  totalUnits: number;
  startDate: string;
  targetDate: string;
  siteEngineer: string;
  projectManager: string;
  overallProgress: number;
  totalBOQValue: number;
  executedBOQValue: number;
  todayManpower: number;
  activeTasks: number;
  color: string;
}

export interface BOQItem {
  id: string;
  projectId: ProjectId;
  category: BOQCategory;
  description: string;
  unit: string;
  plannedQty: number;
  executedQty: number;
  rate: number;
  remark?: string;
}

export interface SiteDiaryEntry {
  id: string;
  projectId: ProjectId;
  date: string;
  weather: WeatherCondition;
  tempHigh: number;
  tempLow: number;
  manpower: number;
  equipmentList: string[];
  workDone: string;
  issues: string;
  engineerNotes: string;
  engineerName: string;
  nextDayPlan: string;
}

export interface DailyUpdate {
  id: string;
  projectId: ProjectId;
  date: string;
  title: string;
  description: string;
  category: UpdateCategory;
  location: string;
  postedBy: string;
  images: { id: string; color: string; label: string }[];
  likes: number;
}

export interface Milestone {
  id: string;
  projectId: ProjectId;
  title: string;
  description: string;
  targetDate: string;
  actualDate?: string;
  status: MilestoneStatus;
  weight: number;
  daysDelayed?: number;
  engineerNote?: string;
}

export interface GanttTask {
  id: string;
  projectId: ProjectId;
  title: string;
  category: BOQCategory;
  startDate: string;
  endDate: string;
  progress: number;
  status: GanttStatus;
  assignee: string;
}

// ── Constants ──────────────────────────────────────────────────────────────────

export const TODAY = "2026-05-19";

// Gantt window: Feb 2026 – Sep 2026
export const GANTT_START = new Date("2026-02-01");
export const GANTT_END   = new Date("2026-09-30");
export const GANTT_DAYS  = (GANTT_END.getTime() - GANTT_START.getTime()) / 86400000;
export const GANTT_MONTHS = [
  { label: "Feb", date: "2026-02-01" }, { label: "Mar", date: "2026-03-01" },
  { label: "Apr", date: "2026-04-01" }, { label: "May", date: "2026-05-01" },
  { label: "Jun", date: "2026-06-01" }, { label: "Jul", date: "2026-07-01" },
  { label: "Aug", date: "2026-08-01" }, { label: "Sep", date: "2026-09-01" },
];

export function ganttPct(dateStr: string): number {
  const d = new Date(dateStr);
  const days = (d.getTime() - GANTT_START.getTime()) / 86400000;
  return Math.max(0, Math.min(100, (days / GANTT_DAYS) * 100));
}
export function ganttWidth(start: string, end: string): number {
  const s = new Date(Math.max(new Date(start).getTime(), GANTT_START.getTime()));
  const e = new Date(Math.min(new Date(end).getTime(),   GANTT_END.getTime()));
  return Math.max(0.5, ((e.getTime() - s.getTime()) / 86400000 / GANTT_DAYS) * 100);
}

// ── Helpers ───────────────────────────────────────────────────────────────────

export function fmtINR(n: number): string {
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(2)} Cr`;
  if (n >= 100000)   return `₹${(n / 100000).toFixed(1)} L`;
  return `₹${n.toLocaleString("en-IN")}`;
}

export function fmtDate(d: string, opts?: Intl.DateTimeFormatOptions): string {
  return new Date(d).toLocaleDateString("en-IN", opts ?? { day: "numeric", month: "short", year: "numeric" });
}

export function daysBetween(a: string, b: string): number {
  return Math.round((new Date(b).getTime() - new Date(a).getTime()) / 86400000);
}

export function boqExecuted(item: BOQItem) { return Math.round(item.executedQty * item.rate); }
export function boqPlanned(item:  BOQItem) { return Math.round(item.plannedQty  * item.rate); }
export function boqPct(item: BOQItem): number {
  return item.plannedQty > 0 ? Math.min(100, Math.round((item.executedQty / item.plannedQty) * 100)) : 0;
}

// ── Colour maps ───────────────────────────────────────────────────────────────

export const weatherIcon: Record<WeatherCondition, string> = {
  Sunny: "☀️", "Partly Cloudy": "⛅", Cloudy: "☁️", Rainy: "🌧️",
};

export const categoryStyle: Record<BOQCategory, { icon: string; bg: string; text: string }> = {
  Civil:    { icon: "🏗️", bg: "bg-blue-100 dark:bg-blue-900/30",    text: "text-blue-700 dark:text-blue-300"    },
  MEP:      { icon: "⚡",  bg: "bg-yellow-100 dark:bg-yellow-900/30", text: "text-yellow-700 dark:text-yellow-300" },
  Finishing:{ icon: "🎨", bg: "bg-purple-100 dark:bg-purple-900/30", text: "text-purple-700 dark:text-purple-300" },
  External: { icon: "🌳", bg: "bg-green-100 dark:bg-green-900/30",   text: "text-green-700 dark:text-green-300"   },
};

export const updateCatStyle: Record<UpdateCategory, { bg: string; text: string }> = {
  Civil:    { bg: "bg-blue-100 dark:bg-blue-900/30",    text: "text-blue-700 dark:text-blue-300"    },
  MEP:      { bg: "bg-yellow-100 dark:bg-yellow-900/30", text: "text-yellow-700 dark:text-yellow-300" },
  Finishing:{ bg: "bg-purple-100 dark:bg-purple-900/30", text: "text-purple-700 dark:text-purple-300" },
  Safety:   { bg: "bg-red-100 dark:bg-red-900/30",      text: "text-red-700 dark:text-red-300"       },
  Quality:  { bg: "bg-teal-100 dark:bg-teal-900/30",    text: "text-teal-700 dark:text-teal-300"     },
  General:  { bg: "bg-gray-100 dark:bg-gray-800",       text: "text-gray-700 dark:text-gray-300"     },
};

export const milestoneStyle: Record<MilestoneStatus, { dot: string; ring: string; badge: string; label: string }> = {
  Completed:    { dot: "bg-green-500",  ring: "border-green-400",  badge: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",  label: "Completed"    },
  "In Progress":{ dot: "bg-blue-500",   ring: "border-blue-400",   badge: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",      label: "In Progress"  },
  Upcoming:     { dot: "bg-slate-400",  ring: "border-slate-300",  badge: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",     label: "Upcoming"     },
  Delayed:      { dot: "bg-red-500",    ring: "border-red-400",    badge: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",          label: "Delayed ⚠️"   },
};

export const ganttStatusColor: Record<GanttStatus, string> = {
  Completed:    "#16A34A",
  "In Progress":"#1B3A6B",
  Upcoming:     "#94A3B8",
  Delayed:      "#EF4444",
};

// ── Projects ──────────────────────────────────────────────────────────────────

export const mockProjects: Project[] = [
  { id: "TA", name: "Tower A", type: "G+14 Residential", totalFloors: 14, floorsComplete: 9,  totalUnits: 112, startDate: "2024-04-01", targetDate: "2027-06-30", siteEngineer: "Rajiv Mehta",  projectManager: "Arvind Shah",  overallProgress: 62, totalBOQValue: 148000000, executedBOQValue: 91760000, todayManpower: 87, activeTasks: 8,  color: "#1B3A6B" },
  { id: "TB", name: "Tower B", type: "G+12 Residential", totalFloors: 12, floorsComplete: 4,  totalUnits:  96, startDate: "2024-10-01", targetDate: "2027-12-31", siteEngineer: "Priya Sharma", projectManager: "Arvind Shah",  overallProgress: 33, totalBOQValue: 125000000, executedBOQValue: 41250000, todayManpower: 64, activeTasks: 6,  color: "#C9922A" },
  { id: "TC", name: "Tower C", type: "G+10 Residential", totalFloors: 10, floorsComplete: 1,  totalUnits:  80, startDate: "2025-04-01", targetDate: "2028-03-31", siteEngineer: "Kiran Patil",  projectManager: "Meena Joshi",  overallProgress: 15, totalBOQValue: 102000000, executedBOQValue: 15300000, todayManpower: 42, activeTasks: 4,  color: "#7C3AED" },
];

// ── BOQ ───────────────────────────────────────────────────────────────────────

export const mockBOQ: BOQItem[] = [
  // Tower A — Civil
  { id: "TA-C1", projectId: "TA", category: "Civil",    description: "Foundation & Raft Slab",        unit: "CuM",  plannedQty: 1200,  executedQty: 1200,  rate: 4500, remark: "Completed Apr 2024" },
  { id: "TA-C2", projectId: "TA", category: "Civil",    description: "RCC Columns & Shear Walls",     unit: "CuM",  plannedQty: 980,   executedQty: 784,   rate: 6200, remark: "Floor 10 in progress" },
  { id: "TA-C3", projectId: "TA", category: "Civil",    description: "RCC Beams & Slabs",             unit: "CuM",  plannedQty: 2800,  executedQty: 1820,  rate: 5600 },
  { id: "TA-C4", projectId: "TA", category: "Civil",    description: "Brick Work 230mm",              unit: "SqM",  plannedQty: 15000, executedQty: 9750,  rate: 185  },
  { id: "TA-C5", projectId: "TA", category: "Civil",    description: "Brick Work 115mm",              unit: "SqM",  plannedQty: 4200,  executedQty: 2310,  rate: 125  },
  { id: "TA-C6", projectId: "TA", category: "Civil",    description: "Internal Plaster",              unit: "SqM",  plannedQty: 32000, executedQty: 12800, rate: 88   },
  { id: "TA-C7", projectId: "TA", category: "Civil",    description: "External Plaster & Texture",    unit: "SqM",  plannedQty: 8400,  executedQty: 0,     rate: 115, remark: "Scheduled Q3 2026" },
  // Tower A — MEP
  { id: "TA-M1", projectId: "TA", category: "MEP",      description: "Electrical Conduit & Wiring",   unit: "Rmt",  plannedQty: 45000, executedQty: 15750, rate: 68   },
  { id: "TA-M2", projectId: "TA", category: "MEP",      description: "Plumbing CPVC Pipes",           unit: "Rmt",  plannedQty: 12000, executedQty: 4200,  rate: 125  },
  { id: "TA-M3", projectId: "TA", category: "MEP",      description: "Drainage & Sanitation",         unit: "Rmt",  plannedQty: 8500,  executedQty: 2975,  rate: 98   },
  { id: "TA-M4", projectId: "TA", category: "MEP",      description: "Fire Fighting System",          unit: "Rmt",  plannedQty: 4200,  executedQty: 0,     rate: 245, remark: "Not started" },
  // Tower A — Finishing
  { id: "TA-F1", projectId: "TA", category: "Finishing", description: "Vitrified Flooring",           unit: "SqM",  plannedQty: 11200, executedQty: 0,     rate: 680  },
  { id: "TA-F2", projectId: "TA", category: "Finishing", description: "Wall Tiling (Kitchen/Bath)",   unit: "SqM",  plannedQty: 4500,  executedQty: 0,     rate: 480  },
  { id: "TA-F3", projectId: "TA", category: "Finishing", description: "Interior Paint & Putty",       unit: "SqM",  plannedQty: 32000, executedQty: 0,     rate: 55   },
  // Tower A — External
  { id: "TA-E1", projectId: "TA", category: "External",  description: "Compound Wall & Gate",         unit: "Rmt",  plannedQty: 480,   executedQty: 480,   rate: 2800, remark: "Completed" },
  { id: "TA-E2", projectId: "TA", category: "External",  description: "Internal Roads & Paving",      unit: "SqM",  plannedQty: 2400,  executedQty: 960,   rate: 360  },
  { id: "TA-E3", projectId: "TA", category: "External",  description: "Landscaping & Parking",        unit: "SqM",  plannedQty: 3600,  executedQty: 0,     rate: 280  },
  // Tower B — Civil
  { id: "TB-C1", projectId: "TB", category: "Civil",    description: "Foundation & Raft Slab",        unit: "CuM",  plannedQty: 1050,  executedQty: 1050,  rate: 4500 },
  { id: "TB-C2", projectId: "TB", category: "Civil",    description: "RCC Columns & Shear Walls",     unit: "CuM",  plannedQty: 840,   executedQty: 336,   rate: 6200 },
  { id: "TB-C3", projectId: "TB", category: "Civil",    description: "RCC Beams & Slabs",             unit: "CuM",  plannedQty: 2400,  executedQty: 720,   rate: 5600 },
  { id: "TB-C4", projectId: "TB", category: "Civil",    description: "Brick Work 230mm",              unit: "SqM",  plannedQty: 12800, executedQty: 2560,  rate: 185  },
  { id: "TB-C5", projectId: "TB", category: "Civil",    description: "Internal Plaster",              unit: "SqM",  plannedQty: 28000, executedQty: 0,     rate: 88   },
  // Tower B — MEP
  { id: "TB-M1", projectId: "TB", category: "MEP",      description: "Electrical Conduit & Wiring",   unit: "Rmt",  plannedQty: 38000, executedQty: 0,     rate: 68   },
  { id: "TB-M2", projectId: "TB", category: "MEP",      description: "Plumbing CPVC Pipes",           unit: "Rmt",  plannedQty: 10000, executedQty: 0,     rate: 125  },
  // Tower B — External
  { id: "TB-E1", projectId: "TB", category: "External",  description: "Internal Roads & Paving",      unit: "SqM",  plannedQty: 2000,  executedQty: 400,   rate: 360  },
  // Tower C — Civil
  { id: "TC-C1", projectId: "TC", category: "Civil",    description: "Foundation & Raft Slab",        unit: "CuM",  plannedQty: 900,   executedQty: 900,   rate: 4500 },
  { id: "TC-C2", projectId: "TC", category: "Civil",    description: "RCC Columns & Shear Walls",     unit: "CuM",  plannedQty: 720,   executedQty: 108,   rate: 6200 },
  { id: "TC-C3", projectId: "TC", category: "Civil",    description: "RCC Beams & Slabs",             unit: "CuM",  plannedQty: 2000,  executedQty: 200,   rate: 5600 },
  { id: "TC-C4", projectId: "TC", category: "Civil",    description: "Brick Work 230mm",              unit: "SqM",  plannedQty: 10800, executedQty: 0,     rate: 185  },
  // Tower C — MEP
  { id: "TC-M1", projectId: "TC", category: "MEP",      description: "Electrical Conduit & Wiring",   unit: "Rmt",  plannedQty: 32000, executedQty: 0,     rate: 68   },
];

// ── Site Diary ────────────────────────────────────────────────────────────────

export const mockDiary: SiteDiaryEntry[] = [
  {
    id: "D-TA-519", projectId: "TA", date: "2026-05-19", weather: "Sunny",
    tempHigh: 36, tempLow: 24, manpower: 87,
    equipmentList: ["Tower Crane ×1", "Concrete Pump ×1", "Transit Mixer ×2", "Bar Bending Machine ×2", "Vibrator ×3"],
    workDone: "RCC slab casting for Floor 10 (Flats B-03 to B-08) completed — 145 CuM of M30 poured. Curing membrane applied immediately. Brick work continued on Floor 7 East wing — 520 SqM completed. Electrical conduit laying on Floor 6 — 180 Rmt done.",
    issues: "Minor formwork displacement at column C-07 noticed during pour. Rectified immediately by site foreman. No structural impact confirmed by resident engineer.",
    engineerNotes: "Quality cube samples collected (6 Nos.) for 7-day and 28-day testing. Pre-pour checklist was 100% compliant. Structural consultant visit confirmed for 20 May. Curing period of 14 days to be strictly maintained for Floor 10 slab.",
    engineerName: "Rajiv Mehta",
    nextDayPlan: "Start shuttering for Floor 11 columns. Continue brick work Floor 7 west wing. Plumbing rough-in on Floor 5.",
  },
  {
    id: "D-TA-518", projectId: "TA", date: "2026-05-18", weather: "Partly Cloudy",
    tempHigh: 34, tempLow: 23, manpower: 82,
    equipmentList: ["Tower Crane ×1", "Concrete Pump ×1", "Transit Mixer ×3", "Vibrator ×3"],
    workDone: "Shuttering work for Floor 10 slab completed. TMT Fe-500D reinforcement laid and bound as per structural drawings. Pre-pour checklist verified and signed off by RE. Transit mixer breakdown at 14:00 caused 2-hour delay.",
    issues: "TMX-02 breakdown — concrete delivery delayed 2 hours. Spare vehicle arranged from RMC plant. Mild afternoon winds limited crane swing radius.",
    engineerNotes: "All rebar cover blocks checked — 40mm clear cover maintained throughout. 48 checklist points reviewed and cleared. Pour scheduled 07:00 tomorrow for optimal curing temperature.",
    engineerName: "Rajiv Mehta",
    nextDayPlan: "Floor 10 slab pour at 07:00 hrs. Electrical conduit on Floor 6 to continue.",
  },
  {
    id: "D-TA-516", projectId: "TA", date: "2026-05-16", weather: "Cloudy",
    tempHigh: 33, tempLow: 22, manpower: 79,
    equipmentList: ["Tower Crane ×1", "Bar Bending Machine ×2", "Transit Mixer ×1"],
    workDone: "TMT steel reinforcement for Floor 10 beams — 3.8 MT placed. Brick work Floor 7 west wing — 310 SqM. Internal plaster Floor 4 — 480 SqM. Plumbing CPVC rough-in Floor 3 completed.",
    issues: "NIL — smooth operations.",
    engineerNotes: "Steel inspection by structural consultant passed. All lap lengths and hook lengths as per drawing. Photography done for record. Monthly safety audit scheduled for 20 May — PPE compliance currently at 94%.",
    engineerName: "Rajiv Mehta",
    nextDayPlan: "Complete Floor 10 beam reinforcement. Start slab reinforcement. Safety officer visit.",
  },
  {
    id: "D-TB-519", projectId: "TB", date: "2026-05-19", weather: "Partly Cloudy",
    tempHigh: 35, tempLow: 24, manpower: 64,
    equipmentList: ["Tower Crane ×1", "Transit Mixer ×2", "Bar Bending Machine ×1"],
    workDone: "Column casting for Floor 4 (Grid A–D, Col 1–5) completed with M35 grade concrete. Brick work started on Floor 2 (4 units). Plinth protection on north side finished.",
    issues: "Wind speed exceeded 25 km/h at 16:30 — tower crane operations halted for 45 minutes per safety protocol.",
    engineerNotes: "Floor 4 structural frame nearing completion. Milestone 'Floor 4 Slab Complete' expected by 12 May — currently 7 days delayed due to material delivery lag. Recovery plan submitted to PM.",
    engineerName: "Priya Sharma",
    nextDayPlan: "Floor 5 shuttering to begin. Continue brick work Floor 2.",
  },
  {
    id: "D-TC-519", projectId: "TC", date: "2026-05-19", weather: "Sunny",
    tempHigh: 36, tempLow: 25, manpower: 42,
    equipmentList: ["Concrete Pump ×1", "Transit Mixer ×1", "Vibrator ×2"],
    workDone: "Ground Floor column casting (8 columns) with M40 grade. Foundation PCC on south block completed. Dewatering pump removed after seepage clearance confirmed.",
    issues: "NIL.",
    engineerNotes: "Structural drawings for Floor 2 received from design team. Shop drawings to be prepared and reviewed by 25 May. Foundation work 100% complete — milestone achieved 3 days ahead of schedule.",
    engineerName: "Kiran Patil",
    nextDayPlan: "Begin beam reinforcement for Ground Floor. Mark column positions for Floor 1.",
  },
];

// ── Daily Updates ─────────────────────────────────────────────────────────────

export const mockUpdates: DailyUpdate[] = [
  {
    id: "U-001", projectId: "TA", date: "2026-05-19", title: "Floor 10 Slab Cast Successfully",
    description: "145 CuM M30 concrete poured for Floor 10 slab. 3 transit mixers used continuously. Curing membrane applied immediately after finishing.",
    category: "Civil", location: "Floor 10", postedBy: "Rajiv Mehta",
    images: [{ id: "img-1", color: "#1B3A6B", label: "Pour in progress" }, { id: "img-2", color: "#2563EB", label: "After pour" }],
    likes: 4,
  },
  {
    id: "U-002", projectId: "TA", date: "2026-05-19", title: "Electrical Conduit — Floor 6 Complete",
    description: "180 Rmt of PVC conduit laid for power, lighting, and data circuits. All conduit runs checked against electrical layout drawings.",
    category: "MEP", location: "Floor 6", postedBy: "Anil Verma",
    images: [{ id: "img-3", color: "#CA8A04", label: "Conduit layout" }],
    likes: 2,
  },
  {
    id: "U-003", projectId: "TA", date: "2026-05-18", title: "Brick Work — Floor 7 East Wing",
    description: "520 SqM of 230mm brick work completed. Mix ratio 1:4 cement-sand maintained throughout. All joints raked and cleaned.",
    category: "Civil", location: "Floor 7", postedBy: "Rajiv Mehta",
    images: [{ id: "img-4", color: "#C9922A", label: "Brick work" }, { id: "img-5", color: "#92400E", label: "Joint raking" }],
    likes: 6,
  },
  {
    id: "U-004", projectId: "TA", date: "2026-05-18", title: "Monthly Safety Audit — Site Wide",
    description: "HSE audit completed. 2 minor PPE observations raised and addressed immediately. Overall site safety rating: Good (87/100). Fire extinguisher servicing completed.",
    category: "Safety", location: "Site Wide", postedBy: "HSE Officer",
    images: [{ id: "img-6", color: "#16A34A", label: "Safety check" }],
    likes: 8,
  },
  {
    id: "U-005", projectId: "TA", date: "2026-05-16", title: "Steel Reinforcement Inspection Passed",
    description: "Structural consultant inspected TMT Fe-500D reinforcement for Floor 10 beams. All lap lengths, cover blocks, and hook lengths as per drawing. Inspection certificate issued.",
    category: "Quality", location: "Floor 10", postedBy: "Structural Consultant",
    images: [{ id: "img-7", color: "#475569", label: "Steel inspection" }, { id: "img-8", color: "#334155", label: "Rebar detail" }],
    likes: 5,
  },
  {
    id: "U-006", projectId: "TA", date: "2026-05-15", title: "Internal Plaster — Floor 4 North Wing",
    description: "480 SqM single-coat gypsum plaster applied. Surface level checked at 3mm tolerance. Ready for putty and paint after 21-day curing.",
    category: "Finishing", location: "Floor 4", postedBy: "Rajiv Mehta",
    images: [{ id: "img-9", color: "#7C3AED", label: "Plaster surface" }],
    likes: 3,
  },
  {
    id: "U-007", projectId: "TB", date: "2026-05-19", title: "Floor 4 Column Casting — Tower B",
    description: "12 RCC columns (Grid A–D) cast with M35 grade concrete. Column dimensions 600×600mm as per structural drawing. Curing started.",
    category: "Civil", location: "Floor 4", postedBy: "Priya Sharma",
    images: [{ id: "img-10", color: "#1B3A6B", label: "Column pour" }],
    likes: 3,
  },
  {
    id: "U-008", projectId: "TC", date: "2026-05-19", title: "Foundation Complete — Tower C",
    description: "Raft slab and pile caps 100% complete. Dewatering removed. Foundation achieved 3 days ahead of schedule. Milestone closed.",
    category: "Civil", location: "Foundation", postedBy: "Kiran Patil",
    images: [{ id: "img-11", color: "#0F766E", label: "Foundation done" }],
    likes: 12,
  },
];

// ── Milestones ────────────────────────────────────────────────────────────────

export const mockMilestones: Milestone[] = [
  // Tower A
  { id: "M-TA-01", projectId: "TA", title: "Foundation Complete",         description: "Raft slab and pile caps up to plinth level",           targetDate: "2024-06-30", actualDate: "2024-07-05", status: "Completed",    weight: 10, daysDelayed: 5,  engineerNote: "Delayed due to monsoon onset. No structural impact." },
  { id: "M-TA-02", projectId: "TA", title: "Plinth Beam & Ground Slab",   description: "Ground floor slab ready for superstructure",           targetDate: "2024-08-31", actualDate: "2024-08-28", status: "Completed",    weight: 8  },
  { id: "M-TA-03", projectId: "TA", title: "Floor 5 Slab Complete",       description: "RCC structural frame up to Floor 5",                   targetDate: "2025-01-31", actualDate: "2025-02-10", status: "Completed",    weight: 12, daysDelayed: 10 },
  { id: "M-TA-04", projectId: "TA", title: "Floor 9 Slab Complete",       description: "RCC structural frame up to Floor 9",                   targetDate: "2025-08-31", actualDate: "2025-09-15", status: "Completed",    weight: 12, daysDelayed: 15 },
  { id: "M-TA-05", projectId: "TA", title: "Terrace Slab Complete",       description: "Full structural frame including roof slab",             targetDate: "2026-06-30", actualDate: undefined,    status: "In Progress",  weight: 15, engineerNote: "On track. Floor 10 pour done today." },
  { id: "M-TA-06", projectId: "TA", title: "MEP Rough-in Complete",       description: "All MEP first-fix before plastering",                  targetDate: "2026-10-31", actualDate: undefined,    status: "Upcoming",     weight: 10 },
  { id: "M-TA-07", projectId: "TA", title: "External Plaster & Paint",    description: "Full external finish and texture coat",                 targetDate: "2026-12-31", actualDate: undefined,    status: "Upcoming",     weight: 8  },
  { id: "M-TA-08", projectId: "TA", title: "OC & Possession Ready",       description: "Occupancy certificate and handover preparation",        targetDate: "2027-06-30", actualDate: undefined,    status: "Upcoming",     weight: 25 },
  // Tower B
  { id: "M-TB-01", projectId: "TB", title: "Foundation Complete",         description: "Raft slab and pile caps up to plinth level",           targetDate: "2024-12-31", actualDate: "2025-01-08", status: "Completed",    weight: 10 },
  { id: "M-TB-02", projectId: "TB", title: "Plinth Beam & Ground Slab",   description: "Ground floor slab ready",                              targetDate: "2025-02-28", actualDate: "2025-03-05", status: "Completed",    weight: 8  },
  { id: "M-TB-03", projectId: "TB", title: "Floor 4 Slab Complete",       description: "RCC structural frame up to Floor 4",                   targetDate: "2026-05-12", actualDate: undefined,    status: "Delayed",      weight: 12, daysDelayed: 7, engineerNote: "7 days delayed — material delivery lag from TMT supplier. Recovery plan in place." },
  { id: "M-TB-04", projectId: "TB", title: "Floor 8 Slab Complete",       description: "RCC structural frame up to Floor 8",                   targetDate: "2026-12-31", actualDate: undefined,    status: "Upcoming",     weight: 15 },
  { id: "M-TB-05", projectId: "TB", title: "OC & Possession Ready",       description: "Occupancy certificate and handover",                   targetDate: "2027-12-31", actualDate: undefined,    status: "Upcoming",     weight: 25 },
  // Tower C
  { id: "M-TC-01", projectId: "TC", title: "Foundation Complete",         description: "Raft slab and pile caps",                              targetDate: "2025-07-31", actualDate: "2025-07-28", status: "Completed",    weight: 10 },
  { id: "M-TC-02", projectId: "TC", title: "Plinth Beam & Ground Slab",   description: "Ground floor slab ready",                              targetDate: "2025-09-30", actualDate: "2025-10-05", status: "Completed",    weight: 8  },
  { id: "M-TC-03", projectId: "TC", title: "Floor 3 Slab Complete",       description: "RCC structural frame up to Floor 3",                   targetDate: "2026-07-31", actualDate: undefined,    status: "In Progress",  weight: 12, engineerNote: "Ground floor columns in progress. On schedule." },
  { id: "M-TC-04", projectId: "TC", title: "Floor 6 Slab Complete",       description: "RCC structural frame up to Floor 6",                   targetDate: "2026-12-31", actualDate: undefined,    status: "Upcoming",     weight: 12 },
  { id: "M-TC-05", projectId: "TC", title: "OC & Possession Ready",       description: "Occupancy certificate and handover",                   targetDate: "2028-03-31", actualDate: undefined,    status: "Upcoming",     weight: 25 },
];

// ── Gantt Tasks ───────────────────────────────────────────────────────────────

export const mockGantt: GanttTask[] = [
  // Tower A
  { id: "G-TA-01", projectId: "TA", title: "RCC Frame (Fl. 10–14)",     category: "Civil",    startDate: "2026-02-01", endDate: "2026-07-15", progress: 55, status: "In Progress", assignee: "Rameshwar Co." },
  { id: "G-TA-02", projectId: "TA", title: "Brick Work (Fl. 6–10)",     category: "Civil",    startDate: "2026-03-15", endDate: "2026-08-31", progress: 30, status: "In Progress", assignee: "Rameshwar Co." },
  { id: "G-TA-03", projectId: "TA", title: "Internal Plaster (Fl. 1–5)",category: "Finishing", startDate: "2026-02-01", endDate: "2026-07-31", progress: 40, status: "In Progress", assignee: "Direct" },
  { id: "G-TA-04", projectId: "TA", title: "MEP Rough-in (Fl. 1–5)",    category: "MEP",      startDate: "2026-03-01", endDate: "2026-07-31", progress: 35, status: "In Progress", assignee: "Joshi Electricals" },
  { id: "G-TA-05", projectId: "TA", title: "External Plaster",          category: "Finishing", startDate: "2026-07-01", endDate: "2026-11-30", progress: 0,  status: "Upcoming",    assignee: "TBD" },
  { id: "G-TA-06", projectId: "TA", title: "Flooring & Tiling",         category: "Finishing", startDate: "2026-09-01", endDate: "2027-02-28", progress: 0,  status: "Upcoming",    assignee: "TBD" },
  // Tower B
  { id: "G-TB-01", projectId: "TB", title: "RCC Frame (Fl. 4–8)",       category: "Civil",    startDate: "2026-04-01", endDate: "2026-12-31", progress: 15, status: "Delayed",     assignee: "Rameshwar Co." },
  { id: "G-TB-02", projectId: "TB", title: "Brick Work (Fl. 1–3)",      category: "Civil",    startDate: "2026-05-01", endDate: "2026-09-30", progress: 5,  status: "In Progress", assignee: "Rameshwar Co." },
  { id: "G-TB-03", projectId: "TB", title: "MEP Rough-in",              category: "MEP",      startDate: "2026-08-01", endDate: "2027-04-30", progress: 0,  status: "Upcoming",    assignee: "Joshi Electricals" },
  // Tower C
  { id: "G-TC-01", projectId: "TC", title: "RCC Frame (Fl. 1–4)",       category: "Civil",    startDate: "2026-04-01", endDate: "2026-10-31", progress: 10, status: "In Progress", assignee: "Rameshwar Co." },
  { id: "G-TC-02", projectId: "TC", title: "Brick Work (Fl. 1–2)",      category: "Civil",    startDate: "2026-09-01", endDate: "2027-01-31", progress: 0,  status: "Upcoming",    assignee: "Rameshwar Co." },
];
