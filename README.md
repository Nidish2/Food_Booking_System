# Hotel Booking System

A full-stack hotel booking case-study app built with React, Node.js, TypeScript, Prisma, and PostgreSQL. It supports room management, room booking, double-booking prevention, stored booking details, and booking history.

## Features

- User signup, login, logout, and protected routes
- Role-based admin/user navigation
- Admin can add, view, and edit hotel rooms
- Admin can view all bookings and registered users
- Users can search available rooms with date, type, capacity, and price filters
- Fixed room-number selection for a single-hotel inventory
- Book rooms with guest and date details
- Prevent double booking with backend overlap validation
- Store booking details in PostgreSQL
- Display booking history as responsive cards
- Profile page, demo forgot-password reset, booking detail view, status filters, and post-checkout feedback
- Responsive Albertsons-inspired blue/red hotel dashboard UI
- Centralized backend validation and error handling

## Tech Stack

- Frontend: React, Vite, TypeScript, Tailwind CSS
- Backend: Node.js, Express.js, TypeScript
- Database: Neon PostgreSQL
- ORM: Prisma
- Validation: Zod
- Auth: JWT and bcrypt
- Frontend data: TanStack Query, Axios
- Forms: React Hook Form
- Tests: Vitest

## Architecture

The project uses separate `frontend` and `backend` folders. The backend follows a clean architecture-lite approach:

- Routes define API endpoints.
- Controllers handle HTTP request and response.
- Services contain business logic.
- Validators contain Zod schemas.
- Middleware handles auth, validation, and errors.
- Prisma handles database access.

## Folder Structure

```text
Hotel_Booking_System/
  backend/
    prisma/
    src/
      config/
      constants/
      controllers/
      middleware/
      routes/
      services/
      validators/
      utils/
    tests/
  frontend/
    src/
      api/
      components/
      hooks/
      pages/
      routes/
      schemas/
      types/
      utils/
```

## Database Schema

- `User`: stores user account details and hashed passwords.
- `Room`: stores room number, type, capacity, price, and description.
- `Booking`: stores room, user, guest details, date range, total amount, and status.
- `Review`: stores post-checkout feedback linked to one booking, one room, and one user.

Room availability is date-based. The app does not rely on a static room availability flag.

## Double Booking Prevention

The backend rejects overlapping bookings using this rule:

```text
requestedCheckIn < existingCheckOut
AND
requestedCheckOut > existingCheckIn
```

Booking creation runs inside a Prisma transaction. If an overlapping confirmed booking exists for the same room, the API returns `409 Conflict`.

## Setup

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env
```

Update `.env`:

```text
DATABASE_URL="your-neon-postgresql-url"
JWT_SECRET="replace-with-a-long-random-secret"
JWT_EXPIRES_IN="1d"
PORT=5000
CLIENT_URL="http://localhost:5173"
NODE_ENV="development"
```

Run Prisma:

```bash
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
npm run dev
```

On Windows, stop the backend dev server before running Prisma migration/generate commands. A running server can lock Prisma's generated engine file.

### 2. Frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

Backend runs on:

```text
http://localhost:5000
```

## Demo Credentials

Seeded admin:

```text
Email: admin@hotel.com
Password: Admin@123
```

Seeded guest:

```text
Email: guest@hotel.com
Password: User@1234
```

## Testing

Backend:

```bash
cd backend
npm test
npm run build
```

Frontend:

```bash
cd frontend
npm run build
```

Manual test:

1. Login with demo admin.
2. Add room `101`.
3. Edit a room and confirm the updated price/type appears.
4. Search rooms with check-in/check-out filters.
5. Book room `101` for a date range.
6. Try booking the same room with overlapping dates.
7. Confirm the app shows a double-booking error.
8. Book the same room with adjacent/non-overlapping dates.
9. Confirm the booking succeeds.
10. Open booking history.
11. Login as admin and view all users.
12. Open profile from the header.
13. Add feedback on a completed booking.

## Assumptions

- Users must be logged in to book rooms.
- A logged-in demo/admin user can add rooms.
- Normal users can book rooms and view their own booking history.
- Admin users can view all bookings and registered users.
- Single-hotel inventory is assumed, so room numbers are selected from a fixed list.
- Forgot password is a demo reset flow without SMTP/email delivery.
- Price is calculated as number of nights times room price per night.
- No payment integration is required.
- No email notification is required.
- Availability is calculated by date range.
- Neon is used as the hosted PostgreSQL provider.

## AI-Assisted Development

During development, I used AI-assisted tools such as ChatGPT/Codex to plan the architecture, compare technology choices, generate boilerplate ideas, and review validation and error-handling flows. This helped me move faster while keeping the implementation focused on the assignment requirements.

The main area where I used extra engineering judgment was double-booking prevention. AI suggestions were useful for the overlap condition and API structure, but I manually verified the transaction flow, backend validation, and error handling to ensure bookings are not created when dates conflict.

## Future Improvements

- Add payment workflow
- Add email confirmation
- Replace demo forgot-password reset with SMTP/SendGrid token workflow
- Add richer anonymous room rating summaries
- Add room image uploads
- Add admin analytics
- Add booking cancellation workflow
