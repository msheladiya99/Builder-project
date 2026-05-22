export interface NavUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  avatar?: string;
  tenantId?: string;
}

export interface Tenant {
  id: string;
  name: string;
  shortName: string;
  plan: "starter" | "growth" | "enterprise";
  logo: string;
  city: string;
  gstin: string;
  projects: number;
}

export interface Project {
  id: string;
  tenantId: string;
  name: string;
  rera: string;
  status: string;
  progress: number;
  location: string;
  completion: string;
  budget: string;
  spent: string;
  image: string;
  startDate?: string;
  endDate?: string;
  manager?: string;
  description?: string;
  towers?: Tower[];
}

export interface Tower {
  id: string;
  name: string;
  status: string;
  floors: number;
  unitsPerFloor: number;
  wings: string[];
  progress: number;
  completion: string;
}

export interface Flat {
  id: string;
  number: string;
  floor: number;
  wing: string;
  type: string;
  status: "available" | "booked" | "blocked" | "possession";
  price: number;
  area: number;
}

export interface FlatOwner {
  id: string;
  flatId: string;
  name: string;
  email: string;
  phone: string;
  pan: string;
  aadhaar: string; // Will be encrypted on db level
  address: string;
  status: string;
}

export interface CoApplicant {
  id: string;
  flatOwnerId: string;
  name: string;
  email: string;
  phone: string;
  relationship: string;
}

export interface Worker {
  id: string;
  name: string;
  trade: string;
  contractorId: string;
  dailyWage: number;
  phone: string;
  aadhaar: string; // Encrypted on db level
  status: "active" | "inactive" | "absent";
  skills: string[];
  tower: string;
}

export interface AttendanceRecord {
  id: string;
  workerId: string;
  date: string;
  status: "present" | "absent" | "half-day" | "holiday";
  inTime?: string;
  outTime?: string;
  overtime?: number;
}

export interface Contractor {
  id: string;
  name: string;
  trade: string;
  workersCount: number;
  ratePerDay: number;
  advance: number;
  totalPayable: number;
  paid: number;
  status: "active" | "closed";
}

export interface MaterialStock {
  id: string;
  materialName: string;
  quantity: number;
  unit: string;
  minLevel: number;
}

export interface PurchaseOrder {
  id: string;
  vendorId: string;
  date: string;
  total: number;
  status: "draft" | "sent" | "received" | "cancelled";
}

export interface Vendor {
  id: string;
  name: string;
  contact: string;
  gstin: string;
  phone: string;
  address: string;
}
