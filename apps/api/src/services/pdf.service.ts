import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";

// Ensure a local downloads/vault directory exists for PDFs
const UPLOADS_DIR = path.join(__dirname, "../../../../apps/web/public/vault");
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

/**
 * Generates a PDF from HTML template using Puppeteer.
 * Falls back to generating a mock document if chromium fails to start.
 */
export async function generatePDF(htmlContent: string, fileName: string): Promise<string> {
  const filePath = path.join(UPLOADS_DIR, fileName);
  
  try {
    console.log(`Launching Puppeteer to generate PDF: ${fileName}`);
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"]
    });
    
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: "networkidle0" });
    
    // Print page as PDF
    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: {
        top: "20mm",
        right: "20mm",
        bottom: "20mm",
        left: "20mm"
      }
    });
    
    await browser.close();
    fs.writeFileSync(filePath, pdfBuffer);
    console.log(`PDF saved to disk: ${filePath}`);
    
    // Return relative URL for frontend download (accessible under public/vault/)
    return `/vault/${fileName}`;
  } catch (error: any) {
    console.warn("Puppeteer launch failed. Generating fallback mock document.", error.message);
    
    // Fallback: create a simple mock PDF (text file renamed or simple visual mock)
    const mockContent = `%PDF-1.4\n1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Contents 4 0 R >>\nendobj\n4 0 obj\n<< /Length 50 >>\nstream\nBT /F1 24 Tf 70 700 Td (BUILDER ERP - MOCK DOCUMENT RECEIPT) Tj ET\nendstream\nendobj\nxref\n0 5\n0000000000 65535 f\n0000000009 00000 n\n0000000056 00000 n\n0000000111 00000 n\n0000000212 00000 n\ntrailer\n<< /Size 5 /Root 1 0 R >>\nstartxref\n312\n%%EOF`;
    
    fs.writeFileSync(filePath, Buffer.from(mockContent));
    return `/vault/${fileName}`;
  }
}
