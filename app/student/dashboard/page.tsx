"use client"

import { useState } from "react"
import { Navbar } from "@/components/layout/navbar"
import { StudentSidebar } from "@/components/layout/student-sidebar"
import { DashboardOverview } from "@/components/student/dashboard-overview"
import { ResourceBrowser } from "@/components/student/resource-browser"
import { BookingHistory } from "@/components/student/booking-history"
import { StudentProfile } from "@/components/student/student-profile"
import { QRCheckIn } from "@/components/student/qr-checkin"
import { ToastNotifications } from "@/components/notifications/toast-notifications"
import { ErrorBoundary } from "@/components/ui/error-boundary"

export default function StudentDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard")

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardOverview />
      case "resources":
        return <ResourceBrowser />
      case "bookings":
        return <BookingHistory />
      case "checkin":
        return <QRCheckIn />
      case "profile":
        return <StudentProfile />
      default:
        return <DashboardOverview />
    }
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-background transition-colors duration-300">
        <Navbar userType="student" userName="Chirag Varu" />

        <div className="flex">
          <StudentSidebar activeTab={activeTab} onTabChange={setActiveTab} />

          <main className="flex-1 p-6 transition-all duration-300">{renderContent()}</main>
        </div>

        <ToastNotifications userType="student" />
      </div>
    </ErrorBoundary>
  )
}
