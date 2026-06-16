import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../src/utils/password.js";

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await hashPassword("Admin@123");
  const userPassword = await hashPassword("User@1234");

  const admin = await prisma.user.upsert({
    where: { email: "admin@hotel.com" },
    update: {},
    create: {
      name: "Demo Admin",
      email: "admin@hotel.com",
      passwordHash: adminPassword,
      role: "ADMIN"
    }
  });

  await prisma.user.upsert({
    where: { email: "guest@hotel.com" },
    update: {},
    create: {
      name: "Demo Guest",
      email: "guest@hotel.com",
      passwordHash: userPassword,
      role: "USER"
    }
  });

  const rooms = [
    {
      roomNumber: "101",
      type: "Deluxe King",
      capacity: 2,
      pricePerNight: 3200,
      description: "Comfortable king room for business and leisure stays."
    },
    {
      roomNumber: "204",
      type: "Family Suite",
      capacity: 4,
      pricePerNight: 5400,
      description: "Spacious suite with extra seating and family-friendly layout."
    },
    {
      roomNumber: "305",
      type: "Executive Twin",
      capacity: 2,
      pricePerNight: 4100,
      description: "Twin-bed room with work desk and premium amenities."
    }
  ];

  for (const room of rooms) {
    await prisma.room.upsert({
      where: { roomNumber: room.roomNumber },
      update: {},
      create: { ...room, createdById: admin.id }
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
