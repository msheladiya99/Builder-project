// ── Types ─────────────────────────────────────────────────────────────────────

export type MilestoneStatus = "completed" | "in-progress" | "delayed" | "upcoming";
export type BOQStatus       = "completed" | "in-progress" | "not-started";
export type PhotoCategory   = "foundation" | "structure" | "masonry" | "mep" | "finishing" | "site" | "inspection";
export type WeatherType     = "sunny" | "cloudy" | "rainy" | "overcast";

export interface BOQCategory {
  id: string;
  label: string;
  icon: string;
  color: string;
  bg: string;
}

export interface BOQItem {
  id: string;
  code: string;
  description: string;
  unit: string;
  quantity: number;
  rate: number;
  amount: number;           // quantity * rate
  executedQty: number;
  category: string;
  status: BOQStatus;
  remarks?: string;
}

export interface Milestone {
  id: string;
  name: string;
  shortName: string;
  tower: string;
  plannedStart: string;     // "MMM YYYY"
  plannedEnd: string;
  actualStart?: string;
  actualEnd?: string;
  progress: number;         // 0-100
  status: MilestoneStatus;
  criticalPath: boolean;
  assignee: string;
  daysDelayed?: number;
  ganttStartMonth: number;  // offset from Jan 2025 (index 0)
  ganttDuration: number;    // months
  notes?: string;
  dependencies?: string[];
}

export interface DiaryEntry {
  id: string;
  date: string;
  displayDate: string;
  weather: WeatherType;
  temperature: string;
  workers: { trade: string; count: number }[];
  workDone: string[];
  materialsReceived: string[];
  issues: string[];
  engineerNote: string;
  engineer: string;
  designation: string;
  photoCount: number;
  qualityChecks: { item: string; status: "pass" | "fail" | "pending" }[];
}

export interface DailyUpdate {
  id: string;
  date: string;
  displayDate: string;
  overallProgress: number;
  delta: number;
  headline: string;
  tasks: string[];
  completed: string[];
  issues: string[];
  engineerNote: string;
  engineer: string;
  workerCount: number;
  weather: WeatherType;
  photos: { id: string; color: string; label: string; category: PhotoCategory }[];
  materials: string[];
}

export interface SitePhoto {
  id: string;
  label: string;
  date: string;
  category: PhotoCategory;
  color: string;
  engineer: string;
  tower: string;
  floor?: number;
  tag?: string;
}

export interface EngineerNote {
  id: string;
  date: string;
  author: string;
  designation: string;
  content: string;
  category: "quality" | "safety" | "progress" | "material" | "instruction";
  priority: "critical" | "high" | "medium" | "low";
  status: "open" | "resolved" | "acknowledged";
  actionRequired: boolean;
  relatedMilestone?: string;
}

// ── Config ────────────────────────────────────────────────────────────────────

export const BOQ_CATEGORIES: BOQCategory[] = [
  { id: "all",        label: "All",              icon: "📋", color: "#1B3A6B", bg: "#EFF6FF" },
  { id: "civil",      label: "Civil & Structure", icon: "🏗️", color: "#1B3A6B", bg: "#EFF6FF" },
  { id: "masonry",    label: "Masonry",           icon: "🧱", color: "#C9922A", bg: "#FEF3C7" },
  { id: "plastering", label: "Plastering",        icon: "🪣", color: "#0D9488", bg: "#CCFBF1" },
  { id: "flooring",   label: "Flooring",          icon: "⬜", color: "#7C3AED", bg: "#EDE9FE" },
  { id: "mep",        label: "MEP",               icon: "⚡", color: "#EF4444", bg: "#FEF2F2" },
  { id: "finishing",  label: "Finishing",         icon: "🎨", color: "#F97316", bg: "#FFF7ED" },
];

export const WEATHER_CFG: Record<WeatherType, { icon: string; label: string; color: string }> = {
  sunny:    { icon: "☀️", label: "Sunny",    color: "#F59E0B" },
  cloudy:   { icon: "⛅", label: "Cloudy",   color: "#64748B" },
  rainy:    { icon: "🌧️", label: "Rainy",    color: "#3B82F6" },
  overcast: { icon: "☁️", label: "Overcast", color: "#94A3B8" },
};

export const STATUS_CFG: Record<MilestoneStatus, { label: string; color: string; bg: string; border: string }> = {
  completed:   { label: "Completed",   color: "#22C55E", bg: "#F0FDF4", border: "#86EFAC" },
  "in-progress": { label: "In Progress", color: "#3B82F6", bg: "#EFF6FF", border: "#93C5FD" },
  delayed:     { label: "Delayed",     color: "#EF4444", bg: "#FEF2F2", border: "#FECACA" },
  upcoming:    { label: "Upcoming",    color: "#94A3B8", bg: "#F8FAFC", border: "#E2E8F0" },
};

