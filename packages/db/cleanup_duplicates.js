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
  console.log(`Loaded ${projects.length} projects. Checking for duplicates...`);

  // Group by tenantId and name
  const groups = {};
  for (const p of projects) {
    const key = `${p.tenantId}::${p.name.toLowerCase()}`;
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(p);
  }

  for (const key in groups) {
    const list = groups[key];
    if (list.length <= 1) continue;

    console.log(`\nDuplicate found for key: ${key}`);

    // Sort: projects with non-null towers, tasks, staff, or financials first.
    // Otherwise, newer first.
    list.sort((a, b) => {
      const aScore = (a.towers ? 10 : 0) + (a.tasks ? 1 : 0) + (a.staff ? 1 : 0);
      const bScore = (b.towers ? 10 : 0) + (b.tasks ? 1 : 0) + (b.staff ? 1 : 0);
      if (aScore !== bScore) {
        return bScore - aScore; // Descending score
      }
      return new Date(b.updatedAt) - new Date(a.updatedAt); // Descending updatedAt
    });

    const keep = list[0];
    const toDelete = list.slice(1);

    console.log(`KEEP: ID=${keep.id}, TowersCount=${keep.towers ? keep.towers.length : 0}, UpdatedAt=${keep.updatedAt}`);
    for (const p of toDelete) {
      console.log(`DELETE: ID=${p.id}, TowersCount=${p.towers ? p.towers.length : 0}, UpdatedAt=${p.updatedAt}`);
      await dbMaster.project.delete({
        where: { id: p.id }
      });
    }
  }

  console.log("\nCleanup finished.");
  await dbMaster.$disconnect();
}

main().catch(async (e) => {
  console.error(e);
  await dbMaster.$disconnect();
});
