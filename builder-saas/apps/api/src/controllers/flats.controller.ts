import { Request, Response } from "express";
import { encrypt, decrypt } from "../utils/crypto";

// Auto-seed flats helper to ensure UI works on empty databases
async function ensureFlatsSeeded(db: any) {
  const count = await db.flat.count();
  if (count === 0) {
    console.log("No flats found. Automatically seeding default flat inventory...");
    const towers = ["Tower A", "Tower B", "Tower C"];
    const flatsData = [];
    
    for (const t of towers) {
      for (let floor = 1; floor <= 5; floor++) {
        for (let num = 1; num <= 4; num++) {
          const flatNum = `${floor}${num.toString().padStart(2, "0")}`;
          const isBooked = floor === 3 || (floor === 4 && num === 2);
          const isBlocked = floor === 5 && num === 4;
          
          flatsData.push({
            number: `${flatNum}`,
            floor,
            wing: t,
            type: num % 2 === 0 ? "2 BHK" : "3 BHK",
            status: isBooked ? "booked" : isBlocked ? "blocked" : "available",
            price: num % 2 === 0 ? 7500000 : 9500000,
            area: num % 2 === 0 ? 1150 : 1450
          });
        }
      }
    }
    
    await db.flat.createMany({ data: flatsData });
    console.log("Flat inventory seeded.");
  }
}

export async function getFlats(req: Request, res: Response) {
  try {
    await ensureFlatsSeeded(req.db);
    
    const flats = await req.db.flat.findMany({
      include: { flatOwners: true }
    });
    
    return res.json(flats);
  } catch (error) {
    console.error("Fetch flats error:", error);
    return res.status(500).json({ error: "Failed to fetch flat inventory." });
  }
}

export async function getFlatDetails(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const flat = await req.db.flat.findUnique({
      where: { id },
      include: {
        flatOwners: {
          include: {
            coApplicants: true,
            documents: true,
            paymentReceipts: true,
            demandLetters: true,
            loanDetails: true,
            insurancePolicies: true
          }
        },
        paymentSchedules: true
      }
    });

    if (!flat) {
      return res.status(404).json({ error: "Flat unit not found." });
    }

    // Decrypt sensitive information (Aadhaar)
    if (flat.flatOwners) {
      flat.flatOwners = flat.flatOwners.map((owner: any) => ({
        ...owner,
        aadhaar: decrypt(owner.aadhaar)
      }));
    }

    return res.json(flat);
  } catch (error) {
    return res.status(500).json({ error: "Failed to load flat details." });
  }
}

export async function bookFlat(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { owner, coApplicant } = req.body;
    
    if (!owner || !owner.name || !owner.email || !owner.phone) {
      return res.status(400).json({ error: "Owner credentials (name, email, phone) are required." });
    }

    // Encrypt Aadhaar number before database storage
    const encryptedAadhaar = encrypt(owner.aadhaar || "XXXX-XXXX-XXXX");

    // Perform transaction to update flat status, create owner, and add co-applicant
    const result = await req.db.$transaction(async (tx: any) => {
      // 1. Update Flat Status
      const flat = await tx.flat.update({
        where: { id },
        data: { status: "booked" }
      });

      // 2. Create Owner Profile
      const flatOwner = await tx.flatOwner.create({
        data: {
          flatId: id,
          name: owner.name,
          email: owner.email,
          phone: owner.phone,
          pan: owner.pan,
          aadhaar: encryptedAadhaar,
          address: owner.address || "N/A"
        }
      });

      // 3. Create Co-applicant if data exists
      let applicant = null;
      if (coApplicant && coApplicant.name) {
        applicant = await tx.coApplicant.create({
          data: {
            flatOwnerId: flatOwner.id,
            name: coApplicant.name,
            email: coApplicant.email || "",
            phone: coApplicant.phone || "",
            relationship: coApplicant.relationship || "Other"
          }
        });
      }

      // 4. Create default payment schedules based on milestones
      const totalAmount = Number(flat.price);
      const milestones = [
        { name: "Booking Amount (10%)", pct: 0.1, days: 7 },
        { name: "Plinth Level Completion (20%)", pct: 0.2, days: 60 },
        { name: "Slab 1 Completion (20%)", pct: 0.2, days: 120 },
        { name: "Brickwork & Plastering (30%)", pct: 0.3, days: 240 },
        { name: "Possession Handover (20%)", pct: 0.2, days: 365 }
      ];

      const schedules = milestones.map(m => {
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + m.days);
        return {
          flatId: id,
          milestoneName: m.name,
          amount: totalAmount * m.pct,
          dueDate,
          status: "pending"
        };
      });

      await tx.paymentSchedule.createMany({ data: schedules });

      return { flat, flatOwner, coApplicant: applicant };
    });

    return res.status(200).json(result);
  } catch (error: any) {
    console.error("Booking error:", error);
    return res.status(500).json({ error: "Booking transaction failed." });
  }
}

export async function uploadDocument(req: Request, res: Response) {
  try {
    const { ownerId } = req.body;
    const { name, type, fileContent } = req.body; // Mock base64 content
    
    if (!ownerId || !name || !type) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    // Mock upload URL to Cloudflare R2
    const mockR2Url = `https://r2.shrihari.in/vault/${ownerId}_${Date.now()}_${name}`;

    const document = await req.db.document.create({
      data: {
        flatOwnerId: ownerId,
        name,
        type,
        url: mockR2Url,
        status: "verified",
        verifiedAt: new Date()
      }
    });

    return res.status(201).json(document);
  } catch (error) {
    return res.status(500).json({ error: "Failed to upload and archive KYC document." });
  }
}
