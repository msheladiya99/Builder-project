export type NotifType = "payment" | "loan" | "rera" | "stock" | "diary";
export type Channel = "whatsapp" | "sms" | "email" | "inapp";
export type NotifStatus = "sent" | "delivered" | "failed" | "pending" | "read";
export type Severity = "critical" | "high" | "medium" | "low";

export interface Notification {
  id: string;
  type: NotifType;
  channel: Channel;
  status: NotifStatus;
  severity: Severity;
  title: string;
  body: string;
  recipient: string;
  recipientPhone?: string;
  time: string;
  date: string;
  tags?: string[];
}

export interface AlertGroup {
  type: NotifType;
  count: number;
  urgent: number;
  items: AlertItem[];
}

export interface AlertItem {
  id: string;
  title: string;
  sub: string;
  severity: Severity;
  dueIn: string;
  amount?: number;
  unit?: string;
  action: string;
}

export interface Template {
  id: string;
  name: string;
  type: NotifType;
  channels: Channel[];
  content: Record<Channel, string>;
  variables: string[];
  lastEdited: string;
  sentCount: number;
}

export interface ChannelInfo {
  id: Channel;
  label: string;
  icon: string;
  enabled: boolean;
  sentToday: number;
  delivered: number;
  failed: number;
  costPerMsg: string;
  provider: string;
  color: string;
  bg: string;
}

export const TYPE_CFG: Record<NotifType, { label: string; icon: string; color: string; bg: string }> = {
  payment: { label: "Payment",    icon: "💰", color: "#C9922A", bg: "#FEF3C7" },
  loan:    { label: "Loan",       icon: "🏦", color: "#1B3A6B", bg: "#DBEAFE" },
  rera:    { label: "RERA",       icon: "📋", color: "#7C3AED", bg: "#EDE9FE" },
  stock:   { label: "Low Stock",  icon: "📦", color: "#0D9488", bg: "#CCFBF1" },
  diary:   { label: "Site Diary", icon: "📓", color: "#EF4444", bg: "#FEE2E2" },
};

export const CHANNEL_CFG: Record<Channel, { label: string; icon: string; color: string; bg: string }> = {
  whatsapp: { label: "WhatsApp", icon: "💬", color: "#22C55E", bg: "#F0FDF4" },
  sms:      { label: "SMS",      icon: "📱", color: "#0EA5E9", bg: "#F0F9FF" },
  email:    { label: "Email",    icon: "✉️",  color: "#8B5CF6", bg: "#F5F3FF" },
  inapp:    { label: "In-App",   icon: "🔔", color: "#F59E0B", bg: "#FFFBEB" },
};

export const SEVERITY_CFG: Record<Severity, { label: string; color: string; dot: string }> = {
  critical: { label: "Critical", color: "#EF4444", dot: "#EF4444" },
  high:     { label: "High",     color: "#F97316", dot: "#F97316" },
  medium:   { label: "Medium",   color: "#F59E0B", dot: "#F59E0B" },
  low:      { label: "Low",      color: "#22C55E", dot: "#22C55E" },
};

export const STATUS_CFG: Record<NotifStatus, { label: string; color: string; bg: string }> = {
  sent:      { label: "Sent",      color: "#0EA5E9", bg: "#F0F9FF" },
  delivered: { label: "Delivered", color: "#22C55E", bg: "#F0FDF4" },
  failed:    { label: "Failed",    color: "#EF4444", bg: "#FEF2F2" },
  pending:   { label: "Pending",   color: "#F59E0B", bg: "#FFFBEB" },
  read:      { label: "Read",      color: "#94A3B8", bg: "#F8FAFC" },
};

