// ── Types ─────────────────────────────────────────────────────────────────────

export type Site = "Tower A" | "Tower B" | "Tower C" | "Club House" | "Basement Parking" | "All Sites";
export type VendorStatus = "Active" | "Blacklisted" | "On Hold" | "New";
export type POStatus = "Draft" | "Pending Approval" | "Approved" | "Partially Received" | "Received" | "Cancelled";
export type GRNStatus = "Pending QC" | "QC Passed" | "QC Failed" | "Accepted" | "Rejected";
export type IssueStatus = "Requested" | "Pending Approval" | "Approved" | "Issued" | "Returned" | "Cancelled";
export type StockHealth = "Critical" | "Low" | "Normal" | "Overstocked";
export type MaterialCategory = "Cement & Concrete" | "Steel & Iron" | "Electrical" | "Plumbing" | "Tiles & Flooring" | "Hardware" | "Safety Equipment" | "Tools & Machinery";

// ── Helper ─────────────────────────────────────────────────────────────────────

export function fmtINR(n: number, compact = false): string {
  if (compact) {
    if (Math.abs(n) >= 10000000) return `₹${(n / 10000000).toFixed(2)}Cr`;
    if (Math.abs(n) >= 100000) return `₹${(n / 100000).toFixed(1)}L`;
    if (Math.abs(n) >= 1000) return `₹${(n / 1000).toFixed(1)}K`;
    return `₹${n.toFixed(0)}`;
  }
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
}

export function stockHealth(current: number, min: number, max: number): StockHealth {
  if (current <= 0 || current < min * 0.5) return "Critical";
  if (current < min) return "Low";
  if (current > max * 0.9) return "Overstocked";
  return "Normal";
}

// ── Interfaces ─────────────────────────────────────────────────────────────────

export interface Vendor {
  id: string;
  code: string;
  name: string;
  category: MaterialCategory;
  contactPerson: string;
  phone: string;
  email: string;
  gstin: string;
  address: string;
  city: string;
  rating: number;
  status: VendorStatus;
  paymentTerms: string;
  creditLimit: number;
  totalOrders: number;
  totalValue: number;
  onTimeDelivery: number;
  qualityScore: number;
  registeredOn: string;
  materials: string[];
}

export interface POItem {
  id: string;
  material: string;
  materialCode: string;
  unit: string;
  qty: number;
  rate: number;
  amount: number;
  gstRate: number;
  gst: number;
  receivedQty: number;
}

export interface PurchaseOrder {
  id: string;
  poNo: string;
  date: string;
  deliveryDate: string;
  vendor: string;
  vendorCode: string;
  site: Site;
  warehouse: string;
  items: POItem[];
  subtotal: number;
  gstTotal: number;
  total: number;
  status: POStatus;
  priority: "Low" | "Normal" | "High" | "Urgent";
  approvalSteps: ApprovalStep[];
  remarks: string;
  createdBy: string;
}

export interface ApprovalStep {
  role: string;
  name: string;
  status: "Pending" | "Approved" | "Rejected" | "Skipped";
  date?: string;
  remarks?: string;
}

export interface GRN {
  id: string;
  grnNo: string;
  poNo: string;
  date: string;
  vendor: string;
  site: Site;
  warehouse: string;
  receivedBy: string;
  vehicleNo: string;
  dcNo: string;
  items: GRNItem[];
  status: GRNStatus;
  qcBy?: string;
  qcDate?: string;
  remarks: string;
}

export interface GRNItem {
  material: string;
  materialCode: string;
  unit: string;
  orderedQty: number;
  receivedQty: number;
  acceptedQty: number;
  rejectedQty: number;
  rate: number;
  amount: number;
  batchNo: string;
  barcode: string;
}

export interface StockItem {
  id: string;
  code: string;
  barcode: string;
  name: string;
  category: MaterialCategory;
  unit: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  reorderQty: number;
  rate: number;
  value: number;
  warehouse: string;
  site: Site;
  lastReceived: string;
  lastIssued: string;
  supplier: string;
  hsn: string;
}

export interface MaterialIssue {
  id: string;
  issueNo: string;
  date: string;
  site: Site;
  issuedFrom: string;
  requestedBy: string;
  approvedBy?: string;
  purpose: string;
  items: IssueItem[];
  status: IssueStatus;
  total: number;
  remarks: string;
}

export interface IssueItem {
  material: string;
  materialCode: string;
  unit: string;
  requestedQty: number;
  issuedQty: number;
  rate: number;
  amount: number;
}

export interface Warehouse {
  id: string;
  code: string;
  name: string;
  site: Site;
  incharge: string;
  phone: string;
  capacity: number;
  utilized: number;
  totalItems: number;
  totalValue: number;
  stockAlerts: number;
  lastAudit: string;
}

// ── Vendors ────────────────────────────────────────────────────────────────────

