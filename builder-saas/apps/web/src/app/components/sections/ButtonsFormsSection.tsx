import { useState } from "react";
import { Plus, Download, Trash2, Edit2, Eye, ChevronDown, Search, Upload, Check, X, AlertCircle, Info } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Switch } from "../ui/switch";
import { Slider } from "../ui/slider";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

export function ButtonsFormsSection() {
  const [selectVal, setSelectVal] = useState("option1");
  const [toggle, setToggle] = useState(false);
  const [checkA, setCheckA] = useState(true);
  const [checkB, setCheckB] = useState(false);
  const [radio, setRadio] = useState("r1");
  const [sliderVal, setSliderVal] = useState([60]);
  const [inputError, setInputError] = useState(false);

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-foreground">Buttons & Forms</h1>
        <p className="text-sm text-muted-foreground mt-1">All interactive controls for the SHG ERP platform</p>
      </div>

      {/* Button Variants */}
      <section>
        <h3 className="text-foreground mb-1">Button Variants</h3>
        <p className="text-xs text-muted-foreground mb-4">All buttons use Inter Medium 14px with consistent 8px/16px padding</p>
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <div className="flex flex-wrap gap-3">
            <Button variant="default">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="destructive">Danger</Button>
            <Button className="bg-success text-success-foreground hover:bg-success/90">Success</Button>
            <Button variant="link">Link</Button>
            <Button disabled>Disabled</Button>
          </div>
        </div>
      </section>

      {/* Button Sizes */}
      <section>
        <h3 className="text-foreground mb-4">Button Sizes</h3>
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <div className="flex flex-wrap items-center gap-3">
            <Button size="sm" className="h-6 text-xs px-2.5">XS Button</Button>
            <Button size="sm">SM Button</Button>
            <Button size="default">MD Button</Button>
            <Button size="lg">LG Button</Button>
            <Button size="lg" className="h-12 px-6 text-base rounded-xl">XL Button</Button>
          </div>
        </div>
      </section>

      {/* Icon Buttons */}
      <section>
        <h3 className="text-foreground mb-4">Icon Buttons & Combos</h3>
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <div className="flex flex-wrap items-center gap-3">
            <Button>
              <Plus size={15} /> Add Unit
            </Button>
            <Button variant="outline">
              <Download size={15} /> Export
            </Button>
            <Button variant="outline">
              <Upload size={15} /> Import
            </Button>
            <div className="flex rounded-lg overflow-hidden group">
              <Button className="rounded-r-none border-r border-primary-foreground/20">
                <Plus size={15} /> New Booking
              </Button>
              <Button className="rounded-l-none px-2" size="icon">
                <ChevronDown size={14} />
              </Button>
            </div>
            <Button variant="secondary" size="icon">
              <Edit2 size={15} />
            </Button>
            <Button variant="secondary" size="icon">
              <Eye size={15} />
            </Button>
            <Button variant="destructive" size="icon" className="bg-red-50 dark:bg-red-950/30 text-red-500 hover:bg-red-100 hover:text-red-600">
              <Trash2 size={15} />
            </Button>
          </div>
        </div>
      </section>

      {/* Loading States */}
      <section>
        <h3 className="text-foreground mb-4">Loading States</h3>
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <div className="flex flex-wrap items-center gap-3">
            <Button disabled className="opacity-80">
              <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Saving…
            </Button>
            <Button variant="outline" disabled className="opacity-70">
              <span className="w-3.5 h-3.5 border-2 border-border border-t-primary rounded-full animate-spin" />
              Loading…
            </Button>
            <Button className="bg-success text-success-foreground hover:bg-success/90">
              <Check size={15} /> Saved!
            </Button>
          </div>
        </div>
      </section>

      {/* Inputs */}
      <section>
        <h3 className="text-foreground mb-4">Input Fields</h3>
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Default */}
            <div className="space-y-1.5">
              <Label>Unit Number</Label>
              <Input placeholder="e.g. B-204" />
              <p className="text-[10px] text-muted-foreground">Enter the flat/unit number</p>
            </div>

            {/* With Icon */}
            <div className="space-y-1.5">
              <Label>Search Customer</Label>
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input className="pl-9" placeholder="Name, phone, or email…" />
              </div>
            </div>

            {/* Error state */}
            <div className="space-y-1.5">
              <Label>
                Mobile Number <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Input
                  value="9876"
                  onFocus={() => setInputError(true)}
                  onBlur={() => setInputError(false)}
                  className={`pr-9 ${inputError ? "border-destructive focus-visible:ring-destructive/20" : "border-destructive focus-visible:ring-destructive/20"}`}
                  readOnly
                />
                <X size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-destructive" />
              </div>
              <p className="text-[10px] text-destructive flex items-center gap-1">
                <AlertCircle size={11} /> Please enter a valid 10-digit mobile number
              </p>
            </div>

            {/* Success state */}
            <div className="space-y-1.5">
              <Label>PAN Number</Label>
              <div className="relative">
                <Input
                  defaultValue="ABCDE1234F"
                  className="border-success focus-visible:ring-success/20 pr-9 uppercase"
                  readOnly
                />
                <Check size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-success" />
              </div>
              <p className="text-[10px] text-success flex items-center gap-1"><Check size={11} /> PAN verified</p>
            </div>

            {/* Textarea */}
            <div className="space-y-1.5 sm:col-span-2">
              <Label>Remarks</Label>
              <Textarea rows={3} placeholder="Add any additional notes or remarks…" className="resize-none" />
            </div>
          </div>
        </div>
      </section>

      {/* Dropdowns & Select */}
      <section>
        <h3 className="text-foreground mb-4">Dropdowns & Select</h3>
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="space-y-1.5">
              <Label>Project</Label>
              <Select value={selectVal} onValueChange={setSelectVal}>
                <SelectTrigger>
                  <SelectValue placeholder="Select project" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="option1">Hari Heights</SelectItem>
                  <SelectItem value="option2">Shri Residency</SelectItem>
                  <SelectItem value="option3">Green Valley</SelectItem>
                  <SelectItem value="option4">Lakshmi Towers</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label>Unit Type</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select type…" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1bhk">1 BHK</SelectItem>
                  <SelectItem value="2bhk">2 BHK</SelectItem>
                  <SelectItem value="3bhk">3 BHK</SelectItem>
                  <SelectItem value="4bhk">4 BHK</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label>Floor</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="All Floors" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Floors</SelectItem>
                  {Array.from({ length: 20 }, (_, i) => (
                    <SelectItem key={i + 1} value={`floor-${i + 1}`}>Floor {i + 1}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>

      {/* Checkboxes, Radios, Toggle */}
      <section>
        <h3 className="text-foreground mb-4">Checkboxes, Radio & Toggle</h3>
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {/* Checkboxes */}
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Checkboxes</p>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Checkbox id="cb-a" checked={checkA} onCheckedChange={(c) => setCheckA(!!c)} />
                  <Label htmlFor="cb-a" className="cursor-pointer font-normal">Include GST</Label>
                </div>
                <div className="flex items-center space-x-3">
                  <Checkbox id="cb-b" checked={checkB} onCheckedChange={(c) => setCheckB(!!c)} />
                  <Label htmlFor="cb-b" className="cursor-pointer font-normal">Send via Email</Label>
                </div>
                <div className="flex items-center space-x-3">
                  <Checkbox id="cb-disabled" disabled />
                  <Label htmlFor="cb-disabled" className="font-normal opacity-50">Disabled option</Label>
                </div>
              </div>
            </div>

            {/* Radio */}
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Radio Buttons</p>
              <RadioGroup value={radio} onValueChange={setRadio} className="space-y-1">
                <div className="flex items-center space-x-3">
                  <RadioGroupItem value="r1" id="r1" />
                  <Label htmlFor="r1" className="cursor-pointer font-normal">Self-Funded</Label>
                </div>
                <div className="flex items-center space-x-3">
                  <RadioGroupItem value="r2" id="r2" />
                  <Label htmlFor="r2" className="cursor-pointer font-normal">Home Loan</Label>
                </div>
                <div className="flex items-center space-x-3">
                  <RadioGroupItem value="r3" id="r3" />
                  <Label htmlFor="r3" className="cursor-pointer font-normal">NRI Purchase</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Toggle */}
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Toggle Switch</p>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="font-normal">Email Notifications</Label>
                  <Switch checked={toggle} onCheckedChange={setToggle} />
                </div>
                <div className="flex items-center justify-between">
                  <Label className="font-normal">Auto Reminders</Label>
                  <Switch checked={true} />
                </div>
                <div className="flex items-center justify-between opacity-40">
                  <Label className="font-normal">SMS Alerts (disabled)</Label>
                  <Switch disabled />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Range Slider */}
      <section>
        <h3 className="text-foreground mb-4">Slider</h3>
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <div className="max-w-md space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Budget Range</Label>
                <span className="text-xs font-bold text-primary">₹{sliderVal[0]}L</span>
              </div>
              <Slider 
                value={sliderVal} 
                onValueChange={setSliderVal} 
                max={200} 
                min={10} 
                step={1} 
              />
              <div className="flex justify-between mt-2">
                <span className="text-[10px] text-muted-foreground">₹10L</span>
                <span className="text-[10px] text-muted-foreground">₹200L</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Full Form Layout */}
      <section>
        <h3 className="text-foreground mb-4">Form Layout — New Booking</h3>
        <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-border">
            <h4 className="text-foreground">New Unit Booking</h4>
            <p className="text-xs text-muted-foreground mt-0.5">Fill in all required details to create a booking</p>
          </div>
          <div className="p-6 space-y-6">
            {/* Section: Unit Details */}
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-[10px] font-bold">1</span>
                Unit Details
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <Label>Project <span className="text-destructive">*</span></Label>
                  <Select>
                    <SelectTrigger><SelectValue placeholder="Select project" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hari">Hari Heights</SelectItem>
                      <SelectItem value="shri">Shri Residency</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Block / Wing <span className="text-destructive">*</span></Label>
                  <Select>
                    <SelectTrigger><SelectValue placeholder="Select block" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="a">Block A</SelectItem>
                      <SelectItem value="b">Block B</SelectItem>
                      <SelectItem value="c">Block C</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Unit Number <span className="text-destructive">*</span></Label>
                  <Input placeholder="e.g. B-204" />
                </div>
              </div>
            </div>

            {/* Section: Customer */}
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-[10px] font-bold">2</span>
                Customer Information
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5"><Label>Full Name</Label><Input placeholder="Customer full name" /></div>
                <div className="space-y-1.5"><Label>Mobile</Label><Input placeholder="+91 XXXXX XXXXX" /></div>
                <div className="space-y-1.5"><Label>Email</Label><Input placeholder="email@example.com" /></div>
                <div className="space-y-1.5"><Label>PAN Number</Label><Input placeholder="ABCDE1234F" /></div>
              </div>
            </div>

            {/* Info banner */}
            <div className="flex items-start gap-3 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-3.5">
              <Info size={15} className="text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed">
                Booking amount of <strong>₹1,00,000</strong> is non-refundable as per company policy. Agreement must be signed within 30 days of booking.
              </p>
            </div>
          </div>
          <div className="px-6 py-4 border-t border-border bg-muted/30 flex items-center justify-between">
            <Button variant="ghost" className="text-muted-foreground">Cancel</Button>
            <div className="flex items-center gap-2">
              <Button variant="outline">Save Draft</Button>
              <Button>
                <Plus size={15} /> Create Booking
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