export const mockNotifications: Notification[] = [
  // Today
  { id: "N001", type: "payment", channel: "whatsapp", status: "delivered", severity: "critical", title: "Payment Overdue — Flat 4B", body: "₹12,50,000 payment from Rajesh Mehta is 15 days overdue. Reminder sent.", recipient: "Rajesh Mehta", recipientPhone: "+91 98765 43210", time: "9:15 AM", date: "today", tags: ["Tower A", "Flat 4B"] },
  { id: "N002", type: "loan", channel: "email", status: "delivered", severity: "high", title: "EMI Due in 3 Days", body: "SBI Home Loan EMI of ₹84,000 due on 22 May. Auto-reminder dispatched.", recipient: "Accounts Team", time: "9:00 AM", date: "today", tags: ["SBI", "Term Loan"] },
  { id: "N003", type: "rera", channel: "inapp", status: "read", severity: "critical", title: "RERA Registration Expiry — 8 Days", body: "RERA Reg. MH/07/2022/1456 expires on 27 May 2026. Renew immediately.", recipient: "Admin", time: "8:30 AM", date: "today", tags: ["RERA", "Tower B"] },
  { id: "N004", type: "stock", channel: "inapp", status: "pending", severity: "high", title: "Low Stock: TMT Bars Grade Fe500", body: "Current stock: 2.4 MT. Minimum threshold: 5 MT. Raise PO immediately.", recipient: "Site Engineer", time: "8:00 AM", date: "today", tags: ["Inventory", "TMT"] },
  { id: "N005", type: "diary", channel: "inapp", status: "pending", severity: "medium", title: "Site Diary Missing — Tower B, 18 May", body: "No diary entry submitted for Tower B on 18 May. Please update.", recipient: "Kiran Patil", time: "7:45 AM", date: "today", tags: ["Tower B", "Missing"] },
  { id: "N006", type: "payment", channel: "sms", status: "delivered", severity: "medium", title: "Payment Reminder — Flat 7C", body: "₹8,75,000 installment due in 5 days. SMS sent to Priya Sharma.", recipient: "Priya Sharma", recipientPhone: "+91 87654 32109", time: "7:30 AM", date: "today", tags: ["Tower A", "Flat 7C"] },
  // Yesterday
  { id: "N007", type: "loan", channel: "whatsapp", status: "delivered", severity: "high", title: "Loan Disbursement — HDFC", body: "₹1.2 Cr disbursed by HDFC. Confirm receipt and update accounts.", recipient: "Finance Head", time: "6:00 PM", date: "yesterday", tags: ["HDFC", "Disbursement"] },
  { id: "N008", type: "payment", channel: "email", status: "failed", severity: "high", title: "Reminder Failed — Flat 2A", body: "Email delivery failed for Ankit Joshi. WhatsApp fallback triggered.", recipient: "Ankit Joshi", recipientPhone: "+91 76543 21098", time: "4:30 PM", date: "yesterday", tags: ["Tower C", "Flat 2A"] },
  { id: "N009", type: "stock", channel: "email", status: "delivered", severity: "medium", title: "PO Raised — Cement OPC 53", body: "Purchase order for 200 bags cement raised and emailed to Ambuja Cements.", recipient: "Purchase Team", time: "2:15 PM", date: "yesterday", tags: ["Cement", "PO"] },
  { id: "N010", type: "diary", channel: "inapp", status: "read", severity: "low", title: "Diary Submitted — Tower A", body: "Site diary for Tower A on 17 May submitted by Suresh Kumar.", recipient: "Project Manager", time: "8:00 PM", date: "yesterday", tags: ["Tower A", "Submitted"] },
  // 2 days ago
  { id: "N011", type: "rera", channel: "email", status: "delivered", severity: "medium", title: "RERA Compliance Report Sent", body: "Monthly compliance report sent to MAHARERAIT portal successfully.", recipient: "MAHARERAIT", time: "11:00 AM", date: "2 days ago", tags: ["RERA", "Compliance"] },
  { id: "N012", type: "payment", channel: "whatsapp", status: "read", severity: "low", title: "Payment Received — Flat 9D", body: "₹22,00,000 received from Neha Gupta. Receipt WhatsApp sent.", recipient: "Neha Gupta", recipientPhone: "+91 65432 10987", time: "3:45 PM", date: "2 days ago", tags: ["Tower B", "Flat 9D"] },
];