export const NOTE_CATEGORY_CFG = {
  quality:     { color: "#1B3A6B", bg: "#EFF6FF", label: "Quality" },
  safety:      { color: "#EF4444", bg: "#FEF2F2", label: "Safety"  },
  progress:    { color: "#22C55E", bg: "#F0FDF4", label: "Progress"},
  material:    { color: "#C9922A", bg: "#FEF3C7", label: "Material"},
  instruction: { color: "#7C3AED", bg: "#EDE9FE", label: "Instruction"},
};

// ── BOQ Data ─────────────────────────────────────────────────────────────────

export const boqItems: BOQItem[] = [
  // Civil & Structure
  { id: "C001", code: "CS-001", description: "Excavation & Earthwork (Hard Soil)",  unit: "cum",   quantity: 2400,  rate: 280,    amount: 672000,    executedQty: 2400,  category: "civil",      status: "completed",   remarks: "As per drawing revision 3" },
  { id: "C002", code: "CS-002", description: "PCC M15 Grade Concrete",             unit: "cum",   quantity: 180,   rate: 4200,   amount: 756000,    executedQty: 180,   category: "civil",      status: "completed"   },
  { id: "C003", code: "CS-003", description: "RCC M30 Grade — Columns, Beams, Slabs", unit: "cum", quantity: 3800, rate: 6800,   amount: 25840000,  executedQty: 2736,  category: "civil",      status: "in-progress", remarks: "Floor 12-16 pending" },
  { id: "C004", code: "CS-004", description: "Reinforcement Steel Fe500D",          unit: "MT",    quantity: 450,   rate: 65000,  amount: 29250000,  executedQty: 324,   category: "civil",      status: "in-progress", remarks: "Rate revision pending for balance" },
  { id: "C005", code: "CS-005", description: "Formwork / Shuttering (Steel)",       unit: "sqm",   quantity: 18000, rate: 380,    amount: 6840000,   executedQty: 13500, category: "civil",      status: "in-progress" },
  { id: "C006", code: "CS-006", description: "Structural Steel (Staircase)",        unit: "MT",    quantity: 32,    rate: 72000,  amount: 2304000,   executedQty: 32,    category: "civil",      status: "completed"   },
  // Masonry
  { id: "M001", code: "MS-001", description: "230mm Brick Masonry (External Walls)", unit: "cum",  quantity: 2800,  rate: 1800,   amount: 5040000,   executedQty: 1680,  category: "masonry",    status: "in-progress" },
  { id: "M002", code: "MS-002", description: "115mm Brick Partition Walls",         unit: "cum",   quantity: 1200,  rate: 1650,   amount: 1980000,   executedQty: 540,   category: "masonry",    status: "in-progress", remarks: "Proceeding floor by floor" },
  { id: "M003", code: "MS-003", description: "AAC Block Masonry (Internal)",        unit: "cum",   quantity: 900,   rate: 2100,   amount: 1890000,   executedQty: 270,   category: "masonry",    status: "in-progress" },
  // Plastering
  { id: "P001", code: "PL-001", description: "External Plastering 20mm (CM 1:4)",  unit: "sqm",   quantity: 12000, rate: 285,    amount: 3420000,   executedQty: 2400,  category: "plastering", status: "in-progress", remarks: "Scaffold requirement" },
  { id: "P002", code: "PL-002", description: "Internal Plastering 12mm (CM 1:6)",  unit: "sqm",   quantity: 28000, rate: 195,    amount: 5460000,   executedQty: 9800,  category: "plastering", status: "in-progress" },
  { id: "P003", code: "PL-003", description: "Ceiling Plaster 6mm",                unit: "sqm",   quantity: 14000, rate: 220,    amount: 3080000,   executedQty: 2100,  category: "plastering", status: "in-progress" },
  { id: "P004", code: "PL-004", description: "Waterproofing — Terrace & Toilet",   unit: "sqm",   quantity: 3800,  rate: 450,    amount: 1710000,   executedQty: 0,     category: "plastering", status: "not-started" },
  // Flooring
  { id: "F001", code: "FL-001", description: "Vitrified Tiles 800×800 (Rooms)",    unit: "sqm",   quantity: 8500,  rate: 680,    amount: 5780000,   executedQty: 0,     category: "flooring",   status: "not-started" },
  { id: "F002", code: "FL-002", description: "Anti-skid Tiles (Toilets & Bath)",   unit: "sqm",   quantity: 1200,  rate: 720,    amount: 864000,    executedQty: 0,     category: "flooring",   status: "not-started" },
  { id: "F003", code: "FL-003", description: "Granite Flooring (Lobby & Corridor)",unit: "sqm",   quantity: 400,   rate: 1800,   amount: 720000,    executedQty: 0,     category: "flooring",   status: "not-started" },
  { id: "F004", code: "FL-004", description: "Kota Stone (Staircase)",             unit: "sqm",   quantity: 620,   rate: 950,    amount: 589000,    executedQty: 0,     category: "flooring",   status: "not-started" },
  // MEP
  { id: "E001", code: "EP-001", description: "Electrical Conduit & Wiring",        unit: "lot",   quantity: 1,     rate: 4200000,amount: 4200000,   executedQty: 0.15,  category: "mep",        status: "in-progress", remarks: "Sleeve work in progress" },
  { id: "E002", code: "EP-002", description: "Distribution Boards & Switchgear",   unit: "lot",   quantity: 1,     rate: 1800000,amount: 1800000,   executedQty: 0.10,  category: "mep",        status: "in-progress" },
  { id: "E003", code: "EP-003", description: "Sanitary Fixtures & CP Fittings",    unit: "lot",   quantity: 1,     rate: 2800000,amount: 2800000,   executedQty: 0.05,  category: "mep",        status: "not-started" },
  { id: "E004", code: "EP-004", description: "Water Supply CPVC Pipework",         unit: "rmt",   quantity: 8500,  rate: 320,    amount: 2720000,   executedQty: 1700,  category: "mep",        status: "in-progress" },
  { id: "E005", code: "EP-005", description: "Drainage & Sewage uPVC",             unit: "rmt",   quantity: 6200,  rate: 290,    amount: 1798000,   executedQty: 1550,  category: "mep",        status: "in-progress" },
  { id: "E006", code: "EP-006", description: "Fire Fighting System",               unit: "lot",   quantity: 1,     rate: 3500000,amount: 3500000,   executedQty: 0,     category: "mep",        status: "not-started" },
  // Finishing
  { id: "FN01", code: "FN-001", description: "Gypsum False Ceiling (Drawing rooms)",unit: "sqm",  quantity: 6200,  rate: 480,    amount: 2976000,   executedQty: 0,     category: "finishing",  status: "not-started" },
  { id: "FN02", code: "FN-002", description: "Interior Paint — 2 coats + primer",  unit: "sqm",   quantity: 42000, rate: 85,     amount: 3570000,   executedQty: 0,     category: "finishing",  status: "not-started" },
  { id: "FN03", code: "FN-003", description: "Exterior Texture Paint",             unit: "sqm",   quantity: 18000, rate: 140,    amount: 2520000,   executedQty: 0,     category: "finishing",  status: "not-started" },
  { id: "FN04", code: "FN-004", description: "UPVC Windows & Sliding Doors",       unit: "sqm",   quantity: 2800,  rate: 3200,   amount: 8960000,   executedQty: 1120,  category: "finishing",  status: "in-progress", remarks: "40% installed — upper floors pending" },
  { id: "FN05", code: "FN-005", description: "Main Entry Door (SS Frame + Panel)", unit: "nos",   quantity: 120,   rate: 18500,  amount: 2220000,   executedQty: 0,     category: "finishing",  status: "not-started" },
];

