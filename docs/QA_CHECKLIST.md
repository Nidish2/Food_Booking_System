# QA Checklist

Use this before demo/submission.

## Assignment Coverage

- Add and view rooms: admin can add rooms from fixed room-number inventory and view room cards.
- Book a room: authenticated users can book available rooms.
- Prevent double booking: backend transaction checks overlapping confirmed bookings.
- Store booking details: bookings are stored in PostgreSQL with room, user, guest, dates, amount, and status.
- Display booking history: users see own history; admins see all bookings.

## Backend Test Cases

- Auth: register succeeds, duplicate register fails, invalid login fails, logout clears cookie.
- Security: passwords are hashed, invalid login message is generic, forgot-password does not reveal whether email exists.
- RBAC: unauthenticated routes fail, normal users cannot add/edit rooms, admins can add/edit rooms.
- Rooms: duplicate room number fails, filters work by date/type/capacity/price, availability is date-based.
- Bookings: valid booking succeeds, overlapping booking fails with `409`, adjacent booking succeeds, past dates fail, invalid date range fails.
- Reviews: only booking owner can review, review only after checkout, duplicate review fails.

## Frontend Test Cases

- Login/signup forms show inline validation and toast messages.
- Header shows role-aware links.
- Profile page opens from header and shows current user details.
- Admin can add room, edit room, view users, view all bookings.
- User can filter rooms, book room, view own booking cards, open details, and submit feedback after checkout.
- Booking history status filters work: `ALL`, `UPCOMING`, `ACTIVE`, `COMPLETED`, `CANCELLED`.
- Empty/loading/error states render cleanly.
- Mobile layout remains card-based and readable.

## Database Checks

- `User.email` is unique.
- `Room.roomNumber` is unique.
- `Booking` indexes support room/date lookup.
- `Review.bookingId` is unique so one booking receives one feedback entry.
- No static `isAvailable` flag is used; room availability is calculated from dates.

## Manual Demo Flow

1. Start backend and frontend.
2. Login as `admin@hotel.com` / `Admin@123`.
3. Add a room from available room numbers.
4. Edit room price/type/capacity/description.
5. Open Users and verify registered users display.
6. Open All Bookings and test status filters.
7. Logout.
8. Signup/login as a normal user.
9. Filter rooms by dates, type, capacity, and price.
10. Book a room.
11. Try the same room with overlapping dates and confirm the conflict message.
12. Try adjacent dates and confirm booking succeeds.
13. Open My Bookings and View Details.
14. For a completed booking, submit feedback and verify room rating appears.