export const alertGroups: AlertGroup[] = [
  {
    type: "payment",
    count: 8,
    urgent: 3,
    items: [
      { id: "A001", title: "Rajesh Mehta — Flat 4B", sub: "15 days overdue · Tower A", severity: "critical", dueIn: "15d overdue", amount: 1250000, action: "Send WhatsApp" },
      { id: "A002", title: "Ankit Joshi — Flat 2A", sub: "7 days overdue · Tower C", severity: "high", dueIn: "7d overdue", amount: 875000, action: "Call & SMS" },
      { id: "A003", title: "Priya Sharma — Flat 7C", sub: "Due in 5 days · Tower A", severity: "medium", dueIn: "5d left", amount: 875000, action: "Send Reminder" },
    ],
  },
  {
    type: "loan",
    count: 3,
    urgent: 1,
    items: [
      { id: "A004", title: "SBI Term Loan EMI", sub: "Due 22 May · ₹84,000", severity: "high", dueIn: "3d left", amount: 84000, action: "Schedule Transfer" },
      { id: "A005", title: "HDFC Construction Loan", sub: "Interest due 31 May", severity: "medium", dueIn: "12d left", amount: 145000, action: "Prepare Payment" },
    ],
  },
  {
    type: "rera",
    count: 2,
    urgent: 1,
    items: [
      { id: "A006", title: "RERA Reg. MH/07/2022/1456", sub: "Tower B — Expires 27 May", severity: "critical", dueIn: "8d left", action: "Renew Now" },
      { id: "A007", title: "RERA Quarterly Report", sub: "Q1 FY27 due 30 Jun", severity: "low", dueIn: "42d left", action: "Prepare Report" },
    ],
  },
  {
    type: "stock",
    count: 5,
    urgent: 2,
    items: [
      { id: "A008", title: "TMT Bars Grade Fe500", sub: "2.4 MT remaining · Min 5 MT", severity: "high", dueIn: "Critical", unit: "MT", action: "Raise PO" },
      { id: "A009", title: "OPC Cement 53 Grade", sub: "48 bags remaining · Min 200", severity: "high", dueIn: "Critical", unit: "bags", action: "Raise PO" },
      { id: "A010", title: "River Sand (M-Sand)", sub: "3.8 m³ remaining · Min 10 m³", severity: "medium", dueIn: "Low", unit: "m³", action: "Order" },
    ],
  },
  {
    type: "diary",
    count: 4,
    urgent: 2,
    items: [
      { id: "A011", title: "Tower B — 18 May 2026", sub: "No entry by Kiran Patil", severity: "medium", dueIn: "1d late", action: "Request Entry" },
      { id: "A012", title: "Tower C — 17 May 2026", sub: "No entry by Suresh Kumar", severity: "medium", dueIn: "2d late", action: "Request Entry" },
    ],
  },
];