// ── Milestones ────────────────────────────────────────────────────────────────

export const milestones: Milestone[] = [
  {
    id: "MS01", name: "Design Finalisation & Approvals", shortName: "Design & Approvals",
    tower: "All", plannedStart: "Jan 2025", plannedEnd: "Mar 2025",
    actualStart: "Jan 2025", actualEnd: "Mar 2025",
    progress: 100, status: "completed", criticalPath: false,
    assignee: "Ar. Priya Desai", ganttStartMonth: 0, ganttDuration: 3,
    notes: "All municipal approvals received. RERA registration completed.",
  },
  {
    id: "MS02", name: "Excavation & Foundation Work", shortName: "Foundation",
    tower: "Tower A & B", plannedStart: "Feb 2025", plannedEnd: "May 2025",
    actualStart: "Feb 2025", actualEnd: "May 2025",
    progress: 100, status: "completed", criticalPath: true,
    assignee: "Er. Ramesh Yadav", ganttStartMonth: 1, ganttDuration: 4,
    notes: "Hard rock encountered at 3.2m — blasting required. Additional cost ₹4.8L approved.",
  },
  {
    id: "MS03", name: "Plinth Beam & Ground Floor Slab", shortName: "Plinth & Ground",
    tower: "Tower A & B", plannedStart: "Apr 2025", plannedEnd: "Jun 2025",
    actualStart: "Apr 2025", actualEnd: "Jun 2025",
    progress: 100, status: "completed", criticalPath: true,
    assignee: "Er. Suresh Kumar", ganttStartMonth: 3, ganttDuration: 3,
  },
  {
    id: "MS04", name: "RCC Structure — Floors 1 to 5", shortName: "Structure F1–5",
    tower: "Tower A", plannedStart: "Jun 2025", plannedEnd: "Oct 2025",
    actualStart: "Jun 2025", actualEnd: "Oct 2025",
    progress: 100, status: "completed", criticalPath: true,
    assignee: "Er. Kiran Patil", ganttStartMonth: 5, ganttDuration: 5,
    notes: "Concrete cube test results — all satisfactory. M30 grade maintained.",
  },
  {
    id: "MS05", name: "RCC Structure — Floors 6 to 10", shortName: "Structure F6–10",
    tower: "Tower A", plannedStart: "Sep 2025", plannedEnd: "Jan 2026",
    actualStart: "Sep 2025", actualEnd: "Jan 2026",
    progress: 100, status: "completed", criticalPath: true,
    assignee: "Er. Kiran Patil", ganttStartMonth: 8, ganttDuration: 5,
  },
  {
    id: "MS06", name: "RCC Structure — Floors 11 to 16", shortName: "Structure F11–16",
    tower: "Tower A", plannedStart: "Jan 2026", plannedEnd: "Apr 2026",
    actualStart: "Jan 2026",
    progress: 72, status: "delayed", criticalPath: true, daysDelayed: 23,
    assignee: "Er. Kiran Patil", ganttStartMonth: 12, ganttDuration: 5,
    notes: "DELAYED: Labour shortage and monsoon impact. Floor 14 slab casting pending.",
    dependencies: ["MS05"],
  },
  {
    id: "MS07", name: "Masonry Work — All Floors", shortName: "Masonry",
    tower: "Tower A", plannedStart: "Oct 2025", plannedEnd: "Jun 2026",
    actualStart: "Oct 2025",
    progress: 60, status: "in-progress", criticalPath: false,
    assignee: "Er. Dinesh Thakur", ganttStartMonth: 9, ganttDuration: 9,
    notes: "Proceeding floor by floor. Floors 1-8 complete.",
  },
  {
    id: "MS08", name: "External Plastering & Waterproofing", shortName: "Ext. Plastering",
    tower: "Tower A", plannedStart: "Mar 2026", plannedEnd: "Jul 2026",
    actualStart: "Mar 2026",
    progress: 20, status: "in-progress", criticalPath: false,
    assignee: "Er. Arun Verma", ganttStartMonth: 14, ganttDuration: 5,
    notes: "Scaffold erected for lower floors. Upper floors pending structure.",
  },
  {
    id: "MS09", name: "MEP — Electrical Works", shortName: "Electrical",
    tower: "Tower A", plannedStart: "Apr 2026", plannedEnd: "Oct 2026",
    actualStart: "Apr 2026",
    progress: 15, status: "in-progress", criticalPath: true,
    assignee: "Er. Raju Mishra", ganttStartMonth: 15, ganttDuration: 7,
    notes: "Conduit sleeve work in progress. Material delivery schedule confirmed.",
    dependencies: ["MS07"],
  },
  {
    id: "MS10", name: "MEP — Plumbing & Sanitation", shortName: "Plumbing",
    tower: "Tower A", plannedStart: "Apr 2026", plannedEnd: "Sep 2026",
    actualStart: "Apr 2026",
    progress: 18, status: "in-progress", criticalPath: false,
    assignee: "Er. Keshav Singh", ganttStartMonth: 15, ganttDuration: 6,
    dependencies: ["MS07"],
  },
  {
    id: "MS11", name: "Internal Flooring & Tiling", shortName: "Flooring",
    tower: "Tower A", plannedStart: "Aug 2026", plannedEnd: "Nov 2026",
    progress: 0, status: "upcoming", criticalPath: false,
    assignee: "TBD", ganttStartMonth: 19, ganttDuration: 4,
    dependencies: ["MS07", "MS10"],
  },
  {
    id: "MS12", name: "Interior Finishing & Painting", shortName: "Int. Finishing",
    tower: "Tower A", plannedStart: "Sep 2026", plannedEnd: "Nov 2026",
    progress: 0, status: "upcoming", criticalPath: true,
    assignee: "TBD", ganttStartMonth: 20, ganttDuration: 3,
    dependencies: ["MS11"],
  },
  {
    id: "MS13", name: "External Development & Landscaping", shortName: "External Dev.",
    tower: "Site", plannedStart: "Sep 2026", plannedEnd: "Nov 2026",
    progress: 0, status: "upcoming", criticalPath: false,
    assignee: "TBD", ganttStartMonth: 20, ganttDuration: 3,
  },
  {
    id: "MS14", name: "Testing, Commissioning & OC", shortName: "Testing & OC",
    tower: "All", plannedStart: "Nov 2026", plannedEnd: "Dec 2026",
    progress: 0, status: "upcoming", criticalPath: true,
    assignee: "Er. Suresh Kumar", ganttStartMonth: 22, ganttDuration: 2,
    dependencies: ["MS09", "MS12"],
  },
  {
    id: "MS15", name: "Possession to Owners", shortName: "Possession",
    tower: "All", plannedStart: "Dec 2026", plannedEnd: "Dec 2026",
    progress: 0, status: "upcoming", criticalPath: true,
    assignee: "Management", ganttStartMonth: 23, ganttDuration: 1,
    dependencies: ["MS14"],
  },
];

