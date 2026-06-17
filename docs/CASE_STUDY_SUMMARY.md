# Hotel Booking System - Case Study Summary

## Candidate & Assignment Details
- **Project Name:** Hotel Booking System
- **Objective:** Build an end-to-end application to manage rooms and bookings, preventing double bookings, and maintaining secure access.
- **Timeline:** Submitted for review.

## Technology Stack
- **Frontend:** React 18, Vite, TypeScript, Tailwind CSS, React Hook Form, Zod, React Router.
- **Backend:** Node.js, Express, TypeScript, Prisma ORM, PostgreSQL, JSON Web Tokens (JWT).
- **Testing:** Vitest, Supertest (Backend API workflows).
- **Security:** Helmet, Express Rate Limit, bcryptjs, Ethereal Email (mock SMTP).

## Key Features & Implementations
1. **Authentication & Security:** 
   - JWT-based authentication with secure, HTTP-only cookies.
   - Comprehensive forgot password workflow with simulated email delivery and strict rate limiting to prevent enumeration attacks.
   - Helmet integration for secure HTTP headers.
2. **Room & Booking Management:**
   - Full CRUD for rooms (Admin only).
   - Booking system with double-booking prevention using Prisma transactions and date-overlap logic.
3. **Architecture:**
   - Separation of concerns: UI components handle pure rendering, Custom Hooks manage API calls and state, Pages assemble components.
   - Controller-Service-Route backend pattern.

## Assumptions Made
1. **Mock Email Provider:** Instead of requiring real SMTP credentials (SendGrid, etc.), Ethereal Email was used to provide a free, complete end-to-end forgot password flow that is "hacker safe" and fully functional for demonstration.
2. **User Exposure:** UUIDs are used for database primary keys. Exposing them to the client is considered safe and necessary for state management, unlike sequential integer IDs.
3. **Roles:** Only two roles (USER, ADMIN) are needed. ADMIN can create rooms; USER can book.

## AI Tools Usage & Experience
- **Tools Used:** Advanced agentic AI models (ChatGPT/Claude/Gemini) were used during development for scaffolding boilerplate, architectural planning, and generating strict TypeScript types.
- **How they helped:** They significantly accelerated the initial setup of the Prisma schema, Express middleware, and complex React Hook Form validation logic. They were also instrumental in quickly refactoring components to adhere to strict design patterns.
- **Challenges Encountered:** Coordinating the mock email flow (Ethereal) to be both "user-friendly" and "hacker safe" required careful prompting to ensure standard security practices (like not exposing email existence) were maintained while fulfilling UX requirements.
