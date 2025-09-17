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
import { TrendingUp, TrendingDown, Calendar, Clock, Settings, Loader2 } from "lucide-react"
import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"

interface AnalyticsData {
  resourceUsageData: {
    name: string;
    bookings: number;
    capacity: number;
    utilization: number;
  }[];
  peakHoursData: {
    hour: string;
    bookings: number;
  }[];
  bookingTrendsData: {
    name: string;
    value: number;
    color: string;
  }[];
  weeklyTrendData: {
    day: string;
    bookings: number;
    cancellations: number;
  }[];
  stats: {
    totalBookings: number;
    averageUtilization: string;
    peakHour: string;
    peakHourBookings: number;
    activeResourcesCount: number;
  };
}

// Default empty data
const defaultData: AnalyticsData = {
  resourceUsageData: [],
  peakHoursData: [],
  bookingTrendsData: [],
  weeklyTrendData: [],
  stats: {
    totalBookings: 0,
    averageUtilization: "0.0",
    peakHour: "N/A",
    peakHourBookings: 0,
    activeResourcesCount: 0
  }
};

const COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))"]

export function AnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState("7d")
  const [isLoading, setIsLoading] = useState(true)
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>(defaultData)
  const { toast } = useToast()
  
  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(`/api/admin/analytics?timeRange=${timeRange}`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch analytics data')
        }
        
        const data = await response.json()
        setAnalyticsData(data)
      } catch (error) {
        console.error('Error fetching analytics data:', error)
        toast({
          title: "Error",
          description: "Failed to load analytics data. Please try again.",
          variant: "destructive"
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchAnalyticsData()
  }, [timeRange, toast])

  const stats = [
    {
      title: "Total Bookings",
      value: analyticsData.stats.totalBookings.toString(),
      change: "All time",
      trend: "up",
      icon: Calendar,
      description: "Total bookings",
    },
    {
      title: "Average Utilization",
      value: `${analyticsData.stats.averageUtilization}%`,
      change: "Current rate",
      trend: "up",
      icon: TrendingUp,
      description: "Across all resources",
    },
    {
      title: "Peak Hour",
      value: analyticsData.stats.peakHour,
      change: `${analyticsData.stats.peakHourBookings} bookings`,
      trend: "neutral",
      icon: Clock,
      description: "Highest activity",
    },
    {
      title: "Active Resources",
      value: analyticsData.stats.activeResourcesCount.toString(),
      change: "Currently available",
      trend: "up",
      icon: Settings,
      description: "Currently available",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Analytics</h1>
          <p className="text-muted-foreground mt-2">Campus resource usage metrics and trends.</p>
        </div>

        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
            <SelectItem value="12m">Last 12 months</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary mr-3" />
          <span>Loading analytics data...</span>
        </div>
      ) : (
        <>
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                      <p className="text-2xl font-bold">{stat.value}</p>
                      <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
                    </div>
                    <div
                      className={`p-2 rounded-full ${
                        stat.trend === "up"
                          ? "bg-green-100"
                          : stat.trend === "down"
                          ? "bg-red-100"
                          : "bg-gray-100"
                      }`}
                    >
                      <stat.icon
                        className={`h-5 w-5 ${
                          stat.trend === "up"
                            ? "text-green-600"
                            : stat.trend === "down"
                            ? "text-red-600"
                            : "text-gray-600"
                        }`}
                      />
                    </div>
                  </div>
                  <div className="text-xs font-medium mt-3 flex items-center gap-1">
                    {stat.trend === "up" ? (
                      <TrendingUp className="h-3 w-3 text-green-600" />
                    ) : stat.trend === "down" ? (
                      <TrendingDown className="h-3 w-3 text-red-600" />
                    ) : null}
                    <span
                      className={
                        stat.trend === "up"
                          ? "text-green-600"
                          : stat.trend === "down"
                          ? "text-red-600"
                          : "text-gray-600"
                      }
                    >
                      {stat.change}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Resource Usage Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Resource Utilization</CardTitle>
              <CardDescription>Booking rates across different campus resources</CardDescription>
            </CardHeader>
            <CardContent>
              {analyticsData.resourceUsageData.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-[300px] text-muted-foreground">
                  <Settings className="h-12 w-12 mb-3 opacity-50" />
                  <p>No resource usage data available</p>
                </div>
              ) : (
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={analyticsData.resourceUsageData}
                      margin={{ top: 10, right: 30, left: 0, bottom: 30 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis
                        dataKey="name"
                        tick={{ fontSize: 12 }}
                        tickLine={false}
                        axisLine={false}
                        angle={-45}
                        textAnchor="end"
                        height={70}
                      />
                      <YAxis tickLine={false} axisLine={false} unit="%" />
                      <Tooltip
                        formatter={(value, name) => {
                          if (name === "utilization") return [`${value}%`, "Utilization"]
                          return [value, name]
                        }}
                        labelStyle={{ color: "var(--foreground)" }}
                        contentStyle={{
                          backgroundColor: "var(--background)",
                          borderColor: "var(--border)",
                        }}
                      />
                      <Bar
                        dataKey="utilization"
                        fill="hsl(var(--chart-1))"
                        radius={[4, 4, 0, 0]}
                        barSize={30}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Peak Hours Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Peak Hours</CardTitle>
                <CardDescription>Booking activity throughout the day</CardDescription>
              </CardHeader>
              <CardContent>
                {analyticsData.peakHoursData.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-[300px] text-muted-foreground">
                    <Clock className="h-12 w-12 mb-3 opacity-50" />
                    <p>No peak hours data available</p>
                  </div>
                ) : (
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={analyticsData.peakHoursData} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
                        <defs>
                          <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0.2} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                        <XAxis dataKey="hour" tickLine={false} axisLine={false} />
                        <YAxis tickLine={false} axisLine={false} />
                        <Tooltip
                          labelStyle={{ color: "var(--foreground)" }}
                          contentStyle={{
                            backgroundColor: "var(--background)",
                            borderColor: "var(--border)",
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="bookings"
                          stroke="hsl(var(--chart-2))"
                          fillOpacity={1}
                          fill="url(#colorBookings)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Weekly Trends Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Weekly Trends</CardTitle>
                <CardDescription>Booking activity and cancellations by day</CardDescription>
              </CardHeader>
              <CardContent>
                {analyticsData.weeklyTrendData.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-[300px] text-muted-foreground">
                    <Calendar className="h-12 w-12 mb-3 opacity-50" />
                    <p>No weekly trend data available</p>
                  </div>
                ) : (
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={analyticsData.weeklyTrendData} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                        <XAxis dataKey="day" tickLine={false} axisLine={false} />
                        <YAxis tickLine={false} axisLine={false} />
                        <Tooltip
                          labelStyle={{ color: "var(--foreground)" }}
                          contentStyle={{
                            backgroundColor: "var(--background)",
                            borderColor: "var(--border)",
                          }}
                        />
                        <Line
                          type="monotone"
                          dataKey="bookings"
                          stroke="hsl(var(--chart-3))"
                          strokeWidth={2}
                          dot={{ r: 4, stroke: "hsl(var(--chart-3))", fill: "white" }}
                          activeDot={{ r: 6, stroke: "hsl(var(--chart-3))", fill: "white" }}
                        />
                        <Line
                          type="monotone"
                          dataKey="cancellations"
                          stroke="hsl(var(--chart-4))"
                          strokeWidth={2}
                          dot={{ r: 4, stroke: "hsl(var(--chart-4))", fill: "white" }}
                          activeDot={{ r: 6, stroke: "hsl(var(--chart-4))", fill: "white" }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Resource Type Distribution Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Booking Distribution</CardTitle>
              <CardDescription>Resource types most frequently booked</CardDescription>
            </CardHeader>
            <CardContent>
              {analyticsData.bookingTrendsData.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-[320px] text-muted-foreground">
                  <Settings className="h-12 w-12 mb-3 opacity-50" />
                  <p>No booking distribution data available</p>
                </div>
              ) : (
                <div className="h-[320px]">
                  <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
                    <div className="flex items-center justify-center">
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={analyticsData.bookingTrendsData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={100}
                            paddingAngle={2}
                            dataKey="value"
                          >
                            {analyticsData.bookingTrendsData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip
                            formatter={(value) => [`${value} bookings`, ""]}
                            labelStyle={{ color: "var(--foreground)" }}
                            contentStyle={{
                              backgroundColor: "var(--background)",
                              borderColor: "var(--border)",
                            }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="flex flex-col justify-center">
                      <div className="space-y-4">
                        {analyticsData.bookingTrendsData.map((item, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: item.color }}
                            ></div>
                            <div>
                              <p className="text-sm font-medium">{item.name}</p>
                              <p className="text-xs text-muted-foreground">{item.value} bookings</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
