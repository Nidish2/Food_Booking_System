import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../src/utils/password.js";

const prisma = new PrismaClient();

async function main() {
  await prisma.review.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.room.deleteMany();
  await prisma.user.deleteMany();

  const adminPassword = await hashPassword("Admin@123");
  const userPassword = await hashPassword("User@1234");

  const admin = await prisma.user.upsert({
    where: { email: "admin@hotel.com" },
    update: {},
    create: {
      name: "Demo Admin",
      email: "admin@hotel.com",
      passwordHash: adminPassword,
      role: "ADMIN",
    },
  });

  await prisma.user.upsert({
    where: { email: "guest@hotel.com" },
    update: {},
    create: {
      name: "Demo Guest",
      email: "guest@hotel.com",
      passwordHash: userPassword,
      role: "USER",
    },
  });

  const rooms = [
    {
      roomNumber: "101",
      type: "Deluxe King",
      capacity: 2,
      pricePerNight: 3200,
      description: "Comfortable king room for business and leisure stays.",
    },
    {
      roomNumber: "204",
      type: "Family Suite",
      capacity: 4,
      pricePerNight: 5400,
      description:
        "Spacious suite with extra seating and family-friendly layout.",
    },
    {
      roomNumber: "305",
      type: "Executive Twin",
      capacity: 2,
      pricePerNight: 4100,
      description: "Twin-bed room with work desk and premium amenities.",
    },
  ];

  for (const room of rooms) {
    await prisma.room.upsert({
      where: { roomNumber: room.roomNumber },
      update: {},
      create: { ...room, createdById: admin.id },
    });
  }

  const seededRooms = await prisma.room.findMany({
    orderBy: { roomNumber: "asc" },
  });
  const guest = await prisma.user.findUnique({
    where: { email: "guest@hotel.com" },
  });

  if (!guest) {
    throw new Error("Seed guest user was not created.");
  }

  const completedBookings = [
    {
      roomId: seededRooms[0].id,
      guestName: "Vic U",
      guestEmail: "guest@hotel.com",
      checkInDate: new Date("2026-05-01T00:00:00.000Z"),
      checkOutDate: new Date("2026-05-04T00:00:00.000Z"),
      totalAmount: "9600.00",
    },
    {
      roomId: seededRooms[1].id,
      guestName: "Vic U",
      guestEmail: "guest@hotel.com",
      checkInDate: new Date("2026-05-10T00:00:00.000Z"),
      checkOutDate: new Date("2026-05-13T00:00:00.000Z"),
      totalAmount: "16200.00",
    },
  ] as const;

  const createdBookings = [] as { id: string; roomId: string }[];

  for (const booking of completedBookings) {
    const createdBooking = await prisma.booking.create({
      data: {
        roomId: booking.roomId,
        userId: guest.id,
        guestName: booking.guestName,
        guestEmail: booking.guestEmail,
        checkInDate: booking.checkInDate,
        checkOutDate: booking.checkOutDate,
        totalAmount: booking.totalAmount,
        status: "CONFIRMED",
      },
    });

    createdBookings.push({
      id: createdBooking.id,
      roomId: createdBooking.roomId,
    });
  }

  await prisma.review.createMany({
    data: [
      {
        bookingId: createdBookings[0].id,
        roomId: createdBookings[0].roomId,
        userId: guest.id,
        rating: 5,
        comment: "Excellent stay, clean room and quick service.",
      },
      {
        bookingId: createdBookings[1].id,
        roomId: createdBookings[1].roomId,
        userId: guest.id,
        rating: 4,
        comment: "Comfortable suite with good amenities.",
      },
    ],
  });
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
