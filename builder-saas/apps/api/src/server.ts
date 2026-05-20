import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { tenantResolver } from "./middleware/tenant.middleware";
import { authenticate, authorize } from "./middleware/auth.middleware";

// Controllers
import * as authCtrl from "./controllers/auth.controller";
import * as projectsCtrl from "./controllers/projects.controller";
import * as flatsCtrl from "./controllers/flats.controller";
import * as inventoryCtrl from "./controllers/inventory.controller";
import * as labourCtrl from "./controllers/labour.controller";
import * as accountingCtrl from "./controllers/accounting.controller";
import * as pdfCtrl from "./controllers/pdf.controller";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for frontend clients
app.use(cors({
  origin: true, // Echo origin back to allow dynamic tenant domains
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Tenant-Id"]
}));

app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());

// Resolve isolated tenant database clients dynamically on all routes
app.use(tenantResolver);

// ── HEALTH CHECK ──
app.get("/api/health", (req, res) => {
  res.json({
    status: "healthy",
    tenantId: req.tenantId,
    schema: req.tenantSchema,
    timestamp: new Date()
  });
});

// ── AUTH MODULE ──
app.post("/api/auth/login", authCtrl.login);
app.post("/api/auth/otp/send", authCtrl.sendOTP);
app.post("/api/auth/otp/verify", authCtrl.verifyOTP);
app.get("/api/auth/me", authenticate, authCtrl.getProfile);

// ── PROJECTS MODULE ──
app.get("/api/projects", authenticate, projectsCtrl.getProjects);
app.post("/api/projects", authenticate, authorize(["Super Admin", "Project Admin"]), projectsCtrl.createProject);
app.put("/api/projects/:id", authenticate, authorize(["Super Admin", "Project Admin"]), projectsCtrl.updateProject);
app.get("/api/projects/milestones", authenticate, projectsCtrl.getMilestones);
app.post("/api/projects/milestones", authenticate, authorize(["Super Admin", "Project Admin", "Site Engineer"]), projectsCtrl.createMilestone);

// ── FLATS & CRM MODULE ──
app.get("/api/flats", authenticate, flatsCtrl.getFlats);
app.get("/api/flats/:id", authenticate, flatsCtrl.getFlatDetails);
app.post("/api/flats/:id/book", authenticate, authorize(["Super Admin", "Project Admin", "Sales Staff"]), flatsCtrl.bookFlat);
app.post("/api/flats/document", authenticate, flatsCtrl.uploadDocument);

// ── MATERIALS & INVENTORY ──
app.get("/api/inventory/stock", authenticate, inventoryCtrl.getInventoryStock);
app.get("/api/inventory/vendors", authenticate, inventoryCtrl.getVendors);
app.post("/api/inventory/vendors", authenticate, authorize(["Super Admin", "Project Admin", "Accountant"]), inventoryCtrl.createVendor);
app.get("/api/inventory/po", authenticate, inventoryCtrl.getPurchaseOrders);
app.post("/api/inventory/po", authenticate, authorize(["Super Admin", "Project Admin", "Accountant"]), inventoryCtrl.createPurchaseOrder);
app.post("/api/inventory/grn", authenticate, authorize(["Super Admin", "Project Admin", "Site Engineer"]), inventoryCtrl.receiveGoods);

// ── LABOUR MODULE ──
app.get("/api/labour/workers", authenticate, labourCtrl.getWorkers);
app.post("/api/labour/workers", authenticate, authorize(["Super Admin", "Project Admin", "Site Engineer"]), labourCtrl.createWorker);
app.post("/api/labour/attendance", authenticate, authorize(["Super Admin", "Project Admin", "Site Engineer"]), labourCtrl.saveAttendance);
app.get("/api/labour/contractors", authenticate, labourCtrl.getContractors);

// ── ACCOUNTING MODULE ──
app.get("/api/accounting/accounts", authenticate, accountingCtrl.getAccounts);
app.get("/api/accounting/expenses", authenticate, accountingCtrl.getExpenses);
app.post("/api/accounting/expenses", authenticate, authorize(["Super Admin", "Project Admin", "Accountant"]), accountingCtrl.createExpense);
app.get("/api/accounting/journals", authenticate, accountingCtrl.getJournalEntries);
app.post("/api/accounting/journals", authenticate, authorize(["Super Admin", "Project Admin", "Accountant"]), accountingCtrl.createJournalEntry);

// ── PDF GENERATION ──
app.post("/api/pdf/receipt", authenticate, pdfCtrl.generateReceipt);
app.post("/api/pdf/demand", authenticate, pdfCtrl.generateDemand);

app.listen(PORT, () => {
  console.log(`[Express API Server] Running on http://localhost:${PORT}`);
});
