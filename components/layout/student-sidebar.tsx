"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Search, Calendar, History, User, QrCode } from "lucide-react"

interface StudentSidebarProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

const sidebarItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "resources", label: "Resources", icon: Search },
  { id: "bookings", label: "Bookings", icon: Calendar },
  { id: "checkin", label: "QR Check-In", icon: QrCode },
  { id: "history", label: "History", icon: History },
  { id: "profile", label: "Profile", icon: User },
]

export function StudentSidebar({ activeTab, onTabChange }: StudentSidebarProps) {
  return (
    <div className="h-full flex flex-col p-4 bg-app dark:bg-app-dark border-r border-default">
      <nav className="space-y-1">
        {sidebarItems.map((item) => {
          const Icon = item.icon
          return (
            <Button
              key={item.id}
              variant="ghost"
              className={cn(
                "w-full justify-start text-gray-700 dark:text-[var(--sc-text-white)] hover:bg-[var(--sc-gray-light)]/10 transition-all duration-200 rounded-md",
                activeTab === item.id && "bg-[var(--sc-gray-light)]/20 text-gray-900 dark:text-[var(--sc-text-white)] border-l-2 border-default",
              )}
              onClick={() => onTabChange(item.id)}
            >
              <Icon className="mr-3 h-5 w-5" />
              {item.label}
            </Button>
          )
        })}
      </nav>
    </div>
  )
}