// ── Site Diary Entries ─────────────────────────────────────────────────────────

export const diaryEntries: DiaryEntry[] = [
  {
    id: "D001", date: "2026-05-19", displayDate: "Mon, 19 May 2026",
    weather: "sunny", temperature: "34°C",
    workers: [
      { trade: "Mason",       count: 22 },
      { trade: "Carpenter",   count: 14 },
      { trade: "Helper",      count: 30 },
      { trade: "Electrician", count: 8  },
      { trade: "Plumber",     count: 6  },
    ],
    workDone: [
      "RCC column casting completed at Floor 14 — Grid C2 to C8",
      "Masonry work on Floor 9 — 14 walls completed",
      "Electrical conduit laying on Floors 5 & 6",
      "External scaffold erected up to Floor 7 — east face",
    ],
    materialsReceived: [
      "TMT Steel Fe500D — 4.2 MT (DO: 2026-0519-01)",
      "OPC Cement 53 Grade — 120 bags (DO: 2026-0519-02)",
    ],
    issues: [
      "Crane #2 breakdown — downtime 3 hours. Maintenance team called.",
      "Concrete mixer water supply disruption — 1 hour stoppage.",
    ],
    engineerNote: "Overall progress satisfactory despite crane breakdown. Floor 14 slab shuttering to be completed by 21 May for casting on 22 May. Ensure cube testing samples are labelled correctly per IS 516.",
    engineer: "Er. Kiran Patil",
    designation: "Site Engineer — Structural",
    photoCount: 8,
    qualityChecks: [
      { item: "Column Rebar cover check F14",       status: "pass"    },
      { item: "Masonry mortar mix ratio F9",        status: "pass"    },
      { item: "Electrical conduit dia check F5-F6", status: "pending" },
      { item: "Shuttering alignment F14",           status: "fail"    },
    ],
  },
  {
    id: "D002", date: "2026-05-18", displayDate: "Sun, 18 May 2026",
    weather: "cloudy", temperature: "31°C",
    workers: [
      { trade: "Mason",    count: 15 },
      { trade: "Helper",   count: 18 },
      { trade: "Plumber",  count: 4  },
    ],
    workDone: [
      "Masonry work continued on Floor 9 — weekend batch",
      "Plumbing rough-in on Floors 3 & 4 — flats 3A to 3D",
    ],
    materialsReceived: [],
    issues: ["Sunday half-day — reduced workforce"],
    engineerNote: "Sunday operations limited to non-concrete work. Masonry and plumbing rough-in proceeded. All PPE compliance checked — 2 workers without helmets warned.",
    engineer: "Er. Suresh Kumar",
    designation: "Project Manager",
    photoCount: 4,
    qualityChecks: [
      { item: "PPE compliance check",     status: "pass" },
      { item: "Masonry vertical plumb F9",status: "pass" },
    ],
  },
  {
    id: "D003", date: "2026-05-17", displayDate: "Sat, 17 May 2026",
    weather: "rainy", temperature: "27°C",
    workers: [
      { trade: "Mason",       count: 8  },
      { trade: "Carpenter",   count: 12 },
      { trade: "Helper",      count: 14 },
    ],
    workDone: [
      "Shuttering work for Floor 14 slabs — grid rows A to D",
      "Reduced operations due to rain — morning session only",
    ],
    materialsReceived: [
      "Shuttering plywood 18mm — 40 sheets",
    ],
    issues: [
      "Heavy rain from 2 PM — work suspended for safety",
      "Water logging in basement — pumps activated",
    ],
    engineerNote: "Rain halted operations at 14:00 hrs. Shuttering work partially complete — remaining grids E to H to be done on 19 May (Monday). Material stored under cover. Basement pump running continuously.",
    engineer: "Er. Kiran Patil",
    designation: "Site Engineer — Structural",
    photoCount: 3,
    qualityChecks: [
      { item: "Material storage cover check", status: "pass" },
    ],
  },
];

