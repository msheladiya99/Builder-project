export type FlatStatus = "Available" | "Booked" | "Sold" | "Registered" | "Cancelled";

export interface Flat {
  id: string;
  wing: string;
  floor: number;
  floorLabel: string;
  unit: number;
  unitNo: string;
  bhk: "1BHK" | "2BHK" | "3BHK";
  carpetArea: number;
  superArea: number;
  facing: string;
  status: FlatStatus;
  basePrice: number;
  parkingPrice: number;
  clubMembership: number;
  maintenanceDeposit: number;
  totalPrice: number;
  ownerId?: string;
  ownerName?: string;
  ownerPhone?: string;
  ownerEmail?: string;
  bookingDate?: string;
  agreementDate?: string;
  registrationDate?: string;
  remarks?: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  pan: string;
  aadhar: string;
  address: string;
  kycStatus: "Pending" | "Verified" | "Rejected";
}

export interface FlatDocument {
  id: string;
  flatId: string;
  category: string;
  name: string;
  status: "Pending" | "Uploaded" | "Verified" | "Rejected";
  uploadedDate?: string;
  fileSize?: string;
  fileType?: string;
}

export const statusConfig: Record<FlatStatus, { color: string; bg: string; border: string; dot: string; mapBg: string }> = {
  Available:  { color: "text-success",      bg: "bg-success/10",     border: "border-success/30",     dot: "bg-success",     mapBg: "bg-success" },
  Booked:     { color: "text-warning",      bg: "bg-warning/10",     border: "border-warning/30",     dot: "bg-warning",     mapBg: "bg-warning" },
  Sold:       { color: "text-primary",      bg: "bg-primary/10",     border: "border-primary/30",     dot: "bg-primary",     mapBg: "bg-primary" },
  Registered: { color: "text-purple-600 dark:text-purple-400", bg: "bg-purple-50 dark:bg-purple-950/30", border: "border-purple-200 dark:border-purple-800", dot: "bg-purple-500", mapBg: "bg-purple-500" },
  Cancelled:  { color: "text-destructive",  bg: "bg-destructive/10", border: "border-destructive/30", dot: "bg-destructive", mapBg: "bg-destructive/70" },
};

const wings = ["A", "B", "C", "D"];
const facings = ["East", "West", "North", "South", "North-East", "North-West"];
const bhkPerUnit: Record<number, "1BHK" | "2BHK" | "3BHK"> = { 1: "1BHK", 2: "2BHK", 3: "2BHK", 4: "3BHK" };
const carpetPerBhk: Record<string, number> = { "1BHK": 450, "2BHK": 650, "3BHK": 950 };
const superPerBhk: Record<string, number> = { "1BHK": 582, "2BHK": 841, "3BHK": 1230 };
const basePricePerBhk: Record<string, number> = { "1BHK": 4500000, "2BHK": 6500000, "3BHK": 9500000 };

const owners = [
  { id: "c1", name: "Rajesh Sharma",    phone: "9876543210", email: "rajesh.sharma@gmail.com",    pan: "ABCPS1234D", aadhar: "1234-5678-9012", address: "12, MG Road, Pune" },
  { id: "c2", name: "Priya Patel",      phone: "9812345678", email: "priya.patel@hotmail.com",    pan: "BNCPP5678E", aadhar: "2345-6789-0123", address: "45, Baner, Pune" },
  { id: "c3", name: "Vikram Mehta",     phone: "9898765432", email: "vikram.mehta@outlook.com",   pan: "CMQVM3456F", aadhar: "3456-7890-1234", address: "78, Hinjewadi, Pune" },
  { id: "c4", name: "Sunita Agarwal",   phone: "9765432109", email: "sunita.agarwal@yahoo.com",   pan: "DNRSA7890G", aadhar: "4567-8901-2345", address: "22, Wakad, Pune" },
  { id: "c5", name: "Amit Desai",       phone: "9934567890", email: "amit.desai@gmail.com",       pan: "EOSAD2345H", aadhar: "5678-9012-3456", address: "56, Viman Nagar, Pune" },
  { id: "c6", name: "Kavita Joshi",     phone: "9823456789", email: "kavita.joshi@rediff.com",    pan: "FPTJK6789I", aadhar: "6789-0123-4567", address: "33, Kothrud, Pune" },
  { id: "c7", name: "Suresh Nair",      phone: "9745678901", email: "suresh.nair@gmail.com",      pan: "GQUSN1234J", aadhar: "7890-1234-5678", address: "67, Aundh, Pune" },
  { id: "c8", name: "Meena Krishnan",   phone: "9867890123", email: "meena.krishnan@gmail.com",   pan: "HRVMK5678K", aadhar: "8901-2345-6789", address: "89, Hadapsar, Pune" },
];

