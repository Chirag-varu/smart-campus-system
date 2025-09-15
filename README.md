## Smart Campus System

A Next.js 14 + TypeScript application for a smart campus platform, featuring student and admin dashboards, resource booking, email-based OTP verification, and MongoDB persistence.

### Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript, React 18
- **UI**: Tailwind CSS 4, Radix UI, Lucide Icons
- **State/Forms**: React Hook Form, Zod
- **Charts/UX**: Recharts, Embla Carousel
- **Backend**: API routes (`pages/api`), MongoDB (official driver)
- **Email**: Nodemailer (Gmail example)

### Prerequisites
- Node.js 18+ and npm (or pnpm)
- MongoDB database (Atlas or self-hosted)
- Email SMTP account (example uses Gmail with an App Password)

### Getting Started
1. Clone and install dependencies
```bash
git clone <repo-url>
cd smart-campus-system
npm install
# or: pnpm install
```

2. Create an environment file `.env.local` in the project root
```bash
# Database
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>/<db>?retryWrites=true&w=majority

# Email (Gmail example — use an App Password)
EMAIL_USER=youremail@gmail.com
EMAIL_PASS=your_app_password
```

3. Run the development server
```bash
npm run dev
# open http://localhost:3000
```

### Scripts
- `npm run dev`: Start the Next.js dev server
- `npm run build`: Build for production
- `npm run start`: Start the production server
- `npm run lint`: Run linting

### Project Structure (high-level)
```
app/                    # App Router pages/layouts (Next.js 14)
  admin/dashboard/      # Admin dashboard pages
  student/dashboard/    # Student dashboard pages
components/             # UI/components (Radix-based, forms, layout, etc.)
lib/mongodb.ts          # MongoDB client helper (uses MONGODB_URI)
pages/api/              # API routes (email OTP, registration)
public/                 # Static assets
styles/                 # Global styles
```

### Environment Variables
- **MONGODB_URI**: MongoDB connection string used by `lib/mongodb.ts`
- **EMAIL_USER / EMAIL_PASS**: SMTP credentials used by `pages/api/register.ts` to send OTP emails

### API Endpoints
- `POST /api/register`
  - Body: `{ firstName, lastName, email, studentId, department, password }`
  - Creates a user (unverified), generates an OTP, and emails it

- `POST /api/verify-otp`
  - Body: `{ email, otp }`
  - Verifies the user and removes the OTP record

Note: Passwords are stored in plain text in this starter. For production, integrate hashing (e.g., bcrypt) and add rate-limiting and email delivery hardening.

### Development Notes
- Tailwind CSS 4 is configured via `@tailwindcss/postcss` and `postcss.config.mjs`
- UI components leverage Radix primitives and utility helpers
- Recharts is used for simple analytics visualizations on dashboards

### Deployment
- Recommended: Vercel for Next.js hosting
  - Set env vars (`MONGODB_URI`, `EMAIL_USER`, `EMAIL_PASS`) in project settings
  - Ensure an SMTP provider suitable for production (consider provider like SendGrid, Resend, Mailgun)

### Troubleshooting
- MongoDB connection error: verify `MONGODB_URI` and IP allowlist on Atlas
- Email not sending: confirm SMTP creds, enable “less secure app” alternative via App Passwords, or use a dedicated provider
- OTP not received: check spam folder and confirm transporter configuration

### License
Add your license here (e.g., MIT).


