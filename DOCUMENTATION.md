## Smart Campus System - Technical Documentation

This document describes the implemented features, APIs, data expectations, and how the app integrates with MongoDB, sessions, and email OTP.

### Authentication & Sessions
- Registration (`POST /api/register`): Creates an unverified user, stores hashed password (bcrypt), generates a 6-digit OTP, and sends via Nodemailer (Gmail example). Env: `EMAIL_USER`, `EMAIL_PASS`.
- Verify OTP (`POST /api/verify-otp`): Validates OTP and marks user as verified.
- Generate OTP (`POST /api/generate-otp`): Issues a new OTP for an email and sends it.
- Login (`POST /api/login`): Verifies credentials with bcrypt and sets an `HttpOnly` cookie `session` with a server-stored session token.
- Logout (`POST /api/logout`): Clears session token from DB and cookie from client.
- Current user (`GET /api/me`): Returns user info from the active session.

Session storage:
- Collection: `sessions` with fields `{ token, userId, createdAt, expiresAt }`.
- Cookie: `session` (HttpOnly, SameSite=Lax, Secure in production), 7-day expiry.

### Environment Variables
- `MONGODB_URI`: required MongoDB connection string (`lib/mongodb.ts`, seed script).
- `EMAIL_USER`, `EMAIL_PASS`: SMTP credentials for Nodemailer.

### Database & Seeding
- Seed script: `npm run seed` executes `scripts/seed.js`.
  - Upserts admin and sample student users with hashed passwords.
  - Upserts `resources` matching UI mock data.
  - Creates indexes for `users.email` and `otps.email`.
  - Reads `MONGODB_URI` from environment or `.env.local`.

### Protected Routes
- Middleware (`middleware.ts`) protects `/student/*` and `/admin/*` by requiring a `session` cookie; unauthenticated users get redirected to `/`.

### Resources
- Fetch resources (`GET /api/resources`): Returns all resource documents from `resources`.
- UI (`components/student/resource-browser.tsx`): Loads resources from `/api/resources` and filters client-side.

### Bookings
- Create booking (`POST /api/bookings`): Auth required. Body `{ resourceId, date: 'YYYY-MM-DD', timeSlot: string }`. Prevents duplicate bookings for the same `resourceId+date+timeSlot`.
- Get booked slots (`GET /api/bookings?resourceId=...&date=YYYY-MM-DD`): Returns `{ slots: string[] }`.
- UI (`components/student/booking-modal.tsx`): Fetches booked time slots and posts new bookings; updates UI accordingly.

### Components Updated
- `components/auth/register-form.tsx`: Calls `/api/register`, then shows OTP form.
- `components/auth/otp-form.tsx`: Calls `/api/verify-otp` and navigates on success.
- `components/auth/login-form.tsx`: Calls `/api/login`, stores minimal info in `localStorage` for display, navigates to dashboards.
- `components/layout/navbar.tsx`: Adds Working "Sign Out" that posts to `/api/logout`, clears local state, and redirects to `/`.
- `components/student/resource-browser.tsx`: Switches from mock data to DB-backed API.
- `components/student/booking-modal.tsx`: Integrated with bookings API.

### API Summary
- POST `/api/register` — body: `{ firstName, lastName, email, studentId, department, password }` → `200 { success: true }`
- POST `/api/verify-otp` — body: `{ email, otp }` → `200 { success: true }`
- POST `/api/generate-otp` — body: `{ email }` → `200 { success: true }`
- POST `/api/login` — body: `{ email, password }` → sets session cookie → `200 { success: true, user }`
- POST `/api/logout` — clears session → `200 { success: true }`
- GET `/api/me` — returns `{ user }` if authenticated
- GET `/api/resources` — returns `{ resources }`
- GET `/api/bookings?resourceId&date` — returns `{ slots }`
- POST `/api/bookings` — body: `{ resourceId, date, timeSlot }` → `201 { success: true }`

### Notes & Next Steps
- Security: Consider switching to NextAuth or adding CSRF protection, rate-limiting, and email provider hardening.
- Bookings: Add admin approval/rejection flows and student booking history views.
- Roles: Add role/permissions to `users` (e.g., `role: 'student' | 'admin'`).
- Data Models: If migrating to Mongoose, define schemas for `User`, `Resource`, `Booking`, and align APIs.


