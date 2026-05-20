import { Request, Response } from "express";

async function ensureStockSeeded(db: any) {
  const count = await db.materialStock.count();
  if (count === 0) {
    console.log("No inventory stocks found. Seeding materials...");
    const items = [
      { materialName: "Cement OPC (Ambuja)", quantity: 450, unit: "bags", minLevel: 200 },
      { materialName: "Cement PPC (Ultratech)", quantity: 180, unit: "bags", minLevel: 150 },
      { materialName: "TMT Steel Bars (TATA)", quantity: 12.4, unit: "MT", minLevel: 5.0 },
      { materialName: "River Sand (Fine)", quantity: 45.0, unit: "CFT", minLevel: 20.0 },
      { materialName: "Red Bricks (Clay)", quantity: 12000, unit: "nos", minLevel: 5000 },
      { materialName: "Crushed Aggregate 20mm", quantity: 38.0, unit: "CFT", minLevel: 15.0 },
      { materialName: "PVC Pipe 4-inch (Finolex)", quantity: 85, unit: "nos", minLevel: 30 }
    ];
    await db.materialStock.createMany({ data: items });
  }
  
  const vendorCount = await db.vendor.count();
  if (vendorCount === 0) {
    console.log("No vendors found. Seeding vendor accounts...");
    const vendors = [
      { name: "Ambuja Cements Ltd.", contact: "Anand Gupta", phone: "+91 99221 00123", address: "Mumbai Highway, Pune", gstin: "27AAACA1234A1ZB" },
      { name: "Tata Steel Distributors", contact: "Vikas Patil", phone: "+91 99221 00124", address: "MIDC Chinchwad, Pune", gstin: "27AAACT5678T1ZC" },
      { name: "Supreme Pipe Agency", contact: "Sanjay Shah", phone: "+91 99221 00125", address: "Somwar Peth, Pune", gstin: "27AAACS9012S1ZD" }
    ];
    await db.vendor.createMany({ data: vendors });
  }
}

export async function getInventoryStock(req: Request, res: Response) {
  try {
    await ensureStockSeeded(req.db);
    const stock = await req.db.materialStock.findMany();
    return res.json(stock);
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch material stock." });
  }
}

export async function getVendors(req: Request, res: Response) {
  try {
    await ensureStockSeeded(req.db);
    const vendors = await req.db.vendor.findMany();
    return res.json(vendors);
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch vendor list." });
  }
}

export async function createVendor(req: Request, res: Response) {
  try {
    const { name, contact, phone, address, gstin } = req.body;
    if (!name || !phone) {
      return res.status(400).json({ error: "Vendor name and phone number are required." });
    }
    const vendor = await req.db.vendor.create({
      data: { name, contact, phone, address, gstin }
    });
    return res.status(201).json(vendor);
  } catch (error) {
    return res.status(500).json({ error: "Failed to save vendor details." });
  }
}

export async function getPurchaseOrders(req: Request, res: Response) {
  try {
    const pos = await req.db.purchaseOrder.findMany({
      include: { vendor: true, grns: true }
    });
    return res.json(pos);
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch purchase orders." });
  }
}

export async function createPurchaseOrder(req: Request, res: Response) {
  try {
    const { vendorId, total, items } = req.body;
    if (!vendorId || !total) {
      return res.status(400).json({ error: "Vendor ID and total amount are required." });
    }
    const po = await req.db.purchaseOrder.create({
      data: {
        vendorId,
        total: Number(total),
        status: "sent"
      }
    });
    return res.status(201).json(po);
  } catch (error) {
    return res.status(500).json({ error: "Failed to record purchase order." });
  }
}

export async function receiveGoods(req: Request, res: Response) {
  try {
    const { purchaseOrderId, items } = req.body; // items is [{ materialName, qty }]
    if (!purchaseOrderId || !items) {
      return res.status(400).json({ error: "Purchase Order ID and items are required." });
    }

    const result = await req.db.$transaction(async (tx: any) => {
      // 1. Create GRN
      const grn = await tx.gRN.create({
        data: {
          purchaseOrderId,
          status: "verified"
        }
      });

      // 2. Update Purchase Order Status
      await tx.purchaseOrder.update({
        where: { id: purchaseOrderId },
        data: { status: "received" }
      });

      // 3. Increment Material Stock
      for (const item of items) {
        await tx.materialStock.upsert({
          where: { materialName: item.materialName },
          update: { quantity: { increment: Number(item.qty) } },
          create: {
            materialName: item.materialName,
            quantity: Number(item.qty),
            unit: item.unit || "bags",
            minLevel: 100
          }
        });
      }

      return grn;
    });

    return res.status(200).json(result);
  } catch (error: any) {
    console.error("GRN receipt error:", error);
    return res.status(500).json({ error: "Failed to process Goods Receipt Note." });
  }
}
