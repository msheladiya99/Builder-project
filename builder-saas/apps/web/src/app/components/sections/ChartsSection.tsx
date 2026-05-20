import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadialBarChart, RadialBar
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card";

const monthly = [
  { month: "Oct", bookings: 18, revenue: 182, leads: 64 },
  { month: "Nov", bookings: 24, revenue: 215, leads: 78 },
  { month: "Dec", bookings: 21, revenue: 198, leads: 55 },
  { month: "Jan", bookings: 31, revenue: 267, leads: 92 },
  { month: "Feb", bookings: 38, revenue: 312, leads: 108 },
  { month: "Mar", bookings: 29, revenue: 289, leads: 87 },
  { month: "Apr", bookings: 42, revenue: 345, leads: 124 },
  { month: "May", bookings: 45, revenue: 378, leads: 136 },
];

const projectRevenue = [
  { project: "Hari Hts", q1: 420, q2: 380, q3: 510, q4: 340 },
  { project: "Shri Res", q1: 280, q2: 320, q3: 290, q4: 410 },
  { project: "Grn Vly", q1: 150, q2: 210, q3: 180, q4: 220 },
  { project: "Lksh Twrs", q1: 380, q2: 450, q3: 520, q4: 480 },
];

const unitMix = [
  { name: "1 BHK", value: 24, color: "#EEF3FF" },
  { name: "2 BHK", value: 56, color: "#C9922A" },
  { name: "3 BHK", value: 30, color: "#1B3A6B" },
  { name: "4 BHK+", value: 14, color: "#16A34A" },
];

const collectionHealth = [
  { name: "On Time", value: 68, fill: "#16A34A" },
  { name: "Overdue", value: 18, fill: "#DC2626" },
  { name: "Partial", value: 14, fill: "#D97706" },
];

const tooltipStyle = {
  contentStyle: {
    borderRadius: 10,
    border: "1px solid var(--border)",
    background: "var(--card)",
    color: "var(--foreground)",
    fontSize: 12,
    boxShadow: "0 10px 40px rgba(0,0,0,0.15)",
  },
  labelStyle: { color: "var(--foreground)", fontWeight: 600 },
};