export const mockVendors: Vendor[] = [
  {
    id: "V001", code: "VND-001", name: "Ambuja Cements Ltd.", category: "Cement & Concrete",
    contactPerson: "Rakesh Sharma", phone: "9821034567", email: "rakesh@ambuja.com",
    gstin: "27AAECA0789P1ZX", address: "Plot 14, MIDC Industrial Area, Pune", city: "Pune",
    rating: 4.8, status: "Active", paymentTerms: "30 Days Net", creditLimit: 5000000,
    totalOrders: 48, totalValue: 12400000, onTimeDelivery: 94, qualityScore: 97,
    registeredOn: "2022-04-01",
    materials: ["OPC 53 Grade Cement", "PPC Cement", "Ready Mix Concrete M25", "Ready Mix Concrete M30"],
  },
  {
    id: "V002", code: "VND-002", name: "Tata Steel Ltd.", category: "Steel & Iron",
    contactPerson: "Priya Mehta", phone: "9867123456", email: "priya.mehta@tatasteel.com",
    gstin: "19AAACT1234P1ZQ", address: "Bombay House, 24 Homi Mody Street, Mumbai", city: "Mumbai",
    rating: 4.9, status: "Active", paymentTerms: "45 Days Net", creditLimit: 10000000,
    totalOrders: 62, totalValue: 28600000, onTimeDelivery: 97, qualityScore: 99,
    registeredOn: "2022-04-01",
    materials: ["Fe500 TMT Bars 10mm", "Fe500 TMT Bars 12mm", "Fe500 TMT Bars 16mm", "Fe500 TMT Bars 20mm", "Binding Wire"],
  },
  {
    id: "V003", code: "VND-003", name: "Polycab India Ltd.", category: "Electrical",
    contactPerson: "Anil Nair", phone: "9745012345", email: "anil.nair@polycab.com",
    gstin: "24AADCP3456R1ZF", address: "Satnam Complex, Vadodara", city: "Vadodara",
    rating: 4.5, status: "Active", paymentTerms: "21 Days Net", creditLimit: 2000000,
    totalOrders: 24, totalValue: 4200000, onTimeDelivery: 88, qualityScore: 95,
    registeredOn: "2023-01-15",
    materials: ["2.5 sqmm FR Cable", "4 sqmm FR Cable", "PVC Conduit Pipe", "MCB DB Box", "Distribution Board"],
  },
  {
    id: "V004", code: "VND-004", name: "Astral Pipes Ltd.", category: "Plumbing",
    contactPerson: "Deepak Gupta", phone: "9632145678", email: "deepak@astralpipes.com",
    gstin: "24AAGCA1230P1Z3", address: "Survey No. 2120, Santej, Gujarat", city: "Ahmedabad",
    rating: 4.3, status: "Active", paymentTerms: "30 Days Net", creditLimit: 1500000,
    totalOrders: 18, totalValue: 2800000, onTimeDelivery: 85, qualityScore: 93,
    registeredOn: "2023-03-10",
    materials: ["CPVC Pipe 20mm", "CPVC Pipe 25mm", "UPVC Pipe 110mm", "Ball Valve 25mm", "Elbow 25mm CPVC"],
  },
  {
    id: "V005", code: "VND-005", name: "Somany Ceramics Ltd.", category: "Tiles & Flooring",
    contactPerson: "Sunita Joshi", phone: "9876501234", email: "sunita@somany.in",
    gstin: "06AADCS1234N1ZQ", address: "122-123, Udyog Vihar Phase 4, Gurugram", city: "Gurugram",
    rating: 4.1, status: "Active", paymentTerms: "15 Days Net", creditLimit: 3000000,
    totalOrders: 12, totalValue: 6100000, onTimeDelivery: 80, qualityScore: 90,
    registeredOn: "2023-06-01",
    materials: ["Vitrified Tiles 600x600", "Ceramic Wall Tiles 300x450", "Parking Tiles 400x400", "Granite Slab"],
  },
  {
    id: "V006", code: "VND-006", name: "Pidilite Industries Ltd.", category: "Hardware",
    contactPerson: "Vijay Desai", phone: "9921034521", email: "vijay.desai@pidilite.com",
    gstin: "27AAACQ0782M1ZV", address: "Regent Chambers, Nariman Point, Mumbai", city: "Mumbai",
    rating: 4.6, status: "Active", paymentTerms: "30 Days Net", creditLimit: 1000000,
    totalOrders: 30, totalValue: 1900000, onTimeDelivery: 92, qualityScore: 96,
    registeredOn: "2022-09-01",
    materials: ["Fevicol SH 1kg", "Dr. Fixit Waterproof LW+", "Roff Cement Grout", "M-Seal", "Cera Bond Tiles Adhesive"],
  },
  {
    id: "V007", code: "VND-007", name: "Karam Safety Pvt. Ltd.", category: "Safety Equipment",
    contactPerson: "Ravi Kumar", phone: "9654321098", email: "ravi@karam.in",
    gstin: "07AABCK7123P1ZQ", address: "Sector 63, Noida, Uttar Pradesh", city: "Noida",
    rating: 3.9, status: "On Hold", paymentTerms: "15 Days Net", creditLimit: 500000,
    totalOrders: 9, totalValue: 780000, onTimeDelivery: 72, qualityScore: 87,
    registeredOn: "2023-08-15",
    materials: ["Safety Helmet IS:2925", "Safety Harness", "Reflective Jacket", "Safety Shoes", "Safety Goggles"],
  },
  {
    id: "V008", code: "VND-008", name: "Ultratech Cement Ltd.", category: "Cement & Concrete",
    contactPerson: "Mahesh Patel", phone: "9512034678", email: "mahesh@ultratech.com",
    gstin: "27AAACL0123P1ZW", address: "B-Wing, 3rd Floor, Ahura Centre, Mahakali Caves Road, Mumbai", city: "Mumbai",
    rating: 4.7, status: "Active", paymentTerms: "30 Days Net", creditLimit: 8000000,
    totalOrders: 55, totalValue: 19500000, onTimeDelivery: 93, qualityScore: 98,
    registeredOn: "2022-04-01",
    materials: ["OPC 53 Grade Cement", "PPC Cement", "White Cement", "Super Seal Waterproof Cement"],
  },
  {
    id: "V009", code: "VND-009", name: "Bharat Bhari Udyog Pvt. Ltd.", category: "Tools & Machinery",
    contactPerson: "Suresh Rao", phone: "9845076543", email: "suresh.rao@bbupl.com",
    gstin: "29AABCB5678P1ZL", address: "Plot 45, Peenya Industrial Area, Bengaluru", city: "Bengaluru",
    rating: 4.2, status: "New", paymentTerms: "Advance Payment", creditLimit: 200000,
    totalOrders: 4, totalValue: 450000, onTimeDelivery: 100, qualityScore: 91,
    registeredOn: "2025-11-01",
    materials: ["Concrete Mixer 1 Bag", "Bar Bending Machine", "Plate Compactor", "Needle Vibrator", "Electric Drill"],
  },
  {
    id: "V010", code: "VND-010", name: "Royal Star Pipes Ltd.", category: "Plumbing",
    contactPerson: "Kishore Shah", phone: "9376210345", email: "kishore@royalstar.com",
    gstin: "24AACSR6543P1ZF", address: "Opp. Water Tank, Kathwada GIDC, Ahmedabad", city: "Ahmedabad",
    rating: 2.8, status: "Blacklisted", paymentTerms: "Advance", creditLimit: 0,
    totalOrders: 3, totalValue: 220000, onTimeDelivery: 33, qualityScore: 52,
    registeredOn: "2024-02-10",
    materials: ["GI Pipe 15mm", "GI Pipe 20mm"],
  },
];

