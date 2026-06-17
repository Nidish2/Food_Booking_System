# Setup and Run Guide

This guide details the complete installation, environment configuration, database seeding, and execution steps for both the backend and frontend components of the Hotel Booking System.

---

## 1. Getting Started

### Clone the Repository
If you are starting from a fresh clone, download the project files using Git:
```bash
git clone https://github.com/your-username/hotel-booking-system.git
cd hotel-booking-system
```

### Extracting from a ZIP Archive
If you received this project as a ZIP file, extract it to your preferred directory:
- **Windows (PowerShell):**
  ```powershell
  Expand-Archive -Path .\Hotel_Booking_System.zip -DestinationPath .\Hotel_Booking_System
  cd Hotel_Booking_System
  ```
- **macOS / Linux:**
  ```bash
  unzip Hotel_Booking_System.zip
  cd Hotel_Booking_System
  ```

---

## 2. Backend Configuration & Launch

The backend is built using Node.js, Express, and Prisma ORM with PostgreSQL.

### Step A: Install Dependencies
Open a terminal in the project root and navigate to the backend directory:
```bash
cd backend
npm install
```

### Step B: Create the `.env` File
Create a `.env` file in the `backend` directory:
```bash
# Windows
New-Item -Path .env -ItemType File
# macOS / Linux
touch .env
```

### Step C: Generate a Cryptographically Secure JWT Secret
The backend requires a secure `JWT_SECRET` key to sign and verify web tokens. Choose one of the following methods to generate a 32-byte key:
- **Node.js (Recommended):**
  ```bash
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```
- **Windows PowerShell:**
  ```powershell
  $secret = [Convert]::ToBase64String((1..32 | ForEach-Object {Get-Random -Maximum 256}))
  Write-Host $secret
  ```
- **macOS / Linux OpenSSL:**
  ```bash
  openssl rand -hex 32
  ```

### Step D: Database Setup (PostgreSQL via Neon)
This application uses PostgreSQL. We recommend Neon for a hosted serverless database.
1. Sign up or log in at the [Neon Console](https://console.neon.tech/).
2. Create a new project (e.g., `hotel-booking-system`).
3. Under **Connection Details**, select **Prisma** or **PostgreSQL** connection string. It will look like:
   `postgresql://owner:password@ep-cool-resonance-123456.us-east-2.aws.neon.tech/neondb?sslmode=require`
4. Copy this connection string.

### Step E: Configure Environment Variables
Open the `backend/.env` file and populate it with the template below. Replace placeholders with your actual secrets and connection string.

```env
# Database Connection String
DATABASE_URL="postgresql://owner:password@ep-cool-resonance-123456.us-east-2.aws.neon.tech/neondb?sslmode=require"

# JWT Auth Configuration
JWT_SECRET="your_generated_32_byte_secret_hex_or_base64"
JWT_EXPIRES_IN="7d"

# Server Environment
PORT=5000
NODE_ENV="development"
CLIENT_URL="http://localhost:5173"
```

### Step F: Run Prisma Migrations and Seed Data
Prisma is used to manage database schema updates and seed files. Apply the migrations and populate the tables with default records:
```bash
# Generate Prisma Client
npx prisma generate

# Execute DB Migrations
npx prisma migrate dev --name init

# Run Seeding Script
npx prisma db seed
```

> [!NOTE]
> The seeding script creates:
> - **1 Admin User:** `nidish2207@gmail.com`
> - **9 Guest Users:** (e.g., `sanvith@example.com`, `sujay@example.com`, `sridevi@example.com`)
> - **Standard Password:** All seeded accounts share the password `Password@123`.

### Step G: Start the Backend Development Server
```bash
npm run dev
```
The server will start, typically logging:
```text
[server]: Server is running at http://localhost:5000
[database]: Connected to PostgreSQL successfully via Prisma
```

---

## 3. Frontend Configuration & Launch

The frontend is built using React 18, Vite, TypeScript, and Tailwind CSS.

### Step A: Install Dependencies
Open a separate terminal window and navigate to the frontend directory:
```bash
cd frontend
npm install
```

### Step B: Create the `.env.local` File
Create a `.env.local` file in the `frontend` directory:
```bash
# Windows
New-Item -Path .env.local -ItemType File
# macOS / Linux
touch .env.local
```

### Step C: Configure Variables
Edit `frontend/.env.local` and add the base URL matching your backend server:
```env
VITE_API_BASE_URL="http://localhost:5000/api"
```

### Step D: Start the Frontend Development Server
```bash
npm run dev
```
The console will display the local port details:
```text
  VITE v8.0.0  ready in 400 ms

  ➜  Local:   http://localhost:5173/
```
Open [http://localhost:5173/](http://localhost:5173/) in your browser to view the application interface.

---

## 4. Building for Production

If you need to test the production build locally:

### Backend Build
In the `backend` directory:
```bash
npm run build
npm start
```

### Frontend Build
In the `frontend` directory:
```bash
npm run build
npm run preview
```

---

## 5. Running Tests

The application features unit and integration test suites using Vitest, Supertest, and React Testing Library.

- **Running Backend API Tests:**
  Navigate to the `backend` directory and run:
  ```bash
  npm run test
  ```
  This runs all API routes, token verification, permission logic, and transaction-level double-booking validations.

- **Running Frontend Component and Utility Tests:**
  Navigate to the `frontend` directory and run:
  ```bash
  npm run test
  ```
  This runs validations for UI components, custom hooks, date calculation logic, and responsive forms.

*For details on the exact test cases and coverage statistics, refer to [TEST_REPORT.md](file:///e:/Videos/Projects/Hotel_Booking_System/docs/TEST_REPORT.md).*

---

## 6. Verification Checklist

To confirm the setup has succeeded, check the following items:
- [ ] Backend server starts on port `5000` without database connection errors.
- [ ] Frontend server starts on port `5173`.
- [ ] You can log in using `nidish2207@gmail.com` / `Password@123` (Admin).
- [ ] You can log in using `sanvith@example.com` / `Password@123` (Guest User).
- [ ] Creating a booking returns success and displays inside **My Bookings**.
- [ ] Double bookings are blocked when testing overlapping dates.

---

## 7. Troubleshooting

### Port Conflict (Address already in use)
If port `5000` or `5173` is already taken, you can locate and kill the process:
- **Windows (PowerShell):**
  ```powershell
  # Find PID on port 5000
  Get-NetTCPConnection -LocalPort 5000 | Select-Object -Property OwnProcess
  # Kill the process
  Stop-Process -Id <PID> -Force
  ```
- **macOS / Linux:**
  ```bash
  lsof -i :5000
  kill -9 <PID>
  ```

### Database Connection Failures
- Verify your IP is allowed in your Neon database dashboard (Neon's default allows all connections with SSL).
- Ensure the connection string ends with `?sslmode=require`.
- Double-check database credentials in the `DATABASE_URL` string inside `backend/.env`.
