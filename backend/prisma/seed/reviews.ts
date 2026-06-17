import { PrismaClient } from "@prisma/client";

export async function seedReviews(prisma: PrismaClient, bookings: any[]) {
  // Add reviews to completed bookings (in the past)
  
  const reviewsData = [
    {
      bookingId: bookings[0].id,
      roomId: bookings[0].roomId,
      userId: bookings[0].userId,
      rating: 5,
      comment: "Excellent stay, clean room and quick service.",
    },
    {
      bookingId: bookings[1].id,
      roomId: bookings[1].roomId,
      userId: bookings[1].userId,
      rating: 4,
      comment: "Comfortable room with good amenities, but the view could be better.",
    },
    {
      bookingId: bookings[4].id,
      roomId: bookings[4].roomId,
      userId: bookings[4].userId,
      rating: 5,
      comment: "Absolutely loved the luxurious stay! Worth every penny.",
    }
  ];

  const createdReviews = [];
  for (const review of reviewsData) {
    const createdReview = await prisma.review.create({
      data: review,
    });
    createdReviews.push(createdReview);
  }

  return createdReviews;
}
