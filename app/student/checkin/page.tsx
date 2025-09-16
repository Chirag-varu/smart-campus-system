"use client"

import { QRCheckIn } from "@/components/student/qr-checkin"
import { StudentLayout } from "@/components/layout/student-layout"

export default function CheckInPage() {
  return (
    <StudentLayout activeTab="checkin">
      <QRCheckIn />
    </StudentLayout>
  )
}