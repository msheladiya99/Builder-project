import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding master platform data...");

  // 1. Roles
  const roles = [
    { name: "Super Admin", permissions: ["*"] },
    { name: "Project Admin", permissions: ["project:read", "project:write", "users:read", "users:write"] },
    { name: "Accountant", permissions: ["accounting:read", "accounting:write", "payments:read", "payments:write"] },
    { name: "Site Engineer", permissions: ["progress:read", "progress:write", "labour:read", "labour:write", "inventory:read"] },
    { name: "Sales Staff", permissions: ["crm:read", "crm:write", "flats:read", "flats:write"] },
    { name: "Flat Owner", permissions: ["owner:read", "owner:payments", "owner:complaints"] }
  ];

  const dbRoles: Record<string, any> = {};
  for (const r of roles) {
    const role = await prisma.role.upsert({
      where: { name: r.name },
      update: { permissions: r.permissions },
      create: { name: r.name, permissions: r.permissions }
    });
    dbRoles[r.name] = role;
    console.log(`Role ${r.name} created.`);
  }

  // 2. Company
  const company = await prisma.company.upsert({
    where: { domain: "shrihari.in" },
    update: {},
    create: {
      name: "Shri Hari Group",
      logo: "shg_logo",
      domain: "shrihari.in",
      plan: "enterprise",
      status: "active"
    }
  });
  console.log(`Company ${company.name} created/verified.`);

  // 3. Projects
  const projects = [
    {
      name: "Shri Hari Heights",
      location: "S.G. Highway, Ahmedabad",
      rera: "PR/GJ/AHMEDABAD/AUDA/RAA12345/010123",
      status: "active",
      budget: 1200000000,
      spent: 780000000,
      tenantId: "shg-001"
    },
    {
      name: "Hari Heritage",
      location: "GIFT City, Gandhinagar",
      rera: "PR/GJ/GANDHINAGAR/GUDA/RAA12346/010123",
      status: "planning",
      budget: 2500000000,
      spent: 350000000,
      tenantId: "hariheights"
    },
    {
      name: "Green Valley",
      location: "Bopal, Ahmedabad",
      rera: "PR/GJ/AHMEDABAD/AUDA/RAA12347/010123",
      status: "completed",
      budget: 850000000,
      spent: 820000000,
      tenantId: "kmb-002"
    }
  ];

  for (const p of projects) {
    const project = await prisma.project.create({
      data: p
    });
    console.log(`Project ${project.name} created.`);
  }

  // 4. Users
  // In a real application, password hashes must be generated via bcrypt.
  // Using a mock bcrypt hash for 'password123' -> '$2b$10$wE1V9Wv4M9cR.Fw/9VbOPOp6w09R6uK0.WjU7Q1L1Dq6.xZ1a9q2'
  const passwordHash = "$2b$10$wE1V9Wv4M9cR.Fw/9VbOPOp6w09R6uK0.WjU7Q1L1Dq6.xZ1a9q2";

  const users = [
    {
      name: "Rajesh Sharma",
      email: "rajesh@shrihari.com",
      phone: "+91 98765 43210",
      roleId: dbRoles["Super Admin"].id,
      tenantId: null
    },
    {
      name: "Priya Nair",
      email: "priya@shrihari.com",
      phone: "+91 98765 43211",
      roleId: dbRoles["Project Admin"].id,
      tenantId: "shg-001"
    },
    {
      name: "Kiran Patil",
      email: "kiran@shrihari.com",
      phone: "+91 98765 43212",
      roleId: dbRoles["Site Engineer"].id,
      tenantId: "shg-001"
    },
    {
      name: "Meena Joshi",
      email: "meena@shrihari.com",
      phone: "+91 98765 43213",
      roleId: dbRoles["Accountant"].id,
      tenantId: "shg-001"
    },
    {
      name: "Hari Admin",
      email: "user@hariheights.in",
      phone: "+91 98765 43214",
      roleId: dbRoles["Project Admin"].id,
      tenantId: "hariheights"
    }
  ];

  for (const u of users) {
    await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: {
        name: u.name,
        email: u.email,
        passwordHash,
        phone: u.phone,
        roleId: u.roleId,
        tenantId: u.tenantId
      }
    });
    console.log(`User ${u.name} created.`);
  }

  console.log("Database seed completed successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
