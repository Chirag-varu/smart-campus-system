"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Bell, CheckCircle, Info, AlertTriangle, X } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Notification {
  id: number
  title: string
  message: string
  time: string
  read: boolean
  type: "success" | "info" | "warning" | "error"
}

interface NotificationDropdownProps {
  notifications: Notification[]
  unreadCount: number
  onMarkAsRead: (id: number) => void
  onMarkAllAsRead: () => void
}

export function NotificationDropdown({
  notifications,
  unreadCount,
  onMarkAsRead,
  onMarkAllAsRead,
}: NotificationDropdownProps) {
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "info":
        return <Info className="h-4 w-4 text-blue-500" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case "error":
        return <X className="h-4 w-4 text-red-500" />
      default:
        return <Bell className="h-4 w-4" />
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative text-white hover:bg-white/10">
          <Bell className="h-5 w-5" />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative text-white hover:bg-white/10 dark:text-gray-900 dark:hover:bg-gray-100/10">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-red-500 text-white text-xs">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 bg-black text-white dark:bg-gray-100 dark:text-gray-900">
              <div className="flex items-center justify-between p-3 border-b border-gray-700 dark:border-gray-200">
                <h3 className="font-semibold">Notifications</h3>
                <button
                  onClick={onMarkAllAsRead}
                  className="text-xs text-primary hover:text-primary/80"
                >
                  Mark all as read
                </button>
              </div>
              <ScrollArea className="max-h-96">
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-muted-foreground">No notifications</div>
                ) : (
                  notifications.map((notification) => (
                    <DropdownMenuItem
                      key={notification.id}
                      onClick={() => onMarkAsRead(notification.id)}
                      className={`p-4 cursor-pointer hover:bg-gray-900/80 dark:hover:bg-gray-200/80 ${!notification.read ? "bg-gray-800 dark:bg-gray-200/60" : ""} text-white dark:text-gray-900`}
                    >
                      <div className="flex items-start space-x-3 w-full">
                        <div className="mt-1">{getNotificationIcon(notification.type)}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span
                              className={`text-sm font-medium ${!notification.read ? "text-white dark:text-gray-900" : "text-gray-300 dark:text-gray-700"}`}
                            >
                              {notification.title}
                            </span>
                            {!notification.read && <div className="w-2 h-2 bg-primary rounded-full ml-2" />}
                          </div>
                          <p className="text-xs mt-1 line-clamp-2 text-gray-300 dark:text-gray-700">{notification.message}</p>
                        </div>
                        <span className="text-xs whitespace-nowrap ml-2 text-gray-400 dark:text-gray-600">{notification.time}</span>
                      </div>
                    </DropdownMenuItem>
                  ))
                )}
              </ScrollArea>
            </DropdownMenuContent>
          </DropdownMenu>
        </ Button>
        {/* </ScrollArea> */}

        {notifications.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="p-3 text-center text-primary hover:text-primary/80">
              View all notifications
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuTrigger>
    </DropdownMenu>
  )
}
