"use client"

import { DashboardOverview } from "@/components/student/dashboard-overview"
import { StudentLayout } from "@/components/layout/student-layout"

export default function StudentDashboard() {

  return (
    <StudentLayout activeTab="dashboard">
      <DashboardOverview />
    </StudentLayout>
  )
}
