import {
  TrendingUp, TrendingDown, Building2, Users, IndianRupee,
  Layers, ArrowUpRight, MoreHorizontal, CheckCircle2, Clock, AlertCircle
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from "recharts";

const revenueData = [
  { month: "Oct", collected: 182, target: 200 },
  { month: "Nov", collected: 215, target: 220 },
  { month: "Dec", collected: 198, target: 230 },
  { month: "Jan", collected: 267, target: 250 },
  { month: "Feb", collected: 312, target: 280 },
  { month: "Mar", collected: 289, target: 300 },
  { month: "Apr", collected: 345, target: 320 },
  { month: "May", collected: 378, target: 350 },
];

const unitMixData = [
  { name: "1 BHK", value: 24, color: "#1B3A6B" },
  { name: "2 BHK", value: 56, color: "#C9922A" },
  { name: "3 BHK", value: 30, color: "#16A34A" },
  { name: "4 BHK", value: 14, color: "#0EA5E9" },
];

const projectProgress = [
  { project: "Hari Heights", progress: 78, status: "On Track", color: "bg-green-500" },
  { project: "Shri Residency", progress: 52, status: "On Track", color: "bg-green-500" },
  { project: "Green Valley", progress: 34, status: "Delayed", color: "bg-amber-500" },
  { project: "Lakshmi Towers", progress: 91, status: "Ahead", color: "bg-blue-500" },
];

const recentActivities = [
  { icon: <CheckCircle2 size={14} className="text-green-500" />, text: "Unit B-204 booking confirmed — Suresh Nair", time: "2 min ago" },
  { icon: <IndianRupee size={14} className="text-blue-500" />, text: "₹8.5L received — Priya Sharma, A-101", time: "15 min ago" },
  { icon: <AlertCircle size={14} className="text-red-500" />, text: "Demand letter generated — Block C (12 units)", time: "1 hr ago" },
  { icon: <Clock size={14} className="text-amber-500" />, text: "Site inspection scheduled — Green Valley Phase 2", time: "2 hr ago" },
  { icon: <CheckCircle2 size={14} className="text-green-500" />, text: "Agreement registered — Unit D-508", time: "3 hr ago" },
];

const kpiCards = [
  {
    title: "Total Revenue",
    value: "₹24.8 Cr",
    change: "+18.2%",
    up: true,
    sub: "vs last quarter",
    icon: <IndianRupee size={20} />,
    bg: "bg-blue-50 dark:bg-blue-950/30",
    iconBg: "bg-primary",
    iconColor: "text-white",
  },
  {
    title: "Units Booked",
    value: "142",
    change: "+12",
    up: true,
    sub: "this month",
    icon: <Layers size={20} />,
    bg: "bg-amber-50 dark:bg-amber-950/30",
    iconBg: "bg-secondary",
    iconColor: "text-white",
  },
  {
    title: "Active Projects",
    value: "8",
    change: "+1",
    up: true,
    sub: "newly launched",
    icon: <Building2 size={20} />,
    bg: "bg-green-50 dark:bg-green-950/30",
    iconBg: "bg-success",
    iconColor: "text-white",
  },
  {
    title: "Active Customers",
    value: "1,284",
    change: "-2.1%",
    up: false,
    sub: "from last month",
    icon: <Users size={20} />,
    bg: "bg-red-50 dark:bg-red-950/30",
    iconBg: "bg-destructive",
    iconColor: "text-white",
  },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border rounded-lg p-3 shadow-xl text-xs">
        <p className="font-semibold text-foreground mb-1">{label}</p>
        {payload.map((p: any, i: number) => (
          <p key={i} style={{ color: p.color }} className="font-medium">
            {p.name}: ₹{p.value}L
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export function OverviewSection() {
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-foreground">Dashboard Overview</h1>
          <p className="text-sm text-muted-foreground mt-0.5">FY 2025–26 · All Projects · As of May 19, 2026</p>
        </div>
        <div className="flex items-center gap-2">
          <select className="text-sm bg-card border border-border rounded-lg px-3 py-1.5 text-foreground outline-none focus:border-primary transition-colors cursor-pointer">
            <option>This Financial Year</option>
            <option>Last Quarter</option>
            <option>Last Month</option>
          </select>
          <button className="flex items-center gap-1.5 bg-primary text-primary-foreground text-sm px-3 py-1.5 rounded-lg hover:opacity-90 transition-opacity font-medium">
            <ArrowUpRight size={14} /> Export
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {kpiCards.map(card => (
          <div key={card.title} className={`${card.bg} rounded-xl p-4 border border-border relative overflow-hidden`}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{card.title}</p>
                <p className="text-2xl font-bold text-foreground mt-1">{card.value}</p>
                <div className="flex items-center gap-1 mt-1.5">
                  {card.up ? (
                    <TrendingUp size={12} className="text-green-500" />
                  ) : (
                    <TrendingDown size={12} className="text-red-500" />
                  )}
                  <span className={`text-xs font-semibold ${card.up ? "text-green-600 dark:text-green-400" : "text-red-500"}`}>
                    {card.change}
                  </span>
                  <span className="text-xs text-muted-foreground">{card.sub}</span>
                </div>
              </div>
              <div className={`${card.iconBg} ${card.iconColor} w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm`}>
                {card.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Revenue Chart */}
        <div className="xl:col-span-2 bg-card border border-border rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-foreground">Revenue Collection</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Monthly collected vs target (₹ in Lakhs)</p>
            </div>
            <button className="text-muted-foreground hover:text-foreground p-1 rounded">
              <MoreHorizontal size={16} />
            </button>
          </div>
          <ResponsiveContainer width="100%" height={220} minWidth={1} minHeight={1}>
            <AreaChart data={revenueData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="blueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1B3A6B" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#1B3A6B" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="goldGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#C9922A" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#C9922A" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="target" name="Target" stroke="#C9922A" strokeWidth={2} strokeDasharray="5 3" fill="url(#goldGrad)" />
              <Area type="monotone" dataKey="collected" name="Collected" stroke="#1B3A6B" strokeWidth={2.5} fill="url(#blueGrad)" />
            </AreaChart>
          </ResponsiveContainer>
          <div className="flex items-center gap-5 mt-3">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-0.5 bg-primary rounded-full" />
              <span className="text-xs text-muted-foreground">Collected</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-0.5 bg-secondary rounded-full border-dashed" style={{ borderTop: "2px dashed #C9922A", background: "none" }} />
              <div className="w-3 h-px border-t-2 border-dashed border-secondary" />
              <span className="text-xs text-muted-foreground">Target</span>
            </div>
          </div>
        </div>

        {/* Unit Mix */}
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-foreground">Unit Mix</h3>
              <p className="text-xs text-muted-foreground mt-0.5">By configuration</p>
            </div>
            <button className="text-muted-foreground hover:text-foreground p-1 rounded">
              <MoreHorizontal size={16} />
            </button>
          </div>
          <ResponsiveContainer width="100%" height={180} minWidth={1} minHeight={1}>
            <PieChart>
              <Pie data={unitMixData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                {unitMixData.map((entry, i) => (
                  <Cell key={`cell-${i}`} fill={entry.color} stroke="none" />
                ))}
              </Pie>
              <Tooltip
                formatter={(val: any, name: any) => [`${val} units`, name]}
                contentStyle={{ borderRadius: 8, border: "1px solid var(--border)", background: "var(--card)", fontSize: 12 }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {unitMixData.map(item => (
              <div key={item.name} className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: item.color }} />
                <div>
                  <p className="text-[11px] font-semibold text-foreground">{item.name}</p>
                  <p className="text-[10px] text-muted-foreground">{item.value} units</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Project Progress + Activity */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {/* Construction Progress */}
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-foreground">Construction Progress</h3>
            <button className="text-xs text-primary font-medium hover:underline">View all</button>
          </div>
          <div className="space-y-4">
            {projectProgress.map(project => (
              <div key={project.project}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-medium text-foreground">{project.project}</span>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full
                      ${project.status === "On Track" ? "bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400" :
                        project.status === "Ahead" ? "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400" :
                        "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400"}`}>
                      {project.status}
                    </span>
                    <span className="text-sm font-bold text-foreground w-10 text-right">{project.progress}%</span>
                  </div>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${project.color}`}
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-foreground">Recent Activity</h3>
            <button className="text-xs text-primary font-medium hover:underline">View all</button>
          </div>
          <div className="space-y-0">
            {recentActivities.map((activity, i) => (
              <div key={i} className="flex gap-3 py-2.5 border-b border-border/60 last:border-0">
                <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center flex-shrink-0 mt-0.5">
                  {activity.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground leading-snug">{activity.text}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
