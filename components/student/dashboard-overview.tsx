"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, MapPin, BookOpen, Search, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function DashboardOverview() {
  const router = useRouter();
  const [bookings, setBookings] = useState<{
    upcoming: any[];
    past: any[];
  }>({
    upcoming: [],
    past: []
  });
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("Student");

  useEffect(() => {
    // Get user name from localStorage (set during login)
    if (typeof window !== 'undefined') {
      const storedName = localStorage.getItem('userName');
      if (storedName) {
        setUserName(storedName.split(' ')[0]); // Just use first name
      }
    }
    
    // Fetch bookings data
    const fetchBookings = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/booking-history');
        if (response.ok) {
          const data = await response.json();
          setBookings(data);
        }
      } catch (err) {
        console.error('Failed to load bookings:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchBookings();
  }, []);

  // Calculate usage statistics
  const calculateHoursBooked = () => {
    if (loading || !bookings.upcoming.length) return "-";
    
    let totalHours = 0;
    bookings.upcoming.forEach(booking => {
      // Assuming each booking has a duration in hours
      if (booking.duration) {
        totalHours += booking.duration;
      } else if (booking.startTime && booking.endTime) {
        // Or calculate from start/end times if available
        const start = new Date(booking.startTime).getHours();
        const end = new Date(booking.endTime).getHours();
        totalHours += (end - start);
      } else {
        // Fallback to estimated 2 hours per booking
        totalHours += 2;
      }
    });
    
    return totalHours.toString();
  };

  // Find most booked resource type
  const findFavoriteResource = () => {
    if (loading) return "-";
    if (!bookings.past.length && !bookings.upcoming.length) return "None yet";
    
    const allBookings = [...bookings.past, ...bookings.upcoming];
    const resourceTypes = allBookings.map(b => b.resourceType || "Other");
    
    // Count occurrences of each resource type
    const counts: Record<string, number> = resourceTypes.reduce((acc: Record<string, number>, type: string) => {
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});
    
    // Find the most frequent resource type
    let favorite = "None";
    let maxCount = 0;
    
    Object.entries(counts).forEach(([type, count]) => {
      if (count > maxCount) {
        favorite = type;
        maxCount = count;
      }
    });
    
    return favorite;
  };

  const quickStats = [
    { label: "Active Bookings", value: loading ? "-" : bookings.upcoming.length.toString(), icon: Calendar, color: "text-chart-1" },
    { label: "Hours Booked", value: calculateHoursBooked(), icon: Clock, color: "text-chart-2" },
    { label: "Favorite Resource", value: findFavoriteResource(), icon: BookOpen, color: "text-chart-3" },
  ]

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-background to-muted/30 border-muted">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Welcome back, {userName}!</CardTitle>
          <CardDescription className="text-base">Here's what's happening with your bookings today.</CardDescription>
        </CardHeader>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {quickStats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index} className="overflow-hidden transition-all hover:shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <div className="rounded-full p-2 bg-muted">
                    <Icon className={cn("h-5 w-5", stat.color)} />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Upcoming Bookings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Upcoming Bookings
          </CardTitle>
          <CardDescription>Your scheduled resource bookings</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <LoadingSpinner size="md" />
            </div>
          ) : bookings.upcoming.length > 0 ? (
            <div className="space-y-4">
              {bookings.upcoming.slice(0, 3).map((booking) => {
                return (
                  <div
                    key={booking._id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`w-2 h-2 rounded-full ${
                        booking.status === "confirmed" ? "bg-emerald-500" : 
                        booking.status === "pending" ? "bg-amber-500" : 
                        booking.status === "cancelled" ? "bg-red-500" : 
                        "bg-slate-500"
                      }`}></div>
                      <div>
                        <h4 className="font-medium">{booking.resourceName}</h4>
                        <div className="flex flex-wrap items-center text-sm text-muted-foreground mt-1 gap-3">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {new Date(booking.date).toLocaleDateString()}
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {booking.startTime} - {booking.endTime}
                          </div>
                        </div>
                      </div>
                    </div>
                    <Badge 
                      variant="outline" 
                      className={`${
                        booking.status === "confirmed" ? "border-green-200 bg-green-100 text-green-800 hover:bg-green-100" : 
                        booking.status === "pending" ? "border-amber-200 bg-amber-100 text-amber-800 hover:bg-amber-100" : 
                        booking.status === "cancelled" ? "border-red-200 bg-red-100 text-red-800 hover:bg-red-100" : 
                        "border-slate-200 bg-slate-100 text-slate-800 hover:bg-slate-100"
                      }`}
                    >
                      {booking.status}
                    </Badge>
                  </div>
                );
              })}
              {bookings.upcoming.length > 3 && (
                <p className="text-sm text-muted-foreground text-center mt-2">
                  + {bookings.upcoming.length - 3} more upcoming bookings
                </p>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 gap-2">
              <div className="rounded-full bg-muted p-3 mb-2">
                <Calendar className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="font-medium">No upcoming bookings</h3>
              <p className="text-sm text-muted-foreground">Browse resources to make your first booking</p>
              <Button variant="outline" size="sm" className="mt-3" onClick={() => router.push('/student/resources')}>
                Browse Resources
              </Button>
            </div>
          )}

          <div className="mt-6 text-center">
            <Button 
              variant="default"
              onClick={() => router.push('/student/bookings')}
              className="bg-black text-white hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90"
            >
              View All Bookings
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card className="bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-950 dark:to-blue-950">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>Recent Bookings</span>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs flex items-center gap-1 text-muted-foreground"
              onClick={() => router.push('/student/bookings?tab=past')}
            >
              View History <ArrowRight className="h-3 w-3" />
            </Button>
          </CardTitle>
          <CardDescription>Your most recent completed bookings</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-4">
              <LoadingSpinner size="sm" />
            </div>
          ) : bookings.past.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {bookings.past.slice(0, 4).map((booking) => (
                <Card 
                  key={booking._id}
                  className="bg-white/60 dark:bg-slate-900/60 hover:shadow-sm transition-all border-muted"
                >
                  <CardContent className="p-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-sm">{booking.resourceName}</p>
                        <div className="text-xs text-muted-foreground mt-1 flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {new Date(booking.date).toLocaleDateString()}
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs px-2 py-0 h-5 border-blue-200 bg-blue-100 text-blue-800 hover:bg-blue-100">
                        Completed
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-6 gap-1">
              <div className="rounded-full bg-muted/50 p-2">
                <Clock className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                No past bookings found
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <ArrowRight className="h-4 w-4" />
            Quick Actions
          </CardTitle>
          <CardDescription>Common tasks you might want to do</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-dashed rounded-lg hover:border-primary/50 hover:bg-muted/50 transition-colors cursor-pointer flex justify-center items-center" onClick={() => router.push('/student/resources')}>
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <Search className="h-6 w-6 mb-2" />
                <span className="font-medium">Browse Resources</span>
              </div>
            </div>
            <div className="border border-dashed rounded-lg hover:border-primary/50 hover:bg-muted/50 transition-colors cursor-pointer flex justify-center items-center" onClick={() => router.push('/student/nearby')}>
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <MapPin className="h-6 w-6 mb-2" />
                <span className="font-medium">Find Nearby</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