// ── Purchase Orders ─────────────────────────────────────────────────────────────

export const mockPurchaseOrders: PurchaseOrder[] = [
  {
    id: "PO001", poNo: "PO/2526/001", date: "2025-04-05", deliveryDate: "2025-04-12",
    vendor: "Ambuja Cements Ltd.", vendorCode: "VND-001", site: "Tower A", warehouse: "Site A Store",
    subtotal: 350000, gstTotal: 63000, total: 413000, status: "Received",
    priority: "Normal", createdBy: "Vivek Tiwari", remarks: "Monthly cement requirement",
    items: [
      { id: "i1", material: "OPC 53 Grade Cement", materialCode: "CEM-001", unit: "Bags", qty: 500, rate: 420, amount: 210000, gstRate: 18, gst: 37800, receivedQty: 500 },
      { id: "i2", material: "PPC Cement", materialCode: "CEM-002", unit: "Bags", qty: 333, rate: 420, amount: 140000, gstRate: 18, gst: 25200, receivedQty: 333 },
    ],
    approvalSteps: [
      { role: "Site Engineer", name: "Vivek Tiwari", status: "Approved", date: "2025-04-05", remarks: "Required urgently" },
      { role: "Site Manager", name: "Ramesh Iyer", status: "Approved", date: "2025-04-05" },
      { role: "Purchase Manager", name: "Kavita Bhatt", status: "Approved", date: "2025-04-06" },
      { role: "Finance Manager", name: "Ashok Jain", status: "Approved", date: "2025-04-06" },
    ],
  },
  {
    id: "PO002", poNo: "PO/2526/002", date: "2025-04-18", deliveryDate: "2025-04-25",
    vendor: "Tata Steel Ltd.", vendorCode: "VND-002", site: "Tower B", warehouse: "Site B Store",
    subtotal: 1280000, gstTotal: 153600, total: 1433600, status: "Partially Received",
    priority: "High", createdBy: "Sunil Yadav", remarks: "TMT bars for floor slab",
    items: [
      { id: "i1", material: "Fe500 TMT Bars 12mm", materialCode: "STL-002", unit: "MT", qty: 20, rate: 60000, amount: 1200000, gstRate: 18, gst: 216000, receivedQty: 12 },
      { id: "i2", material: "Binding Wire", materialCode: "STL-005", unit: "Kgs", qty: 400, rate: 80, amount: 32000, gstRate: 18, gst: 5760, receivedQty: 400 },
    ],
    approvalSteps: [
      { role: "Site Engineer", name: "Sunil Yadav", status: "Approved", date: "2025-04-18" },
      { role: "Site Manager", name: "Ramesh Iyer", status: "Approved", date: "2025-04-19" },
      { role: "Purchase Manager", name: "Kavita Bhatt", status: "Approved", date: "2025-04-19" },
      { role: "Finance Manager", name: "Ashok Jain", status: "Pending" },
    ],
  },
  {
    id: "PO003", poNo: "PO/2526/003", date: "2025-05-02", deliveryDate: "2025-05-10",
    vendor: "Polycab India Ltd.", vendorCode: "VND-003", site: "Tower C", warehouse: "Site C Store",
    subtotal: 185000, gstTotal: 33300, total: 218300, status: "Approved",
    priority: "Normal", createdBy: "Anita Kulkarni", remarks: "Electrical works - 5th floor",
    items: [
      { id: "i1", material: "2.5 sqmm FR Cable", materialCode: "ELE-001", unit: "Mtrs", qty: 5000, rate: 18, amount: 90000, gstRate: 18, gst: 16200, receivedQty: 0 },
      { id: "i2", material: "4 sqmm FR Cable", materialCode: "ELE-002", unit: "Mtrs", qty: 2500, rate: 28, amount: 70000, gstRate: 18, gst: 12600, receivedQty: 0 },
      { id: "i3", material: "PVC Conduit Pipe", materialCode: "ELE-003", unit: "Mtrs", qty: 1000, rate: 25, amount: 25000, gstRate: 18, gst: 4500, receivedQty: 0 },
    ],
    approvalSteps: [
      { role: "Site Engineer", name: "Anita Kulkarni", status: "Approved", date: "2025-05-02" },
      { role: "Site Manager", name: "Ramesh Iyer", status: "Approved", date: "2025-05-03" },
      { role: "Purchase Manager", name: "Kavita Bhatt", status: "Approved", date: "2025-05-03" },
      { role: "Finance Manager", name: "Ashok Jain", status: "Approved", date: "2025-05-04" },
    ],
  },
  {
    id: "PO004", poNo: "PO/2526/004", date: "2025-05-10", deliveryDate: "2025-05-18",
    vendor: "Somany Ceramics Ltd.", vendorCode: "VND-005", site: "Club House", warehouse: "Main Store",
    subtotal: 920000, gstTotal: 110400, total: 1030400, status: "Pending Approval",
    priority: "Normal", createdBy: "Dinesh Patil", remarks: "Flooring for club house ground floor",
    items: [
      { id: "i1", material: "Vitrified Tiles 600x600", materialCode: "TIL-001", unit: "Sqft", qty: 8000, rate: 85, amount: 680000, gstRate: 12, gst: 81600, receivedQty: 0 },
      { id: "i2", material: "Granite Slab", materialCode: "TIL-004", unit: "Sqft", qty: 2000, rate: 120, amount: 240000, gstRate: 12, gst: 28800, receivedQty: 0 },
    ],
    approvalSteps: [
      { role: "Site Engineer", name: "Dinesh Patil", status: "Approved", date: "2025-05-10" },
      { role: "Site Manager", name: "Ramesh Iyer", status: "Approved", date: "2025-05-11" },
      { role: "Purchase Manager", name: "Kavita Bhatt", status: "Pending" },
      { role: "Finance Manager", name: "Ashok Jain", status: "Pending" },
    ],
  },
  {
    id: "PO005", poNo: "PO/2526/005", date: "2025-05-14", deliveryDate: "2025-05-20",
    vendor: "Tata Steel Ltd.", vendorCode: "VND-002", site: "Tower A", warehouse: "Site A Store",
    subtotal: 2400000, gstTotal: 288000, total: 2688000, status: "Pending Approval",
    priority: "Urgent", createdBy: "Vivek Tiwari", remarks: "Critical — slab casting in 7 days",
    items: [
      { id: "i1", material: "Fe500 TMT Bars 16mm", materialCode: "STL-003", unit: "MT", qty: 30, rate: 62000, amount: 1860000, gstRate: 18, gst: 334800, receivedQty: 0 },
      { id: "i2", material: "Fe500 TMT Bars 20mm", materialCode: "STL-004", unit: "MT", qty: 8, rate: 67500, amount: 540000, gstRate: 18, gst: 97200, receivedQty: 0 },
    ],
    approvalSteps: [
      { role: "Site Engineer", name: "Vivek Tiwari", status: "Approved", date: "2025-05-14" },
      { role: "Site Manager", name: "Ramesh Iyer", status: "Approved", date: "2025-05-14", remarks: "Urgent. Please expedite." },
      { role: "Purchase Manager", name: "Kavita Bhatt", status: "Pending" },
      { role: "Finance Manager", name: "Ashok Jain", status: "Pending" },
    ],
  },
  {
    id: "PO006", poNo: "PO/2526/006", date: "2025-05-16", deliveryDate: "2025-05-22",
    vendor: "Karam Safety Pvt. Ltd.", vendorCode: "VND-007", site: "Tower B", warehouse: "Main Store",
    subtotal: 78000, gstTotal: 14040, total: 92040, status: "Draft",
    priority: "Low", createdBy: "Ramesh Iyer", remarks: "Safety gear for new labourers",
    items: [
      { id: "i1", material: "Safety Helmet IS:2925", materialCode: "SAF-001", unit: "Nos", qty: 100, rate: 350, amount: 35000, gstRate: 18, gst: 6300, receivedQty: 0 },
      { id: "i2", material: "Reflective Jacket", materialCode: "SAF-003", unit: "Nos", qty: 100, rate: 250, amount: 25000, gstRate: 18, gst: 4500, receivedQty: 0 },
      { id: "i3", material: "Safety Shoes", materialCode: "SAF-004", unit: "Pairs", qty: 60, rate: 300, amount: 18000, gstRate: 18, gst: 3240, receivedQty: 0 },
    ],
    approvalSteps: [
      { role: "Site Engineer", name: "Ramesh Iyer", status: "Pending" },
      { role: "Site Manager", name: "Ramesh Iyer", status: "Pending" },
      { role: "Purchase Manager", name: "Kavita Bhatt", status: "Pending" },
      { role: "Finance Manager", name: "Ashok Jain", status: "Pending" },
    ],
  },
  {
    id: "PO007", poNo: "PO/2526/007", date: "2025-04-28", deliveryDate: "2025-05-05",
    vendor: "Astral Pipes Ltd.", vendorCode: "VND-004", site: "Basement Parking", warehouse: "Main Store",
    subtotal: 145000, gstTotal: 17400, total: 162400, status: "Received",
    priority: "Normal", createdBy: "Suresh Nair", remarks: "Drainage and water supply lines",
    items: [
      { id: "i1", material: "UPVC Pipe 110mm", materialCode: "PLB-003", unit: "Mtrs", qty: 500, rate: 180, amount: 90000, gstRate: 12, gst: 10800, receivedQty: 500 },
      { id: "i2", material: "CPVC Pipe 25mm", materialCode: "PLB-002", unit: "Mtrs", qty: 500, rate: 110, amount: 55000, gstRate: 12, gst: 6600, receivedQty: 500 },
    ],
    approvalSteps: [
      { role: "Site Engineer", name: "Suresh Nair", status: "Approved", date: "2025-04-28" },
      { role: "Site Manager", name: "Ramesh Iyer", status: "Approved", date: "2025-04-28" },
      { role: "Purchase Manager", name: "Kavita Bhatt", status: "Approved", date: "2025-04-29" },
      { role: "Finance Manager", name: "Ashok Jain", status: "Approved", date: "2025-04-29" },
    ],
  },
  {
    id: "PO008", poNo: "PO/2526/008", date: "2025-05-08", deliveryDate: "2025-05-15",
    vendor: "Ambuja Cements Ltd.", vendorCode: "VND-001", site: "Tower C", warehouse: "Site C Store",
    subtotal: 210000, gstTotal: 37800, total: 247800, status: "Cancelled",
    priority: "Normal", createdBy: "Anita Kulkarni", remarks: "Cancelled — switched to Ultratech",
    items: [
      { id: "i1", material: "OPC 53 Grade Cement", materialCode: "CEM-001", unit: "Bags", qty: 500, rate: 420, amount: 210000, gstRate: 18, gst: 37800, receivedQty: 0 },
    ],
    approvalSteps: [
      { role: "Site Engineer", name: "Anita Kulkarni", status: "Approved", date: "2025-05-08" },
      { role: "Site Manager", name: "Ramesh Iyer", status: "Rejected", date: "2025-05-09", remarks: "Use Ultratech instead" },
      { role: "Purchase Manager", name: "Kavita Bhatt", status: "Skipped" },
      { role: "Finance Manager", name: "Ashok Jain", status: "Skipped" },
    ],
  },
];

