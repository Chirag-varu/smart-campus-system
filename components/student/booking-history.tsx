"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { Calendar, Clock, MapPin, X } from "lucide-react"
import { LoadingState } from "@/components/ui/loading-state"

interface Booking {
  id: string
  resource: string
  date: string
  time: string
  status: string
  type: string
}

interface BookingsData {
  upcoming: Booking[]
  past: Booking[]
}

export function BookingHistory() {
  const [bookings, setBookings] = useState<BookingsData>({ upcoming: [], past: [] })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const fetchBookings = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/booking-history')
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }
      const data = await response.json()
      setBookings(data)
      setError(null)
    } catch (err) {
      console.error('Failed to fetch bookings:', err)
      setError('Failed to load your bookings. Please try again later.')
      toast({
        title: "Error",
        description: "Failed to load bookings. Please try again.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBookings()
  }, [])

  const handleCancelBooking = async (bookingId: string) => {
    try {
      const response = await fetch(`/api/booking-history?bookingId=${bookingId}`, {
        method: 'DELETE',
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to cancel booking')
      }
      
      // Update local state to reflect the cancellation
      setBookings((prev) => ({
        ...prev,
        upcoming: prev.upcoming.map(booking => 
          booking.id === bookingId 
            ? { ...booking, status: 'cancelled' }
            : booking
        )
      }))
      
      toast({
        title: "Booking Cancelled",
        description: "Your booking has been successfully cancelled.",
      })
      
      // Refresh the bookings data
      fetchBookings()
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to cancel booking. Please try again.",
        variant: "destructive"
      })
    }
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

  const getStatusStyle = (status: string) => {
  switch (status) {
    case "confirmed":
      return "bg-green-100 text-green-700 border border-green-200"
    case "pending":
      return "bg-yellow-100 text-yellow-700 border border-yellow-200"
    case "completed":
      return "bg-blue-100 text-blue-700 border border-blue-200"
    case "cancelled":
      return "bg-red-100 text-red-700 border border-red-200"
    default:
      return "bg-gray-100 text-gray-600 border border-gray-200"
  }
}

const BookingCard = ({ booking, showCancel = false }: { booking: Booking; showCancel?: boolean }) => (
  <Card className="rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200">
    <CardContent className="p-6">
      <div className="flex flex-col sm:items-start justify-between gap-6">
        {/* Left Info */}
        <div className="flex-1">
          <h3 className="font-semibold text-lg text-gray-900">{booking.resource}</h3>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 mt-3 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              {booking.date}
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-gray-500" />
              {booking.time}
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-gray-500" />
              {booking.type}
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-3">
          <Badge className={`${getStatusStyle(booking.status)} px-3 py-1 rounded-full capitalize`}>
            {booking.status}
          </Badge>
          {showCancel && (booking.status === "pending" || booking.status === "approved") && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleCancelBooking(booking.id)}
              className="text-red-600 hover:text-red-700 hover:bg-red-100 transition"
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
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-[var(--sc-text-white)]">Booking History</h1>
        <p className="text-muted-foreground mt-2 text-sm sm:text-base">Manage your upcoming bookings and view past reservations.</p>
      </div>

      {loading ? (
        <LoadingState text="Loading your bookings..." spinnerSize="lg" className="py-12" />
      ) : error ? (
        <Card className="p-6 text-center">
          <div className="py-8">
            <X className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Failed to load bookings</h3>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={fetchBookings}>Try Again</Button>
          </div>
        </Card>
      ) : (
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
                {bookings.past.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {bookings.past.map((booking) => (
                      <BookingCard key={booking.id} booking={booking} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No past bookings</h3>
                    <p className="text-muted-foreground">Your completed bookings will appear here.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
