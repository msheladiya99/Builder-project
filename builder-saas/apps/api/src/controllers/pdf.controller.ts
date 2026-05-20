import { Request, Response } from "express";
import { generatePDF } from "../services/pdf.service";

export async function generateReceipt(req: Request, res: Response) {
  try {
    const { ownerName, flatNo, amount, date, mode, txId } = req.body;
    if (!ownerName || !amount || !txId) {
      return res.status(400).json({ error: "Missing receipt parameters." });
    }

    const htmlTemplate = `
      <html>
        <head>
          <style>
            body { font-family: 'Helvetica Neue', Arial, sans-serif; padding: 30px; color: #333; }
            .header { text-align: center; border-bottom: 2px solid #1B3A6B; padding-bottom: 20px; }
            .logo { font-size: 28px; font-weight: bold; color: #1B3A6B; }
            .title { font-size: 18px; margin-top: 10px; text-transform: uppercase; letter-spacing: 1px; }
            .meta { display: flex; justify-content: space-between; margin-top: 30px; font-size: 14px; }
            .details { margin-top: 40px; border-collapse: collapse; width: 100%; }
            .details th, .details td { border: 1px solid #ddd; padding: 12px; text-align: left; }
            .details th { bg-color: #f2f2f2; font-weight: bold; }
            .amount-section { margin-top: 40px; font-size: 20px; font-weight: bold; text-align: right; color: #1B3A6B; }
            .footer { margin-top: 60px; font-size: 10px; color: #777; text-align: center; border-top: 1px solid #ddd; padding-top: 10px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">SHRI HARI GROUP</div>
            <div class="title">OFFICIAL PAYMENT RECEIPT</div>
          </div>
          <div class="meta">
            <div>
              <strong>Issued To:</strong><br>
              ${ownerName}<br>
              Flat No: ${flatNo || "N/A"}
            </div>
            <div>
              <strong>Receipt No:</strong> REC-${txId.substring(0, 8)}<br>
              <strong>Date:</strong> ${date || new Date().toLocaleDateString()}<br>
              <strong>Transaction ID:</strong> ${txId}
            </div>
          </div>
          <table class="details">
            <thead>
              <tr>
                <th>Description</th>
                <th>Payment Mode</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Builder Flat Installment Payment</td>
                <td>${mode || "NEFT / Bank Transfer"}</td>
                <td style="color: green; font-weight: bold;">SUCCESSFUL</td>
              </tr>
            </tbody>
          </table>
          <div class="amount-section">
            Total Amount Collected: ₹${Number(amount).toLocaleString("en-IN")}
          </div>
          <div class="footer">
            This is a computer-generated receipt. No signature is required. For inquiries, reach out to accounting@shrihari.in.
          </div>
        </body>
      </html>
    `;

    const fileName = `receipt_${txId}_${Date.now()}.pdf`;
    const relativeUrl = await generatePDF(htmlTemplate, fileName);
    
    // Save PDF record to active tenant database
    await req.db.paymentReceipt.updateMany({
      where: { txId },
      data: { pdfUrl: relativeUrl }
    });

    return res.json({ pdfUrl: relativeUrl });
  } catch (error: any) {
    console.error("PDF collection receipt generation failed:", error);
    return res.status(500).json({ error: "Failed to generate receipt PDF." });
  }
}

export async function generateDemand(req: Request, res: Response) {
  try {
    const { ownerName, flatNo, amount, dueDate, milestoneName, ownerId } = req.body;
    if (!ownerName || !amount || !milestoneName) {
      return res.status(400).json({ error: "Missing demand parameters." });
    }

    const htmlTemplate = `
      <html>
        <head>
          <style>
            body { font-family: 'Helvetica Neue', Arial, sans-serif; padding: 40px; color: #222; line-height: 1.5; }
            .header { border-bottom: 3px solid #C9922A; padding-bottom: 15px; margin-bottom: 30px; }
            .logo { font-size: 26px; font-weight: bold; color: #1B3A6B; }
            .title { font-size: 20px; font-weight: bold; color: #C9922A; text-align: center; margin: 20px 0; }
            .details-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            .details-table td { padding: 8px; border-bottom: 1px solid #eee; }
            .clause { margin-top: 30px; font-size: 13px; color: #444; }
            .signature { margin-top: 50px; text-align: right; }
          </style>
        </head>
        <body>
          <div class="header">
            <span class="logo">SHRI HARI GROUP</span>
            <div style="float: right; text-align: right; font-size: 12px; color: #555;">
              Office: Landmark Plaza, Pune<br>
              RERA Reg: MH/07/2022/1456
            </div>
          </div>
          <div class="title">DEMAND NOTICE FOR PAYMENT</div>
          <p>Dear ${ownerName},</p>
          <p>We would like to inform you that construction work has reached the milestone: <strong>${milestoneName}</strong>. As per the mutual builder-buyer agreement signed, the installment is now due for payment.</p>
          
          <table class="details-table">
            <tr>
              <td><strong>Flat Unit Number:</strong></td>
              <td>${flatNo || "N/A"}</td>
            </tr>
            <tr>
              <td><strong>Milestone Reached:</strong></td>
              <td>${milestoneName}</td>
            </tr>
            <tr>
              <td><strong>Amount Payable (INR):</strong></td>
              <td><strong>₹${Number(amount).toLocaleString("en-IN")}</strong></td>
            </tr>
            <tr>
              <td><strong>Due Date:</strong></td>
              <td><span style="color: red;">${dueDate || "Within 7 Days"}</span></td>
            </tr>
          </table>
          
          <div class="clause">
            Please credit the amount to the designated escrow bank account of Shri Hari Group via NEFT/RTGS. Delay in payment beyond the due date will attract interest penalties at standard RERA rates.
          </div>
          
          <div class="signature">
            <p>For <strong>Shri Hari Group</strong></p>
            <br>
            <p>Authorized Signatory</p>
          </div>
        </body>
      </html>
    `;

    const fileName = `demand_${ownerId}_${Date.now()}.pdf`;
    const relativeUrl = await generatePDF(htmlTemplate, fileName);

    return res.json({ pdfUrl: relativeUrl });
  } catch (error) {
    return res.status(500).json({ error: "Failed to compile demand letter PDF." });
  }
}
