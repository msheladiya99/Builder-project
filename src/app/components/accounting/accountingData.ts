export type FinancialYear = "2023-24" | "2024-25" | "2025-26";
export type PaymentMode = "Cash" | "Cheque" | "NEFT" | "RTGS" | "UPI" | "DD" | "Auto Debit" | "Credit Card";

export function fmtINR(n: number, compact = false): string {
  const abs = Math.abs(n);
  const sign = n < 0 ? "-" : "";
  if (compact) {
    if (abs >= 10000000) return `${sign}₹${(abs / 10000000).toFixed(2)}Cr`;
    if (abs >= 100000) return `${sign}₹${(abs / 100000).toFixed(2)}L`;
    if (abs >= 1000) return `${sign}₹${(abs / 1000).toFixed(1)}K`;
    return `${sign}₹${abs.toLocaleString("en-IN")}`;
  }
  return `${sign}₹${abs.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function formatDate(d: string): string {
  const dt = new Date(d);
  return dt.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

// ── Types ──────────────────────────────────────────────────────────────────

export interface ReceiptDoc {
  id: string; receiptNo: string; date: string; party: string;
  flatNo: string; wing: string; amount: number; tds: number; netAmount: number;
  mode: PaymentMode; category: "Booking" | "Demand" | "Maintenance" | "Registration" | "Other";
  status: "Cleared" | "Pending" | "Bounced"; reference: string; fy: FinancialYear; narration: string;
}

export interface InvoiceItem {
  description: string; hsnSac: string; qty: number; unit: string;
  rate: number; amount: number; gstRate: number; cgst: number; sgst: number; igst: number;
}

export interface Invoice {
  id: string; invoiceNo: string; invoiceDate: string; dueDate: string;
  party: string; partyGSTIN: string; partyAddress: string; flatNo: string; wing: string;
  items: InvoiceItem[]; subtotal: number; cgst: number; sgst: number; igst: number;
  tds: number; roundOff: number; total: number;
  status: "Paid" | "Unpaid" | "Overdue" | "Draft" | "Cancelled" | "Partial";
  paidAmount: number; fy: FinancialYear;
}

export interface ExpenseDoc {
  id: string; date: string; expenseNo: string; vendor: string; vendorGSTIN: string;
  category: string; description: string; amount: number; gst: number; gstRate: number;
  tds: number; netPayable: number; mode: PaymentMode;
  status: "Paid" | "Pending" | "Approved" | "Rejected";
  billNo: string; project: string; fy: FinancialYear;
}

export interface JournalLine {
  account: string; accountGroup: string; debit: number; credit: number;
}

export interface JournalEntry {
  id: string; date: string; voucherNo: string; narration: string;
  lines: JournalLine[]; totalDebit: number; totalCredit: number;
  createdBy: string; status: "Posted" | "Draft" | "Reversed"; fy: FinancialYear;
}

export interface LedgerEntry {
  id: string; date: string; narration: string; voucherNo: string;
  voucherType: "Receipt" | "Payment" | "Journal" | "Sales" | "Purchase";
  debit: number; credit: number; balance: number;
}

export interface LedgerAccount {
  id: string; name: string; group: string; code: string;
  openingBalance: number; openingType: "Dr" | "Cr"; entries: LedgerEntry[];
}

export interface GSTEntry {
  id: string; date: string; party: string; gstin: string; invoiceNo: string;
  taxableValue: number; cgst: number; sgst: number; igst: number; total: number;
  type: "B2B" | "B2CL" | "B2CS"; fy: FinancialYear;
}

export interface MonthlyData {
  month: string; revenue: number; expense: number; collections: number; outstanding: number;
}

// ── Mock Receipts ─────────────────────────────────────────────────────────

export const mockReceipts: ReceiptDoc[] = [
  { id:"r1", receiptNo:"RCP/25-26/001", date:"2025-04-05", party:"Rajesh Kumar Sharma", flatNo:"A-301", wing:"A", amount:500000, tds:0, netAmount:500000, mode:"NEFT", category:"Booking", status:"Cleared", reference:"UTR25040512345", fy:"2025-26", narration:"Booking amount - Flat A-301, Shri Hari Heights Phase 2" },
  { id:"r2", receiptNo:"RCP/25-26/002", date:"2025-04-12", party:"Priya Suresh Mehta", flatNo:"B-205", wing:"B", amount:750000, tds:0, netAmount:750000, mode:"RTGS", category:"Demand", status:"Cleared", reference:"UTR25041267890", fy:"2025-26", narration:"1st Demand Note - Slab casting milestone" },
  { id:"r3", receiptNo:"RCP/25-26/003", date:"2025-04-18", party:"Suresh Agarwal", flatNo:"C-102", wing:"C", amount:25000, tds:0, netAmount:25000, mode:"UPI", category:"Maintenance", status:"Cleared", reference:"UPI25041834567", fy:"2025-26", narration:"Annual maintenance charges FY 2025-26" },
  { id:"r4", receiptNo:"RCP/25-26/004", date:"2025-05-03", party:"Anita Deepak Singh", flatNo:"D-404", wing:"D", amount:1200000, tds:12000, netAmount:1188000, mode:"Cheque", category:"Demand", status:"Cleared", reference:"CHQ123456", fy:"2025-26", narration:"2nd Demand Note - Brickwork completion (TDS deducted u/s 194C)" },
  { id:"r5", receiptNo:"RCP/25-26/005", date:"2025-05-15", party:"Vikram Dinesh Patel", flatNo:"A-501", wing:"A", amount:300000, tds:0, netAmount:300000, mode:"UPI", category:"Demand", status:"Pending", reference:"UPI25051598765", fy:"2025-26", narration:"1st Demand Note payment pending clearance" },
  { id:"r6", receiptNo:"RCP/25-26/006", date:"2025-05-22", party:"Neha Rahul Joshi", flatNo:"B-310", wing:"B", amount:800000, tds:0, netAmount:800000, mode:"NEFT", category:"Booking", status:"Cleared", reference:"UTR25052211234", fy:"2025-26", narration:"Booking amount - Flat B-310" },
  { id:"r7", receiptNo:"RCP/25-26/007", date:"2025-06-08", party:"Amit Kumar Verma", flatNo:"C-203", wing:"C", amount:150000, tds:0, netAmount:150000, mode:"Cheque", category:"Maintenance", status:"Bounced", reference:"CHQ789012", fy:"2025-26", narration:"Maintenance charges - Cheque bounced (NSF)" },
  { id:"r8", receiptNo:"RCP/25-26/008", date:"2025-06-15", party:"Sunita Krishnan Rao", flatNo:"D-102", wing:"D", amount:2500000, tds:25000, netAmount:2475000, mode:"RTGS", category:"Demand", status:"Cleared", reference:"UTR25061554321", fy:"2025-26", narration:"3rd Demand Note - Plaster completion" },
  { id:"r9", receiptNo:"RCP/25-26/009", date:"2025-07-04", party:"Manish Sunil Gupta", flatNo:"A-405", wing:"A", amount:600000, tds:0, netAmount:600000, mode:"NEFT", category:"Demand", status:"Cleared", reference:"UTR25070489012", fy:"2025-26", narration:"2nd Demand Note payment" },
  { id:"r10", receiptNo:"RCP/25-26/010", date:"2025-07-20", party:"Rekha Ajay Nair", flatNo:"B-101", wing:"B", amount:35000, tds:0, netAmount:35000, mode:"UPI", category:"Maintenance", status:"Cleared", reference:"UPI25072067890", fy:"2025-26", narration:"Annual maintenance + parking charges" },
  { id:"r11", receiptNo:"RCP/25-26/011", date:"2025-08-12", party:"Rajesh Kumar Sharma", flatNo:"A-301", wing:"A", amount:1500000, tds:15000, netAmount:1485000, mode:"RTGS", category:"Demand", status:"Cleared", reference:"UTR25081212345", fy:"2025-26", narration:"3rd Demand Note - Floor tile completion" },
  { id:"r12", receiptNo:"RCP/25-26/012", date:"2025-09-05", party:"Priya Suresh Mehta", flatNo:"B-205", wing:"B", amount:3500000, tds:35000, netAmount:3465000, mode:"NEFT", category:"Registration", status:"Cleared", reference:"UTR25090523456", fy:"2025-26", narration:"Registration amount - Flat B-205" },
  { id:"r13", receiptNo:"RCP/25-26/013", date:"2025-09-18", party:"Suresh Agarwal", flatNo:"C-102", wing:"C", amount:900000, tds:0, netAmount:900000, mode:"Cash", category:"Demand", status:"Cleared", reference:"CASH001", fy:"2025-26", narration:"4th Demand Note - Cash payment" },
  { id:"r14", receiptNo:"RCP/25-26/014", date:"2025-10-10", party:"Anita Deepak Singh", flatNo:"D-404", wing:"D", amount:1800000, tds:18000, netAmount:1782000, mode:"RTGS", category:"Demand", status:"Cleared", reference:"UTR25101034567", fy:"2025-26", narration:"4th Demand Note payment" },
  { id:"r15", receiptNo:"RCP/25-26/015", date:"2025-11-08", party:"Vikram Dinesh Patel", flatNo:"A-501", wing:"A", amount:2200000, tds:22000, netAmount:2178000, mode:"NEFT", category:"Demand", status:"Cleared", reference:"UTR25110845678", fy:"2025-26", narration:"5th Demand Note - OC receipt milestone" },
];

// ── Mock Invoices ─────────────────────────────────────────────────────────

export const mockInvoices: Invoice[] = [
  { id:"inv1", invoiceNo:"SHG/INV/25-26/001", invoiceDate:"2025-04-05", dueDate:"2025-04-20", party:"Rajesh Kumar Sharma", partyGSTIN:"27AAGPM2842L1ZQ", partyAddress:"23, Sector 15, Navi Mumbai, Maharashtra - 400703", flatNo:"A-301", wing:"A", items:[{ description:"Booking Amount - Flat A-301, Shri Hari Heights Phase 2 (3 BHK)", hsnSac:"995411", qty:1, unit:"Flat", rate:476190, amount:476190, gstRate:5, cgst:11905, sgst:11905, igst:0 }], subtotal:476190, cgst:11905, sgst:11905, igst:0, tds:0, roundOff:0, total:500000, status:"Paid", paidAmount:500000, fy:"2025-26" },
  { id:"inv2", invoiceNo:"SHG/INV/25-26/002", invoiceDate:"2025-04-12", dueDate:"2025-04-27", party:"Priya Suresh Mehta", partyGSTIN:"27AAJME1234K1Z5", partyAddress:"45, Andheri West, Mumbai - 400053", flatNo:"B-205", wing:"B", items:[{ description:"1st Demand Note - Flat B-205 (Slab Casting - 15%)", hsnSac:"995411", qty:1, unit:"Nos", rate:714286, amount:714286, gstRate:5, cgst:17857, sgst:17857, igst:0 }], subtotal:714286, cgst:17857, sgst:17857, igst:0, tds:0, roundOff:0, total:750000, status:"Paid", paidAmount:750000, fy:"2025-26" },
  { id:"inv3", invoiceNo:"SHG/INV/25-26/003", invoiceDate:"2025-05-03", dueDate:"2025-05-18", party:"Anita Deepak Singh", partyGSTIN:"", partyAddress:"78, Bandra East, Mumbai - 400051", flatNo:"D-404", wing:"D", items:[{ description:"2nd Demand Note - Flat D-404 (Brickwork Completion - 20%)", hsnSac:"995411", qty:1, unit:"Nos", rate:1142857, amount:1142857, gstRate:5, cgst:28571, sgst:28571, igst:0 }], subtotal:1142857, cgst:28571, sgst:28571, igst:0, tds:12000, roundOff:1, total:1200000, status:"Paid", paidAmount:1188000, fy:"2025-26" },
  { id:"inv4", invoiceNo:"SHG/INV/25-26/004", invoiceDate:"2025-06-15", dueDate:"2025-06-30", party:"Sunita Krishnan Rao", partyGSTIN:"", partyAddress:"12, Powai, Mumbai - 400076", flatNo:"D-102", wing:"D", items:[{ description:"3rd Demand Note - Flat D-102 (Plaster Completion - 20%)", hsnSac:"995411", qty:1, unit:"Nos", rate:2380952, amount:2380952, gstRate:5, cgst:59524, sgst:59524, igst:0 }], subtotal:2380952, cgst:59524, sgst:59524, igst:0, tds:25000, roundOff:0, total:2500000, status:"Paid", paidAmount:2475000, fy:"2025-26" },
  { id:"inv5", invoiceNo:"SHG/INV/25-26/005", invoiceDate:"2025-07-04", dueDate:"2025-07-19", party:"Manish Sunil Gupta", partyGSTIN:"27AABMG5432J1ZL", partyAddress:"67, Thane West - 400601", flatNo:"A-405", wing:"A", items:[{ description:"2nd Demand Note - Flat A-405 (Brickwork - 20%)", hsnSac:"995411", qty:1, unit:"Nos", rate:571429, amount:571429, gstRate:5, cgst:14286, sgst:14286, igst:0 }], subtotal:571429, cgst:14286, sgst:14286, igst:0, tds:0, roundOff:-1, total:600000, status:"Paid", paidAmount:600000, fy:"2025-26" },
  { id:"inv6", invoiceNo:"SHG/INV/25-26/006", invoiceDate:"2025-08-01", dueDate:"2025-08-16", party:"Vikram Dinesh Patel", partyGSTIN:"27ABCPV9876L1ZR", partyAddress:"33, Mulund East, Mumbai - 400081", flatNo:"A-501", wing:"A", items:[{ description:"1st Demand Note - Flat A-501 (Booking - 10%)", hsnSac:"995411", qty:1, unit:"Nos", rate:285714, amount:285714, gstRate:5, cgst:7143, sgst:7143, igst:0 }], subtotal:285714, cgst:7143, sgst:7143, igst:0, tds:0, roundOff:0, total:300000, status:"Partial", paidAmount:250000, fy:"2025-26" },
  { id:"inv7", invoiceNo:"SHG/INV/25-26/007", invoiceDate:"2025-09-15", dueDate:"2025-09-30", party:"Amit Kumar Verma", partyGSTIN:"27AAAPV1234K1Z8", partyAddress:"89, Chembur, Mumbai - 400071", flatNo:"C-203", wing:"C", items:[{ description:"3rd Demand Note - Flat C-203 (Floor Tile - 15%)", hsnSac:"995411", qty:1, unit:"Nos", rate:857143, amount:857143, gstRate:5, cgst:21429, sgst:21429, igst:0 }], subtotal:857143, cgst:21429, sgst:21429, igst:0, tds:0, roundOff:-1, total:900000, status:"Overdue", paidAmount:0, fy:"2025-26" },
  { id:"inv8", invoiceNo:"SHG/INV/25-26/008", invoiceDate:"2025-10-05", dueDate:"2025-10-20", party:"Rekha Ajay Nair", partyGSTIN:"", partyAddress:"15, Ghatkopar West, Mumbai - 400086", flatNo:"B-101", wing:"B", items:[{ description:"Annual Maintenance Charges - FY 2025-26", hsnSac:"997222", qty:1, unit:"Year", rate:29661, amount:29661, gstRate:18, cgst:2670, sgst:2670, igst:0 }], subtotal:29661, cgst:2670, sgst:2670, igst:0, tds:0, roundOff:-1, total:35000, status:"Paid", paidAmount:35000, fy:"2025-26" },
  { id:"inv9", invoiceNo:"SHG/INV/25-26/009", invoiceDate:"2025-11-08", dueDate:"2025-11-23", party:"Vikram Dinesh Patel", partyGSTIN:"27ABCPV9876L1ZR", partyAddress:"33, Mulund East, Mumbai - 400081", flatNo:"A-501", wing:"A", items:[{ description:"5th Demand Note - Flat A-501 (OC Receipt - 10%)", hsnSac:"995411", qty:1, unit:"Nos", rate:2095238, amount:2095238, gstRate:5, cgst:52381, sgst:52381, igst:0 }], subtotal:2095238, cgst:52381, sgst:52381, igst:0, tds:22000, roundOff:0, total:2200000, status:"Paid", paidAmount:2178000, fy:"2025-26" },
  { id:"inv10", invoiceNo:"SHG/INV/25-26/010", invoiceDate:"2025-12-01", dueDate:"2025-12-16", party:"Neha Rahul Joshi", partyGSTIN:"", partyAddress:"56, Kandivali West, Mumbai - 400067", flatNo:"B-310", wing:"B", items:[{ description:"2nd Demand Note - Flat B-310 (Slab Casting - 15%)", hsnSac:"995411", qty:1, unit:"Nos", rate:952381, amount:952381, gstRate:5, cgst:23810, sgst:23810, igst:0 }], subtotal:952381, cgst:23810, sgst:23810, igst:0, tds:0, roundOff:-1, total:1000000, status:"Unpaid", paidAmount:0, fy:"2025-26" },
];

// ── Mock Expenses ─────────────────────────────────────────────────────────

export const mockExpenses: ExpenseDoc[] = [
  { id:"exp1", date:"2025-04-08", expenseNo:"EXP/25-26/001", vendor:"Sangvi Construction Pvt Ltd", vendorGSTIN:"27AADCS8765K1ZP", category:"Construction", description:"RCC work - Wing A floors 3-5", amount:2500000, gst:225000, gstRate:9, tds:25000, netPayable:2700000, mode:"RTGS", status:"Paid", billNo:"SCPL/2025/456", project:"Phase 2", fy:"2025-26" },
  { id:"exp2", date:"2025-04-15", expenseNo:"EXP/25-26/002", vendor:"Himalaya Steel Suppliers", vendorGSTIN:"27AABHS4567M1ZQ", category:"Materials", description:"TMT Steel bars - 50 MT", amount:2000000, gst:360000, gstRate:18, tds:0, netPayable:2360000, mode:"RTGS", status:"Paid", billNo:"HSS/2025/789", project:"Phase 2", fy:"2025-26" },
  { id:"exp3", date:"2025-04-22", expenseNo:"EXP/25-26/003", vendor:"Brand Catalyst Agency", vendorGSTIN:"27AACBA3456L1ZR", category:"Marketing", description:"Digital marketing campaign Q1", amount:150000, gst:27000, gstRate:18, tds:15000, netPayable:162000, mode:"NEFT", status:"Paid", billNo:"BCA/2025/101", project:"All", fy:"2025-26" },
  { id:"exp4", date:"2025-05-10", expenseNo:"EXP/25-26/004", vendor:"Mehta & Associates (CA)", vendorGSTIN:"27AABMA9876K1ZL", category:"Professional", description:"Audit fees FY 2024-25", amount:75000, gst:13500, gstRate:18, tds:7500, netPayable:81000, mode:"NEFT", status:"Paid", billNo:"MA/2025/234", project:"Admin", fy:"2025-26" },
  { id:"exp5", date:"2025-05-18", expenseNo:"EXP/25-26/005", vendor:"Maharashtra Cement Corp", vendorGSTIN:"27AABMC5678J1ZM", category:"Materials", description:"OPC Cement - 1000 bags", amount:450000, gst:63000, gstRate:14, tds:0, netPayable:513000, mode:"RTGS", status:"Paid", billNo:"MCC/2025/567", project:"Phase 2", fy:"2025-26" },
  { id:"exp6", date:"2025-06-05", expenseNo:"EXP/25-26/006", vendor:"Office Supplies Hub", vendorGSTIN:"27AABOS1234K1ZT", category:"Admin", description:"Office stationery and consumables", amount:12000, gst:2160, gstRate:18, tds:0, netPayable:14160, mode:"Cash", status:"Paid", billNo:"OSH/2025/345", project:"Admin", fy:"2025-26" },
  { id:"exp7", date:"2025-06-12", expenseNo:"EXP/25-26/007", vendor:"Shivaji Electrical Works", vendorGSTIN:"27AABSE7890K1ZN", category:"Construction", description:"Electrical wiring - Wing B floors 1-5", amount:800000, gst:144000, gstRate:18, tds:8000, netPayable:936000, mode:"RTGS", status:"Paid", billNo:"SEW/2025/890", project:"Phase 2", fy:"2025-26" },
  { id:"exp8", date:"2025-07-08", expenseNo:"EXP/25-26/008", vendor:"Vikas Plumbing Services", vendorGSTIN:"27AABVP2345L1ZO", category:"Construction", description:"Plumbing work - Phase 2 complete", amount:600000, gst:108000, gstRate:18, tds:6000, netPayable:702000, mode:"Cheque", status:"Paid", billNo:"VPS/2025/123", project:"Phase 2", fy:"2025-26" },
  { id:"exp9", date:"2025-07-20", expenseNo:"EXP/25-26/009", vendor:"Times of India - Advertising", vendorGSTIN:"27AABTO8765J1ZU", category:"Marketing", description:"Print advertisement - Weekend edition", amount:85000, gst:15300, gstRate:18, tds:8500, netPayable:91800, mode:"NEFT", status:"Paid", billNo:"TOI/2025/678", project:"All", fy:"2025-26" },
  { id:"exp10", date:"2025-08-15", expenseNo:"EXP/25-26/010", vendor:"State Bank of India", vendorGSTIN:"", category:"Finance", description:"Construction loan interest August 2025", amount:285000, gst:0, gstRate:0, tds:0, netPayable:285000, mode:"Auto Debit", status:"Paid", billNo:"SBI/INT/AUG25", project:"Phase 2", fy:"2025-26" },
  { id:"exp11", date:"2025-08-22", expenseNo:"EXP/25-26/011", vendor:"Kirtane Pandit Architects", vendorGSTIN:"27AABKP3456M1ZV", category:"Professional", description:"Architect fees - BOQ revision", amount:120000, gst:21600, gstRate:18, tds:12000, netPayable:129600, mode:"NEFT", status:"Paid", billNo:"KPA/2025/234", project:"Phase 2", fy:"2025-26" },
  { id:"exp12", date:"2025-09-10", expenseNo:"EXP/25-26/012", vendor:"Rangvali Paints Pvt Ltd", vendorGSTIN:"27AABRA4567N1ZW", category:"Materials", description:"Interior paint - All flats Wing A", amount:380000, gst:68400, gstRate:18, tds:0, netPayable:448400, mode:"RTGS", status:"Paid", billNo:"RPL/2025/789", project:"Phase 2", fy:"2025-26" },
  { id:"exp13", date:"2025-10-05", expenseNo:"EXP/25-26/013", vendor:"Security Force Agency", vendorGSTIN:"27AABSF5678O1ZX", category:"Admin", description:"Security staff salary October 2025", amount:95000, gst:17100, gstRate:18, tds:0, netPayable:112100, mode:"NEFT", status:"Paid", billNo:"SFA/OCT25", project:"Admin", fy:"2025-26" },
  { id:"exp14", date:"2025-10-18", expenseNo:"EXP/25-26/014", vendor:"Mahendra Tile Works", vendorGSTIN:"27AABMT6789P1ZY", category:"Materials", description:"Vitrified tiles - Wing B & C common areas", amount:520000, gst:93600, gstRate:18, tds:0, netPayable:613600, mode:"RTGS", status:"Paid", billNo:"MTW/2025/456", project:"Phase 2", fy:"2025-26" },
  { id:"exp15", date:"2025-11-12", expenseNo:"EXP/25-26/015", vendor:"Google Ads India", vendorGSTIN:"27AABGI2345R1ZZ", category:"Marketing", description:"Google Ads campaign Q3 2025", amount:200000, gst:36000, gstRate:18, tds:0, netPayable:236000, mode:"Credit Card", status:"Paid", billNo:"GAI/Q3-25", project:"All", fy:"2025-26" },
  { id:"exp16", date:"2025-11-28", expenseNo:"EXP/25-26/016", vendor:"Navi Mumbai Property Tax", vendorGSTIN:"", category:"Admin", description:"Property tax - Q3 2025", amount:180000, gst:0, gstRate:0, tds:0, netPayable:180000, mode:"Cheque", status:"Pending", billNo:"NMC/PT/Q3", project:"Admin", fy:"2025-26" },
];

// ── Mock Journal Entries ──────────────────────────────────────────────────

export const mockJournalEntries: JournalEntry[] = [
  { id:"je1", date:"2025-04-01", voucherNo:"JV/25-26/001", narration:"Opening balance entry for FY 2025-26", lines:[{ account:"Cash in Hand", accountGroup:"Current Assets", debit:450000, credit:0 },{ account:"HDFC Bank A/c", accountGroup:"Current Assets", debit:12500000, credit:0 },{ account:"Trade Debtors", accountGroup:"Current Assets", debit:8750000, credit:0 },{ account:"Capital Account", accountGroup:"Capital", debit:0, credit:21700000 }], totalDebit:21700000, totalCredit:21700000, createdBy:"Vijay Patil (CFO)", status:"Posted", fy:"2025-26" },
  { id:"je2", date:"2025-04-05", voucherNo:"JV/25-26/002", narration:"Booking receipt - Rajesh Kumar Sharma, Flat A-301", lines:[{ account:"HDFC Bank A/c", accountGroup:"Current Assets", debit:500000, credit:0 },{ account:"Customer Advances - Rajesh Sharma", accountGroup:"Current Liabilities", debit:0, credit:476190 },{ account:"GST Payable - CGST", accountGroup:"Current Liabilities", debit:0, credit:11905 },{ account:"GST Payable - SGST", accountGroup:"Current Liabilities", debit:0, credit:11905 }], totalDebit:500000, totalCredit:500000, createdBy:"Rekha Sharma (Accountant)", status:"Posted", fy:"2025-26" },
  { id:"je3", date:"2025-04-08", voucherNo:"JV/25-26/003", narration:"Payment to Sangvi Construction - RCC work Wing A", lines:[{ account:"Construction WIP - Phase 2", accountGroup:"Capital WIP", debit:2500000, credit:0 },{ account:"GST Input - CGST", accountGroup:"Current Assets", debit:112500, credit:0 },{ account:"GST Input - SGST", accountGroup:"Current Assets", debit:112500, credit:0 },{ account:"TDS Payable", accountGroup:"Current Liabilities", debit:0, credit:25000 },{ account:"HDFC Bank A/c", accountGroup:"Current Assets", debit:0, credit:2700000 }], totalDebit:2725000, totalCredit:2725000, createdBy:"Rekha Sharma (Accountant)", status:"Posted", fy:"2025-26" },
  { id:"je4", date:"2025-05-31", voucherNo:"JV/25-26/004", narration:"Monthly depreciation entry - May 2025", lines:[{ account:"Depreciation Expense", accountGroup:"Indirect Expenses", debit:45000, credit:0 },{ account:"Accum. Depreciation - Vehicles", accountGroup:"Fixed Assets", debit:0, credit:18000 },{ account:"Accum. Depreciation - Plant", accountGroup:"Fixed Assets", debit:0, credit:15000 },{ account:"Accum. Depreciation - Office Equipment", accountGroup:"Fixed Assets", debit:0, credit:12000 }], totalDebit:45000, totalCredit:45000, createdBy:"System Auto-Entry", status:"Posted", fy:"2025-26" },
  { id:"je5", date:"2025-06-15", voucherNo:"JV/25-26/005", narration:"GST payment for May 2025 - GSTR-3B filing", lines:[{ account:"GST Payable - CGST", accountGroup:"Current Liabilities", debit:89286, credit:0 },{ account:"GST Payable - SGST", accountGroup:"Current Liabilities", debit:89286, credit:0 },{ account:"GST Input - CGST", accountGroup:"Current Assets", debit:0, credit:31500 },{ account:"GST Input - SGST", accountGroup:"Current Assets", debit:0, credit:31500 },{ account:"HDFC Bank A/c", accountGroup:"Current Assets", debit:0, credit:115572 }], totalDebit:178572, totalCredit:178572, createdBy:"Vijay Patil (CFO)", status:"Posted", fy:"2025-26" },
  { id:"je6", date:"2025-07-15", voucherNo:"JV/25-26/006", narration:"TDS deposit Q1 FY 2025-26 u/s 194C", lines:[{ account:"TDS Payable", accountGroup:"Current Liabilities", debit:57000, credit:0 },{ account:"HDFC Bank A/c", accountGroup:"Current Assets", debit:0, credit:57000 }], totalDebit:57000, totalCredit:57000, createdBy:"Rekha Sharma (Accountant)", status:"Posted", fy:"2025-26" },
  { id:"je7", date:"2025-08-31", voucherNo:"JV/25-26/007", narration:"Provision for bad debt - Cheque bounce Amit Verma C-203", lines:[{ account:"Bad Debts Expense", accountGroup:"Indirect Expenses", debit:150000, credit:0 },{ account:"Provision for Bad Debts", accountGroup:"Current Assets (Contra)", debit:0, credit:150000 }], totalDebit:150000, totalCredit:150000, createdBy:"Vijay Patil (CFO)", status:"Posted", fy:"2025-26" },
  { id:"je8", date:"2025-09-30", voucherNo:"JV/25-26/008", narration:"Bank loan interest accrual - September 2025", lines:[{ account:"Interest Expense - Construction Loan", accountGroup:"Finance Costs", debit:285000, credit:0 },{ account:"Interest Accrued - SBI", accountGroup:"Current Liabilities", debit:0, credit:285000 }], totalDebit:285000, totalCredit:285000, createdBy:"System Auto-Entry", status:"Posted", fy:"2025-26" },
  { id:"je9", date:"2025-10-10", voucherNo:"JV/25-26/009", narration:"Revenue recognition on registration - Priya Mehta Flat B-205", lines:[{ account:"Customer Advances - Priya Mehta", accountGroup:"Current Liabilities", debit:4250000, credit:0 },{ account:"Sale of Flats Revenue", accountGroup:"Direct Income", debit:0, credit:4047619 },{ account:"GST Payable - CGST", accountGroup:"Current Liabilities", debit:0, credit:101190 },{ account:"GST Payable - SGST", accountGroup:"Current Liabilities", debit:0, credit:101190 }], totalDebit:4250000, totalCredit:4250000, createdBy:"Vijay Patil (CFO)", status:"Posted", fy:"2025-26" },
  { id:"je10", date:"2025-11-30", voucherNo:"JV/25-26/010", narration:"Salary payable for November 2025", lines:[{ account:"Salaries & Wages Expense", accountGroup:"Indirect Expenses", debit:875000, credit:0 },{ account:"Salaries Payable", accountGroup:"Current Liabilities", debit:0, credit:787500 },{ account:"TDS Payable - Salary (u/s 192)", accountGroup:"Current Liabilities", debit:0, credit:87500 }], totalDebit:875000, totalCredit:875000, createdBy:"Rekha Sharma (Accountant)", status:"Posted", fy:"2025-26" },
];

// ── Ledger Accounts ───────────────────────────────────────────────────────

export const mockLedgerAccounts: LedgerAccount[] = [
  { id:"la1", name:"HDFC Bank Current A/c — 2345678901", group:"Bank Accounts", code:"1101", openingBalance:12500000, openingType:"Dr", entries:[
    { id:"e1", date:"2025-04-05", narration:"Receipt - Rajesh Sharma A-301", voucherNo:"RCP/25-26/001", voucherType:"Receipt", debit:500000, credit:0, balance:13000000 },
    { id:"e2", date:"2025-04-08", narration:"Payment - Sangvi Construction", voucherNo:"PMT/25-26/001", voucherType:"Payment", debit:0, credit:2700000, balance:10300000 },
    { id:"e3", date:"2025-04-12", narration:"Receipt - Priya Mehta B-205", voucherNo:"RCP/25-26/002", voucherType:"Receipt", debit:750000, credit:0, balance:11050000 },
    { id:"e4", date:"2025-04-15", narration:"Payment - Himalaya Steel", voucherNo:"PMT/25-26/002", voucherType:"Payment", debit:0, credit:2360000, balance:8690000 },
    { id:"e5", date:"2025-05-03", narration:"Receipt - Anita Singh D-404", voucherNo:"RCP/25-26/004", voucherType:"Receipt", debit:1188000, credit:0, balance:9878000 },
    { id:"e6", date:"2025-06-15", narration:"GST Payment May 2025", voucherNo:"JV/25-26/005", voucherType:"Journal", debit:0, credit:115572, balance:9762428 },
    { id:"e7", date:"2025-06-15", narration:"Receipt - Sunita Rao D-102", voucherNo:"RCP/25-26/008", voucherType:"Receipt", debit:2475000, credit:0, balance:12237428 },
    { id:"e8", date:"2025-07-04", narration:"Receipt - Manish Gupta A-405", voucherNo:"RCP/25-26/009", voucherType:"Receipt", debit:600000, credit:0, balance:12837428 },
    { id:"e9", date:"2025-07-15", narration:"TDS Deposit Q1", voucherNo:"JV/25-26/006", voucherType:"Journal", debit:0, credit:57000, balance:12780428 },
    { id:"e10", date:"2025-08-12", narration:"Receipt - Rajesh Sharma Demand 3", voucherNo:"RCP/25-26/011", voucherType:"Receipt", debit:1485000, credit:0, balance:14265428 },
  ]},
  { id:"la2", name:"Trade Debtors (Control Account)", group:"Sundry Debtors", code:"1201", openingBalance:8750000, openingType:"Dr", entries:[
    { id:"e1", date:"2025-04-05", narration:"Invoice - Rajesh Sharma A-301", voucherNo:"SHG/INV/25-26/001", voucherType:"Sales", debit:500000, credit:0, balance:9250000 },
    { id:"e2", date:"2025-04-05", narration:"Receipt - Rajesh Sharma", voucherNo:"RCP/25-26/001", voucherType:"Receipt", debit:0, credit:500000, balance:8750000 },
    { id:"e3", date:"2025-06-08", narration:"Invoice - Amit Verma C-203", voucherNo:"SHG/INV/25-26/007", voucherType:"Sales", debit:900000, credit:0, balance:9650000 },
    { id:"e4", date:"2025-08-31", narration:"Bad debt provision - Amit Verma", voucherNo:"JV/25-26/007", voucherType:"Journal", debit:0, credit:150000, balance:9500000 },
    { id:"e5", date:"2025-12-01", narration:"Invoice - Neha Joshi B-310", voucherNo:"SHG/INV/25-26/010", voucherType:"Sales", debit:1000000, credit:0, balance:10500000 },
  ]},
  { id:"la3", name:"GST Payable — CGST", group:"Duties & Taxes", code:"2101", openingBalance:0, openingType:"Cr", entries:[
    { id:"e1", date:"2025-04-05", narration:"GST on invoice SHG/INV/25-26/001", voucherNo:"SHG/INV/25-26/001", voucherType:"Sales", debit:0, credit:11905, balance:11905 },
    { id:"e2", date:"2025-04-12", narration:"GST on invoice SHG/INV/25-26/002", voucherNo:"SHG/INV/25-26/002", voucherType:"Sales", debit:0, credit:17857, balance:29762 },
    { id:"e3", date:"2025-05-03", narration:"GST on invoice SHG/INV/25-26/003", voucherNo:"SHG/INV/25-26/003", voucherType:"Sales", debit:0, credit:28571, balance:58333 },
    { id:"e4", date:"2025-06-15", narration:"GST Input credit set-off (CGST)", voucherNo:"JV/25-26/005", voucherType:"Journal", debit:31500, credit:0, balance:26833 },
    { id:"e5", date:"2025-06-15", narration:"GST paid to government", voucherNo:"JV/25-26/005", voucherType:"Journal", debit:57786, credit:0, balance:-30953 },
  ]},
  { id:"la4", name:"Construction WIP — Phase 2", group:"Capital Work in Progress", code:"0501", openingBalance:45000000, openingType:"Dr", entries:[
    { id:"e1", date:"2025-04-08", narration:"RCC work - Sangvi Construction", voucherNo:"EXP/25-26/001", voucherType:"Purchase", debit:2500000, credit:0, balance:47500000 },
    { id:"e2", date:"2025-04-15", narration:"TMT Steel - Himalaya Steel", voucherNo:"EXP/25-26/002", voucherType:"Purchase", debit:2000000, credit:0, balance:49500000 },
    { id:"e3", date:"2025-05-18", narration:"OPC Cement - MCC", voucherNo:"EXP/25-26/005", voucherType:"Purchase", debit:450000, credit:0, balance:49950000 },
    { id:"e4", date:"2025-06-12", narration:"Electrical - Shivaji Works", voucherNo:"EXP/25-26/007", voucherType:"Purchase", debit:800000, credit:0, balance:50750000 },
    { id:"e5", date:"2025-07-08", narration:"Plumbing - Vikas Services", voucherNo:"EXP/25-26/008", voucherType:"Purchase", debit:600000, credit:0, balance:51350000 },
    { id:"e6", date:"2025-10-18", narration:"Vitrified tiles - Mahendra Works", voucherNo:"EXP/25-26/014", voucherType:"Purchase", debit:520000, credit:0, balance:51870000 },
  ]},
  { id:"la5", name:"Sale of Flats Revenue", group:"Direct Income", code:"4101", openingBalance:0, openingType:"Cr", entries:[
    { id:"e1", date:"2025-04-05", narration:"Sale - Rajesh Sharma A-301 booking", voucherNo:"SHG/INV/25-26/001", voucherType:"Sales", debit:0, credit:476190, balance:476190 },
    { id:"e2", date:"2025-04-12", narration:"Sale - Priya Mehta B-205 demand 1", voucherNo:"SHG/INV/25-26/002", voucherType:"Sales", debit:0, credit:714286, balance:1190476 },
    { id:"e3", date:"2025-05-03", narration:"Sale - Anita Singh D-404 demand 2", voucherNo:"SHG/INV/25-26/003", voucherType:"Sales", debit:0, credit:1142857, balance:2333333 },
    { id:"e4", date:"2025-06-15", narration:"Sale - Sunita Rao D-102 demand 3", voucherNo:"SHG/INV/25-26/004", voucherType:"Sales", debit:0, credit:2380952, balance:4714285 },
    { id:"e5", date:"2025-10-10", narration:"Revenue recognition - Priya Mehta flat", voucherNo:"JV/25-26/009", voucherType:"Journal", debit:0, credit:4047619, balance:8761904 },
  ]},
];

// ── GST Entries ───────────────────────────────────────────────────────────

export const mockGSTEntries: GSTEntry[] = [
  { id:"g1", date:"2025-04-05", party:"Rajesh Kumar Sharma", gstin:"27AAGPM2842L1ZQ", invoiceNo:"SHG/INV/25-26/001", taxableValue:476190, cgst:11905, sgst:11905, igst:0, total:500000, type:"B2B", fy:"2025-26" },
  { id:"g2", date:"2025-04-12", party:"Priya Suresh Mehta", gstin:"27AAJME1234K1Z5", invoiceNo:"SHG/INV/25-26/002", taxableValue:714286, cgst:17857, sgst:17857, igst:0, total:750000, type:"B2B", fy:"2025-26" },
  { id:"g3", date:"2025-05-03", party:"Anita Deepak Singh", gstin:"", invoiceNo:"SHG/INV/25-26/003", taxableValue:1142857, cgst:28571, sgst:28571, igst:0, total:1200000, type:"B2CL", fy:"2025-26" },
  { id:"g4", date:"2025-06-15", party:"Sunita Krishnan Rao", gstin:"", invoiceNo:"SHG/INV/25-26/004", taxableValue:2380952, cgst:59524, sgst:59524, igst:0, total:2500000, type:"B2CL", fy:"2025-26" },
  { id:"g5", date:"2025-07-04", party:"Manish Sunil Gupta", gstin:"27AABMG5432J1ZL", invoiceNo:"SHG/INV/25-26/005", taxableValue:571429, cgst:14286, sgst:14286, igst:0, total:600000, type:"B2B", fy:"2025-26" },
  { id:"g6", date:"2025-08-01", party:"Vikram Dinesh Patel", gstin:"27ABCPV9876L1ZR", invoiceNo:"SHG/INV/25-26/006", taxableValue:285714, cgst:7143, sgst:7143, igst:0, total:300000, type:"B2B", fy:"2025-26" },
  { id:"g7", date:"2025-09-15", party:"Amit Kumar Verma", gstin:"27AAAPV1234K1Z8", invoiceNo:"SHG/INV/25-26/007", taxableValue:857143, cgst:21429, sgst:21429, igst:0, total:900000, type:"B2B", fy:"2025-26" },
  { id:"g8", date:"2025-10-05", party:"Rekha Ajay Nair", gstin:"", invoiceNo:"SHG/INV/25-26/008", taxableValue:29661, cgst:2670, sgst:2670, igst:0, total:35000, type:"B2CS", fy:"2025-26" },
  { id:"g9", date:"2025-11-08", party:"Vikram Dinesh Patel", gstin:"27ABCPV9876L1ZR", invoiceNo:"SHG/INV/25-26/009", taxableValue:2095238, cgst:52381, sgst:52381, igst:0, total:2200000, type:"B2B", fy:"2025-26" },
  { id:"g10", date:"2025-12-01", party:"Neha Rahul Joshi", gstin:"", invoiceNo:"SHG/INV/25-26/010", taxableValue:952381, cgst:23810, sgst:23810, igst:0, total:1000000, type:"B2CL", fy:"2025-26" },
];

// ── Monthly Chart Data ─────────────────────────────────────────────────────

export const monthlyChartData: MonthlyData[] = [
  { month:"Apr'25", revenue:9500000, expense:6200000, collections:8800000, outstanding:700000 },
  { month:"May'25", revenue:11200000, expense:7100000, collections:10400000, outstanding:800000 },
  { month:"Jun'25", revenue:8700000, expense:5800000, collections:8200000, outstanding:500000 },
  { month:"Jul'25", revenue:14300000, expense:8900000, collections:12800000, outstanding:1500000 },
  { month:"Aug'25", revenue:9800000, expense:6700000, collections:9100000, outstanding:700000 },
  { month:"Sep'25", revenue:16700000, expense:9800000, collections:15500000, outstanding:1200000 },
  { month:"Oct'25", revenue:13400000, expense:8100000, collections:12400000, outstanding:1000000 },
  { month:"Nov'25", revenue:18900000, expense:11500000, collections:17200000, outstanding:1700000 },
  { month:"Dec'25", revenue:14500000, expense:9400000, collections:13800000, outstanding:700000 },
  { month:"Jan'26", revenue:20100000, expense:12700000, collections:18700000, outstanding:1400000 },
  { month:"Feb'26", revenue:17800000, expense:10800000, collections:16400000, outstanding:1400000 },
  { month:"Mar'26", revenue:23400000, expense:14200000, collections:21800000, outstanding:1600000 },
];

// ── P&L Data ──────────────────────────────────────────────────────────────

export const plData = {
  revenue: [
    { label:"Sale of Flats (Under Construction)", amount:128700000 },
    { label:"Maintenance Income", amount:4520000 },
    { label:"Interest Income on FDs", amount:1230000 },
    { label:"Other Operating Income", amount:850000 },
  ],
  cogs: [
    { label:"Construction Cost — Materials", amount:52300000 },
    { label:"Labour & Contract Charges", amount:24100000 },
    { label:"Site Supervision & Project Overheads", amount:8200000 },
  ],
  opex: [
    { label:"Marketing & Advertising", amount:4580000 },
    { label:"Salaries & Employee Benefits", amount:8750000 },
    { label:"Administrative Expenses", amount:3210000 },
    { label:"Professional Fees (Legal/CA/Architect)", amount:1840000 },
    { label:"Depreciation", amount:1220000 },
    { label:"Bad Debts Written Off", amount:150000 },
  ],
  finCosts: [
    { label:"Interest on Construction Loan", amount:3420000 },
    { label:"Bank Charges & Processing Fees", amount:125000 },
  ],
  tax: [
    { label:"Current Tax (30%)", amount:5940000 },
    { label:"Deferred Tax Charge", amount:280000 },
  ],
};

// ── Balance Sheet Data ────────────────────────────────────────────────────

export const bsData = {
  assets: {
    fixed: [
      { label:"Land & Building (Net)", amount:84500000 },
      { label:"Plant & Machinery (Net)", amount:1230000 },
      { label:"Vehicles (Net)", amount:3850000 },
      { label:"Furniture & Fixtures (Net)", amount:820000 },
      { label:"Computer Equipment (Net)", amount:450000 },
    ],
    current: [
      { label:"Construction WIP — Phase 2", amount:156700000 },
      { label:"Trade Debtors (Net of Provisions)", amount:42300000 },
      { label:"Advances to Vendors", amount:11200000 },
      { label:"GST Input Tax Credit", amount:3450000 },
      { label:"Fixed Deposits (Short-term)", amount:12000000 },
      { label:"HDFC Bank Current A/c", amount:14265000 },
      { label:"Cash in Hand", amount:850000 },
      { label:"Other Current Assets", amount:2100000 },
    ],
  },
  liabilities: {
    equity: [
      { label:"Paid-up Share Capital", amount:50000000 },
      { label:"Securities Premium Reserve", amount:20000000 },
      { label:"General Reserves", amount:12500000 },
      { label:"Retained Earnings (Current Year)", amount:29400000 },
    ],
    longTerm: [
      { label:"Term Loan — SBI (Construction)", amount:85000000 },
      { label:"Unsecured Loans (Promoters)", amount:15000000 },
      { label:"Deferred Tax Liability", amount:1280000 },
    ],
    current: [
      { label:"Customer Advances (Booking & Demand)", amount:56700000 },
      { label:"Trade Creditors", amount:34500000 },
      { label:"GST Payable (Net)", amount:1890000 },
      { label:"TDS Payable", amount:870000 },
      { label:"Salaries Payable", amount:875000 },
      { label:"Interest Accrued", amount:285000 },
      { label:"Other Current Liabilities", amount:1265000 },
    ],
  },
};

// ── Cash Flow Data ────────────────────────────────────────────────────────

export const cfData = {
  operating: [
    { label:"Net Profit After Tax", amount:29400000 },
    { label:"Add: Depreciation", amount:1220000 },
    { label:"Add: Bad Debts Written Off", amount:150000 },
    { label:"Add: Deferred Tax", amount:280000 },
    { label:"Less: Increase in Trade Debtors", amount:-15600000 },
    { label:"Less: Increase in Construction WIP", amount:-22500000 },
    { label:"Less: Increase in Advances to Vendors", amount:-3200000 },
    { label:"Add: Increase in Customer Advances", amount:18700000 },
    { label:"Add: Increase in Trade Creditors", amount:8900000 },
    { label:"Add: Net Tax Adjustments", amount:1250000 },
  ],
  investing: [
    { label:"Purchase of Fixed Assets", amount:-4530000 },
    { label:"Investment in Fixed Deposits", amount:-5000000 },
    { label:"Proceeds from Sale of Equipment", amount:320000 },
  ],
  financing: [
    { label:"Term Loan Drawdowns — SBI", amount:25000000 },
    { label:"Loan Repayments", amount:-18500000 },
    { label:"Interest Paid on Loans", amount:-3420000 },
    { label:"Promoter Unsecured Loans Received", amount:5000000 },
  ],
  openingBalance: 3000000,
};
