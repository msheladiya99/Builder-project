import { Request, Response } from "express";
import { encrypt, decrypt } from "../utils/crypto";

async function ensureLabourSeeded(db: any) {
  const contractorCount = await db.contractor.count();
  if (contractorCount === 0) {
    console.log("No contractors found. Seeding contractor entries...");
    const contractors = [
      { name: "Sharma Contractor", trade: "Civil", workersCount: 18, ratePerDay: 13500, advance: 250000, totalPayable: 810000, paid: 560000, status: "active" },
      { name: "Gupta Works", trade: "Carpentry", workersCount: 8, ratePerDay: 6800, advance: 100000, totalPayable: 408000, paid: 308000, status: "active" },
      { name: "EM Electric", trade: "Electrical", workersCount: 5, ratePerDay: 4500, advance: 80000, totalPayable: 270000, paid: 190000, status: "active" }
    ];
    await db.contractor.createMany({ data: contractors });
  }

  const workerCount = await db.worker.count();
  if (workerCount === 0) {
    console.log("No workers found. Seeding worker roster...");
    const dbContractors = await db.contractor.findMany();
    const sharma = dbContractors.find((c: any) => c.name === "Sharma Contractor")?.id || "";
    const gupta = dbContractors.find((c: any) => c.name === "Gupta Works")?.id || "";
    
    // Aadhaar number encrypted
    const workers = [
      { name: "Ramesh Yadav", trade: "Mason", contractorId: sharma, dailyWage: 750, phone: "+91 94512 34567", aadhaar: encrypt("1234-5678-9012"), status: "active", skills: ["Brickwork", "Plastering"], tower: "Tower A" },
      { name: "Suresh Gupta", trade: "Carpenter", contractorId: gupta, dailyWage: 850, phone: "+91 94523 45678", aadhaar: encrypt("2345-6789-0123"), status: "active", skills: ["Shuttering", "Formwork"], tower: "Tower A" },
      { name: "Mohan Lal", trade: "Helper", contractorId: sharma, dailyWage: 550, phone: "+91 94534 56789", aadhaar: encrypt("3456-7890-1234"), status: "present", skills: ["Material Handling"], tower: "Tower B" },
      { name: "Raju Mishra", trade: "Electrician", contractorId: sharma, dailyWage: 900, phone: "+91 94545 67890", aadhaar: encrypt("4567-8901-2345"), status: "active", skills: ["Wiring", "Panel Work"], tower: "Tower A" }
    ];
    
    await db.worker.createMany({ data: workers });
  }
}

export async function getWorkers(req: Request, res: Response) {
  try {
    await ensureLabourSeeded(req.db);
    const workers = await req.db.worker.findMany({
      include: { attendance: true }
    });
    
    const decryptedWorkers = workers.map((w: any) => ({
      ...w,
      aadhaar: decrypt(w.aadhaar)
    }));
    
    return res.json(decryptedWorkers);
  } catch (error) {
    return res.status(500).json({ error: "Failed to load worker roster." });
  }
}

export async function createWorker(req: Request, res: Response) {
  try {
    const { name, trade, contractorId, dailyWage, phone, aadhaar, status, skills, tower } = req.body;
    if (!name || !trade || !dailyWage || !phone) {
      return res.status(400).json({ error: "Missing required worker parameters." });
    }

    const worker = await req.db.worker.create({
      data: {
        name,
        trade,
        contractorId,
        dailyWage: Number(dailyWage),
        phone,
        aadhaar: encrypt(aadhaar || "XXXX-XXXX-XXXX"),
        status: status || "active",
        skills: skills || [],
        tower: tower || null
      }
    });

    return res.status(201).json({ ...worker, aadhaar: decrypt(worker.aadhaar) });
  } catch (error) {
    return res.status(500).json({ error: "Failed to add worker profile." });
  }
}

export async function saveAttendance(req: Request, res: Response) {
  try {
    const { records } = req.body; // Array of { workerId, date, status, checkIn, checkOut, overtime }
    if (!records || !Array.isArray(records)) {
      return res.status(400).json({ error: "Attendance records array is required." });
    }

    const saved = [];
    for (const rec of records) {
      const formattedDate = new Date(rec.date);
      // Remove time component to prevent duplicate attendance logs on same day
      formattedDate.setHours(0, 0, 0, 0);

      const record = await req.db.attendance.upsert({
        where: {
          id: rec.id || `ATT_${rec.workerId}_${formattedDate.getTime()}`
        },
        update: {
          status: rec.status,
          checkIn: rec.checkIn || null,
          checkOut: rec.checkOut || null,
          overtime: Number(rec.overtime || 0)
        },
        create: {
          id: rec.id || `ATT_${rec.workerId}_${formattedDate.getTime()}`,
          workerId: rec.workerId,
          date: formattedDate,
          status: rec.status,
          checkIn: rec.checkIn || null,
          checkOut: rec.checkOut || null,
          overtime: Number(rec.overtime || 0)
        }
      });
      saved.push(record);
    }

    return res.json({ success: true, count: saved.length });
  } catch (error: any) {
    console.error("Attendance save error:", error);
    return res.status(500).json({ error: "Failed to save attendance logs." });
  }
}

export async function getContractors(req: Request, res: Response) {
  try {
    await ensureLabourSeeded(req.db);
    const contractors = await req.db.contractor.findMany();
    return res.json(contractors);
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch contractors ledger." });
  }
}
