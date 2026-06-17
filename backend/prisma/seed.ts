import { PrismaClient } from "@prisma/client";
import { seedUsers } from "./seed/users.js";
import { seedRooms } from "./seed/rooms.js";
import { seedBookings } from "./seed/bookings.js";
import { seedReviews } from "./seed/reviews.js";

const prisma = new PrismaClient();

async function main() {
  console.log("Cleaning up existing data...");
  await prisma.review.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.room.deleteMany();
  await prisma.passwordResetToken.deleteMany();
  await prisma.user.deleteMany();

  console.log("Seeding Users...");
  const { admin, users } = await seedUsers(prisma);

  console.log("Seeding Rooms...");
  const rooms = await seedRooms(prisma, admin.id);

  console.log("Seeding Bookings...");
  const bookings = await seedBookings(prisma, users, rooms);

  console.log("Seeding Reviews...");
  await seedReviews(prisma, bookings);

  console.log("Seeding completed successfully.");
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
