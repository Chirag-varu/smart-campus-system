"use client"

import { useState } from "react"
import { Navbar } from "@/components/layout/navbar"
import { AdminSidebar } from "@/components/layout/admin-sidebar"
import { AdminOverview } from "@/components/admin/admin-overview"
import { ResourceManagement } from "@/components/admin/resource-management"
import { BookingApprovals } from "@/components/admin/booking-approvals"
import { UserManagement } from "@/components/admin/user-management"
import { AnalyticsDashboard } from "@/components/admin/analytics-dashboard"
import { ToastNotifications } from "@/components/notifications/toast-notifications"
import { ErrorBoundary } from "@/components/ui/error-boundary"

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard")

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <AdminOverview />
      case "resources":
        return <ResourceManagement />
      case "approvals":
        return <BookingApprovals />
      case "analytics":
        return <AnalyticsDashboard />
      case "users":
        return <UserManagement />
      default:
        return <AdminOverview />
    }
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-background transition-colors duration-300">
        <Navbar userType="admin" userName="Admin User" />

        <div className="flex">
          <AdminSidebar activeTab={activeTab} onTabChange={setActiveTab} />

          <main className="flex-1 p-6 transition-all duration-300">{renderContent()}</main>
        </div>

        <ToastNotifications userType="admin" />
      </div>
    </ErrorBoundary>
  )
}
