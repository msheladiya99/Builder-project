import { Request, Response, NextFunction } from "express";
import { dbMaster, getTenantClient, PrismaClient } from "@builder/db";
import fs from "fs";
import path from "path";

// Extend Request interface to support multi-tenancy and authentication
declare global {
  namespace Express {
    interface Request {
      db: PrismaClient;
      tenantId?: string;
      tenantSchema?: string;
      user?: {
        id: string;
        email: string;
        role: string;
        tenantId: string | null;
      };
    }
  }
}

const initializedSchemas = new Set<string>();

async function ensureTenantSchema(schemaName: string) {
  if (initializedSchemas.has(schemaName)) return;

  // 1. Create schema if not exists
  await dbMaster.$executeRawUnsafe(`CREATE SCHEMA IF NOT EXISTS "${schemaName}"`);

  // 2. Check if the schema has tables (e.g. "Flat")
  const tableCheck = await dbMaster.$queryRawUnsafe<{ exists: boolean }[]>(`
    SELECT EXISTS (
      SELECT FROM information_schema.tables 
      WHERE table_schema = '${schemaName}' 
      AND table_name = 'Flat'
    );
  `);

  if (!tableCheck[0]?.exists) {
    console.log(`[Multi-tenant] Initializing database schema '${schemaName}'...`);
    const migrationsDir = path.join(__dirname, "../../../../packages/db/prisma/migrations");
    let migrationPath = "";
    if (fs.existsSync(migrationsDir)) {
      const dirs = fs.readdirSync(migrationsDir).filter(f => fs.statSync(path.join(migrationsDir, f)).isDirectory());
      if (dirs.length > 0) {
        migrationPath = path.join(migrationsDir, dirs[0], "migration.sql");
      }
    }

    if (migrationPath && fs.existsSync(migrationPath)) {
      const sql = fs.readFileSync(migrationPath, "utf8");
      const statements = sql
        .split(";")
        .map(s => s.trim())
        .filter(s => s.length > 0 && !s.startsWith("--"));

      const tenantClient = getTenantClient(schemaName);
      for (const statement of statements) {
        try {
          await tenantClient.$executeRawUnsafe(statement);
        } catch (err: any) {
          if (!err.message.includes("already exists") && !err.message.includes("relation")) {
            console.error(`[Multi-tenant] Schema init statement warning:`, err.message);
          }
        }
      }
      console.log(`[Multi-tenant] Schema '${schemaName}' initialized successfully.`);
    } else {
      console.error(`[Multi-tenant] Schema init error: Migration file not found at ${migrationPath}`);
    }
  }

  initializedSchemas.add(schemaName);
}

export async function tenantResolver(req: Request, res: Response, next: NextFunction) {
  try {
    // 1. Extract subdomain/tenantId from Host header or X-Tenant-Id header
    const host = req.headers.host || "";
    let subdomain = "";
    
    const parts = host.split(".");
    if (host.includes("localhost") && parts.length > 1) {
      subdomain = parts[0];
    } else if (!host.includes("localhost") && parts.length > 2 && parts[0] !== "www") {
      subdomain = parts[0];
    }
    
    // Explicit override via header (useful for API clients or cross-origin requests)
    const headerTenant = req.headers["x-tenant-id"] as string;
    if (headerTenant) {
      subdomain = headerTenant;
    }
    
    // Map slugified 'hari-heritage' or 'hari-haritage' back to 'hariheights'
    if (subdomain === "hari-heritage" || subdomain === "hari-haritage") {
      subdomain = "hariheights";
    }
    
    // If no subdomain (could be main domain / public api), use the public schema
    if (!subdomain || subdomain === "localhost" || subdomain === "www") {
      req.db = dbMaster;
      req.tenantId = "master";
      req.tenantSchema = "public";
      return next();
    }
    
    req.tenantId = subdomain;
    
    // Normalize subdomain to map to a valid PostgreSQL schema name
    // e.g. "shg-001" -> "shg_001", "hariheights" -> "hariheights"
    const schemaName = subdomain.toLowerCase().replace(/[^a-z0-9_]/g, "_");
    req.tenantSchema = schemaName;
    
    // Ensure the tenant database schema exists and is fully migrated
    await ensureTenantSchema(schemaName);
    
    // 2. Resolve client from database registry
    req.db = getTenantClient(schemaName);
    
    // 3. Verify tenant database / schema is provisioned or active
    // We do a quick connection check or lookup on the master database.
    // NOTE: We do NOT block unknown tenants at this point — a Super Admin can create
    // new projects with new tenantIds and they should be immediately accessible.
    // Only reject if this is a non-master request accessing a completely unknown tenant
    // AND the request is not a write operation (POST/PUT) that would create the tenant.
    const project = await dbMaster.project.findFirst({
      where: { tenantId: subdomain }
    });
    
    const company = await dbMaster.company.findFirst({
      where: { domain: subdomain }
    });

    if (!project && !company && !["POST", "PUT", "PATCH"].includes(req.method)) {
      // For read requests to an unknown tenant, return 404 with a clear message
      // but only if it really looks like an invalid tenant (no matching records)
      const projectCount = await dbMaster.project.count({ where: { tenantId: subdomain } });
      const companyCount = await dbMaster.company.count({ where: { domain: subdomain } });
      if (projectCount === 0 && companyCount === 0) {
        return res.status(404).json({ error: `Tenant workspace '${subdomain}' not found. Please check the subdomain.` });
      }
    }
    
    next();
  } catch (error: any) {
    console.error("Multi-tenancy middle resolver error:", error);
    res.status(500).json({ error: "Failed to resolve tenant workspace database schema." });
  }
}
