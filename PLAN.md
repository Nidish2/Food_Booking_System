# Implementation Plan: Hotel Booking System

## Summary
Build the app as a clean two-part full-stack project:

```text
Hotel_Booking_System/
  backend/
  frontend/
  README.md
  AI_USAGE_NOTE.md
```

Use **React + Vite + TypeScript** for frontend, **Node.js + Express + TypeScript** for backend, and **Neon PostgreSQL + Prisma** for database. The implementation should prioritize correctness, clean structure, strong validation, double-booking prevention, and easy interview explanation.

Engineering principles to follow:

- **KISS:** Keep flows simple and understandable.
- **SOLID:** Separate controllers, services, repositories/data access, validators, and middleware.
- **DRY:** Reuse validation schemas, API helpers, and UI components.
- **YAGNI:** Do not add unnecessary features like payment, AI chatbot, RAG, or complex admin analytics.
- **Clean Architecture Lite:** Routes only route, controllers handle HTTP, services handle business rules, Prisma handles persistence.
- **Secure by default:** bcrypt, JWT, backend validation, centralized errors, no raw secrets in code.
- **User-first UX:** Clear errors, loading states, no confusing flows.

## Final Folder Structure
### Root
```text
Hotel_Booking_System/
  backend/
  frontend/
  README.md
  AI_USAGE_NOTE.md
  .gitignore
```

### Backend
```text
backend/
  prisma/
    schema.prisma
    seed.ts

  src/
    config/
      env.ts
      prisma.ts

    constants/
      httpStatus.ts
      bookingStatus.ts
      userRole.ts

    controllers/
      auth.controller.ts
      room.controller.ts
      booking.controller.ts

    middleware/
      auth.middleware.ts
      error.middleware.ts
      validate.middleware.ts

    routes/
      auth.routes.ts
      room.routes.ts
      booking.routes.ts
      index.ts

    services/
      auth.service.ts
      room.service.ts
      booking.service.ts

    validators/
      auth.validator.ts
      room.validator.ts
      booking.validator.ts

    utils/
      ApiError.ts
      asyncHandler.ts
      date.ts
      jwt.ts
      password.ts

    app.ts
    server.ts

  tests/
    booking.test.ts
    auth.test.ts

  .env.example
  package.json
  tsconfig.json
```

Backend naming rules:

- File names: lowercase domain + purpose, for example `booking.service.ts`.
- Controllers: HTTP request/response only.
- Services: business logic only.
- Validators: Zod schemas only.
- Middleware: auth, validation, error handling.
- Utils: small reusable pure helpers.

### Frontend
```text
frontend/
  src/
    api/
      apiClient.ts
      auth.api.ts
      rooms.api.ts
      bookings.api.ts

    components/
      common/
        Button.tsx
        Input.tsx
        Badge.tsx
        EmptyState.tsx
        LoadingState.tsx
        ErrorState.tsx
      layout/
        AppLayout.tsx
        Navbar.tsx
      rooms/
        RoomCard.tsx
        RoomForm.tsx
      bookings/
        BookingForm.tsx
        BookingHistoryTable.tsx

    hooks/
      useAuth.ts
      useRooms.ts
      useBookings.ts

    pages/
      LoginPage.tsx
      SignupPage.tsx
      RoomsPage.tsx
      AddRoomPage.tsx
      BookingHistoryPage.tsx

    routes/
      AppRoutes.tsx
      ProtectedRoute.tsx

    schemas/
      auth.schema.ts
      room.schema.ts
      booking.schema.ts

    types/
      auth.types.ts
      room.types.ts
      booking.types.ts

    utils/
      date.ts
      currency.ts

    App.tsx
    main.tsx
    index.css

  .env.example
  package.json
  tsconfig.json
  tailwind.config.js
  vite.config.ts
```

Frontend naming rules:

- React components: PascalCase.
- Hooks: `useSomething`.
- API files: domain-based, for example `bookings.api.ts`.
- Types: domain-based, for example `room.types.ts`.
- Schemas: Zod validation schemas separate from UI.

## Backend Implementation
### Database Models
Use Prisma models for:

- `User`
- `Room`
- `Booking`

`Room` should not rely on permanent `isAvailable` for booking logic. Availability is calculated based on selected booking dates.

Booking overlap rule:

```text
requestedCheckIn < existingCheckOut
AND
requestedCheckOut > existingCheckIn
```

Booking creation must:

- Validate input with Zod.
- Confirm room exists.
- Calculate total amount from number of nights × price per night.
- Run conflict check inside a Prisma transaction.
- Return `409 Conflict` if overlapping booking exists.
- Create booking only if no conflict exists.

### Backend APIs
Auth:

```text
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
POST /api/auth/logout
```

Rooms:

```text
GET  /api/rooms
GET  /api/rooms/:id
POST /api/rooms
```

Bookings:

```text
POST /api/bookings
GET  /api/bookings/my
GET  /api/bookings/history
```

Optional only after required features:

```text
PATCH /api/bookings/:id/cancel
```

### Error Handling
Use one centralized `ApiError` class and one global error middleware.

Standard API error format:

```json
{
  "success": false,
  "message": "This room is already booked for the selected dates."
}
```

Standard success format:

```json
{
  "success": true,
  "message": "Booking created successfully.",
  "data": {}
}
```