// ── Daily Updates ─────────────────────────────────────────────────────────────

export const dailyUpdates: DailyUpdate[] = [
  {
    id: "U001", date: "2026-05-19", displayDate: "Today, 19 May",
    overallProgress: 68, delta: 0.3,
    headline: "Floor 14 columns cast — masonry advancing on 9th floor",
    tasks: ["RCC Column Casting F14", "Masonry F9 walls", "Electrical conduit F5-F6", "Scaffold east face"],
    completed: ["RCC Column Casting F14 — Grid C2-C8", "Scaffold east face F1-F7"],
    issues: ["Crane #2 breakdown (3h downtime)", "Concrete mixer stoppage (1h)"],
    engineerNote: "Good progress overall. Crane issue resolved by 2 PM. On track for F14 slab on 22 May.",
    engineer: "Er. Kiran Patil",
    workerCount: 80, weather: "sunny",
    photos: [
      { id: "p001", color: "#1B3A6B", label: "F14 Column Casting",  category: "structure"   },
      { id: "p002", color: "#374151", label: "F9 Masonry East Wall", category: "masonry"     },
      { id: "p003", color: "#1e3a5f", label: "Conduit Layout F5",   category: "mep"          },
      { id: "p004", color: "#065f46", label: "Scaffold East Face",  category: "site"         },
    ],
    materials: ["TMT Steel 4.2 MT", "Cement 120 bags"],
  },
  {
    id: "U002", date: "2026-05-16", displayDate: "Fri, 16 May",
    overallProgress: 67.7, delta: 0.5,
    headline: "Concrete cast on F13 — 45m³ poured, cube tests taken",
    tasks: ["RCC Slab F13 casting", "Masonry F8 completion", "Plumbing F3-F4"],
    completed: ["RCC F13 Slab — full casting complete", "Masonry F8 — all walls done"],
    issues: [],
    engineerNote: "Excellent day — F13 slab fully cast. Cube test samples taken for 3d, 7d, and 28d testing. F8 masonry complete — ready for plastering.",
    engineer: "Er. Kiran Patil",
    workerCount: 95, weather: "sunny",
    photos: [
      { id: "p005", color: "#1B3A6B", label: "F13 Slab Casting",   category: "structure" },
      { id: "p006", color: "#7C3AED", label: "Cube Test Sampling",  category: "inspection"},
      { id: "p007", color: "#C9922A", label: "F8 Masonry Done",     category: "masonry"   },
    ],
    materials: ["Concrete M30 — 45m³ (RMC)"],
  },
  {
    id: "U003", date: "2026-05-15", displayDate: "Thu, 15 May",
    overallProgress: 67.2, delta: 0.2,
    headline: "F13 shuttering complete — reinforcement check passed",
    tasks: ["F13 shuttering", "Rebar placement F13", "External plaster F4"],
    completed: ["F13 shuttering — all grids", "Rebar check passed (QC signed)"],
    issues: ["Steel delivery delayed by 2 hours"],
    engineerNote: "Shuttering for F13 complete. Cover blocks placed. Third-party QC inspection for rebar done — all compliant. Ready for casting tomorrow.",
    engineer: "Er. Suresh Kumar",
    workerCount: 88, weather: "overcast",
    photos: [
      { id: "p008", color: "#374151", label: "F13 Shuttering",      category: "structure" },
      { id: "p009", color: "#0D9488", label: "Rebar QC Inspection", category: "inspection"},
    ],
    materials: ["Binding Wire 80 kg", "Cover blocks 2000 nos"],
  },
  {
    id: "U004", date: "2026-05-14", displayDate: "Wed, 14 May",
    overallProgress: 67.0, delta: 0.4,
    headline: "Electrical rough-in advancing — 6 flats wired on F5",
    tasks: ["Electrical conduit F5-F6", "Masonry F8", "Window frames F1-F5"],
    completed: ["UPVC window frames F1-F4 installed — 48 units"],
    issues: ["Shuttering alignment issue F13 — corrected before casting"],
    engineerNote: "Electrical team making good pace. Window contractor completed F1-F4. F13 alignment issue detected and corrected before day end.",
    engineer: "Er. Raju Mishra",
    workerCount: 82, weather: "cloudy",
    photos: [
      { id: "p010", color: "#F97316", label: "UPVC Windows F1-F4", category: "finishing" },
      { id: "p011", color: "#1B3A6B", label: "Conduit Trench F5",  category: "mep"      },
    ],
    materials: ["UPVC window frames 24 units", "Electrical conduit 200 rmt"],
  },
];