// ── GRN ─────────────────────────────────────────────────────────────────────────

export const mockGRNs: GRN[] = [
  {
    id: "GRN001", grnNo: "GRN/2526/001", poNo: "PO/2526/001", date: "2025-04-12",
    vendor: "Ambuja Cements Ltd.", site: "Tower A", warehouse: "Site A Store",
    receivedBy: "Gajanan More", vehicleNo: "MH14-AB-3456", dcNo: "AMB/DC/4521",
    status: "Accepted", qcBy: "Vikram Patil", qcDate: "2025-04-12",
    remarks: "All bags intact, proper stacking done",
    items: [
      { material: "OPC 53 Grade Cement", materialCode: "CEM-001", unit: "Bags", orderedQty: 500, receivedQty: 500, acceptedQty: 500, rejectedQty: 0, rate: 420, amount: 210000, batchNo: "BAT-APR25-01", barcode: "8901030123456" },
      { material: "PPC Cement", materialCode: "CEM-002", unit: "Bags", orderedQty: 333, receivedQty: 330, acceptedQty: 330, rejectedQty: 0, rate: 420, amount: 138600, batchNo: "BAT-APR25-02", barcode: "8901030123789" },
    ],
  },
  {
    id: "GRN002", grnNo: "GRN/2526/002", poNo: "PO/2526/002", date: "2025-04-26",
    vendor: "Tata Steel Ltd.", site: "Tower B", warehouse: "Site B Store",
    receivedBy: "Santosh Kadam", vehicleNo: "MH12-CD-7890", dcNo: "TATA/DC/9832",
    status: "QC Passed", qcBy: "Vikram Patil", qcDate: "2025-04-27",
    remarks: "12 MT received, balance pending",
    items: [
      { material: "Fe500 TMT Bars 12mm", materialCode: "STL-002", unit: "MT", orderedQty: 20, receivedQty: 12, acceptedQty: 12, rejectedQty: 0, rate: 60000, amount: 720000, batchNo: "TATA-B25-112", barcode: "8903026789012" },
      { material: "Binding Wire", materialCode: "STL-005", unit: "Kgs", orderedQty: 400, receivedQty: 400, acceptedQty: 395, rejectedQty: 5, rate: 80, amount: 31600, batchNo: "BW-2025-04", barcode: "8903026789345" },
    ],
  },
  {
    id: "GRN003", grnNo: "GRN/2526/003", poNo: "PO/2526/007", date: "2025-05-06",
    vendor: "Astral Pipes Ltd.", site: "Basement Parking", warehouse: "Main Store",
    receivedBy: "Manoj Singh", vehicleNo: "GJ01-ER-4512", dcNo: "AST/DC/2876",
    status: "Accepted", qcBy: "Vikram Patil", qcDate: "2025-05-06",
    remarks: "Complete delivery as per PO",
    items: [
      { material: "UPVC Pipe 110mm", materialCode: "PLB-003", unit: "Mtrs", orderedQty: 500, receivedQty: 500, acceptedQty: 500, rejectedQty: 0, rate: 180, amount: 90000, batchNo: "AST-UPVC-2504", barcode: "8902012345678" },
      { material: "CPVC Pipe 25mm", materialCode: "PLB-002", unit: "Mtrs", orderedQty: 500, receivedQty: 500, acceptedQty: 500, rejectedQty: 0, rate: 110, amount: 55000, batchNo: "AST-CPVC-2504", barcode: "8902012345901" },
    ],
  },
  {
    id: "GRN004", grnNo: "GRN/2526/004", poNo: "PO/2526/002", date: "2025-05-10",
    vendor: "Tata Steel Ltd.", site: "Tower B", warehouse: "Site B Store",
    receivedBy: "Santosh Kadam", vehicleNo: "MH04-GH-2234", dcNo: "TATA/DC/9999",
    status: "Pending QC", remarks: "Second tranche — 8 MT received",
    items: [
      { material: "Fe500 TMT Bars 12mm", materialCode: "STL-002", unit: "MT", orderedQty: 8, receivedQty: 8, acceptedQty: 0, rejectedQty: 0, rate: 60000, amount: 480000, batchNo: "TATA-B25-134", barcode: "8903026789678" },
    ],
  },
  {
    id: "GRN005", grnNo: "GRN/2526/005", poNo: "PO/2526/005", date: "2025-05-18",
    vendor: "Pidilite Industries Ltd.", site: "Tower A", warehouse: "Site A Store",
    receivedBy: "Gajanan More", vehicleNo: "MH43-PQ-8823", dcNo: "PIL/DC/14323",
    status: "QC Failed", qcBy: "Vikram Patil", qcDate: "2025-05-18",
    remarks: "Packaging damaged — 3 drums Dr Fixit rejected",
    items: [
      { material: "Dr. Fixit Waterproof LW+", materialCode: "HRD-002", unit: "Ltrs", orderedQty: 500, receivedQty: 480, acceptedQty: 450, rejectedQty: 30, rate: 180, amount: 81000, batchNo: "PIL-DF-2505", barcode: "8901698345012" },
    ],
  },
];

