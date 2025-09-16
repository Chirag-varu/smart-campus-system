"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Search, Calendar, History, User, QrCode } from "lucide-react"

interface StudentSidebarProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

const sidebarItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, directLink: false },
  { id: "resources", label: "Resources", icon: Search, directLink: false },
  { id: "bookings", label: "Bookings", icon: Calendar, directLink: true, href: "/student/bookings" },
  { id: "checkin", label: "QR Check-In", icon: QrCode, directLink: false },
  { id: "profile", label: "Profile", icon: User, directLink: false },
]

export function StudentSidebar({ activeTab, onTabChange }: StudentSidebarProps) {
  return (
    <aside className="h-screen flex flex-col bg-app dark:bg-app-dark border-r border-default shadow-md sticky top-0 z-20 w-64 max-w-full">

      {/* Navigation */}
      <nav className="flex-1 px-2 space-y-1 overflow-y-auto mt-4">
        {sidebarItems.map((item) => {
          const Icon = item.icon
          
          const buttonProps = item.directLink 
            ? { 
                as: "a", 
                href: item.href,
                onClick: (e: React.MouseEvent) => {
                  e.preventDefault();
                  window.location.href = item.href as string;
                }
              } 
            : { 
                onClick: () => onTabChange(item.id)
              };
          
          return (
            <Button
              key={item.id}
              variant="ghost"
              className={cn(
                "w-full justify-start text-gray-700 dark:text-[var(--sc-text-white)] hover:bg-[var(--sc-gray-light)]/10 transition-all duration-200 rounded-md px-4 py-2 text-base",
                activeTab === item.id && "bg-[var(--sc-gray-light)]/20 text-gray-900 dark:text-[var(--sc-text-white)] border-l-4 border-primary font-semibold",
              )}
              {...buttonProps}
            >
              <Icon className="mr-3 h-5 w-5" />
              {item.label}
            </Button>
          )
        })}
      </nav>

      {/* Logout at bottom */}
      <div className="px-6 py-4 border-t border-default mt-2">
        <Button
          variant="outline"
          className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50 dark:hover:bg-red-900/20"
          onClick={() => {
            if (typeof window !== 'undefined') {
              fetch('/api/logout', { method: 'POST' }).then(() => window.location.href = '/');
            }
          }}
        >
          <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h4a2 2 0 012 2v1" /></svg>
          Logout
        </Button>
      </div>

      {/* Responsive: hide on mobile, add menu button elsewhere if needed */}
      <style jsx>{`
        @media (max-width: 768px) {
          aside {
            display: none;
          }
        }
      `}</style>
    </aside>
  )
}