export function ChartsSection() {
  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-foreground">Charts & Analytics</h1>
        <p className="text-sm text-muted-foreground mt-1">Data visualization components using Recharts</p>
      </div>

      {/* Area + Line charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <Card className="shadow-sm gap-0">
          <CardHeader className="pb-4">
            <CardTitle className="text-base">Revenue Collection</CardTitle>
            <CardDescription className="text-xs">Monthly totals in ₹ Lakhs</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220} minWidth={1} minHeight={1}>
              <AreaChart data={monthly} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1B3A6B" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#1B3A6B" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
                <Tooltip {...tooltipStyle} formatter={(v: any) => [`₹${v}L`, "Revenue"]} />
                <Area type="monotone" dataKey="revenue" stroke="#1B3A6B" strokeWidth={2.5} fill="url(#revGrad)" dot={false} activeDot={{ r: 5, fill: "#1B3A6B" }} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-sm gap-0">
          <CardHeader className="pb-4">
            <CardTitle className="text-base">Bookings & Leads Trend</CardTitle>
            <CardDescription className="text-xs">Monthly comparison</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220} minWidth={1} minHeight={1}>
              <LineChart data={monthly} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
                <Tooltip {...tooltipStyle} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
                <Line type="monotone" dataKey="bookings" name="Bookings" stroke="#1B3A6B" strokeWidth={2.5} dot={false} activeDot={{ r: 5 }} />
                <Line type="monotone" dataKey="leads" name="Leads" stroke="#C9922A" strokeWidth={2} strokeDasharray="4 3" dot={false} activeDot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Bar Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <Card className="shadow-sm gap-0">
          <CardHeader className="pb-4">
            <CardTitle className="text-base">Revenue by Project</CardTitle>
            <CardDescription className="text-xs">Quarterly breakdown (₹ Lakhs)</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240} minWidth={1} minHeight={1}>
              <BarChart data={projectRevenue} margin={{ top: 0, right: 0, left: -20, bottom: 0 }} barSize={14} barGap={3}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="project" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
                <Tooltip {...tooltipStyle} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="q1" name="Q1" fill="#1B3A6B" radius={[4, 4, 0, 0]} />
                <Bar dataKey="q2" name="Q2" fill="#4A7FD4" radius={[4, 4, 0, 0]} />
                <Bar dataKey="q3" name="Q3" fill="#C9922A" radius={[4, 4, 0, 0]} />
                <Bar dataKey="q4" name="Q4" fill="#E8B64C" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-sm gap-0">
          <CardHeader className="pb-4">
            <CardTitle className="text-base">Monthly Bookings</CardTitle>
            <CardDescription className="text-xs">Count per month with growth</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240} minWidth={1} minHeight={1}>
              <BarChart data={monthly} margin={{ top: 0, right: 0, left: -20, bottom: 0 }} barSize={24}>
                <defs>
                  <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#C9922A" stopOpacity={1} />
                    <stop offset="100%" stopColor="#C9922A" stopOpacity={0.6} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
                <Tooltip {...tooltipStyle} formatter={(v: any) => [v, "Bookings"]} />
                <Bar dataKey="bookings" name="Bookings" fill="url(#barGrad)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Pie + Radial + Donut */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {/* Donut */}
        <Card className="shadow-sm gap-0">
          <CardHeader className="pb-4">
            <CardTitle className="text-base">Unit Configuration Mix</CardTitle>
            <CardDescription className="text-xs">All projects</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center">
              <ResponsiveContainer width="100%" height={180} minWidth={1} minHeight={1}>
                <PieChart>
                  <Pie
                    data={unitMix}
                    cx="50%" cy="50%"
                    innerRadius={52} outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {unitMix.map((entry, i) => (
                      <Cell key={`cell-${i}`} fill={entry.color === "#EEF3FF" ? "#4A7FD4" : entry.color} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ ...tooltipStyle.contentStyle }}
                    formatter={(v: any, name: any) => [`${v} units`, name]}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 gap-2 w-full mt-1">
                {unitMix.map((item, i) => (
                  <div key={item.name} className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{ background: item.color === "#EEF3FF" ? "#4A7FD4" : item.color }} />
                    <span className="text-xs text-muted-foreground">{item.name}</span>
                    <span className="text-xs font-bold text-foreground ml-auto">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Radial progress */}
        <Card className="shadow-sm gap-0">
          <CardHeader className="pb-4">
            <CardTitle className="text-base">Collection Rate</CardTitle>
            <CardDescription className="text-xs">73% of target achieved</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center">
              <div className="relative">
                <ResponsiveContainer width={180} height={180} minWidth={1} minHeight={1}>
                  <RadialBarChart
                    cx="50%" cy="50%"
                    innerRadius="60%" outerRadius="90%"
                    data={[{ name: "Collection", value: 73, fill: "#1B3A6B" }]}
                    startAngle={225} endAngle={-45}
                  >
                    <RadialBar dataKey="value" cornerRadius={8} background={{ fill: "var(--muted)" }} />
                  </RadialBarChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <p className="text-3xl font-bold text-foreground">73%</p>
                  <p className="text-[10px] text-muted-foreground">of target</p>
                </div>
              </div>
              <div className="flex items-center gap-6 mt-2">
                <div className="text-center">
                  <p className="text-base font-bold text-foreground">₹18.2Cr</p>
                  <p className="text-[10px] text-muted-foreground">Collected</p>
                </div>
                <div className="text-center">
                  <p className="text-base font-bold text-muted-foreground">₹24.8Cr</p>
                  <p className="text-[10px] text-muted-foreground">Target</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pie + legend */}
        <Card className="shadow-sm gap-0">
          <CardHeader className="pb-4">
            <CardTitle className="text-base">Payment Health</CardTitle>
            <CardDescription className="text-xs">Current demand status</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={180} minWidth={1} minHeight={1}>
              <PieChart>
                <Pie
                  data={collectionHealth}
                  cx="50%" cy="50%"
                  outerRadius={70}
                  paddingAngle={3}
                  dataKey="value"
                  label={({ name, value }) => `${value}%`}
                  labelLine={false}
                >
                  {collectionHealth.map((entry, i) => (
                    <Cell key={`cell-${i}`} fill={entry.fill} stroke="none" />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle.contentStyle} formatter={(v: any, name: any) => [`${v}%`, name]} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-col gap-1.5 mt-2">
              {collectionHealth.map(item => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: item.fill }} />
                  <span className="text-xs text-muted-foreground flex-1">{item.name}</span>
                  <span className="text-xs font-bold text-foreground">{item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
