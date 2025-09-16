"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Calendar, Clock, MapPin, X, Filter } from "lucide-react"
import { LoadingState } from "@/components/ui/loading-state"

interface Booking {
  id: string
  title: string;
  resource: string
  date: string
  time: string
  description: string;
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

  // Status handling moved to getStatusVariant function

const getStatusVariant = (status: string) => {
  switch (status) {
    case "confirmed":
      return "outline"
    case "pending":
      return "outline"
    case "completed":
      return "outline"
    case "cancelled":
      return "outline"
    default:
      return "outline"
  }
}

const BookingCard = ({ 
  booking, 
  showCancel = false, 
  className = "" 
}: { 
  booking: Booking; 
  showCancel?: boolean;
  className?: string;
}) => (
  <Card className={`hover:shadow-md transition-all duration-300 ${className}`}>
    <CardHeader className="pb-2">
      <CardTitle className="text-base font-medium">{booking.resource}</CardTitle>
      {booking.title && (
        <CardDescription>{booking.title}</CardDescription>
      )}
    </CardHeader>
    <CardContent className="pb-3">
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <Calendar className="h-3.5 w-3.5" />
          {booking.date}
        </div>
        <div className="flex items-center gap-1.5">
          <Clock className="h-3.5 w-3.5" />
          {booking.time}
        </div>
        <div className="flex items-center gap-1.5">
          <MapPin className="h-3.5 w-3.5" />
          {booking.type}
        </div>
      </div>
      {booking.description && (
        <p className="mt-3 text-sm">{booking.description}</p>
      )}
    </CardContent>
    <CardFooter className="pt-0 flex items-center justify-between">
      <Badge 
        variant={getStatusVariant(booking.status) as any} 
        className={`capitalize ${
          booking.status === "confirmed" ? "border-green-200 bg-green-100 text-green-800 hover:bg-green-100" : 
          booking.status === "pending" ? "border-amber-200 bg-amber-100 text-amber-800 hover:bg-amber-100" : 
          booking.status === "completed" ? "border-blue-200 bg-blue-100 text-blue-800 hover:bg-blue-100" : 
          booking.status === "cancelled" ? "border-red-200 bg-red-100 text-red-800 hover:bg-red-100" : 
          "border-slate-200 bg-slate-100 text-slate-800 hover:bg-slate-100"
        }`}
      >
        {booking.status}
      </Badge>
      {showCancel && (booking.status === "pending" || booking.status === "approved" || booking.status === "confirmed") && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleCancelBooking(booking.id)}
          className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
        >
          <X className="h-3.5 w-3.5 mr-1" />
          Cancel
        </Button>
      )}
    </CardFooter>
  </Card>
)

  useEffect(() => {
    // Set initial tab based on URL query parameter (for direct linking to past bookings)
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const tabParam = urlParams.get('tab');
      if (tabParam === 'past') {
        setActiveTab('past');
      }
    }
  }, []);

  const [activeTab, setActiveTab] = useState<string>('upcoming');

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    // Update URL without refreshing the page
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('tab', value);
      window.history.pushState({}, '', url);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="mb-6 bg-gradient-to-r from-muted/50 via-background to-background border-muted">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
            <div>
              <CardTitle className="text-2xl sm:text-3xl font-bold">
                Booking History
              </CardTitle>
              <CardDescription className="text-sm sm:text-base mt-1">
                Manage your upcoming bookings and view past reservations.
              </CardDescription>
            </div>
            <div className="mt-3 sm:mt-0">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => window.location.href = '/student/dashboard'}
                className="text-sm flex items-center gap-1"
              >
                Back to Dashboard
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {loading ? (
        <LoadingState text="Loading your bookings..." spinnerSize="lg" className="py-12" />
      ) : error ? (
        <Card>
          <CardHeader className="text-center pb-0">
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-red-100 dark:bg-red-900/20 p-3">
                <X className="h-8 w-8 text-red-500" />
              </div>
            </div>
            <CardTitle className="text-lg">Failed to load bookings</CardTitle>
            <CardDescription className="text-base mt-2">{error}</CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-center pt-2 pb-6">
            <Button onClick={fetchBookings}>Try Again</Button>
          </CardFooter>
        </Card>
      ) : (
        <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upcoming">
              Upcoming Bookings 
              {bookings.upcoming.length > 0 && (
                <span className="ml-2 bg-primary/10 text-primary px-2 py-0.5 rounded-full text-xs">
                  {bookings.upcoming.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="past">
              Past Bookings
              {bookings.past.length > 0 && (
                <span className="ml-2 bg-muted text-muted-foreground px-2 py-0.5 rounded-full text-xs">
                  {bookings.past.length}
                </span>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="space-y-4">
            <Card className="border-t-4 border-t-primary">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base sm:text-lg flex items-center">
                      Upcoming Bookings
                      {bookings.upcoming.length > 0 && (
                        <Badge variant="outline" className="ml-2">
                          {bookings.upcoming.length}
                        </Badge>
                      )}
                    </CardTitle>
                    <CardDescription className="text-xs sm:text-sm">
                      Your scheduled resource reservations
                    </CardDescription>
                  </div>
                  <Button variant="outline" size="sm" className="hidden sm:flex items-center gap-1">
                    <Calendar className="h-3 w-3 mr-1" />
                    Add to Calendar
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {bookings.upcoming.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {bookings.upcoming.map((booking) => (
                      <BookingCard 
                        key={booking.id} 
                        booking={booking} 
                        showCancel={true} 
                      />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-10 gap-2">
                    <div className="rounded-full bg-muted p-3 mb-2">
                      <Calendar className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-medium">No upcoming bookings</h3>
                    <p className="text-muted-foreground">Book a resource to see it here.</p>
                    <Button variant="outline" size="sm" className="mt-4">
                      Browse Resources
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="past" className="space-y-4">
            <Card className="border-t-4 border-t-slate-400">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base sm:text-lg flex items-center">
                      Past Bookings
                      {bookings.past.length > 0 && (
                        <Badge variant="outline" className="ml-2">
                          {bookings.past.length}
                        </Badge>
                      )}
                    </CardTitle>
                    <CardDescription className="text-xs sm:text-sm">
                      Your booking history and completed reservations
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Select defaultValue="all">
                      <SelectTrigger className="w-[120px] h-8 text-xs">
                        <SelectValue placeholder="All Resources" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Resources</SelectItem>
                        <SelectItem value="library">Library</SelectItem>
                        <SelectItem value="labs">Labs</SelectItem>
                        <SelectItem value="sports">Sports</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline" size="sm" className="hidden sm:flex items-center text-xs">
                      Filter
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {bookings.past.length > 0 ? (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {bookings.past.map((booking) => (
                        <BookingCard 
                          key={booking.id} 
                          booking={booking} 
                          className="bg-muted/20"
                        />
                      ))}
                    </div>
                    {bookings.past.length > 9 && (
                      <div className="flex justify-center mt-4">
                        <Button variant="outline" size="sm">Load More</Button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center py-10 gap-2">
                    <div className="rounded-full bg-muted p-3 mb-2">
                      <Clock className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-medium">No past bookings</h3>
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
