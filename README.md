# Hotel Booking System

A full-stack, type-safe hotel booking application designed to manage rooms, bookings, and guest feedback. The system features a responsive frontend dashboard alongside a secure, transaction-aware backend.

---

## 📖 Table of Contents

1. [About the Application](#-about-the-application)
2. [Technology Stack](#-technology-stack)
3. [Project Directory Design](#-project-directory-design)
4. [Quick Setup and Run Instructions](#-quick-setup-and-run-instructions)
5. [Core Features &amp; Architecture](#-core-features--architecture)
6. [Development Assumptions](#-development-assumptions)
7. [Testing Suite &amp; Reports](#-testing-suite--reports)
8. [AI-Assisted Development Note](#-ai-assisted-development-note)
9. [Documentation Reference Directory](#-documentation-reference-directory)

---

## 🏨 About the Application

The Hotel Booking System serves as an operational dashboard for hotel managers and guests. It provides clean, role-based workflows to browse rooms, manage stay dates, and submit reviews.

The application is built to ensure database-level consistency (blocking double bookings) while delivering a premium user experience (glassmorphism dashboard with accessible light/dark modes).

---

## 🛠️ Technology Stack

| Layer              | Technologies & Frameworks                                                                                  |
| ------------------ | ---------------------------------------------------------------------------------------------------------- |
| **Frontend** | React 18, Vite, TypeScript, Tailwind CSS, React Router, React Hook Form, Zod                               |
| **Backend**  | Node.js, Express, TypeScript, Prisma ORM, CORS, Cookie Parser                                              |
| **Database** | PostgreSQL (hosted serverless on Neon)                                                                     |
| **Testing**  | Vitest, Supertest (API integration), React Testing Library (UI components)                                 |
| **Security** | JSON Web Tokens (JWT),`bcryptjs` (password hashing), `helmet` (secure headers), `express-rate-limit` |

---

## 📂 Project Directory Design

This tree layout outlines the structured folder design of our codebase:

```text
Hotel_Booking_System/
├── backend/                    # Node.js/Express API Server
│   ├── prisma/                 # Database migrations, seed scripts, and schema
│   │   ├── seed/               # Domain-specific seed scripts
│   │   └── schema.prisma       # Prisma DB schema definition
│   ├── src/
│   │   ├── config/             # DB client instance and env loader
│   │   ├── constants/          # Role and status enums
│   │   ├── controllers/        # HTTP handlers parsing request parameters
│   │   ├── middleware/         # Auth, validation, and error interceptors
│   │   ├── routes/             # API routing endpoints
│   │   ├── services/           # Service layer executing business logic
│   │   ├── validators/         # Zod payload validators
│   │   ├── utils/              # Password hashing and token creators
│   │   └── app.ts              # Express application configuration
│   └── tests/                  # Integration tests for auth and bookings
│
├── frontend/                   # React Single Page Application (SPA)
│   ├── src/
│   │   ├── api/                # API client configuration and network calls
│   │   ├── components/         # Common buttons, inputs, layouts, and badges
│   │   ├── hooks/              # Custom query and authentication hooks
│   │   ├── pages/              # Rooms list, signup, login, and history pages
│   │   ├── routes/             # Auth-guarded routing configuration
│   │   ├── schemas/            # Client Zod validation rules
│   │   ├── types/              # Domain-specific TypeScript declarations
│   │   └── utils/              # UI date formats and currency math
│   └── vite.config.ts          # Vite configuration
│
└── docs/                       # Project Case Study & Setup Documentation
    ├── ASSUMPTIONS.md          # Business rules and boundary settings
    ├── CASE_STUDY_SUMMARY.md   # Single-page cheat sheet for the interview
    ├── FEATURES_AND_ARCHITECTURE.md # Full features and data designs
    ├── PLAN.md                 # Project retrospective roadmap
    ├── SETUP_AND_RUN.md        # Comprehensive setup commands and steps
    ├── SHORT_NOTE.md           # Developer note on AI tool utilization
    └── TEST_REPORT.md          # Test suite results and coverages
```

---

## 🚀 Quick Setup and Run Instructions

A brief outline of instructions is provided below. For step-by-step guidance, environment parameters, and troubleshooting, read the complete [Setup and Run Guide](file:///e:/Videos/Projects/Hotel_Booking_System/docs/SETUP_AND_RUN.md).

### 1. Code Download

```bash
# Clone the repository
git clone https://github.com/Nidish2/Hotel_Booking_System.git
cd hotel-booking-system
```

### 2. Backend Initialization

1. Navigate to the backend directory and install dependencies:
   ```bash
   cd backend
   npm install
   ```
2. Create `backend/.env` with your Neon PostgreSQL URL and JWT configurations.
3. Prepare database tables and seed sample data:
   ```bash
   npx prisma generate
   npx prisma migrate dev --name init
   npx prisma db seed
   ```
4. Run the API server:
   ```bash
   npm run dev
   ```

### 3. Frontend Initialization

1. In a separate terminal window, open the frontend directory:
   ```bash
   cd ../frontend
   npm install
   ```
2. Create `frontend/.env.local` setting `VITE_API_BASE_URL="http://localhost:5000/api"`.
3. Launch the React interface:
   ```bash
   npm run dev
   ```
4. Open the application in your browser at [http://localhost:5173/](http://localhost:5173/).

---

## 🔒 Core Features & Architecture

- **Overlap Conflict Resolution:** Prevents double bookings by validating check-in/out date overlaps at the database transaction level.
- **Role-Based Access Control:** Protects admin operations (e.g., adding rooms, viewing all system bookings) while enabling user stays and review permissions.
- **Glassmorphism Interface:** Incorporates accessible layouts, light/dark mode toggling, and clean visual structures.

*For an in-depth breakdown of features, workflows, and database tables, view the [Features and Architecture Guide](file:///e:/Videos/Projects/Hotel_Booking_System/docs/FEATURES_AND_ARCHITECTURE.md).*

---

## 📋 Development Assumptions

- **Single Location Focus:** Operating inventory applies to a single hotel structure.
- **Calculated Availability:** Room status is calculated dynamically based on booking dates, rather than relying on a static availability flag.
- **Mock Service integrations:** Utilizes simulated SMTP tools (Ethereal Email) and skips payment processor integrations for testing simplicity.

*For details on development boundaries, review the [Development Assumptions Guide](file:///e:/Videos/Projects/Hotel_Booking_System/docs/ASSUMPTIONS.md).*

---

## 🧪 Testing Suite & Reports

The application is validated by a suite of **91 automated tests**:

- **50 Backend Tests:** Supertest endpoints testing, Prisma database mocks, role permissions, and double-booking transaction failures.
- **41 Frontend Tests:** React Testing Library component tests, custom hooks, autocomplete logic, and client-side validators.

*To review the full testing logs and verdicts, view the [Comprehensive Test Suite Report](file:///e:/Videos/Projects/Hotel_Booking_System/docs/TEST_REPORT.md).*

---

## 🤖 AI-Assisted Development Note

The development process was supported by tools such as ChatGPT (for minor bugs and syntax troubleshooting), Gemini (for boilerplate scaffolding and design reviews), and Codex (for inline autocomplete). The primary challenge solved was managing time-dependent validation rules during integration tests by utilizing direct database states.

*To read the full developer note, refer to the [Developer&#39;s Note on AI-Assisted Development](file:///e:/Videos/Projects/Hotel_Booking_System/docs/SHORT_NOTE.md).*

---

## 📂 Documentation Reference Directory

For detailed documentation, click on the links below to open each guide:

- **Project Plan & Retrospective:** [PLAN.md](file:///e:/Videos/Projects/Hotel_Booking_System/docs/PLAN.md)
- **Detailed Setup & Run Guide:** [SETUP_AND_RUN.md](file:///e:/Videos/Projects/Hotel_Booking_System/docs/SETUP_AND_RUN.md)
- **System Features & Architecture:** [FEATURES_AND_ARCHITECTURE.md](file:///e:/Videos/Projects/Hotel_Booking_System/docs/FEATURES_AND_ARCHITECTURE.md)
- **Development Assumptions:** [ASSUMPTIONS.md](file:///e:/Videos/Projects/Hotel_Booking_System/docs/ASSUMPTIONS.md)
- **Test Execution Report:** [TEST_REPORT.md](file:///e:/Videos/Projects/Hotel_Booking_System/docs/TEST_REPORT.md)
- **AI-Assisted Development Short Note:** [SHORT_NOTE.md](file:///e:/Videos/Projects/Hotel_Booking_System/docs/SHORT_NOTE.md)
- **Case Study Print-Friendly Sheet:** [CASE_STUDY_SUMMARY.md](file:///e:/Videos/Projects/Hotel_Booking_System/docs/CASE_STUDY_SUMMARY.md)
