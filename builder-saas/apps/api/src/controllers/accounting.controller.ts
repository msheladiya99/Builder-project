import { Request, Response } from "express";

async function ensureAccountsSeeded(db: any) {
  const count = await db.account.count();
  if (count === 0) {
    console.log("No accounts found. Seeding Chart of Accounts...");
    const accounts = [
      { code: "1000", name: "HDFC Bank A/c - Main", type: "Asset", balance: 54000000 },
      { code: "1100", name: "Receivables (Customers)", type: "Asset", balance: 21000000 },
      { code: "1200", name: "Material Inventory Stock", type: "Asset", balance: 3500000 },
      { code: "2000", name: "Payables (Vendors)", type: "Liability", balance: 1200000 },
      { code: "2100", name: "GST Payable", type: "Liability", balance: 850000 },
      { code: "3000", name: "Retained Earnings", type: "Equity", balance: 74350000 },
      { code: "4000", name: "Collections Income", type: "Revenue", balance: 184000000 },
      { code: "5000", name: "Material Purchase Cost", type: "Expense", balance: 31000000 },
      { code: "5100", name: "Labour Wage Expense", type: "Expense", balance: 18900000 }
    ];
    await db.account.createMany({ data: accounts });
    
    // Seed a couple of expenses for transactions logs
    const expenses = [
      { category: "Materials", amount: 142640, date: new Date(), description: "Cement OPC procurement Ambuja", status: "approved" },
      { category: "Labour", amount: 35000, date: new Date(), description: "Sharma contractor weekly wage advance", status: "approved" }
    ];
    await db.expense.createMany({ data: expenses });
  }
}

export async function getAccounts(req: Request, res: Response) {
  try {
    await ensureAccountsSeeded(req.db);
    const accounts = await req.db.account.findMany();
    return res.json(accounts);
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch accounts." });
  }
}

export async function getExpenses(req: Request, res: Response) {
  try {
    await ensureAccountsSeeded(req.db);
    const expenses = await req.db.expense.findMany({
      orderBy: { date: "desc" }
    });
    return res.json(expenses);
  } catch (error) {
    return res.status(500).json({ error: "Failed to load expenses." });
  }
}

export async function createExpense(req: Request, res: Response) {
  try {
    const { category, amount, description, date } = req.body;
    if (!category || !amount) {
      return res.status(400).json({ error: "Category and amount are required." });
    }

    const expense = await req.db.$transaction(async (tx: any) => {
      // 1. Create expense log
      const exp = await tx.expense.create({
        data: {
          category,
          amount: Number(amount),
          description,
          date: date ? new Date(date) : new Date()
        }
      });
      
      // 2. Adjust Ledger balance (Bank asset decreases, Material/Labour expenses increase)
      await tx.account.update({
        where: { code: "1000" }, // Bank Account
        data: { balance: { decrement: Number(amount) } }
      });

      const expenseCode = category === "Labour" ? "5100" : "5000";
      await tx.account.update({
        where: { code: expenseCode },
        data: { balance: { increment: Number(amount) } }
      });

      return exp;
    });

    return res.status(201).json(expense);
  } catch (error) {
    return res.status(500).json({ error: "Failed to post expense transaction." });
  }
}

async function ensureJournalsSeeded(db: any) {
  const count = await db.journalVoucher.count();
  if (count === 0) {
    console.log("No journal entries found. Seeding Journal Vouchers...");
    const entries = [
      {
        entryNo: "JV-2026-0001",
        date: new Date(),
        narration: "Provision for contractor weekly wages for May Week 2"
      },
      {
        entryNo: "JV-2026-0002",
        date: new Date(),
        narration: "Inter-account fund transfer to GST account"
      }
    ];
    await db.journalVoucher.createMany({ data: entries });
  }
}

export async function getJournalEntries(req: Request, res: Response) {
  try {
    await ensureJournalsSeeded(req.db);
    const entries = await req.db.journalVoucher.findMany({
      orderBy: { date: "desc" }
    });
    return res.json(entries);
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch journal entries." });
  }
}

export async function createJournalEntry(req: Request, res: Response) {
  try {
    const { entryNo, narration, date } = req.body;
    if (!entryNo || !narration) {
      return res.status(400).json({ error: "Entry number and narration are required." });
    }

    const entry = await req.db.journalVoucher.create({
      data: {
        entryNo,
        narration,
        date: date ? new Date(date) : new Date()
      }
    });

    return res.status(201).json(entry);
  } catch (error) {
    return res.status(500).json({ error: "Failed to save journal voucher." });
  }
}