// ── Stock Items ─────────────────────────────────────────────────────────────────

export const mockStockItems: StockItem[] = [
  { id: "S01", code: "CEM-001", barcode: "8901030123456", name: "OPC 53 Grade Cement", category: "Cement & Concrete", unit: "Bags", currentStock: 420, minStock: 500, maxStock: 3000, reorderQty: 1000, rate: 420, value: 176400, warehouse: "Site A Store", site: "Tower A", lastReceived: "2025-04-12", lastIssued: "2025-05-15", supplier: "Ambuja Cements Ltd.", hsn: "2523" },
  { id: "S02", code: "CEM-002", barcode: "8901030123789", name: "PPC Cement", category: "Cement & Concrete", unit: "Bags", currentStock: 180, minStock: 300, maxStock: 2000, reorderQty: 800, rate: 420, value: 75600, warehouse: "Site C Store", site: "Tower C", lastReceived: "2025-04-12", lastIssued: "2025-05-14", supplier: "Ultratech Cement Ltd.", hsn: "2523" },
  { id: "S03", code: "STL-002", barcode: "8903026789012", name: "Fe500 TMT Bars 12mm", category: "Steel & Iron", unit: "MT", currentStock: 12, minStock: 15, maxStock: 100, reorderQty: 25, rate: 60000, value: 720000, warehouse: "Site B Store", site: "Tower B", lastReceived: "2025-04-26", lastIssued: "2025-05-12", supplier: "Tata Steel Ltd.", hsn: "7213" },
  { id: "S04", code: "STL-003", barcode: "8903026789234", name: "Fe500 TMT Bars 16mm", category: "Steel & Iron", unit: "MT", currentStock: 0, minStock: 10, maxStock: 80, reorderQty: 20, rate: 62000, value: 0, warehouse: "Site A Store", site: "Tower A", lastReceived: "2025-03-20", lastIssued: "2025-05-10", supplier: "Tata Steel Ltd.", hsn: "7213" },
  { id: "S05", code: "STL-005", barcode: "8903026789345", name: "Binding Wire", category: "Steel & Iron", unit: "Kgs", currentStock: 850, minStock: 200, maxStock: 2000, reorderQty: 500, rate: 80, value: 68000, warehouse: "Main Store", site: "Tower A", lastReceived: "2025-04-26", lastIssued: "2025-05-16", supplier: "Tata Steel Ltd.", hsn: "7217" },
  { id: "S06", code: "ELE-001", barcode: "8904123456789", name: "2.5 sqmm FR Cable", category: "Electrical", unit: "Mtrs", currentStock: 12000, minStock: 2000, maxStock: 20000, reorderQty: 5000, rate: 18, value: 216000, warehouse: "Main Store", site: "Tower C", lastReceived: "2025-03-30", lastIssued: "2025-05-13", supplier: "Polycab India Ltd.", hsn: "8544" },
  { id: "S07", code: "ELE-002", barcode: "8904123456012", name: "4 sqmm FR Cable", category: "Electrical", unit: "Mtrs", currentStock: 3200, minStock: 1000, maxStock: 10000, reorderQty: 2500, rate: 28, value: 89600, warehouse: "Main Store", site: "Tower C", lastReceived: "2025-03-30", lastIssued: "2025-05-13", supplier: "Polycab India Ltd.", hsn: "8544" },
  { id: "S08", code: "PLB-002", barcode: "8902012345901", name: "CPVC Pipe 25mm", category: "Plumbing", unit: "Mtrs", currentStock: 320, minStock: 200, maxStock: 2000, reorderQty: 500, rate: 110, value: 35200, warehouse: "Main Store", site: "Basement Parking", lastReceived: "2025-05-06", lastIssued: "2025-05-14", supplier: "Astral Pipes Ltd.", hsn: "3917" },
  { id: "S09", code: "PLB-003", barcode: "8902012345678", name: "UPVC Pipe 110mm", category: "Plumbing", unit: "Mtrs", currentStock: 180, minStock: 100, maxStock: 1000, reorderQty: 300, rate: 180, value: 32400, warehouse: "Main Store", site: "Basement Parking", lastReceived: "2025-05-06", lastIssued: "2025-05-15", supplier: "Astral Pipes Ltd.", hsn: "3917" },
  { id: "S10", code: "TIL-001", barcode: "8906789012345", name: "Vitrified Tiles 600x600", category: "Tiles & Flooring", unit: "Sqft", currentStock: 4500, minStock: 1000, maxStock: 15000, reorderQty: 5000, rate: 85, value: 382500, warehouse: "Main Store", site: "Club House", lastReceived: "2025-04-20", lastIssued: "2025-05-16", supplier: "Somany Ceramics Ltd.", hsn: "6908" },
  { id: "S11", code: "SAF-001", barcode: "8907890123456", name: "Safety Helmet IS:2925", category: "Safety Equipment", unit: "Nos", currentStock: 28, minStock: 50, maxStock: 300, reorderQty: 100, rate: 350, value: 9800, warehouse: "Main Store", site: "Tower B", lastReceived: "2025-03-15", lastIssued: "2025-05-10", supplier: "Karam Safety Pvt. Ltd.", hsn: "6506" },
  { id: "S12", code: "HRD-002", barcode: "8901698345012", name: "Dr. Fixit Waterproof LW+", category: "Hardware", unit: "Ltrs", currentStock: 450, minStock: 200, maxStock: 2000, reorderQty: 500, rate: 180, value: 81000, warehouse: "Site A Store", site: "Tower A", lastReceived: "2025-05-18", lastIssued: "2025-05-12", supplier: "Pidilite Industries Ltd.", hsn: "3214" },
  { id: "S13", code: "CEM-003", barcode: "8901030124000", name: "Ready Mix Concrete M25", category: "Cement & Concrete", unit: "Cum", currentStock: 0, minStock: 20, maxStock: 200, reorderQty: 50, rate: 5800, value: 0, warehouse: "Site B Store", site: "Tower B", lastReceived: "2025-04-30", lastIssued: "2025-05-01", supplier: "Ambuja Cements Ltd.", hsn: "3824" },
  { id: "S14", code: "ELE-003", barcode: "8904123456345", name: "PVC Conduit Pipe", category: "Electrical", unit: "Mtrs", currentStock: 2800, minStock: 500, maxStock: 5000, reorderQty: 1000, rate: 25, value: 70000, warehouse: "Main Store", site: "Tower C", lastReceived: "2025-03-30", lastIssued: "2025-05-11", supplier: "Polycab India Ltd.", hsn: "3917" },
  { id: "S15", code: "SAF-003", barcode: "8907890123789", name: "Reflective Jacket", category: "Safety Equipment", unit: "Nos", currentStock: 15, minStock: 30, maxStock: 200, reorderQty: 60, rate: 250, value: 3750, warehouse: "Main Store", site: "Tower A", lastReceived: "2025-03-15", lastIssued: "2025-05-14", supplier: "Karam Safety Pvt. Ltd.", hsn: "6211" },
];

