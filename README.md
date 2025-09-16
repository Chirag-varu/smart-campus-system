# 📘 Smart Campus System

A comprehensive platform built with Next.js 14 + TypeScript that streamlines campus operations by integrating student & admin dashboards, resource booking, attendance, notices, and verification systems.

The system enhances transparency, reduces manual effort, and ensures efficient utilization of campus resources.

## 🎯 Problem Statement

Traditional campus resource management (classrooms, labs, equipment, events, and student services) often suffers from:

- **Manual booking & allocation** ➝ delays and conflicts
- **Poor communication** between students, faculty, and administration
- **Lack of real-time updates & transparency**
- **Scattered systems** (attendance, resources, notices, exams handled separately)

## 💡 Our Solution

The Smart Campus System provides a unified digital platform where:

- **Students** can book and track resources (labs, rooms, library, equipment).
- **Faculty/Admin** can manage scheduling, approvals, and resource monitoring.
- **Integrated dashboards** show analytics (usage, availability, attendance).
- **Secure OTP/email verification** ensures authentic access.

## 🚀 Features

- 🔐 **User Authentication** – Student & Admin login with OTP verification
- 📅 **Resource Booking** – Real-time booking of labs, classrooms, equipment
- 📊 **Dashboards**
  - **Student Dashboard**: bookings, notices, attendance
  - **Admin Dashboard**: resource allocation, analytics, approvals
- 📢 **Notice & Communication System** – Digital circulars & announcements
- 📈 **Analytics & Reports** – Usage patterns, resource availability, trends
- 📚 **Extensible Modules** (future scope) – Attendance tracking, exam scheduling, fee management, event management

## 🛠️ Tech Stack

### Frontend:
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript, React 18
- **Styling**: Tailwind CSS 4, Radix UI, Lucide Icons
- **Charts/UX**: Recharts, Embla Carousel

### Backend:
- Next.js API Routes
- MongoDB (Official Driver)
- Authentication & Email: Nodemailer + OTP

### Other Tools:
- React Hook Form + Zod (form validation)
- Docker (optional for deployment)
- Cloud Hosting: Vercel (frontend) + MongoDB Atlas

## ⚙️ Prerequisites

- Node.js 18+ and npm (or pnpm)
- MongoDB database (Atlas or self-hosted)
- SMTP account for email OTP (e.g., Gmail, SendGrid, Mailgun)

## 🚀 Getting Started

```bash
# Clone and install dependencies
git clone https://github.com/Chirag-varu/smart-campus-system.git
cd smart-campus-system
npm install

# Set up environment variables
cp .env.example .env.local

# Run dev server
npm run dev
```

Visit: http://localhost:3000

## 📂 Project Structure

```
app/                    # Next.js App Router pages/layouts
  admin/dashboard/      # Admin dashboard
  student/dashboard/    # Student dashboard
components/             # UI components
  admin/                # Admin-specific components
  auth/                 # Authentication components
  layout/               # Layout components (navbars, sidebars)
  student/              # Student-specific components
  ui/                   # Reusable UI components
lib/mongodb.ts          # MongoDB client helper
pages/api/              # API routes (OTP, booking, etc.)
public/                 # Static assets
styles/                 # Global styles
```

## 🔑 Environment Variables

```
MONGODB_URI=your_mongo_connection
EMAIL_USER=youremail@example.com
EMAIL_PASS=your_app_password
```

## 📡 API Endpoints

- **POST** `/api/register` – Create user, send OTP
- **POST** `/api/verify-otp` – Verify OTP and activate account
- **POST** `/api/login` – Authenticate users, create session
- **POST** `/api/logout` – End user session
- **GET** `/api/me` – Get current user information
- **GET** `/api/resources` – Fetch available resources
- **GET** `/api/booking-history` – Get user's booking history
- **POST** `/api/bookings` – Create resource booking
- **DELETE** `/api/booking-history` – Cancel a booking

## 🧪 Development Notes

- **Seeding the Database**:
  ```bash
  npm run seed
  ```
  This creates sample users, resources, and bookings for testing.

- Tailwind CSS 4 + PostCSS for styling
- Radix UI for accessible components
- Recharts for analytics

## 📦 Deployment

- **Frontend**: Vercel
- **Database**: MongoDB Atlas
- **SMTP**: SendGrid / Mailgun for production-ready mailing

## 🧩 Smart India Hackathon Project

This project was developed as part of the Smart India Hackathon (SIH), addressing the challenge of campus resource management and digitization of educational institutions.

## 📝 License

MIT License

Copyright (c) 2025 Chirag Varu

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

## 📚 Additional Documentation

See `DOCUMENTATION.md` for a full list of features and API endpoints.