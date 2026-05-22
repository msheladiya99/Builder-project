export type KYCStatus = "Not Started" | "In Progress" | "Verified" | "Rejected" | "Expired";
export type StepStatus = "Pending" | "Uploaded" | "Under Review" | "Verified" | "Rejected";
export type DocCategory = "Identity" | "Address" | "Income" | "Bank" | "Property";
export type CommType = "call" | "email" | "whatsapp" | "sms" | "visit" | "note";

export interface OCRData {
  [key: string]: string;
}

export interface CoApplicant {
  id: string;
  name: string;
  relation: "Spouse" | "Parent" | "Sibling" | "Child" | "Friend" | "Other";
  phone: string;
  email: string;
  pan: string;
  aadhar: string;
  dob: string;
  occupation: string;
  kycStatus: KYCStatus;
  aadhaarStatus: StepStatus;
  panStatus: StepStatus;
}

export interface Nominee {
  id: string;
  name: string;
  relation: string;
  dob: string;
  share: number;
  isMinor: boolean;
  guardian?: string;
  guardianRelation?: string;
  aadhar?: string;
  phone?: string;
}

export interface KYCDocument {
  id: string;
  ownerId: string;
  type: string;
  category: DocCategory;
  name: string;
  status: StepStatus;
  uploadedDate?: string;
  verifiedDate?: string;
  expiryDate?: string;
  fileSize?: string;
  fileType?: string;
  ocrData?: OCRData;
  remarks?: string;
  isRequired: boolean;
}

export interface ActivityEvent {
  id: string;
  type: CommType | "kyc_update" | "document" | "payment" | "system";
  title: string;
  description: string;
  date: string;
  time: string;
  agent?: string;
  direction?: "inbound" | "outbound";
  duration?: string;
  status?: "completed" | "missed" | "pending";
  tags?: string[];
}

export interface Owner {
  id: string;
  name: string;
  salutation: "Mr." | "Mrs." | "Ms." | "Dr." | "CA";
  phone: string;
  altPhone?: string;
  email: string;
  pan: string;
  aadhar: string;
  dob: string;
  gender: "Male" | "Female" | "Other";
  occupation: string;
  employer?: string;
  annualIncome: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  nationality: string;
  kycStatus: KYCStatus;
  kycScore: number;
  aadhaarStatus: StepStatus;
  panStatus: StepStatus;
  coApplicants: CoApplicant[];
  nominees: Nominee[];
  linkedFlats: string[];
  createdAt: string;
  relationship: string;
  rmName: string;
  rmPhone: string;
  bankName?: string;
  bankAccount?: string;
  ifsc?: string;
}

export const kycStatusConfig: Record<KYCStatus, { color: string; bg: string; border: string; label: string }> = {
  "Not Started":  { color: "text-muted-foreground", bg: "bg-muted",          border: "border-border",          label: "Not Started" },
  "In Progress":  { color: "text-warning",           bg: "bg-warning/10",     border: "border-warning/30",      label: "In Progress" },
  "Verified":     { color: "text-success",           bg: "bg-success/10",     border: "border-success/30",      label: "Verified" },
  "Rejected":     { color: "text-destructive",       bg: "bg-destructive/10", border: "border-destructive/30",  label: "Rejected" },
  "Expired":      { color: "text-orange-500",        bg: "bg-orange-50 dark:bg-orange-950/20", border: "border-orange-200 dark:border-orange-800", label: "Expired" },
};

export const stepStatusConfig: Record<StepStatus, { color: string; bg: string; border: string; dot: string }> = {
  Pending:       { color: "text-muted-foreground", bg: "bg-muted",          border: "border-border",         dot: "bg-muted-foreground/40" },
  Uploaded:      { color: "text-info",             bg: "bg-info/10",        border: "border-info/30",        dot: "bg-info" },
  "Under Review":{ color: "text-warning",          bg: "bg-warning/10",     border: "border-warning/30",     dot: "bg-warning" },
  Verified:      { color: "text-success",          bg: "bg-success/10",     border: "border-success/30",     dot: "bg-success" },
  Rejected:      { color: "text-destructive",      bg: "bg-destructive/10", border: "border-destructive/30", dot: "bg-destructive" },
};

