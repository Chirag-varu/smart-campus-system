"use client"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/layout/navbar"
import { StudentSidebar } from "@/components/layout/student-sidebar"
import { BookingHistory } from "@/components/student/booking-history"
import { ToastNotifications } from "@/components/notifications/toast-notifications"
import { ErrorBoundary } from "@/components/ui/error-boundary"

export default function BookingsPage() {
  const [activeTab, setActiveTab] = useState("bookings")
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-background transition-colors duration-300 flex flex-col">
        <Navbar
          userType="student"
          userName="Chirag Varu"
          onMenuClick={() => setSidebarOpen(true)}
        />

        {/* Sidebar as drawer on mobile, static on md+ */}
        <div className="flex-1 flex flex-col md:flex-row">
          {/* Overlay for mobile drawer */}
          {sidebarOpen && (
            <div
              className="fixed inset-0 z-40 bg-black/30 md:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}
          {/* Sidebar */}
          <aside
            className={`
              fixed z-50 top-0 left-0 h-full w-64 bg-sidebar border-r border-sidebar-border transition-transform duration-300
              md:static md:translate-x-0 md:block
              ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            `}
            style={{ maxWidth: '16rem' }}
          >
            <StudentSidebar
              activeTab={activeTab}
              onTabChange={(tab) => {
                if (tab !== "bookings") {
                  // Navigate to other pages based on tab
                  if (tab === "dashboard") window.location.href = '/student/dashboard';
                  if (tab === "resources") window.location.href = '/student/dashboard?tab=resources';
                  if (tab === "checkin") window.location.href = '/student/dashboard?tab=checkin';
                  if (tab === "profile") window.location.href = '/student/dashboard?tab=profile';
                }
                setSidebarOpen(false);
              }}
            />
          </aside>
          {/* Main content */}
          <main className="flex-1 p-4 sm:p-6 md:p-8 transition-all duration-300 w-full overflow-x-auto md:ml-0">
            <BookingHistory />
          </main>
        </div>

        <ToastNotifications userType="student" />
      </div>
    </ErrorBoundary>
  )
}