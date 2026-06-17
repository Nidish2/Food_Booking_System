# Project Implementation Retrospective

This document outlines the planning, architecture, design systems, and testing phases executed during the development of the Hotel Booking System.

---

## Table of Contents
1. [Executive Summary](#1-executive-summary)
2. [Project Directory Design](#2-project-directory-design)
3. [Database Design](#3-database-design)
4. [Backend Implementation & API Design](#4-backend-implementation--api-design)
5. [Frontend Implementation & Layout System](#5-frontend-implementation--layout-system)
6. [Business Logic & Validation Rules](#6-business-logic--validation-rules)
7. [Testing Strategy](#7-testing-strategy)

---

## 1. Executive Summary

The Hotel Booking System is built as a modular, type-safe full-stack application. It uses a modern TypeScript-based stack to ensure reliability, security, and consistent performance:
- **Backend:** Node.js, Express, TypeScript, and Prisma ORM connecting to a Neon PostgreSQL database.
- **Frontend:** React 18, Vite, TypeScript, and Tailwind CSS.
- **Primary Objective:** Build an operational dashboard to manage rooms, make bookings, prevent double bookings through database transactions, view stay histories, and submit feedback.

Development followed clean coding principles, with a clear separation of concerns (routing, controllers, services, validation schemas) and structured API payloads.

---

## 2. Project Directory Design

The completed directory layout is organized as follows:

```text
Hotel_Booking_System/
├── backend/                  # Node.js/Express API Server
│   ├── prisma/               # Schema definition and database seeders
│   │   ├── seed/             # Seeder modules (users, rooms, bookings, reviews)
│   │   └── schema.prisma     # Prisma schema configuration
│   ├── src/
│   │   ├── config/           # Database connections and environment variables
│   │   ├── constants/        # HTTP status codes and enum constants
│   │   ├── controllers/      # Route handler controllers (HTTP parsing)
│   │   ├── middleware/       # Auth validation, rate limiters, error catchers
│   │   ├── routes/           # Router groups (auth, rooms, bookings, users)
│   │   ├── services/         # Business logic layer
│   │   ├── validators/       # Request body Zod schemas
│   │   ├── utils/            # Shared utilities (ApiError, password hashing)
│   │   └── app.ts / server.ts# Server config and bootstrap entry points
│   └── tests/                # Integration and unit tests
│
├── frontend/                 # React SPA Client
│   ├── src/
│   │   ├── api/              # Axios wrappers and API client hooks
│   │   ├── components/       # Reusable layout and status indicators
│   │   ├── hooks/            # Global custom hooks (authentication, data query)
│   │   ├── pages/            # Page templates (Login, Rooms, Bookings)
│   │   ├── routes/           # Private and public routing rules
│   │   ├── schemas/          # Form-level Zod validation rules
│   │   ├── types/            # TypeScript models and variables
│   │   ├── utils/            # UI date formatting and pricing math utilities
│   │   └── App.tsx / main.tsx# Client router setup and main mounting point
│   └── vite.config.ts        # Vite execution configurations
│
└── docs/                     # Comprehensive documentation folder
```

---

## 3. Database Design

We modeled the application with relational entities using PostgreSQL:
- **User:** Manages authentication details, roles (`USER` or `ADMIN`), bookings, and reviews.
- **Room:** Stores room specifications (number, type, capacity, price, description) and creator references.
- **Booking:** Stores guest details, check-in/out dates, price calculations, and statuses (`CONFIRMED`, `CANCELLED`).
- **Review:** Connects a rating (1-5 stars) and a comment to a completed booking.
- **PasswordResetToken:** Tracks reset requests and expires tokens after 1 hour.

Database interactions are optimized using compound indexes:
- `@@index([roomId, checkInDate, checkOutDate])` on the `Booking` model to accelerate overlap checks.
- `@@index([userId, expiresAt])` on the `PasswordResetToken` model to speed up expiration validation.

---

## 4. Backend Implementation & API Design

The backend uses a three-tier architecture: Routes define URL maps, Controllers process HTTP requests, and Services execute business rules.

### Implemented Endpoints:

#### Authentication Router:
- `POST /api/auth/register` - Registers a user.
- `POST /api/auth/login` - Authenticates credentials and sets a JWT cookie.
- `GET  /api/auth/me` - Verifies current user session.
- `POST /api/auth/logout` - Clears authentication cookies.
- `POST /api/auth/forgot-password` - Creates reset tokens and returns a mock email link.
- `POST /api/auth/reset-password` - Updates a user's password using a valid token.

#### Rooms Router:
- `GET  /api/rooms` - Returns all rooms with dynamic availability filters.
- `GET  /api/rooms/:id` - Returns detailed parameters for a single room.
- `POST /api/rooms` - Adds a room (Admin only).
- `PUT  /api/rooms/:id` - Modifies a room configuration (Admin only).

#### Bookings Router:
- `POST /api/bookings` - Books a room (requires availability check).
- `GET  /api/bookings/my` - Returns the current guest's booking history.
- `GET  /api/bookings/all` - Returns all bookings in the system (Admin only).
- `PATCH /api/bookings/:id/cancel` - Cancels a booking.
- `POST /api/bookings/:id/reviews` - Submits a room review (requires post-checkout verification).

#### Users Router:
- `GET  /api/users` - Returns a list of registered users (Admin only).

---

## 5. Frontend Implementation & Layout System

The client is built as an operational dashboard:
- **Design Aesthetic:** Uses glassmorphism (translucent panels, backdrop blurs, high-contrast borders) to create a clean, modern interface.
- **Theme Support:** Supports dark/light mode toggling using a standard HTML dataset tag and CSS variables. High-contrast colors are configured to meet WCAG legibility rules.
- **Form Controls:** Managed using React Hook Form paired with Zod schemas. Forms display inline validation errors and disable submit buttons during active requests.
- **Portals:** Modals (e.g., booking confirmation, adding a room) are mounted directly to the document body via React Portals. This prevents layout stacking issues during visual transitions.

---

## 6. Business Logic & Validation Rules

### Overlap Check (Double Booking Prevention)
To book a room, the system checks for overlapping date ranges inside a database transaction:
```sql
requestedCheckIn < existingCheckOut AND requestedCheckOut > existingCheckIn
```
If this check finds any conflicting confirmed bookings, the transaction rolls back and returns a `409 Conflict` error.

### Date Validation Rules
- Check-in dates cannot be set in the past.
- Check-out dates must be at least one day after the check-in date.
- Guest reviews can only be submitted for a booking after its check-out date has passed.

---

## 7. Testing Strategy

The test suite contains **91 tests** split across the frontend and backend layers:

### Backend Testing (50 Tests)
- Verifies registration, login failures, secure cookie management, and authorization middleware.
- Validates room creation, filters, booking creation, double-booking prevention, and review submission rules.
- Direct database calls (via Prisma in test hooks) are used to test past checkout dates.

### Frontend Testing (41 Tests)
- Verifies component rendering, buttons, spin loaders, form inputs, and badges.
- Validates the behavior of custom autocomplete components, date calculations, and Zod schemas.

All 91 tests run and pass without errors.
