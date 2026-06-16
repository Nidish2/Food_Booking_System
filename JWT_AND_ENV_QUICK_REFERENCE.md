# 🔑 JWT Secret Generation & Configuration

## 🔐 Generate JWT Secret

### Method 1: Node.js (Recommended)

```javascript
// Run in terminal:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

// Output example:
// a1f2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7a8b9c0d1
```

### Method 2: OpenSSL (Windows PowerShell)

```powershell
$secret = [Convert]::ToBase64String((1..32 | ForEach-Object {Get-Random -Maximum 256}))
Write-Host $secret

# Output example:
# q1w2e3r4t5y6u7i8o9p0sdfghjklzxcvbnm+/ABCDEFGHIJKLMNOPQRSTUVWXYZabcd==
```

### Method 3: OpenSSL (macOS/Linux)

```bash
openssl rand -hex 32

# Output example:
# 1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7a8b9c0d1
```

### Method 4: Online Generator

Visit: https://randomkeygen.com/

- Copy "CodeIgniter 256-bit Key"
- Use that value

---

## ⏱️ JWT Expiration Time Options

| Setting | Duration | Use Case                         |
| ------- | -------- | -------------------------------- |
| `1h`    | 1 hour   | High security, frequent re-login |
| `24h`   | 1 day    | **Recommended for web apps**     |
| `7d`    | 7 days   | **Best balance (current setup)** |
| `30d`   | 30 days  | Mobile apps, remember me         |
| `90d`   | 90 days  | Internal tools                   |
| `365d`  | 1 year   | Long-lived tokens (less secure)  |

### Current Setup:

```env
JWT_EXPIRES_IN=7d
```

This means users stay logged in for 7 days before needing to login again.

---

## 🔒 Security Best Practices

1. **Secret Length**: Minimum 32 bytes (64 hex characters)
2. **Uniqueness**: Generate a new secret per environment (dev, staging, prod)
3. **Never Share**: Don't commit `.env` to git - use `.env.example` instead
4. **Rotation**: Change secret periodically (existing tokens become invalid)
5. **Strong Expiry**: Don't use excessively long expiration times

---

## ✅ Backend `.env` Complete Template

```env
# Database
DATABASE_URL=postgresql://user:password@ep-xxxxx.us-east-1.aws.neon.tech/hotel_db?sslmode=require

# JWT
JWT_SECRET=a1f2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7a8b9c0d1
JWT_EXPIRES_IN=7d

# Server
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

---

## ✅ Frontend `.env.local` Complete Template

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

---

## 🚀 Full Setup Sequence

```bash
# 1. Backend setup
cd backend

# 2. Create .env with generated secret
# (Use one of the generation methods above)

# 3. Initialize database
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed

# 4. Start backend
npm run dev

# 5. In another terminal - Frontend setup
cd frontend
npm install

# 6. Create .env.local with API URL

# 7. Start frontend
npm run dev
```

---

## 🎯 Verification

After setup, verify everything works:

```bash
# Test backend is running
curl http://localhost:5000/api/health

# Test frontend connects
# Open http://localhost:5173 in browser
# Check browser console for errors
```

---

## 📝 Important Files

- Backend: `backend/.env` (create from `.env.example`)
- Frontend: `frontend/.env.local` (create from `.env.example`)
- Config: `backend/src/config/env.ts` (defines schema/validation)

Never commit `.env` files to git!
