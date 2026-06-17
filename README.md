# Hotel Booking System

A full-stack enterprise-grade hotel booking application built with React, Node.js, Express, and PostgreSQL using Prisma.

## Live Deployments
- **Frontend (Vercel)**: [hotel-booking-system-official.vercel.app](https://hotel-booking-system-official.vercel.app/)
- **Backend (Render)**: Deployed on Render web service.

## Technology Stack

- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS, React Router, React Query, React Hook Form + Zod, Vitest & React Testing Library (for testing).
- **Backend**: Node.js, Express, TypeScript, Prisma ORM, PostgreSQL, Zod, JWT, Vitest & Supertest (for testing).
- **Tooling**: ESLint, Prettier, tsx (for running scripts).

## Setup and Run Instructions

### 1. Prerequisites
- Node.js (v18 or higher)
- PostgreSQL (ensure a local or remote instance is running)

### 2. Backend Setup
1. Open a terminal and navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure Environment Variables:
   - Copy `.env.example` to `.env` or create a new `.env` file.
   - Set the `DATABASE_URL` to your PostgreSQL connection string.
   - Ensure `JWT_SECRET` is set.
4. Run Prisma Migrations & Seed the Database:
   ```bash
   npx prisma generate
   npx prisma migrate dev
   npx prisma db seed
   ```
   *Note: The seed script will populate 10 users (including 1 admin "Nidish"), rooms, bookings, and reviews. The common password for all seeded users is `Password@123`.*
5. Run the Backend Server:
   ```bash
   npm run dev
   ```

### 3. Frontend Setup
1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the Frontend Server:
   ```bash
   npm run dev
   ```

### 4. Running Tests
- **Backend**: In the `backend` directory, run `npm run test` (executes 33 integration & unit tests covering RBAC, double-booking validation, and user/review logic).
- **Frontend**: In the `frontend` directory, run `npm run test` (executes 18 component and utility tests covering custom date math, currency formatting, badge variants, and inputs).

## Features
- **Role-Based Access Control (RBAC)**: Admin and User roles with distinct permissions.
- **Room Management**: Admins can add, update, and manage rooms.
- **Booking Workflows**: Users can book rooms, avoiding double-bookings through strict overlap validation.
- **Booking History & Status**: View upcoming, active, completed, and cancelled bookings.
- **Review & Feedback System**: Users can rate and comment on completed bookings.
- **Profile & Auth**: Secure JWT-based authentication with password hashing and forgot password workflows.
- **Modern Glassmorphism Layout**: Elegant, responsive dashboard styling featuring transparent glass containers, sidebars, headers, form controls, and dialog overlays with backdrop blurs.
- **Accessible Theme Toggle**: A seamless light/dark mode switch is available site-wide (including login/signup pages) featuring high-contrast link colors (WCAG compliant) for optimal dark mode legibility.
- **React Portals Integration**: Escaped CSS stacking context traps (caused by Framer Motion page transitions) by mounting modals under `document.body`, ensuring full-screen blur coverage.
- **Production-Ready Rate Limiting**: Placed CORS middleware ahead of the rate limiter to prevent CORS preflight blocks. Bypasses rate limiting in local dev environments and returns structured JSON errors in production.

## Assumptions Made
1. **Password Standards**: All dummy users created via the seed script share a common password (`Password@123`) for ease of evaluation and testing.
2. **Review Validation**: Reviews can only be left for a booking *after* its check-out date to ensure genuine feedback.
3. **Double Booking Prevention**: The backend explicitly prevents bookings that overlap for the same room by checking date ranges at the transaction level.
4. **Mocking Email**: The "forgot password" flow uses a mocked Ethereal email setup (returning a `previewUrl`) to facilitate testing without requiring an actual SMTP service.

## AI Tools Note
During development, AI-assisted tools like Antigravity (a deep-integration agent), GitHub Copilot, and conversational models were heavily leveraged to accelerate both the architectural design and code implementation. These tools were instrumental in rapidly scaffolding boilerplate code, configuring the Vitest + jsdom environment, writing robust database seeders, and generating comprehensive unit and integration tests (such as simulating complex Prisma operations). They also helped enforce SOLID and KISS principles by suggesting modular structures—for instance, breaking the monolithic seed file into separate domain-specific seeders (users, rooms, bookings, reviews).

The primary challenge encountered was ensuring data consistency when testing time-dependent rules (like preventing a user from reviewing a room before their stay is complete). The API inherently blocks booking in the past, meaning integration tests for reviews required bypassing the API and directly injecting past bookings via Prisma in the `beforeAll` blocks. AI tools helped quickly identify this root cause by analyzing the stack traces and controller logic, ultimately suggesting the correct testing strategy to resolve the `400 Bad Request` conflicts.
