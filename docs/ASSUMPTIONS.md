# Development Assumptions

This document lists the core assumptions and boundaries established during the development of the Hotel Booking System.

---

## 1. Single Hotel Operation Constraint
The application is designed around a single hotel establishment with discrete, individually numbered rooms. While administrators can add, edit, or configure rooms via the dashboard, the system operates under the assumption that all room inventory belongs to a single facility. There is no multi-hotel select, location hierarchy, or chain-level dashboard.

---

## 2. Dynamic, Date-Based Availability
Unlike simpler systems that use a static boolean flag (e.g., `isAvailable: true/false`) to denote room status, this system calculates availability dynamically. A room's availability is evaluated based on specific date selections. A room is considered available for booking on a given date range as long as there is no overlapping, active booking record in the database for those exact dates. This allows the same room to be booked for multiple sequential stays.

---

## 3. Instantly Confirmed Bookings
In a production deployment, booking a room usually involves a payment gateway integration and a multi-step confirmation process (e.g., pending, paid, confirmed). To focus on the core requirements of double-booking prevention and user access:
- All valid booking requests are instantly marked as `CONFIRMED`.
- No payment integration (Stripe, PayPal, etc.) is included.
- Financial transactions are represented mathematically by calculating the `totalAmount` (`nights * pricePerNight`) and recording it in the booking schema, without processing actual transactions.

---

## 4. Simulated Email and Reset Flow
To ensure the password reset flow remains fully functional without requiring external API keys or exposing real SMTP servers:
- The system integrates Ethereal Email (a mock SMTP service).
- When a user triggers the "Forgot Password" workflow, the backend communicates with Ethereal to simulate sending the email.
- The API response returns a `previewUrl` containing the simulated email. The user interface displays this URL as a link in a developer notification toast, allowing evaluators to view the simulated email and complete the reset flow.

---

## 5. Seed Data & Common Credentials
To facilitate rapid testing and ease of evaluation:
- The database seeding script creates pre-configured rooms, users, reviews, and booking records.
- All seeded user accounts share a common password: `Password@123`.
- Admin credentials are set to name `Nidish` and email `nidish2207@gmail.com`.