export const mockOwners: Owner[] = [
  {
    id: "o1",
    salutation: "Mr.",
    name: "Rajesh Kumar Sharma",
    phone: "9876543210",
    altPhone: "9812341234",
    email: "rajesh.sharma@gmail.com",
    pan: "ABCPS1234D",
    aadhar: "2345 6789 0123",
    dob: "1982-07-15",
    gender: "Male",
    occupation: "IT Professional",
    employer: "Infosys Ltd.",
    annualIncome: "₹18,00,000",
    address: "12, Mayur Colony, Kothrud",
    city: "Pune",
    state: "Maharashtra",
    pincode: "411038",
    nationality: "Indian",
    kycStatus: "Verified",
    kycScore: 92,
    aadhaarStatus: "Verified",
    panStatus: "Verified",
    linkedFlats: ["flat-A-3-01"],
    createdAt: "2024-01-10",
    relationship: "Primary Owner",
    rmName: "Amit Deshpande",
    rmPhone: "9823456789",
    bankName: "HDFC Bank",
    bankAccount: "5021004567890",
    ifsc: "HDFC0001234",
    coApplicants: [
      {
        id: "ca1",
        name: "Sunita Rajesh Sharma",
        relation: "Spouse",
        phone: "9765432109",
        email: "sunita.sharma@gmail.com",
        pan: "BCQST5678E",
        aadhar: "3456 7890 1234",
        dob: "1985-03-22",
        occupation: "Teacher",
        kycStatus: "Verified",
        aadhaarStatus: "Verified",
        panStatus: "Verified",
      },
    ],
    nominees: [
      { id: "n1", name: "Aryan Sharma", relation: "Son", dob: "2010-11-05", share: 60, isMinor: true, guardian: "Sunita Rajesh Sharma", guardianRelation: "Mother" },
      { id: "n2", name: "Sunita Rajesh Sharma", relation: "Spouse", dob: "1985-03-22", share: 40, isMinor: false, aadhar: "3456 7890 1234", phone: "9765432109" },
    ],
  },
  {
    id: "o2",
    salutation: "Mrs.",
    name: "Priya Vikram Patel",
    phone: "9812345678",
    email: "priya.patel@hotmail.com",
    pan: "BNCPP5678E",
    aadhar: "4567 8901 2345",
    dob: "1990-04-18",
    gender: "Female",
    occupation: "Doctor",
    employer: "Ruby Hall Clinic",
    annualIncome: "₹32,00,000",
    address: "45, Baner Road, Baner",
    city: "Pune",
    state: "Maharashtra",
    pincode: "411045",
    nationality: "Indian",
    kycStatus: "In Progress",
    kycScore: 58,
    aadhaarStatus: "Verified",
    panStatus: "Under Review",
    linkedFlats: ["flat-B-5-02"],
    createdAt: "2024-02-20",
    relationship: "Primary Owner",
    rmName: "Sneha Kulkarni",
    rmPhone: "9956789012",
    coApplicants: [],
    nominees: [
      { id: "n3", name: "Vikram Patel", relation: "Spouse", dob: "1988-09-12", share: 100, isMinor: false, phone: "9834567890" },
    ],
  },
  {
    id: "o3",
    salutation: "Dr.",
    name: "Suresh Nair",
    phone: "9745678901",
    email: "suresh.nair@gmail.com",
    pan: "GQUSN1234J",
    aadhar: "5678 9012 3456",
    dob: "1975-12-01",
    gender: "Male",
    occupation: "Entrepreneur",
    employer: "Self Employed",
    annualIncome: "₹55,00,000",
    address: "67, Aundh IT Park Road",
    city: "Pune",
    state: "Maharashtra",
    pincode: "411007",
    nationality: "Indian",
    kycStatus: "Not Started",
    kycScore: 12,
    aadhaarStatus: "Pending",
    panStatus: "Pending",
    linkedFlats: ["flat-C-8-04"],
    createdAt: "2024-03-05",
    relationship: "Primary Owner",
    rmName: "Amit Deshpande",
    rmPhone: "9823456789",
    coApplicants: [],
    nominees: [],
  },
];

