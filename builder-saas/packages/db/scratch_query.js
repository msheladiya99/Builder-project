const { PrismaClient } = require("@prisma/client");
const dbMaster = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5430/builder_saas?schema=public"
    }
  }
});

async function main() {
  const projects = await dbMaster.project.findMany();
  console.log("=== PROJECTS IN DATABASE ===");
  console.log(JSON.stringify(projects, null, 2));
  await dbMaster.$disconnect();
}

main().catch(console.error);