// ── Site Photos ────────────────────────────────────────────────────────────────

export const sitePhotos: SitePhoto[] = [
  { id: "PH01", label: "F14 Column Casting — Grid C",  date: "19 May 2026", category: "structure",   color: "#1B3A6B", engineer: "Er. Kiran Patil",   tower: "Tower A", floor: 14, tag: "RCC" },
  { id: "PH02", label: "F9 Masonry East Wall Progress",date: "19 May 2026", category: "masonry",     color: "#78350F", engineer: "Er. Kiran Patil",   tower: "Tower A", floor: 9  },
  { id: "PH03", label: "Electrical Conduit Layout F5", date: "19 May 2026", category: "mep",         color: "#1D4ED8", engineer: "Er. Raju Mishra",   tower: "Tower A", floor: 5  },
  { id: "PH04", label: "East Face Scaffold Erected",   date: "19 May 2026", category: "site",        color: "#065F46", engineer: "Er. Suresh Kumar",  tower: "Tower A"          },
  { id: "PH05", label: "F13 Full Slab Casting",        date: "16 May 2026", category: "structure",   color: "#0F172A", engineer: "Er. Kiran Patil",   tower: "Tower A", floor: 13, tag: "Cast" },
  { id: "PH06", label: "Cube Test Sampling F13",       date: "16 May 2026", category: "inspection",  color: "#7C3AED", engineer: "Er. Suresh Kumar",  tower: "Tower A", floor: 13, tag: "QC" },
  { id: "PH07", label: "F8 Masonry Completion",        date: "16 May 2026", category: "masonry",     color: "#92400E", engineer: "Er. Dinesh Thakur", tower: "Tower A", floor: 8  },
  { id: "PH08", label: "F13 Shuttering Overview",      date: "15 May 2026", category: "structure",   color: "#1F2937", engineer: "Er. Suresh Kumar",  tower: "Tower A", floor: 13 },
  { id: "PH09", label: "Rebar QC Inspection F13",      date: "15 May 2026", category: "inspection",  color: "#0D9488", engineer: "QC Team",            tower: "Tower A", floor: 13, tag: "Passed" },
  { id: "PH10", label: "UPVC Windows F1-F4 Installed", date: "14 May 2026", category: "finishing",   color: "#C9922A", engineer: "Er. Arun Verma",    tower: "Tower A", floor: 3  },
  { id: "PH11", label: "Foundation Overview Aerial",   date: "01 Mar 2025", category: "foundation",  color: "#374151", engineer: "Er. Suresh Kumar",  tower: "Tower A"           },
  { id: "PH12", label: "Plinth Beam Completed",        date: "15 May 2025", category: "foundation",  color: "#4B5563", engineer: "Er. Kiran Patil",   tower: "Tower A"           },
  { id: "PH13", label: "External Plaster Floor 3",     date: "10 May 2026", category: "finishing",   color: "#B45309", engineer: "Er. Arun Verma",    tower: "Tower A", floor: 3  },
  { id: "PH14", label: "Site Safety Inspection",       date: "12 May 2026", category: "inspection",  color: "#EF4444", engineer: "Safety Officer",     tower: "All"               },
  { id: "PH15", label: "Plumbing Rough-in F4",         date: "18 May 2026", category: "mep",         color: "#2563EB", engineer: "Er. Keshav Singh",  tower: "Tower A", floor: 4  },
];

