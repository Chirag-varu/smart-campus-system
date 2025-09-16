"use client"

import { StudentProfile } from "@/components/student/student-profile"
import { StudentLayout } from "@/components/layout/student-layout"

export default function ProfilePage() {
  return (
    <StudentLayout activeTab="profile">
      <StudentProfile />
    </StudentLayout>
  )
}