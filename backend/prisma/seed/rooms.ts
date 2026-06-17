import { PrismaClient } from "@prisma/client";

export async function seedRooms(prisma: PrismaClient, adminId: string) {
  const roomsData = [
    {
      roomNumber: "101",
      type: "Deluxe King",
      capacity: 2,
      pricePerNight: 3200,
      description: "Comfortable king room for business and leisure stays.",
    },
    {
      roomNumber: "102",
      type: "Standard Queen",
      capacity: 2,
      pricePerNight: 2500,
      description: "Cozy queen room with city views.",
    },
    {
      roomNumber: "201",
      type: "Family Suite",
      capacity: 4,
      pricePerNight: 5400,
      description: "Spacious suite with extra seating and family-friendly layout.",
    },
    {
      roomNumber: "202",
      type: "Executive Twin",
      capacity: 2,
      pricePerNight: 4100,
      description: "Twin-bed room with work desk and premium amenities.",
    },
    {
      roomNumber: "301",
      type: "Presidential Suite",
      capacity: 4,
      pricePerNight: 15000,
      description: "Luxurious top-floor suite with panoramic views and private lounge.",
    },
    {
      roomNumber: "302",
      type: "Honeymoon Suite",
      capacity: 2,
      pricePerNight: 8500,
      description: "Romantic suite designed for couples, featuring a jacuzzi.",
    },
  ];

  const createdRooms = [];
  for (const room of roomsData) {
    const r = await prisma.room.upsert({
      where: { roomNumber: room.roomNumber },
      update: {},
      create: { ...room, createdById: adminId },
    });
    createdRooms.push(r);
  }

  return createdRooms;
}