// ── Engineer Notes ─────────────────────────────────────────────────────────────

export const engineerNotes: EngineerNote[] = [
  {
    id: "EN001", date: "19 May 2026",
    author: "Er. Kiran Patil", designation: "Site Engineer — Structural",
    content: "Crane #2 hydraulic issue — minor oil leak in boom cylinder. Maintenance contractor engaged. Crane to be back by 20 May EOD. Use Crane #1 for all critical lifts in the interim. Do not use Crane #2 until clearance.",
    category: "safety", priority: "critical", status: "open", actionRequired: true,
    relatedMilestone: "MS06",
  },
  {
    id: "EN002", date: "19 May 2026",
    author: "Er. Suresh Kumar", designation: "Project Manager",
    content: "Floor 14 shuttering alignment failed initial check — 12mm deviation at grid E. Corrective props placed. Must re-check alignment before concrete pour scheduled for 22 May. QC sign-off mandatory.",
    category: "quality", priority: "high", status: "open", actionRequired: true,
    relatedMilestone: "MS06",
  },
  {
    id: "EN003", date: "18 May 2026",
    author: "Safety Officer", designation: "HSE In-charge",
    content: "Two workers (W-0342, W-0519) observed without helmets at Floor 9 masonry zone. First warning issued. If repeated, contractor Sharma & Co. will be penalized ₹5,000 per incident per our contract clause 8.4.",
    category: "safety", priority: "high", status: "acknowledged", actionRequired: false,
  },
  {
    id: "EN004", date: "16 May 2026",
    author: "Er. Kiran Patil", designation: "Site Engineer — Structural",
    content: "F13 slab cube test samples collected: 3 sets (6 cubes each). Labelled F13/M30/19-05-26. Samples sent to NABL lab. Expected 7-day result by 23 May. Ensure testing report is filed in quality register.",
    category: "quality", priority: "medium", status: "open", actionRequired: false,
    relatedMilestone: "MS06",
  },
  {
    id: "EN005", date: "15 May 2026",
    author: "Er. Raju Mishra", designation: "Electrical Engineer",
    content: "Coordinate with civil team — conduit sleeves for Floor 15 must be placed before slab shuttering. Critical that electrical team marks positions before carpenter arrives. Schedule meeting for 20 May morning.",
    category: "instruction", priority: "high", status: "open", actionRequired: true,
    relatedMilestone: "MS09",
  },
  {
    id: "EN006", date: "14 May 2026",
    author: "Er. Arun Verma", designation: "Finishing Engineer",
    content: "UPVC window contractor has confirmed delivery schedule for upper floors. Frames for F5-F8 arriving 25 May. Storage area near gate 2 to be cleared. Ensure frames are not stacked more than 3 layers.",
    category: "material", priority: "medium", status: "acknowledged", actionRequired: false,
    relatedMilestone: "MS12",
  },
  {
    id: "EN007", date: "13 May 2026",
    author: "Er. Suresh Kumar", designation: "Project Manager",
    content: "Project delay of 23 days on MS06 (F11-16 structure) will cascade to MEP and finishing. Recovery plan required: extend daily working hours to 7 AM - 7 PM on weekdays and add Saturday as full working day. Confirm with contractors by 21 May.",
    category: "progress", priority: "critical", status: "open", actionRequired: true,
    relatedMilestone: "MS06",
  },
];

