import { PrismaClient } from "@prisma/client";

export * from "@prisma/client";

// Cache of Prisma clients per tenant schema
const clients: Record<string, PrismaClient> = {};

// Master database connection client
export const dbMaster = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  }
});

/**
 * Returns a cached PrismaClient scoped to the specified tenant schema
 * @param schemaName The PostgreSQL schema name for the tenant (e.g. 'xyz_residency')
 */
export function getTenantClient(schemaName: string): PrismaClient {
  const normalizedSchema = schemaName.toLowerCase().replace(/[^a-z0-9_]/g, "");
  
  if (!clients[normalizedSchema]) {
    const baseDbUrl = process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/builder_saas?schema=public";
    
    // Construct database URL with schema override
    // If DATABASE_URL already has query parameters, we append correctly
    const separator = baseDbUrl.includes("?") ? "&" : "?";
    const tenantDbUrl = `${baseDbUrl}${separator}schema=${normalizedSchema}`;
    
    clients[normalizedSchema] = new PrismaClient({
      datasources: {
        db: {
          url: tenantDbUrl
        }
      }
    });
  }
  
  return clients[normalizedSchema];
}

/**
 * Helper to close all connection pools (useful on shutdown)
 */
export async function disconnectAll(): Promise<void> {
  await dbMaster.$disconnect();
  for (const client of Object.values(clients)) {
    await client.$disconnect();
  }
}