let ownerIdx = 0;
function getOwner(status: FlatStatus) {
  if (status === "Available" || status === "Cancelled") return {};
  const o = owners[ownerIdx % owners.length];
  ownerIdx++;
  return {
    ownerId: o.id,
    ownerName: o.name,
    ownerPhone: o.phone,
    ownerEmail: o.email,
  };
}

function getBookingDate(status: FlatStatus): Record<string, string> {
  if (status === "Available" || status === "Cancelled") return {};
  const dates: Record<string, string> = { bookingDate: "2024-03-15" };
  if (status === "Sold" || status === "Registered") dates.agreementDate = "2024-04-20";
  if (status === "Registered") dates.registrationDate = "2024-06-10";
  return dates;
}

function pickStatus(wingIdx: number, floorIdx: number, unitIdx: number): FlatStatus {
  const seed = (wingIdx * 100 + floorIdx * 10 + unitIdx) % 20;
  if (seed < 7) return "Available";
  if (seed < 11) return "Booked";
  if (seed < 15) return "Sold";
  if (seed < 18) return "Registered";
  return "Cancelled";
}

function generateFlats(): Flat[] {
  const flats: Flat[] = [];
  let flatIdx = 0;
  wings.forEach((wing, wingIdx) => {
    for (let floor = 0; floor <= 14; floor++) {
      const floorLabel = floor === 0 ? "G" : String(floor);
      for (let unit = 1; unit <= 4; unit++) {
        const bhk = bhkPerUnit[unit];
        const status = pickStatus(wingIdx, floor, unit);
        const basePrice = basePricePerBhk[bhk] + floor * 25000;
        const parking = 200000;
        const club = 100000;
        const maintenance = 50000;
        const gst = Math.round((basePrice + parking) * 0.05);
        const total = basePrice + parking + club + maintenance + gst;
        const flat: Flat = {
          id: `flat-${wing}-${floorLabel}-0${unit}`,
          wing,
          floor,
          floorLabel,
          unit,
          unitNo: `${wing}-${floorLabel}-0${unit}`,
          bhk,
          carpetArea: carpetPerBhk[bhk],
          superArea: superPerBhk[bhk],
          facing: facings[(flatIdx + unit) % facings.length],
          status,
          basePrice,
          parkingPrice: parking,
          clubMembership: club,
          maintenanceDeposit: maintenance,
          totalPrice: total,
          ...getOwner(status),
          ...getBookingDate(status),
        };
        flats.push(flat);
        flatIdx++;
      }
    }
  });
  return flats;
}

export const mockFlats: Flat[] = generateFlats();

export const mockCustomers: Customer[] = owners.map(o => ({
  ...o,
  kycStatus: "Verified" as const,
}));

export const mockDocuments: FlatDocument[] = [
  { id: "d1", flatId: "flat-A-1-01", category: "Booking", name: "Booking Application Form", status: "Verified", uploadedDate: "2024-03-16", fileSize: "245 KB", fileType: "PDF" },
  { id: "d2", flatId: "flat-A-1-01", category: "KYC", name: "PAN Card Copy", status: "Verified", uploadedDate: "2024-03-16", fileSize: "180 KB", fileType: "PDF" },
  { id: "d3", flatId: "flat-A-1-01", category: "KYC", name: "Aadhar Card Copy", status: "Verified", uploadedDate: "2024-03-17", fileSize: "310 KB", fileType: "PDF" },
  { id: "d4", flatId: "flat-A-1-01", category: "Payment", name: "Booking Amount Receipt", status: "Verified", uploadedDate: "2024-03-18", fileSize: "95 KB", fileType: "PDF" },
  { id: "d5", flatId: "flat-A-1-01", category: "Legal", name: "Agreement for Sale", status: "Uploaded", uploadedDate: "2024-04-21", fileSize: "1.2 MB", fileType: "PDF" },
  { id: "d6", flatId: "flat-A-1-01", category: "Payment", name: "2nd Instalment Receipt", status: "Uploaded", uploadedDate: "2024-05-10", fileSize: "88 KB", fileType: "PDF" },
  { id: "d7", flatId: "flat-A-1-01", category: "Legal", name: "Sale Deed / Registration", status: "Pending", fileType: "PDF" },
  { id: "d8", flatId: "flat-A-1-01", category: "NOC", name: "Bank NOC / Clearance", status: "Pending", fileType: "PDF" },
];

export function fmt(n: number) {
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(2)} Cr`;
  if (n >= 100000) return `₹${(n / 100000).toFixed(2)} L`;
  return `₹${n.toLocaleString("en-IN")}`;
}