export const mockDocuments: KYCDocument[] = [
  // Owner o1 - Rajesh
  { id: "d1",  ownerId: "o1", type: "Aadhaar Card",         category: "Identity", name: "Aadhaar Card (Front + Back)", status: "Verified",      uploadedDate: "2024-01-12", verifiedDate: "2024-01-14", fileSize: "380 KB", fileType: "PDF",  isRequired: true,  ocrData: { "Aadhaar No": "2345 6789 0123", "Name": "RAJESH KUMAR SHARMA", "DOB": "15/07/1982", "Gender": "MALE", "Address": "12, Mayur Colony, Kothrud, Pune - 411038" } },
  { id: "d2",  ownerId: "o1", type: "PAN Card",              category: "Identity", name: "PAN Card",                    status: "Verified",      uploadedDate: "2024-01-12", verifiedDate: "2024-01-14", fileSize: "210 KB", fileType: "PDF",  isRequired: true,  ocrData: { "PAN No": "ABCPS1234D", "Name": "RAJESH KUMAR SHARMA", "Father's Name": "MOHAN LAL SHARMA", "DOB": "15/07/1982" } },
  { id: "d3",  ownerId: "o1", type: "Passport Photo",        category: "Identity", name: "Recent Photograph",           status: "Verified",      uploadedDate: "2024-01-12", verifiedDate: "2024-01-13", fileSize: "145 KB", fileType: "JPG",  isRequired: true },
  { id: "d4",  ownerId: "o1", type: "Electricity Bill",      category: "Address",  name: "Electricity Bill (Latest)",   status: "Verified",      uploadedDate: "2024-01-15", verifiedDate: "2024-01-16", fileSize: "520 KB", fileType: "PDF",  isRequired: true,  expiryDate: "2024-09-30", ocrData: { "Consumer Name": "RAJESH K SHARMA", "Address": "12, Mayur Colony, Kothrud, Pune", "Bill Date": "01 Jan 2024", "Bill Period": "Dec 2023" } },
  { id: "d5",  ownerId: "o1", type: "Salary Slip",           category: "Income",   name: "Salary Slip (Last 3 months)", status: "Verified",      uploadedDate: "2024-01-15", verifiedDate: "2024-01-17", fileSize: "890 KB", fileType: "PDF",  isRequired: true,  ocrData: { "Employer": "Infosys Ltd.", "Employee Name": "Rajesh K Sharma", "Month": "December 2023", "Gross Salary": "₹1,50,000", "Net Salary": "₹1,24,500" } },
  { id: "d6",  ownerId: "o1", type: "Form 16",               category: "Income",   name: "Form 16 (FY 2022-23)",        status: "Verified",      uploadedDate: "2024-01-15", verifiedDate: "2024-01-18", fileSize: "1.2 MB", fileType: "PDF",  isRequired: false },
  { id: "d7",  ownerId: "o1", type: "Bank Statement",        category: "Bank",     name: "Bank Statement (6 months)",   status: "Verified",      uploadedDate: "2024-01-18", verifiedDate: "2024-01-20", fileSize: "2.1 MB", fileType: "PDF",  isRequired: true,  ocrData: { "Bank": "HDFC Bank", "Account No": "XXXXXXX7890", "Period": "Jul 2023 – Dec 2023", "Avg Balance": "₹2,45,000" } },
  { id: "d8",  ownerId: "o1", type: "Cancelled Cheque",      category: "Bank",     name: "Cancelled Cheque",            status: "Verified",      uploadedDate: "2024-01-18", verifiedDate: "2024-01-19", fileSize: "185 KB", fileType: "JPG",  isRequired: true },
  { id: "d9",  ownerId: "o1", type: "Agreement for Sale",    category: "Property", name: "Agreement for Sale",          status: "Verified",      uploadedDate: "2024-03-10", verifiedDate: "2024-03-12", fileSize: "3.4 MB", fileType: "PDF",  isRequired: true },
  { id: "d10", ownerId: "o1", type: "NOC",                   category: "Property", name: "Builder NOC",                 status: "Under Review",  uploadedDate: "2024-04-01",                              fileSize: "650 KB", fileType: "PDF",  isRequired: false },

  // Owner o2 - Priya
  { id: "d11", ownerId: "o2", type: "Aadhaar Card",         category: "Identity", name: "Aadhaar Card (Front + Back)", status: "Verified",      uploadedDate: "2024-02-22", verifiedDate: "2024-02-24", fileSize: "410 KB", fileType: "PDF",  isRequired: true,  ocrData: { "Aadhaar No": "4567 8901 2345", "Name": "PRIYA VIKRAM PATEL", "DOB": "18/04/1990", "Gender": "FEMALE", "Address": "45, Baner Road, Pune - 411045" } },
  { id: "d12", ownerId: "o2", type: "PAN Card",              category: "Identity", name: "PAN Card",                    status: "Under Review",  uploadedDate: "2024-02-22",                              fileSize: "195 KB", fileType: "JPG",  isRequired: true,  ocrData: { "PAN No": "BNCPP5678E", "Name": "PRIYA PATEL", "DOB": "18/04/1990" }, remarks: "Name mismatch with Aadhaar — checking with NSDL" },
  { id: "d13", ownerId: "o2", type: "Passport Photo",        category: "Identity", name: "Recent Photograph",           status: "Uploaded",      uploadedDate: "2024-02-22",                              fileSize: "110 KB", fileType: "JPG",  isRequired: true },
  { id: "d14", ownerId: "o2", type: "Electricity Bill",      category: "Address",  name: "Electricity Bill (Latest)",   status: "Pending",                                                                                   isRequired: true },
  { id: "d15", ownerId: "o2", type: "Salary Slip",           category: "Income",   name: "Salary Slip (Last 3 months)", status: "Uploaded",      uploadedDate: "2024-02-25",                              fileSize: "780 KB", fileType: "PDF",  isRequired: true },
  { id: "d16", ownerId: "o2", type: "Bank Statement",        category: "Bank",     name: "Bank Statement (6 months)",   status: "Pending",                                                                                   isRequired: true },
  { id: "d17", ownerId: "o2", type: "Cancelled Cheque",      category: "Bank",     name: "Cancelled Cheque",            status: "Pending",                                                                                   isRequired: true },
];