export const templates: Template[] = [
  {
    id: "T001",
    name: "Payment Overdue Alert",
    type: "payment",
    channels: ["whatsapp", "sms", "email"],
    content: {
      whatsapp: "Dear {{customerName}},\n\nThis is a reminder that your payment of *{{amount}}* for *{{flatNumber}}*, Tower {{towerName}} is overdue by *{{daysOverdue}} days*.\n\nPlease make the payment at the earliest to avoid any inconvenience.\n\nFor queries: +91 22 4567 8900\n\n— Shri Hari Group",
      sms: "Dear {{customerName}}, your payment of {{amount}} for {{flatNumber}} is overdue by {{daysOverdue}} days. Please pay immediately. Shri Hari Group: 022-45678900",
      email: "Dear {{customerName}},\n\nWe wish to bring to your attention that the payment of {{amount}} for Flat {{flatNumber}}, Tower {{towerName}} in our project {{projectName}} is overdue by {{daysOverdue}} days.\n\nKindly arrange for payment at the earliest. Our accounts team is available at accounts@shrihari.com.\n\nWarm regards,\nAccounts Team\nShri Hari Group",
      inapp: "Payment of {{amount}} for {{flatNumber}} is overdue by {{daysOverdue}} days.",
    },
    variables: ["customerName", "amount", "flatNumber", "towerName", "daysOverdue", "projectName"],
    lastEdited: "17 May 2026",
    sentCount: 47,
  },
  {
    id: "T002",
    name: "EMI Due Reminder",
    type: "loan",
    channels: ["whatsapp", "email", "inapp"],
    content: {
      whatsapp: "📅 *EMI Reminder*\n\nDear Team,\n\nYour {{bankName}} loan EMI of *{{emiAmount}}* is due on *{{dueDate}}*.\n\nPlease ensure sufficient balance in account ending {{accountLast4}}.\n\n— Finance Team, Shri Hari Group",
      sms: "",
      email: "EMI Reminder: Your {{bankName}} EMI of {{emiAmount}} is due on {{dueDate}}. Account: XXXX{{accountLast4}}. Please ensure funds. - Finance Team",
      inapp: "{{bankName}} EMI of {{emiAmount}} due on {{dueDate}}.",
    },
    variables: ["bankName", "emiAmount", "dueDate", "accountLast4"],
    lastEdited: "15 May 2026",
    sentCount: 23,
  },
  {
    id: "T003",
    name: "RERA Expiry Warning",
    type: "rera",
    channels: ["email", "inapp"],
    content: {
      whatsapp: "",
      sms: "",
      email: "URGENT: RERA Registration {{reraRegNo}} for {{projectName}} expires on {{expiryDate}} ({{daysLeft}} days remaining).\n\nPlease initiate renewal with MahaRERA immediately to avoid project stoppage.\n\nContact: legal@shrihari.com",
      inapp: "RERA Reg {{reraRegNo}} expires in {{daysLeft}} days. Renew immediately.",
    },
    variables: ["reraRegNo", "projectName", "expiryDate", "daysLeft"],
    lastEdited: "10 May 2026",
    sentCount: 6,
  },
  {
    id: "T004",
    name: "Low Stock Alert",
    type: "stock",
    channels: ["inapp", "email"],
    content: {
      whatsapp: "",
      sms: "",
      email: "Low Stock Alert: {{materialName}} at {{location}} has dropped to {{currentStock}} {{unit}}, below the minimum threshold of {{minStock}} {{unit}}. Please raise a purchase order immediately.\n\n— Inventory System, Shri Hari Group",
      inapp: "{{materialName}} stock low: {{currentStock}} {{unit}} remaining. Min: {{minStock}} {{unit}}.",
    },
    variables: ["materialName", "currentStock", "minStock", "unit", "location"],
    lastEdited: "12 May 2026",
    sentCount: 31,
  },
  {
    id: "T005",
    name: "Site Diary Missing",
    type: "diary",
    channels: ["whatsapp", "inapp"],
    content: {
      whatsapp: "⚠️ *Site Diary Pending*\n\nDear {{engineerName}},\n\nThe site diary for *{{towerName}}* on *{{missingDate}}* has not been submitted.\n\nPlease update the diary before end of day.\n\n— SHG Field App",
      sms: "",
      email: "",
      inapp: "Site diary for {{towerName}} on {{missingDate}} not submitted by {{engineerName}}.",
    },
    variables: ["engineerName", "towerName", "missingDate"],
    lastEdited: "14 May 2026",
    sentCount: 18,
  },
  {
    id: "T006",
    name: "Payment Received Confirmation",
    type: "payment",
    channels: ["whatsapp", "sms", "email"],
    content: {
      whatsapp: "✅ *Payment Received*\n\nDear {{customerName}},\n\nWe confirm receipt of *{{amount}}* towards {{flatNumber}}, {{projectName}}.\n\n*Reference:* {{txnId}}\n*Date:* {{paymentDate}}\n\nThank you for your prompt payment!\n\n— Shri Hari Group",
      sms: "Payment of {{amount}} received for {{flatNumber}}. Ref: {{txnId}}. Thank you! - Shri Hari Group",
      email: "Dear {{customerName}},\n\nThis is to confirm receipt of {{amount}} towards Flat {{flatNumber}}, {{projectName}} on {{paymentDate}}.\n\nTransaction Reference: {{txnId}}\n\nPlease retain this for your records.\n\nThank you,\nAccounts Team\nShri Hari Group",
      inapp: "Payment of {{amount}} received from {{customerName}} for {{flatNumber}}.",
    },
    variables: ["customerName", "amount", "flatNumber", "projectName", "txnId", "paymentDate"],
    lastEdited: "16 May 2026",
    sentCount: 89,
  },
];

export const channelInfos: ChannelInfo[] = [
  { id: "whatsapp", label: "WhatsApp Business", icon: "💬", enabled: true,  sentToday: 34, delivered: 31, failed: 3,  costPerMsg: "₹0.80", provider: "Meta Cloud API",      color: "#22C55E", bg: "#F0FDF4" },
  { id: "sms",      label: "SMS Gateway",       icon: "📱", enabled: true,  sentToday: 18, delivered: 17, failed: 1,  costPerMsg: "₹0.45", provider: "Textlocal",           color: "#0EA5E9", bg: "#F0F9FF" },
  { id: "email",    label: "Email (SMTP)",       icon: "✉️",  enabled: true,  sentToday: 22, delivered: 21, failed: 1,  costPerMsg: "₹0.05", provider: "AWS SES",             color: "#8B5CF6", bg: "#F5F3FF" },
  { id: "inapp",    label: "In-App Alerts",      icon: "🔔", enabled: true,  sentToday: 61, delivered: 61, failed: 0,  costPerMsg: "Free",   provider: "Firebase FCM",        color: "#F59E0B", bg: "#FFFBEB" },
];

export const notifStats = {
  totalToday: 135,
  unread: 4,
  critical: 2,
  pending: 6,
  deliveryRate: 96,
};

export function fmtINR(n: number): string {
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(2)} Cr`;
  if (n >= 100000)   return `₹${(n / 100000).toFixed(2)} L`;
  return `₹${n.toLocaleString("en-IN")}`;
}
