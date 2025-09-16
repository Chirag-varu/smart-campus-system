"use client"

import { useState, useEffect } from "react"
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

  // On mount, sync activeTab with localStorage or URL params (client only)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Check URL query params first
      const urlParams = new URLSearchParams(window.location.search);
      const tabParam = urlParams.get('tab');
      
      if (tabParam && ['dashboard', 'resources', 'checkin', 'profile'].includes(tabParam)) {
        setActiveTab(tabParam);
        localStorage.setItem('studentActiveTab', tabParam);
      } else {
        // Fall back to localStorage if no valid tab param
        const storedTab = localStorage.getItem('studentActiveTab');
        if (storedTab && storedTab !== activeTab) {
          setActiveTab(storedTab);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Keep activeTab in sync with localStorage (for profile navigation)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('studentActiveTab', activeTab)
    }
  }, [activeTab])

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardOverview />
      case "resources":
        return <ResourceBrowser />
      case "bookings":
        // Redirect to the dedicated bookings page
        if (typeof window !== 'undefined') {
          window.location.href = '/student/bookings';
        }
        return null;
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
                setActiveTab(tab)
                setSidebarOpen(false)
              }}
            />
          </aside>
          {/* Main content */}
          <main className="flex-1 p-4 sm:p-6 md:p-8 transition-all duration-300 w-full overflow-x-auto md:ml-0">
            {renderContent()}
          </main>
        </div>

        <ToastNotifications userType="student" />
      </div>
    </ErrorBoundary>
  )
}
