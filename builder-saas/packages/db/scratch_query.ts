import { dbMaster } from "./src/index.ts";

async function main() {
  const projects = await dbMaster.project.findMany();
  console.log("=== PROJECTS IN DATABASE ===");
  console.log(JSON.stringify(projects, null, 2));
  await dbMaster.$disconnect();
}

main().catch(console.error);