// ── Material Issues ─────────────────────────────────────────────────────────────

export const mockMaterialIssues: MaterialIssue[] = [
  {
    id: "MI001", issueNo: "MI/2526/001", date: "2025-04-15", site: "Tower A",
    issuedFrom: "Site A Store", requestedBy: "Vivek Tiwari", approvedBy: "Ramesh Iyer",
    purpose: "Column concreting — 4th floor, Grid A-C", status: "Issued",
    total: 294000, remarks: "Used for 4th floor column work",
    items: [
      { material: "OPC 53 Grade Cement", materialCode: "CEM-001", unit: "Bags", requestedQty: 300, issuedQty: 300, rate: 420, amount: 126000 },
      { material: "Fe500 TMT Bars 12mm", materialCode: "STL-002", unit: "MT", requestedQty: 2.8, issuedQty: 2.8, rate: 60000, amount: 168000 },
    ],
  },
  {
    id: "MI002", issueNo: "MI/2526/002", date: "2025-04-22", site: "Tower B",
    issuedFrom: "Site B Store", requestedBy: "Sunil Yadav", approvedBy: "Ramesh Iyer",
    purpose: "Slab shuttering & reinforcement — 3rd floor", status: "Issued",
    total: 576000, remarks: "For 3rd floor slab work",
    items: [
      { material: "Fe500 TMT Bars 12mm", materialCode: "STL-002", unit: "MT", requestedQty: 8, issuedQty: 8, rate: 60000, amount: 480000 },
      { material: "Binding Wire", materialCode: "STL-005", unit: "Kgs", requestedQty: 200, issuedQty: 200, rate: 80, amount: 16000 },
      { material: "OPC 53 Grade Cement", materialCode: "CEM-001", unit: "Bags", requestedQty: 200, issuedQty: 200, rate: 420, amount: 84000 },
    ],
  },
  {
    id: "MI003", issueNo: "MI/2526/003", date: "2025-05-05", site: "Basement Parking",
    issuedFrom: "Main Store", requestedBy: "Suresh Nair", approvedBy: "Ramesh Iyer",
    purpose: "Drainage pipe laying — Level B1", status: "Issued",
    total: 73000, remarks: "Complete",
    items: [
      { material: "UPVC Pipe 110mm", materialCode: "PLB-003", unit: "Mtrs", requestedQty: 200, issuedQty: 200, rate: 180, amount: 36000 },
      { material: "CPVC Pipe 25mm", materialCode: "PLB-002", unit: "Mtrs", requestedQty: 150, issuedQty: 150, rate: 110, amount: 16500 },
      { material: "Dr. Fixit Waterproof LW+", materialCode: "HRD-002", unit: "Ltrs", requestedQty: 100, issuedQty: 100, rate: 180, amount: 18000 },
    ],
  },
  {
    id: "MI004", issueNo: "MI/2526/004", date: "2025-05-12", site: "Tower C",
    issuedFrom: "Main Store", requestedBy: "Anita Kulkarni",
    purpose: "Electrical first fix — 5th & 6th floor", status: "Pending Approval",
    total: 140400, remarks: "Requested for electrical team",
    items: [
      { material: "2.5 sqmm FR Cable", materialCode: "ELE-001", unit: "Mtrs", requestedQty: 4000, issuedQty: 0, rate: 18, amount: 72000 },
      { material: "4 sqmm FR Cable", materialCode: "ELE-002", unit: "Mtrs", requestedQty: 1500, issuedQty: 0, rate: 28, amount: 42000 },
      { material: "PVC Conduit Pipe", materialCode: "ELE-003", unit: "Mtrs", requestedQty: 1000, issuedQty: 0, rate: 25, amount: 25000 },
    ],
  },
  {
    id: "MI005", issueNo: "MI/2526/005", date: "2025-05-16", site: "Club House",
    issuedFrom: "Main Store", requestedBy: "Dinesh Patil", approvedBy: "Ramesh Iyer",
    purpose: "Tile laying — ground floor lobby", status: "Issued",
    total: 382500, remarks: "Delivered to site",
    items: [
      { material: "Vitrified Tiles 600x600", materialCode: "TIL-001", unit: "Sqft", requestedQty: 4500, issuedQty: 4500, rate: 85, amount: 382500 },
    ],
  },
  {
    id: "MI006", issueNo: "MI/2526/006", date: "2025-05-17", site: "Tower A",
    issuedFrom: "Site A Store", requestedBy: "Vivek Tiwari",
    purpose: "Waterproofing — terrace parapet", status: "Requested",
    total: 54000, remarks: "",
    items: [
      { material: "Dr. Fixit Waterproof LW+", materialCode: "HRD-002", unit: "Ltrs", requestedQty: 300, issuedQty: 0, rate: 180, amount: 54000 },
    ],
  },
];

