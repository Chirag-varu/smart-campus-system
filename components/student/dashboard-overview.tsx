"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, MapPin, BookOpen, Search } from "lucide-react"
import { cn } from "@/lib/utils"

export function DashboardOverview() {
  const upcomingBookings = [
    {
      id: 1,
      resource: "Library Study Room A",
      date: "2024-01-15",
      time: "10:00 AM - 12:00 PM",
      status: "confirmed",
    },
    {
      id: 2,
      resource: "Computer Lab 2",
      date: "2024-01-16",
      time: "2:00 PM - 4:00 PM",
      status: "pending",
    },
  ]

  const quickStats = [
    { label: "Active Bookings", value: "3", icon: Calendar, color: "text-chart-1" },
    { label: "Hours This Week", value: "12", icon: Clock, color: "text-chart-2" },
    { label: "Favorite Resource", value: "Library", icon: BookOpen, color: "text-chart-3" },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold gradient-text">Welcome back, Chirag Varu!</h1>
        <p className="text-muted-foreground mt-2">Here's what's happening with your bookings today.</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {quickStats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index} className="  cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                  <Icon className={cn("h-8 w-8", stat.color)} />
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
          <div className="space-y-4">
            {upcomingBookings.map((booking) => (
              <div
                key={booking.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                  <div>
                    <h4 className="font-medium">{booking.resource}</h4>
                    <div className="flex items-center text-sm text-muted-foreground mt-1">
                      <Calendar className="h-4 w-4 mr-1" />
                      {booking.date}
                      <Clock className="h-4 w-4 ml-3 mr-1" />
                      {booking.time}
                    </div>
                  </div>
                </div>
                <Badge variant={booking.status === "confirmed" ? "default" : "secondary"}>{booking.status}</Badge>
              </div>
            ))}
          </div>

          <div className="mt-6 text-center">
            <Button className="gradient-primary   text-white">View All Bookings</Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks you might want to do</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button variant="outline" className="h-20 flex-col space-y-2 hover:bg-primary/5 bg-transparent">
              <Search className="h-6 w-6" />
              <span>Browse Resources</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col space-y-2 hover:bg-primary/5 bg-transparent">
              <MapPin className="h-6 w-6" />
              <span>Find Nearby</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
