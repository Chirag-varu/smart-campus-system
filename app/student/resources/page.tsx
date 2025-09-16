"use client"

import { ResourceBrowser } from "@/components/student/resource-browser"
import { StudentLayout } from "@/components/layout/student-layout"

export default function ResourcesPage() {
  return (
    <StudentLayout activeTab="resources">
      <ResourceBrowser />
    </StudentLayout>
  )
}