// ── Warehouses ───────────────────────────────────────────────────────────────────

export const mockWarehouses: Warehouse[] = [
  { id: "WH01", code: "WH-MAIN", name: "Main Store", site: "All Sites", incharge: "Gajanan More", phone: "9821056789", capacity: 5000, utilized: 3420, totalItems: 142, totalValue: 8200000, stockAlerts: 3, lastAudit: "2025-05-01" },
  { id: "WH02", code: "WH-SITA", name: "Site A Store", site: "Tower A", incharge: "Manoj Shinde", phone: "9867234567", capacity: 1500, utilized: 980, totalItems: 38, totalValue: 2100000, stockAlerts: 2, lastAudit: "2025-05-05" },
  { id: "WH03", code: "WH-SITB", name: "Site B Store", site: "Tower B", incharge: "Prakash Wagh", phone: "9745678901", capacity: 1500, utilized: 720, totalItems: 24, totalValue: 1600000, stockAlerts: 1, lastAudit: "2025-05-03" },
  { id: "WH04", code: "WH-SITC", name: "Site C Store", site: "Tower C", incharge: "Kaveri Patil", phone: "9632890123", capacity: 1200, utilized: 410, totalItems: 19, totalValue: 980000, stockAlerts: 2, lastAudit: "2025-04-28" },
  { id: "WH05", code: "WH-CLUB", name: "Club House Store", site: "Club House", incharge: "Narayan Das", phone: "9512345678", capacity: 800, utilized: 620, totalItems: 28, totalValue: 1400000, stockAlerts: 0, lastAudit: "2025-05-10" },
];

