import { PrismaClient } from "@prisma/client";

export async function seedBookings(prisma: PrismaClient, users: any[], rooms: any[]) {
  // We have 9 users and 6 rooms. Let's create about 6 bookings to show different statuses and history.
  
  const bookingsData = [
    {
      roomId: rooms[0].id,
      userId: users[0].id,
      guestName: users[0].name,
      guestEmail: users[0].email,
      checkInDate: new Date("2025-05-01T00:00:00.000Z"),
      checkOutDate: new Date("2025-05-04T00:00:00.000Z"),
      totalAmount: "9600.00",
      status: "CONFIRMED"
    },
    {
      roomId: rooms[1].id,
      userId: users[1].id,
      guestName: users[1].name,
      guestEmail: users[1].email,
      checkInDate: new Date("2025-06-10T00:00:00.000Z"),
      checkOutDate: new Date("2025-06-12T00:00:00.000Z"),
      totalAmount: "5000.00",
      status: "CONFIRMED"
    },
    {
      roomId: rooms[2].id,
      userId: users[2].id,
      guestName: users[2].name,
      guestEmail: users[2].email,
      checkInDate: new Date("2026-08-15T00:00:00.000Z"),
      checkOutDate: new Date("2026-08-20T00:00:00.000Z"),
      totalAmount: "27000.00",
      status: "CONFIRMED" // Future booking
    },
    {
      roomId: rooms[3].id,
      userId: users[3].id,
      guestName: users[3].name,
      guestEmail: users[3].email,
      checkInDate: new Date("2025-10-05T00:00:00.000Z"),
      checkOutDate: new Date("2025-10-07T00:00:00.000Z"),
      totalAmount: "8200.00",
      status: "CANCELLED" // Cancelled history
    },
    {
      roomId: rooms[4].id,
      userId: users[4].id,
      guestName: users[4].name,
      guestEmail: users[4].email,
      checkInDate: new Date("2025-11-20T00:00:00.000Z"),
      checkOutDate: new Date("2025-11-22T00:00:00.000Z"),
      totalAmount: "30000.00",
      status: "CONFIRMED"
    },
    {
      roomId: rooms[5].id,
      userId: users[5].id,
      guestName: users[5].name,
      guestEmail: users[5].email,
      checkInDate: new Date("2026-12-25T00:00:00.000Z"),
      checkOutDate: new Date("2026-12-28T00:00:00.000Z"),
      totalAmount: "25500.00",
      status: "CONFIRMED" // Future booking
    }
  ];

  const createdBookings = [];
  for (const booking of bookingsData) {
    const createdBooking = await prisma.booking.create({
      data: {
        roomId: booking.roomId,
        userId: booking.userId,
        guestName: booking.guestName,
        guestEmail: booking.guestEmail,
        checkInDate: booking.checkInDate,
        checkOutDate: booking.checkOutDate,
        totalAmount: booking.totalAmount,
        status: booking.status as any,
      },
    });
    createdBookings.push(createdBooking);
  }

  return createdBookings;
}
