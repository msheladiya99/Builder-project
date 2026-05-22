import { Building2, TrendingUp, Users, IndianRupee, MoreHorizontal, ArrowUpRight, MapPin, Bed, Square, Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";

export function CardsSection() {
  const projects = [
    {
      name: "Hari Heights",
      location: "Koramangala, Bengaluru",
      units: 240,
      sold: 187,
      type: "Residential",
      status: "Active",
      completion: 78,
      img: "bg-gradient-to-br from-blue-600 to-blue-900",
    },
    {
      name: "Shri Residency",
      location: "Whitefield, Bengaluru",
      units: 160,
      sold: 82,
      type: "Luxury",
      status: "Active",
      completion: 52,
      img: "bg-gradient-to-br from-amber-500 to-amber-800",
    },
    {
      name: "Green Valley",
      location: "Electronic City, Bengaluru",
      units: 320,
      sold: 48,
      type: "Affordable",
      status: "Delayed",
      completion: 34,
      img: "bg-gradient-to-br from-green-600 to-emerald-900",
    },
  ];

  const units = [
    { id: "A-101", type: "2 BHK", floor: "1st Floor", area: "1150 sq.ft", price: "₹68.5L", status: "Available", facing: "East" },
    { id: "B-204", type: "3 BHK", floor: "2nd Floor", area: "1480 sq.ft", price: "₹92L", status: "Booked", facing: "North" },
    { id: "C-312", type: "1 BHK", floor: "3rd Floor", area: "640 sq.ft", price: "₹38L", status: "Available", facing: "West" },
    { id: "D-508", type: "4 BHK", floor: "5th Floor", area: "2200 sq.ft", price: "₹1.65Cr", status: "Held", facing: "North-East" },
  ];

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-foreground">Cards</h1>
        <p className="text-sm text-muted-foreground mt-1">Card patterns and layout components</p>
      </div>

      {/* Stat Cards */}
      <section>
        <h3 className="text-foreground mb-4">KPI / Stat Cards</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {[
            { title: "Total Revenue", value: "₹24.8 Cr", sub: "+18.2% this quarter", icon: <IndianRupee size={18} />, color: "bg-primary text-white", trend: "up" },
            { title: "Bookings", value: "142", sub: "+12 this month", icon: <Building2 size={18} />, color: "bg-secondary text-white", trend: "up" },
            { title: "Active Leads", value: "867", sub: "67 hot leads", icon: <Users size={18} />, color: "bg-success text-white", trend: "up" },
            { title: "Collection %", value: "73.4%", sub: "of ₹24.8Cr target", icon: <TrendingUp size={18} />, color: "bg-info text-white", trend: "down" },
          ].filter((_, i) => i < 3).map((card, i) => (
            <Card key={i} className="p-5 shadow-sm hover:shadow-md transition-shadow gap-0">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{card.title}</p>
                  <p className="text-2xl font-bold text-foreground mt-2">{card.value}</p>
                  <p className="text-xs text-success mt-1 flex items-center gap-1">
                    <TrendingUp size={11} /> {card.sub}
                  </p>
                </div>
                <div className={`${card.color} w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm`}>
                  {card.icon}
                </div>
              </div>
            </Card>
          ))}
          {/* Target card with progress */}
          <Card className="p-5 shadow-sm hover:shadow-md transition-shadow gap-0">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Collection Rate</p>
                <p className="text-2xl font-bold text-foreground mt-2">73.4%</p>
                <Progress value={73.4} className="mt-2 h-1.5" />
                <p className="text-xs text-muted-foreground mt-1">Target: 80%</p>
              </div>
              <div className="bg-warning text-white w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm ml-4">
                <TrendingUp size={18} />
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Project Cards */}
      <section>
        <h3 className="text-foreground mb-4">Project Cards</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {projects.map(project => (
            <Card key={project.name} className="overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group cursor-pointer gap-0">
              {/* Cover */}
              <div className={`h-32 ${project.img} relative`}>
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute top-3 right-3">
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-full
                    ${project.status === "Active" ? "bg-green-500/90 text-white" :
                      project.status === "Delayed" ? "bg-amber-500/90 text-white" : "bg-gray-500/90 text-white"}`}>
                    {project.status}
                  </span>
                </div>
                <div className="absolute bottom-3 left-4">
                  <h4 className="text-white font-semibold">{project.name}</h4>
                  <p className="text-white/70 text-xs flex items-center gap-1 mt-0.5">
                    <MapPin size={10} /> {project.location}
                  </p>
                </div>
              </div>

              {/* Body */}
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">{project.type}</span>
                  <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                    <MoreHorizontal size={14} />
                  </Button>
                </div>
                <div className="grid grid-cols-3 gap-2 mb-3">
                  {[
                    { label: "Total", val: project.units },
                    { label: "Sold", val: project.sold },
                    { label: "Available", val: project.units - project.sold },
                  ].map(s => (
                    <div key={s.label} className="text-center bg-muted rounded-lg py-2">
                      <p className="text-sm font-bold text-foreground">{s.val}</p>
                      <p className="text-[10px] text-muted-foreground">{s.label}</p>
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] text-muted-foreground">Construction</span>
                    <span className="text-[11px] font-bold text-foreground">{project.completion}%</span>
                  </div>
                  <Progress value={project.completion} className={`h-1.5 ${project.status === "Delayed" ? "[&>div]:bg-amber-500" : ""}`} />
                </div>
              </CardContent>

              <div className="px-4 pb-4">
                <Button variant="outline" className="w-full text-primary border-primary/30 hover:bg-primary hover:text-white transition-colors">
                  <ArrowUpRight size={13} className="mr-1.5" /> View Project
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Unit Cards */}
      <section>
        <h3 className="text-foreground mb-4">Unit / Listing Cards</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {units.map(unit => (
            <Card
              key={unit.id}
              className={`p-4 shadow-sm hover:shadow-md transition-all cursor-pointer relative overflow-hidden gap-0
                ${unit.status === "Booked" ? "border-blue-200 dark:border-blue-900/60" :
                  unit.status === "Held" ? "border-amber-200 dark:border-amber-900/60" :
                  "border-border hover:border-primary/40"}`}
            >
              {unit.status !== "Available" && (
                <div className="absolute top-0 right-0">
                  <div className={`text-[9px] font-bold px-2 py-1 rounded-bl-xl
                    ${unit.status === "Booked" ? "bg-primary text-white" :
                      unit.status === "Held" ? "bg-amber-500 text-white" : "bg-gray-500 text-white"}`}>
                    {unit.status}
                  </div>
                </div>
              )}
              <div className="flex items-center gap-2 mb-3">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold
                  ${unit.status === "Available" ? "bg-primary/10 text-primary" :
                    unit.status === "Booked" ? "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400" :
                    "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400"}`}>
                  {unit.id}
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{unit.type}</p>
                  <p className="text-[10px] text-muted-foreground">{unit.floor}</p>
                </div>
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Square size={11} /> <span>{unit.area}</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Bed size={11} /> <span>{unit.facing} Facing</span>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-border flex items-center justify-between">
                <span className="text-base font-bold text-foreground">{unit.price}</span>
                {unit.status === "Available" && (
                  <Button variant="link" className="h-auto p-0 text-xs font-medium text-primary">Book Now</Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Info / Detail Card */}
      <section>
        <h3 className="text-foreground mb-4">Detail / Info Cards</h3>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {/* Customer card */}
          <Card className="overflow-hidden shadow-sm gap-0">
            <CardHeader className="flex flex-row items-center justify-between px-5 py-4 border-b border-border gap-0 pb-4">
              <CardTitle className="text-base">Customer Profile</CardTitle>
              <Button variant="link" className="h-auto p-0 text-xs font-medium text-primary flex items-center gap-1">
                <ArrowUpRight size={12} /> Edit
              </Button>
            </CardHeader>
            <CardContent className="p-5">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center">
                  <span className="text-white text-lg font-bold">SN</span>
                </div>
                <div>
                  <p className="font-semibold text-foreground">Suresh Nair</p>
                  <p className="text-xs text-muted-foreground">suresh.nair@gmail.com</p>
                  <p className="text-xs text-muted-foreground">+91 98765 43210</p>
                  <div className="flex items-center gap-1 mt-1">
                    {[1, 2, 3, 4, 5].map(s => (
                      <Star key={s} size={11} className={s <= 4 ? "fill-amber-400 text-amber-400" : "text-border fill-border"} />
                    ))}
                    <span className="text-[10px] text-muted-foreground ml-0.5">Premium</span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Customer ID", val: "CUS-10248" },
                  { label: "Source", val: "Referral" },
                  { label: "PAN", val: "ABCDE1234F" },
                  { label: "Aadhaar", val: "XXXX-XXXX-4521" },
                  { label: "Unit Booked", val: "B-204, Hari Heights" },
                  { label: "Booking Date", val: "12 Apr 2026" },
                ].map(f => (
                  <div key={f.label} className="bg-muted/50 rounded-lg px-3 py-2">
                    <p className="text-[10px] text-muted-foreground">{f.label}</p>
                    <p className="text-xs font-semibold text-foreground mt-0.5">{f.val}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Payment summary card */}
          <Card className="overflow-hidden shadow-sm gap-0">
            <CardHeader className="flex flex-row items-center justify-between px-5 py-4 border-b border-border gap-0 pb-4">
              <CardTitle className="text-base">Payment Summary</CardTitle>
              <span className="text-[10px] font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 px-2 py-1 rounded-full">Active</span>
            </CardHeader>
            <CardContent className="p-5 space-y-3">
              {[
                { label: "Total Agreement Value", val: "₹68,50,000", cls: "text-foreground font-bold" },
                { label: "Booking Amount", val: "₹1,00,000", cls: "text-success" },
                { label: "On Slab (Paid)", val: "₹14,00,000", cls: "text-success" },
                { label: "Balance Due", val: "₹53,50,000", cls: "text-destructive font-semibold" },
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between py-1.5 border-b border-border/60 last:border-0">
                  <span className="text-sm text-muted-foreground">{item.label}</span>
                  <span className={`text-sm ${item.cls}`}>{item.val}</span>
                </div>
              ))}
              <div className="pt-1">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs text-muted-foreground">Payment Progress</span>
                  <span className="text-xs font-bold text-foreground">21.9%</span>
                </div>
                <Progress value={21.9} className="h-2" />
              </div>
              <Button className="w-full mt-3">
                Record Payment
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