### Security
Implement:

- bcrypt password hashing.
- JWT authentication.
- Auth middleware for protected routes.
- Role check for add-room route if admin role is included.
- Zod validation on all request bodies.
- Prisma ORM for parameterized database access.
- `.env.example` only, no real secrets committed.
- CORS configured from environment variable.

Recommended auth implementation:

- Use JWT in HttpOnly cookie if time allows.
- If that slows implementation, use bearer token and document production improvement.

## Frontend Implementation
### UI Theme
Use Albertsons-inspired hotel colors:

```js
brand: {
  blue: '#0E4194',
  navy: '#092F6B',
  red: '#E31837',
  light: '#F4F7FC',
  border: '#D8E0EA',
  success: '#2E7D32',
  warning: '#F59E0B',
  danger: '#B00020'
}
```

Design rules:

- Clean operational dashboard, not a landing page.
- Navy navbar.
- Light gray page background.
- White content surfaces.
- Blue primary buttons.
- Red only for important alerts/errors.
- Green badges for confirmed/available states.
- Responsive grid for rooms.
- Tables should collapse cleanly or become cards on mobile.

### Pages
Build these pages:

- `LoginPage`
- `SignupPage`
- `RoomsPage`
- `AddRoomPage`
- `BookingHistoryPage`

Main user flow:

1. User signs up or logs in.
2. User lands on room dashboard.
3. User views rooms.
4. User adds room.
5. User books room.
6. User sees success or double-booking error.
7. User views booking history.

### UX Requirements
Implement:

- Loading states during API calls.
- Toast notifications for success/error.
- Inline form validation.
- Disabled buttons during submit.
- Friendly empty states.
- Clean conflict message for double booking.
- Responsive mobile layout.
- Demo data from backend seed.

## Validation Rules
### Auth
- Name required for signup.
- Email must be valid.
- Password minimum 8 characters.

### Room
- Room number required and unique.
- Type required.
- Capacity must be greater than 0.
- Price per night must be greater than 0.
- Description optional.

### Booking
- Guest name required.
- Guest email valid.
- Room ID required.
- Check-in date required.
- Check-out date required.
- Check-in cannot be in the past.
- Check-out must be after check-in.
- Overlapping confirmed booking must fail.

## Required Features First
Implement in this exact order:

1. Project setup with separate `backend` and `frontend` folders.
2. Backend env, Prisma, database schema, and seed.
3. Auth APIs.
4. Room APIs.
5. Booking APIs with double-booking prevention.
6. Frontend auth pages.
7. Frontend room dashboard.
8. Add room flow.
9. Book room flow.
10. Booking history page.
11. Error/loading/empty states.
12. README and AI usage note.
13. Tests and final manual verification.

Do not add payment, maps, hotel images, chatbot, analytics, email, or complex role dashboards before the required assignment is fully working.

## Testing Plan
Backend tests:

- Register user succeeds.
- Login succeeds.
- Invalid login fails.
- Protected route rejects unauthenticated request.
- Add room succeeds.
- Duplicate room number fails.
- Booking succeeds for available room.
- Overlapping booking fails with `409`.
- Adjacent booking succeeds.
- Invalid date range fails.
- Past check-in fails.
- Booking history returns current user bookings.

Manual UI test:

1. Signup/login.
2. Add room `101`.
3. Book room `101` from one date range.
4. Try overlapping booking for same room.
5. Confirm error is shown.
6. Try non-overlapping booking.
7. Confirm booking succeeds.
8. Open booking history.
9. Test mobile width.

## Documentation
Create `README.md` with:

- Project overview.
- Features.
- Tech stack.
- Architecture.
- Folder structure.
- Database schema summary.
- Setup instructions.
- Environment variables.
- Prisma migration/seed commands.
- Run backend/frontend commands.
- Demo credentials.
- Assumptions.
- Testing instructions.
- AI-assisted development note.
- Future improvements.

Create `AI_USAGE_NOTE.md` with:

- AI tools used.
- How AI helped.
- What you manually verified.
- Challenges faced, especially double-booking prevention.

Suggested AI note:

```text
During development, I used AI-assisted tools such as ChatGPT/Codex to plan the architecture, compare technology choices, generate boilerplate ideas, and review validation and error-handling flows. This helped me move faster while keeping the implementation focused on the assignment requirements.

The main area where I used extra engineering judgment was double-booking prevention. AI suggestions were useful for the overlap condition and API structure, but I manually verified the transaction flow, backend validation, and error handling to ensure bookings are not created when dates conflict.
```

## Final Interview Preparation
Prepare hard copy of:

- README.
- AI usage note.
- Architecture diagram.
- Database schema.
- Screenshots.
- Booking conflict backend code.

Interview explanation:

```text
I used React, Node.js, TypeScript, and Neon PostgreSQL because the assignment is a CRUD-heavy booking system where relational consistency matters. The most important business rule is preventing double booking, so I handled that in the backend using validated date ranges and a database transaction, rather than trusting only frontend availability.
```

## Assumptions
- Users must be logged in to book rooms.
- A demo/admin user can add rooms.
- Booking price is calculated as number of nights × room price.
- No payment integration is required.
- No email notification is required.
- Availability is date-based, not a static room flag.
- Neon is used as the hosted PostgreSQL provider.
