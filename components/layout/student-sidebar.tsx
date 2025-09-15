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
    <aside className="w-64 bg-sidebar border-r border-sidebar-border h-[calc(100vh-73px)]">
      <div className="p-4">
        <nav className="space-y-2">
          {sidebarItems.map((item) => {
            const Icon = item.icon
            return (
              <Button
                key={item.id}
                variant="ghost"
                className={cn(
                  "w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-all duration-200",
                  activeTab === item.id && "bg-sidebar-primary text-sidebar-primary-foreground gradient-hover",
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
    </aside>
  )
}