// ── Summary Calculations ───────────────────────────────────────────────────────

export function getBOQSummary() {
  const totalAmt    = boqItems.reduce((s, i) => s + i.amount, 0);
  const executedAmt = boqItems.reduce((s, i) => {
    if (i.unit === "lot") return s + (i.amount * i.executedQty);
    return s + (i.executedQty * i.rate);
  }, 0);
  const completedCount   = boqItems.filter(i => i.status === "completed").length;
  const inProgressCount  = boqItems.filter(i => i.status === "in-progress").length;
  const notStartedCount  = boqItems.filter(i => i.status === "not-started").length;
  return { totalAmt, executedAmt, completedCount, inProgressCount, notStartedCount, totalItems: boqItems.length };
}

export function getOverallProgress(): number {
  const weights: Record<MilestoneStatus, number> = { completed: 1, "in-progress": 0.5, delayed: 0.3, upcoming: 0 };
  const weighted = milestones.reduce((s, m) => s + (m.progress / 100), 0);
  return Math.round((weighted / milestones.length) * 100);
}

export function getDelayedMilestones() {
  return milestones.filter(m => m.status === "delayed");
}

export function fmtINR(n: number): string {
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(2)} Cr`;
  if (n >= 100000)   return `₹${(n / 100000).toFixed(2)} L`;
  return `₹${n.toLocaleString("en-IN")}`;
}

// Gantt month labels (Jan 2025 = 0 … Dec 2026 = 23)
export const GANTT_MONTHS = [
  "Jan 25","Feb 25","Mar 25","Apr 25","May 25","Jun 25",
  "Jul 25","Aug 25","Sep 25","Oct 25","Nov 25","Dec 25",
  "Jan 26","Feb 26","Mar 26","Apr 26","May 26","Jun 26",
  "Jul 26","Aug 26","Sep 26","Oct 26","Nov 26","Dec 26",
];

// Today = May 2026 = index 16
export const GANTT_TODAY_INDEX = 16;
export const GANTT_COL_WIDTH   = 56; // px per month