export const mockActivity: ActivityEvent[] = [
  { id: "a1",  type: "kyc_update",  title: "KYC Fully Verified",          description: "All documents verified. KYC status updated to Verified.",           date: "2024-01-20", time: "11:32 AM", agent: "System",          status: "completed" },
  { id: "a2",  type: "document",    title: "Agreement for Sale Uploaded",  description: "Agreement for Sale document uploaded and sent for verification.",     date: "2024-03-10", time: "03:15 PM", agent: "Rajesh Sharma",   status: "completed" },
  { id: "a3",  type: "call",        title: "Outbound Call",                description: "Discussed possession timeline and registration process.",             date: "2024-03-22", time: "10:00 AM", agent: "Amit Deshpande",  direction: "outbound", duration: "12 min", status: "completed" },
  { id: "a4",  type: "email",       title: "Welcome Email Sent",           description: "Booking confirmation and KYC checklist emailed to customer.",         date: "2024-01-10", time: "02:00 PM", agent: "System",          direction: "outbound", status: "completed" },
  { id: "a5",  type: "whatsapp",    title: "WhatsApp — Document Reminder", description: "Reminded customer to upload 6-month bank statement.",                date: "2024-01-16", time: "06:45 PM", agent: "Amit Deshpande",  direction: "outbound", status: "completed" },
  { id: "a6",  type: "visit",       title: "Site Visit",                   description: "Customer visited site with family for floor and unit inspection.",     date: "2024-02-14", time: "11:00 AM", agent: "Amit Deshpande",  status: "completed", tags: ["site-visit", "family"] },
  { id: "a7",  type: "payment",     title: "Booking Amount Received",      description: "₹5,00,000 received via NEFT. UTR: HDFC240112345678.",               date: "2024-01-11", time: "04:30 PM", agent: "System",          status: "completed" },
  { id: "a8",  type: "note",        title: "RM Note",                      description: "Customer requested change in payment schedule. Escalated to finance.", date: "2024-03-28", time: "12:00 PM", agent: "Amit Deshpande",  status: "completed" },
  { id: "a9",  type: "document",    title: "NOC Uploaded",                 description: "Builder NOC uploaded. Under verification by legal team.",             date: "2024-04-01", time: "09:15 AM", agent: "Rajesh Sharma",   status: "pending" },
  { id: "a10", type: "call",        title: "Inbound Call",                 description: "Customer enquired about registration date and stamp duty charges.",   date: "2024-04-05", time: "03:20 PM", agent: "Amit Deshpande",  direction: "inbound",  duration: "8 min",  status: "completed" },
];

export const commTypeConfig: Record<CommType, { color: string; bg: string; border: string; label: string }> = {
  call:     { color: "text-primary",      bg: "bg-primary/10",     border: "border-primary/20",     label: "Call" },
  email:    { color: "text-info",         bg: "bg-info/10",        border: "border-info/20",        label: "Email" },
  whatsapp: { color: "text-success",      bg: "bg-success/10",     border: "border-success/20",     label: "WhatsApp" },
  sms:      { color: "text-muted-foreground", bg: "bg-muted",      border: "border-border",         label: "SMS" },
  visit:    { color: "text-secondary",    bg: "bg-secondary/10",   border: "border-secondary/20",   label: "Site Visit" },
  note:     { color: "text-warning",      bg: "bg-warning/10",     border: "border-warning/20",     label: "Note" },
};

export function maskAadhaar(a: string) {
  return a.replace(/^(\d{4})\s(\d{4})\s(\d{4})$/, "XXXX XXXX $3");
}
export function maskPAN(p: string) {
  return p.slice(0, 2) + "XXXXX" + p.slice(7);
}
export function maskAccount(a: string) {
  return "X".repeat(a.length - 4) + a.slice(-4);
}

export function kycScoreColor(score: number) {
  if (score >= 80) return "text-success";
  if (score >= 50) return "text-warning";
  return "text-destructive";
}
export function kycScoreBg(score: number) {
  if (score >= 80) return "bg-success";
  if (score >= 50) return "bg-warning";
  return "bg-destructive";
}
