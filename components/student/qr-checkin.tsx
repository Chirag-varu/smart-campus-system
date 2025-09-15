"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { QrCode, Calendar, Clock, MapPin, CheckCircle, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Booking {
  id: number
  resource: string
  date: string
  time: string
  status: "confirmed" | "checked-in" | "completed"
  type: string
  qrCode: string
}

const mockBookings: Booking[] = [
  {
    id: 1,
    resource: "Library Study Room A",
    date: "2024-01-15",
    time: "10:00 AM - 12:00 PM",
    status: "confirmed",
    type: "Library",
    qrCode: "QR-LIB-001-20240115",
  },
  {
    id: 2,
    resource: "Computer Lab 2",
    date: "2024-01-16",
    time: "2:00 PM - 4:00 PM",
    status: "confirmed",
    type: "Labs",
    qrCode: "QR-LAB-002-20240116",
  },
  {
    id: 3,
    resource: "Basketball Court",
    date: "2024-01-14",
    time: "6:00 PM - 8:00 PM",
    status: "checked-in",
    type: "Sports",
    qrCode: "QR-SPT-003-20240114",
  },
]

export function QRCheckIn() {
  const [bookings, setBookings] = useState(mockBookings)
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const { toast } = useToast()

  const handleCheckIn = (bookingId: number) => {
    setBookings((prev) =>
      prev.map((booking) => (booking.id === bookingId ? { ...booking, status: "checked-in" as const } : booking)),
    )

    toast({
      title: "Check-in Successful!",
      description: "You have successfully checked in to your booking.",
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-blue-500"
      case "checked-in":
        return "bg-green-500"
      case "completed":
        return "bg-gray-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
        return <AlertCircle className="h-4 w-4" />
      case "checked-in":
        return <CheckCircle className="h-4 w-4" />
      case "completed":
        return <CheckCircle className="h-4 w-4" />
      default:
        return <AlertCircle className="h-4 w-4" />
    }
  }

  const activeBookings = bookings.filter((booking) => booking.status === "confirmed" || booking.status === "checked-in")

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold gradient-text">QR Check-In</h1>
        <p className="text-muted-foreground mt-2">Show your QR code to check in to your booked resources.</p>
      </div>

      {/* Active Bookings */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activeBookings.map((booking) => (
          <Card key={booking.id} className="  cursor-pointer">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{booking.resource}</CardTitle>
                  <CardDescription className="flex items-center gap-1 mt-1">
                    <MapPin className="h-4 w-4" />
                    {booking.type}
                  </CardDescription>
                </div>
                <Badge className={`${getStatusColor(booking.status)} text-white border-0 flex items-center gap-1`}>
                  {getStatusIcon(booking.status)}
                  {booking.status}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {booking.date}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {booking.time}
                </div>
              </div>

              <Button
                className="w-full gradient-primary   text-white"
                onClick={() => setSelectedBooking(booking)}
              >
                <QrCode className="h-4 w-4 mr-2" />
                Show QR Code
              </Button>

              {booking.status === "confirmed" && (
                <Button variant="outline" className="w-full bg-transparent" onClick={() => handleCheckIn(booking.id)}>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Check In
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {activeBookings.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <QrCode className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No Active Bookings</h3>
            <p className="text-muted-foreground">You don't have any confirmed bookings to check in to.</p>
          </CardContent>
        </Card>
      )}

      {/* QR Code Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <CardTitle>QR Code for Check-In</CardTitle>
              <CardDescription>{selectedBooking.resource}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* QR Code Placeholder */}
              <div className="flex justify-center">
                <div className="w-48 h-48 bg-white border-2 border-gray-300 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <QrCode className="h-16 w-16 mx-auto mb-2 text-gray-400" />
                    <p className="text-xs text-gray-500 font-mono">{selectedBooking.qrCode}</p>
                  </div>
                </div>
              </div>

              <div className="text-center space-y-2">
                <p className="text-sm font-medium">Booking Details</p>
                <div className="text-sm text-muted-foreground space-y-1">
                  <div className="flex items-center justify-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {selectedBooking.date}
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <Clock className="h-4 w-4" />
                    {selectedBooking.time}
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" className="flex-1 bg-transparent" onClick={() => setSelectedBooking(null)}>
                  Close
                </Button>
                {selectedBooking.status === "confirmed" && (
                  <Button
                    className="flex-1 gradient-primary   text-white"
                    onClick={() => {
                      handleCheckIn(selectedBooking.id)
                      setSelectedBooking(null)
                    }}
                  >
                    Check In Now
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
