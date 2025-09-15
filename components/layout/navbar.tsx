"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Moon, Sun, User } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { NotificationDropdown } from "@/components/notifications/notification-dropdown"
import { useTheme } from "next-themes"
import { useRouter, usePathname } from "next/navigation"

interface NavbarProps {
  userType: "student" | "admin"
  userName: string
  onMenuClick?: () => void
}

export function Navbar({ userType, userName, onMenuClick }: NavbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "Booking Confirmed",
      message: "Your library slot has been confirmed for tomorrow",
      time: "2 minutes ago",
      read: false,
      type: "success" as const,
    },
    {
      id: 2,
      title: "New Resource Available",
      message: "Computer Lab 3 is now available for booking",
      time: "1 hour ago",
      read: false,
      type: "info" as const,
    },
    {
      id: 3,
      title: "Maintenance Scheduled",
      message: "Chemistry Lab 1 will be under maintenance tomorrow",
      time: "3 hours ago",
      read: true,
      type: "warning" as const,
    },
  ])

  useEffect(() => {
    setMounted(true)
  }, [])

  const unreadCount = notifications.filter((n) => !n.read).length

  const toggleDarkMode = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  const markAsRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)),
    )
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notification) => ({ ...notification, read: true })))
  }

  if (!mounted) {
    return (
      <nav className="bg-app dark:bg-app-dark border-b border-default px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold text-white">Smart Campus</h1>
            <Badge variant="secondary" className="bg-white/20 text-white border-0">
              {userType === "admin" ? "Administrator" : "Student"}
            </Badge>
          </div>
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10" /> {/* Placeholder for notifications */}
            <div className="w-10 h-10" /> {/* Placeholder for theme toggle */}
            <div className="w-20 h-10" /> {/* Placeholder for user menu */}
          </div>
        </div>
      </nav>
    )
  }

  return (
    <nav className="bg-app dark:bg-app-dark border-b border-default px-4 sm:px-6 py-4 transition-colors duration-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Hamburger menu for mobile */}
          {onMenuClick && (
            <Button
              variant="ghost"
              size="icon"
              className="text-white md:hidden mr-2"
              onClick={onMenuClick}
              aria-label="Open menu"
            >
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-menu"><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="18" x2="20" y2="18"/></svg>
            </Button>
          )}
          <h1 className="text-xl font-bold text-gray-900 dark:text-[var(--sc-text-white)]">Smart Campus</h1>
          <Badge variant="secondary" className="bg-[var(--sc-gray-light)]/20 text-gray-900 dark:text-[var(--sc-text-white)] border-0">
            {userType === "admin" ? "Administrator" : "Student"}
          </Badge>
        </div>

        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleDarkMode}
            className="text-gray-900 dark:text-[var(--sc-text-white)] hover:bg-[var(--sc-gray-light)]/10 transition-all duration-300 hover:scale-105"
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all duration-300" />
            ) : (
              <Moon className="h-5 w-5 rotate-0 scale-100 transition-all duration-300" />
            )}
          </Button>

          {/* User Profile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="text-gray-900 dark:text-[var(--sc-text-white)] hover:bg-[var(--sc-gray-light)]/10 flex items-center space-x-2 transition-all duration-300 hover:scale-105"
              >
                <User className="h-5 w-5" />
                <span className="hidden md:inline cursor-pointer">{userName}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => {
                  if (!router) return;
                  if (userType === 'student') {
                    // If already on student dashboard, set tab to profile via localStorage
                    if (pathname && pathname.startsWith('/student/dashboard')) {
                      localStorage.setItem('studentActiveTab', 'profile');
                      router.refresh();
                    } else {
                      localStorage.setItem('studentActiveTab', 'profile');
                      router.push('/student/dashboard');
                    }
                  } else if (userType === 'admin') {
                    // For admin, go to dashboard (could be improved if admin profile page exists)
                    router.push('/admin/dashboard');
                  }
                }}
              >
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">Help & Support</DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">Preferences</DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer text-red-600"
                onClick={async () => {
                  try {
                    await fetch('/api/logout', { method: 'POST' })
                  } catch {}
                  if (typeof window !== 'undefined') {
                    localStorage.removeItem('userName')
                    localStorage.removeItem('userEmail')
                  }
                  router.push('/')
                }}
              >
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  )
}
