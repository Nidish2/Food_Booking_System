# Environment Setup Guide - Hotel Booking System

## 📋 Overview

This guide walks you through setting up environment variables for both backend and frontend, including Neon database, JWT authentication, and more.

---

## 🔧 BACKEND SETUP

### Step 1: Create Backend `.env` File

Navigate to the backend directory and create a `.env` file:

```bash
cd backend
touch .env
```

### Step 2: Generate JWT Secret

You need a secure JWT secret. Run this command to generate one:

**Option A - Using OpenSSL (Windows PowerShell):**

```powershell
$secret = [Convert]::ToBase64String((1..32 | ForEach-Object {Get-Random -Maximum 256}))
Write-Host $secret
```

**Option B - Using Node.js:**

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Option C - Online Generator:**
Visit https://randomkeygen.com/ and use a CodeIgniter 256-bit key (copy the value)

### Step 3: Set Up Neon Database

1. Go to [Neon Console](https://console.neon.tech/)
2. Sign up/login with GitHub or email
3. Click "Create a new project"
4. Fill in project details:
   - **Project name**: `hotel-booking` (or your choice)
   - **Database name**: `hotel_db` (or your choice)
   - **Region**: Choose closest to you
5. Click "Create project"
6. Copy the connection string from "Connection details"
   - It will look like: `postgresql://user:password@host/database`

### Step 4: Fill Backend `.env` File

Edit `backend/.env` and add the following (replace with actual values):

```env
# Database - PostgreSQL via Neon
DATABASE_URL=postgresql://user_name:password@ep-xxx.region.neon.tech/hotel_db?sslmode=require

# JWT Configuration
JWT_SECRET=your_generated_jwt_secret_here
JWT_EXPIRES_IN=7d

# Server Configuration
PORT=5000
NODE_ENV=development

# Frontend URL
CLIENT_URL=http://localhost:5173
```

### JWT_EXPIRES_IN Options:

Common values:

- `7d` - 7 days (default recommended)
- `24h` - 24 hours
- `1d` - 1 day
- `30d` - 30 days
- `90d` - 90 days
- `365d` - 1 year

### Step 5: Set Up Database with Prisma

```bash
# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Seed sample data (optional)
npm run prisma:seed
```

### Step 6: Start Backend Server

```bash
npm run dev
```

Expected output:

```
Server running on port 5000
Database connected
```

---

## 🎨 FRONTEND SETUP

### Step 1: Create Frontend `.env.local` File

Navigate to the frontend directory:

```bash
cd frontend
touch .env.local
```

### Step 2: Fill Frontend `.env.local` File

Edit `frontend/.env.local` and add:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:5000/api
```

### Step 3: Install Dependencies

```bash
npm install
```

### Step 4: Start Frontend Development Server

```bash
npm run dev
```

Expected output:

```
  VITE v8.0.0  ready in xxx ms

  ➜  Local:   http://localhost:5173/
```

---

## 📝 Environment Variables Reference

### Backend `.env`

| Variable         | Description                               | Example                             | Required                              |
| ---------------- | ----------------------------------------- | ----------------------------------- | ------------------------------------- |
| `DATABASE_URL`   | PostgreSQL connection string from Neon    | `postgresql://user:pass@host/db`    | ✅                                    |
| `JWT_SECRET`     | Secret key for JWT signing (min 16 chars) | Generated cryptographic string      | ✅                                    |
| `JWT_EXPIRES_IN` | JWT token expiration time                 | `7d`, `24h`, `30d`                  | ✅ (default: `1d`)                    |
| `PORT`           | Backend server port                       | `5000`                              | ❌ (default: `5000`)                  |
| `NODE_ENV`       | Environment                               | `development`, `test`, `production` | ❌ (default: `development`)           |
| `CLIENT_URL`     | Frontend URL (for CORS)                   | `http://localhost:5173`             | ❌ (default: `http://localhost:5173`) |

### Frontend `.env.local`

| Variable            | Description          | Example                     | Required |
| ------------------- | -------------------- | --------------------------- | -------- |
| `VITE_API_BASE_URL` | Backend API base URL | `http://localhost:5000/api` | ✅       |

---

## 🔐 JWT Secret Generation (Detailed)

### Why 32 bytes minimum?

- JWT_SECRET validation requires minimum 16 characters
- 32 bytes (256 bits) is industry standard
- Provides strong cryptographic security

### Different formats:

**Hex string (32 bytes = 64 hex chars):**

```
a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6r7s8t9u0v1w2x3y4z5a6b7c8d9e0f1
```

**Base64 string:**

```
q1w2e3r4t5y6u7i8o9p0sdfghjklzxcvbnm+/==
```

**UUID format:**

```
550e8400-e29b-41d4-a716-446655440000550e8400-e29b-41d4-a716-446655440000
```

---

## 🚀 Quick Start Commands

### Backend:

```bash
cd backend
npm install
# Create .env file with values above
npm run prisma:generate
npm run prisma:migrate
npm run dev
```

### Frontend:

```bash
cd frontend
npm install
# Create .env.local file with values above
npm run dev
```

---

## ✅ Verification Checklist

- [ ] Backend `.env` file created with all required variables
- [ ] Neon database project created and connected
- [ ] JWT_SECRET generated and set (min 16 characters)
- [ ] DATABASE_URL correctly set from Neon
- [ ] Prisma migrations completed successfully
- [ ] Backend running on port 5000 without errors
- [ ] Frontend `.env.local` created with VITE_API_BASE_URL
- [ ] Frontend running on port 5173 without errors
- [ ] Both servers can communicate (no CORS errors)

---

## 🐛 Troubleshooting

### Database Connection Error

- ✓ Check DATABASE_URL is correctly copied from Neon
- ✓ Ensure `?sslmode=require` is included in URL
- ✓ Verify Neon project is active (not suspended)

### JWT Secret Error

- ✓ Must be at least 16 characters
- ✓ Cannot contain newlines or special shell characters
- ✓ Quote the value in .env: `JWT_SECRET="your_secret"`

### Port Already in Use

```bash
# Windows: Find and kill process on port 5000
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux:
lsof -i :5000
kill -9 <PID>
```

### CORS Error

- ✓ Verify CLIENT_URL in backend .env matches frontend URL
- ✓ Ensure both are running on correct ports

---

## 📚 Additional Resources

- [Neon Documentation](https://neon.tech/docs)
- [JWT.io](https://jwt.io) - JWT debugger
- [Prisma Documentation](https://www.prisma.io/docs)
- [Express.js Guide](https://expressjs.com/en/starter/hello-world.html)
