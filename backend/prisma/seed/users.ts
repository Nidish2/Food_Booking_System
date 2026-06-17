import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../../src/utils/password.js";

export async function seedUsers(prisma: PrismaClient) {
  // Use a common password for all seeded users for easy testing.
  const commonPassword = await hashPassword("Password@123");

  const admin = await prisma.user.upsert({
    where: { email: "nidish2207@gmail.com" },
    update: {},
    create: {
      name: "Nidish",
      email: "nidish2207@gmail.com",
      passwordHash: commonPassword,
      role: "ADMIN",
    },
  });

  const usersData = [
    { name: "Sanvith", email: "sanvith@example.com" },
    { name: "Sujay", email: "sujay@example.com" },
    { name: "Sridevi", email: "sridevi@example.com" },
    { name: "Sulekha", email: "amdevil187@gmail.com" },
    { name: "Rama", email: "rama@example.com" },
    { name: "Divyashree", email: "divyashree@example.com" },
    { name: "BalaKrishna", email: "balakrishna@example.com" },
    { name: "Harikrishna", email: "harikrishna@example.com" },
    { name: "Harshit", email: "gpicsforme@gmail.com" },
  ];

  const users = [];
  for (const u of usersData) {
    const createdUser = await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: {
        name: u.name,
        email: u.email,
        passwordHash: commonPassword,
        role: "USER",
      },
    });
    users.push(createdUser);
  }

  return { admin, users };
}
