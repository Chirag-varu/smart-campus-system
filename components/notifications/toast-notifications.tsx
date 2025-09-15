"use client"

import { useToast } from "@/hooks/use-toast"
import { useEffect } from "react"

interface ToastNotificationsProps {
  userType: "student" | "admin"
}

export function ToastNotifications({ userType }: ToastNotificationsProps) {
  const { toast } = useToast()

  useEffect(() => {
    // Simulate real-time notifications
    const interval = setInterval(() => {
      const notifications = [
        {
          title: "Booking Confirmed",
          description: "Your library slot has been confirmed for tomorrow",
        },
        {
          title: "Resource Available",
          description: "Computer Lab 3 is now available for booking",
        },
        {
          title: "Maintenance Alert",
          description: "Chemistry Lab 1 will be under maintenance tomorrow",
        },
      ]

      if (userType === "admin") {
        const adminNotifications = [
          {
            title: "New Booking Request",
            description: "John Doe has requested Conference Room A",
          },
          {
            title: "Resource Added",
            description: "New study room has been added to the system",
          },
          {
            title: "System Update",
            description: "Monthly usage report is ready for review",
          },
        ]
        notifications.push(...adminNotifications)
      }

      // Randomly show a notification every 30 seconds
      if (Math.random() > 0.7) {
        const randomNotification = notifications[Math.floor(Math.random() * notifications.length)]
        toast({
          title: randomNotification.title,
          description: randomNotification.description,
        })
      }
    }, 30000) // 30 seconds

    return () => clearInterval(interval)
  }, [toast, userType])

  return null // This component doesn't render anything
}