// ── Category stock summary (for charts) ─────────────────────────────────────────

export const categoryStockSummary = [
  { category: "Cement & Concrete", items: 4, value: 252000, alerts: 3 },
  { category: "Steel & Iron", items: 3, value: 788000, alerts: 2 },
  { category: "Electrical", items: 4, value: 375600, alerts: 0 },
  { category: "Plumbing", items: 3, value: 67600, alerts: 0 },
  { category: "Tiles & Flooring", items: 2, value: 382500, alerts: 0 },
  { category: "Hardware", items: 2, value: 81000, alerts: 0 },
  { category: "Safety Equipment", items: 3, value: 13550, alerts: 2 },
  { category: "Tools & Machinery", items: 1, value: 45000, alerts: 0 },
];

export const monthlyProcurement = [
  { month: "Apr", po: 5, value: 2226000 },
  { month: "May", po: 8, value: 4188000 },
  { month: "Jun", po: 6, value: 3100000 },
  { month: "Jul", po: 9, value: 5200000 },
  { month: "Aug", po: 7, value: 4800000 },
  { month: "Sep", po: 5, value: 2900000 },
  { month: "Oct", po: 10, value: 6100000 },
  { month: "Nov", po: 8, value: 4700000 },
  { month: "Dec", po: 6, value: 3600000 },
  { month: "Jan", po: 11, value: 7200000 },
  { month: "Feb", po: 9, value: 5400000 },
  { month: "Mar", po: 7, value: 4100000 },
];
