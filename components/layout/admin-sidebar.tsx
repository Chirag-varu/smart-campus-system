"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Settings, CheckSquare, Users, BarChart3 } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useState } from "react"

interface AdminSidebarProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

const sidebarItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "resources", label: "Resources", icon: Settings },
  { id: "approvals", label: "Approvals", icon: CheckSquare },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "users", label: "Users", icon: Users },
]

export function AdminSidebar({ activeTab, onTabChange }: AdminSidebarProps) {
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false)
  
  const handleLogout = async () => {
    await fetch('/api/logout', { method: 'POST' })
    window.location.href = '/'
  }
  
  return (
    <aside className="flex flex-col bg-app dark:bg-app-dark border-r border-default shadow-md sticky top-0 h-screen z-20 w-64 max-w-full overflow-hidden">
      {/* Navigation */}
      <nav className="flex-1 px-2 space-y-1 overflow-y-auto mt-4">
        {sidebarItems.map((item) => {
          const Icon = item.icon
          return (
            <Button
              key={item.id}
              variant="ghost"
              className={cn(
                "w-full justify-start text-gray-700 dark:text-[var(--sc-text-white)] hover:bg-[var(--sc-gray-light)]/10 transition-all duration-200 rounded-md px-4 py-2 text-base",
                activeTab === item.id && "bg-[var(--sc-gray-light)]/20 text-gray-900 dark:text-[var(--sc-text-white)] border-l-4 border-primary font-semibold",
              )}
              onClick={() => onTabChange(item.id)}
            >
              <Icon className="mr-3 h-5 w-5" />
              {item.label}
            </Button>
          )
        })}
      </nav>

      {/* Logout with confirmation dialog */}
      <div className="px-6 py-4 border-t border-default mb-10 pb-10">
        <AlertDialog open={isLogoutDialogOpen} onOpenChange={setIsLogoutDialogOpen}>
          <AlertDialogTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200"
            >
              <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h4a2 2 0 012 2v1" />
              </svg>
              Logout
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure you want to logout?</AlertDialogTitle>
              <AlertDialogDescription>
                You will be redirected to the login page.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleLogout} className="bg-red-600 hover:bg-red-700">Logout</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {/* Responsive: hide on mobile */}
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
