"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { Calendar, Clock, MapPin, X } from "lucide-react"

const mockBookings = {
  upcoming: [
    {
      id: 1,
      resource: "Library Study Room A",
      date: "2024-01-15",
      time: "10:00 AM - 12:00 PM",
      status: "confirmed",
      type: "Library",
    },
    {
      id: 2,
      resource: "Computer Lab 2",
      date: "2024-01-16",
      time: "2:00 PM - 4:00 PM",
      status: "pending",
      type: "Labs",
    },
    {
      id: 3,
      resource: "Basketball Court",
      date: "2024-01-18",
      time: "6:00 PM - 8:00 PM",
      status: "confirmed",
      type: "Sports",
    },
  ],
  past: [
    {
      id: 4,
      resource: "Conference Room B",
      date: "2024-01-10",
      time: "1:00 PM - 3:00 PM",
      status: "completed",
      type: "Library",
    },
    {
      id: 5,
      resource: "Chemistry Lab 1",
      date: "2024-01-08",
      time: "9:00 AM - 11:00 AM",
      status: "completed",
      type: "Labs",
    },
    {
      id: 6,
      resource: "Tennis Court 1",
      date: "2024-01-05",
      time: "4:00 PM - 6:00 PM",
      status: "cancelled",
      type: "Sports",
    },
  ],
}

export function BookingHistory() {
  const [bookings, setBookings] = useState(mockBookings)
  const { toast } = useToast()

  const handleCancelBooking = (bookingId: number) => {
    setBookings((prev) => ({
      ...prev,
      upcoming: prev.upcoming.filter((booking) => booking.id !== bookingId),
    }))

    toast({
      title: "Booking Cancelled",
      description: "Your booking has been successfully cancelled.",
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-500"
      case "pending":
        return "bg-yellow-500"
      case "completed":
        return "bg-blue-500"
      case "cancelled":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const BookingCard = ({ booking, showCancel = false }: { booking: any; showCancel?: boolean }) => (
    <Card className=" ">
      <CardContent className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex-1 w-full">
            <h3 className="font-semibold text-base sm:text-lg">{booking.resource}</h3>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {booking.date}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {booking.time}
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {booking.type}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <Badge className={`${getStatusColor(booking.status)} text-white border-0`}>{booking.status}</Badge>
            {showCancel && booking.status !== "cancelled" && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleCancelBooking(booking.id)}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <X className="h-4 w-4 mr-1" />
                Cancel
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold gradient-text">Booking History</h1>
        <p className="text-muted-foreground mt-2 text-sm sm:text-base">Manage your upcoming bookings and view past reservations.</p>
      </div>

      <Tabs defaultValue="upcoming" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upcoming">Upcoming Bookings</TabsTrigger>
          <TabsTrigger value="past">Past Bookings</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base sm:text-lg">Upcoming Bookings ({bookings.upcoming.length})</CardTitle>
              <CardDescription className="text-xs sm:text-sm">Your scheduled resource reservations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {bookings.upcoming.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {bookings.upcoming.map((booking) => <BookingCard key={booking.id} booking={booking} showCancel={true} />)}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No upcoming bookings</h3>
                  <p className="text-muted-foreground">Book a resource to see it here.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="past" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base sm:text-lg">Past Bookings ({bookings.past.length})</CardTitle>
              <CardDescription className="text-xs sm:text-sm">Your booking history and completed reservations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {bookings.past.map((booking) => (
                  <BookingCard key={booking.id} booking={booking} />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
