"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart,
} from "recharts"
import { TrendingUp, TrendingDown, Calendar, Clock, Settings } from "lucide-react"
import { useState } from "react"

// Mock data for analytics
const resourceUsageData = [
  { name: "Library Study Rooms", bookings: 145, capacity: 200, utilization: 72.5 },
  { name: "Computer Labs", bookings: 98, capacity: 120, utilization: 81.7 },
  { name: "Sports Facilities", bookings: 76, capacity: 80, utilization: 95.0 },
  { name: "Conference Rooms", bookings: 54, capacity: 60, utilization: 90.0 },
  { name: "Chemistry Labs", bookings: 32, capacity: 40, utilization: 80.0 },
  { name: "Physics Labs", bookings: 28, capacity: 40, utilization: 70.0 },
]

const peakHoursData = [
  { hour: "8 AM", bookings: 12 },
  { hour: "9 AM", bookings: 28 },
  { hour: "10 AM", bookings: 45 },
  { hour: "11 AM", bookings: 52 },
  { hour: "12 PM", bookings: 38 },
  { hour: "1 PM", bookings: 42 },
  { hour: "2 PM", bookings: 65 },
  { hour: "3 PM", bookings: 58 },
  { hour: "4 PM", bookings: 48 },
  { hour: "5 PM", bookings: 35 },
  { hour: "6 PM", bookings: 22 },
  { hour: "7 PM", bookings: 18 },
]

const bookingTrendsData = [
  { name: "Library", value: 35, color: "hsl(var(--chart-1))" },
  { name: "Labs", value: 28, color: "hsl(var(--chart-2))" },
  { name: "Sports", value: 22, color: "hsl(var(--chart-3))" },
  { name: "Conference", value: 15, color: "hsl(var(--chart-4))" },
]

const weeklyTrendData = [
  { day: "Mon", bookings: 45, cancellations: 5 },
  { day: "Tue", bookings: 52, cancellations: 3 },
  { day: "Wed", bookings: 48, cancellations: 7 },
  { day: "Thu", bookings: 61, cancellations: 4 },
  { day: "Fri", bookings: 55, cancellations: 6 },
  { day: "Sat", bookings: 38, cancellations: 2 },
  { day: "Sun", bookings: 25, cancellations: 1 },
]

const COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))"]

export function AnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState("7d")

  const stats = [
    {
      title: "Total Bookings",
      value: "1,247",
      change: "+12.5%",
      trend: "up",
      icon: Calendar,
      description: "This month",
    },
    {
      title: "Average Utilization",
      value: "78.2%",
      change: "+5.2%",
      trend: "up",
      icon: TrendingUp,
      description: "Across all resources",
    },
    {
      title: "Peak Hour",
      value: "2-3 PM",
      change: "65 bookings",
      trend: "neutral",
      icon: Clock,
      description: "Highest activity",
    },
    {
      title: "Active Resources",
      value: "24",
      change: "+2",
      trend: "up",
      icon: Settings,
      description: "Currently available",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Analytics Dashboard</h1>
          <p className="text-muted-foreground mt-2">Comprehensive insights into resource usage and booking patterns.</p>
        </div>

        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 3 months</SelectItem>
            <SelectItem value="1y">Last year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index} className=" ">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge
                        variant="secondary"
                        className={`text-xs ${
                          stat.trend === "up"
                            ? "bg-green-100 text-green-700"
                            : stat.trend === "down"
                              ? "bg-red-100 text-red-700"
                              : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {stat.trend === "up" ? (
                          <TrendingUp className="h-3 w-3 mr-1" />
                        ) : stat.trend === "down" ? (
                          <TrendingDown className="h-3 w-3 mr-1" />
                        ) : null}
                        {stat.change}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
                  </div>
                  <Icon className="h-8 w-8 text-chart-1" />
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Resource Usage Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Most Used Resources</CardTitle>
            <CardDescription>Resource utilization and booking statistics</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={resourceUsageData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="name" className="text-xs" angle={-45} textAnchor="end" height={80} />
                <YAxis className="text-xs" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="bookings" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Peak Hours Line Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Peak Booking Hours</CardTitle>
            <CardDescription>Hourly booking distribution throughout the day</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={peakHoursData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="hour" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="bookings"
                  stroke="hsl(var(--chart-2))"
                  fill="hsl(var(--chart-2))"
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Booking Trends Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Student Booking Trends</CardTitle>
            <CardDescription>Distribution of bookings by resource category</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={bookingTrendsData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {bookingTrendsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Weekly Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Weekly Booking Trends</CardTitle>
            <CardDescription>Bookings vs cancellations throughout the week</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={weeklyTrendData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="day" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="bookings"
                  stroke="hsl(var(--chart-3))"
                  strokeWidth={3}
                  dot={{ fill: "hsl(var(--chart-3))", strokeWidth: 2, r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="cancellations"
                  stroke="hsl(var(--chart-5))"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={{ fill: "hsl(var(--chart-5))", strokeWidth: 2, r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Resource Performance Table */}
      <Card>
        <CardHeader>
          <CardTitle>Resource Performance Overview</CardTitle>
          <CardDescription>Detailed utilization metrics for all resources</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {resourceUsageData.map((resource, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex-1">
                  <h4 className="font-medium">{resource.name}</h4>
                  <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                    <span>{resource.bookings} bookings</span>
                    <span>•</span>
                    <span>Capacity: {resource.capacity}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm font-medium">{resource.utilization}%</p>
                    <p className="text-xs text-muted-foreground">Utilization</p>
                  </div>

                  <div className="w-24 bg-muted rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-chart-1 to-chart-2 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${resource.utilization}%` }}
                    />
                  </div>

                  <Badge
                    variant="secondary"
                    className={
                      resource.utilization >= 90
                        ? "bg-red-100 text-red-700"
                        : resource.utilization >= 70
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                    }
                  >
                    {resource.utilization >= 90 ? "High" : resource.utilization >= 70 ? "Good" : "Low"}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
