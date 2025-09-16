"use client"

import { BookingHistory } from "@/components/student/booking-history"
import { StudentLayout } from "@/components/layout/student-layout"

export default function BookingsPage() {
  return (
    <StudentLayout activeTab="bookings">
      <BookingHistory />
    </StudentLayout>
  )
}