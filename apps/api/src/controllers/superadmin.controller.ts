import { Request, Response } from "express";
import { dbMaster } from "@builder/db";
import bcrypt from "bcryptjs";

function slugify(text: string): string {
  return text.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

export async function createCompany(req: Request, res: Response) {
  try {
    const { name, adminEmail, adminPassword, plan } = req.body;
    let { domain } = req.body;

    if (!name || !adminEmail || !adminPassword) {
      return res.status(400).json({ error: "Name, Admin Email, and Admin Password are required." });
    }

    // Auto-generate domain if not provided
    if (!domain) {
      domain = slugify(name);
    } else {
      domain = slugify(domain);
    }

    // Ensure unique domain
    let finalDomain = domain;
    let counter = 1;
    while (await dbMaster.company.findFirst({ where: { domain: finalDomain } })) {
      finalDomain = `${domain}${counter}`;
      counter++;
    }

    // 1. Create Company in master DB
    const company = await dbMaster.company.create({
      data: {
        name,
        domain: finalDomain,
        plan: plan || "growth",
        status: "active"
      }
    });

    // 2. Ensure Role exists for the new Admin user
    let adminRole = await dbMaster.role.findFirst({
      where: { name: "Project Admin" }
    });

    if (!adminRole) {
      adminRole = await dbMaster.role.create({
        data: {
          name: "Project Admin",
          permissions: ["all"]
        }
      });
    }

    // 3. Create Admin User
    const passwordHash = await bcrypt.hash(adminPassword, 10);
    
    // Check if user email already exists
    const existingUser = await dbMaster.user.findFirst({ where: { email: adminEmail } });
    if (existingUser) {
        // Just update user's tenantId if they exist (simplification for now)
        await dbMaster.user.update({
            where: { id: existingUser.id },
            data: { tenantId: finalDomain, roleId: adminRole.id }
        });
    } else {
        await dbMaster.user.create({
        data: {
            name: `${name} Admin`,
            email: adminEmail,
            passwordHash,
            roleId: adminRole.id,
            tenantId: finalDomain,
            status: "active"
        }
        });
    }

    return res.status(201).json({
      message: "Company created successfully",
      company,
      loginUrl: `https://${finalDomain}.shrihari.in` // Using the base domain logic from the app
    });
  } catch (error: any) {
    console.error("Create company error:", error);
    return res.status(500).json({ error: "Failed to create company." });
  }
}
