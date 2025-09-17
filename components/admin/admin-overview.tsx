"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Users, Calendar, Settings, AlertTriangle, TrendingUp, Clock, CheckSquare, BarChart3, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"

interface DashboardData {
  stats: {
    totalResources: number;
    activeBookings: number;
    totalUsers: number;
    pendingApprovals: number;
  };
  recentActivity: {
    id: string;
    action: string;
    resource: string;
    user: string;
    time: string;
    type: string;
  }[];
  upcomingTasks: {
    id: string;
    task: string;
    priority: string;
    dueDate: string;
  }[];
}

export function AdminOverview() {
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/admin/dashboard');
        
        if (!response.ok) {
          throw new Error('Failed to fetch dashboard data');
        }
        
        const data = await response.json();
        setDashboardData(data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast({
          title: "Error",
          description: "Failed to load dashboard data. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [toast]);

  const stats = [
    {
      label: "Total Resources",
      value: dashboardData?.stats?.totalResources?.toString() || "0",
      change: "Campus resources",
      icon: Settings,
      color: "text-chart-1",
      trend: "up",
    },
    {
      label: "Active Bookings",
      value: dashboardData?.stats?.activeBookings?.toString() || "0",
      change: "Current & upcoming",
      icon: Calendar,
      color: "text-chart-2",
      trend: "up",
    },
    {
      label: "Total Users",
      value: dashboardData?.stats?.totalUsers?.toString() || "0",
      change: "Registered accounts",
      icon: Users,
      color: "text-chart-3",
      trend: "up",
    },
    {
      label: "Pending Approvals",
      value: dashboardData?.stats?.pendingApprovals?.toString() || "0",
      change: dashboardData?.stats?.pendingApprovals ? "Requires attention" : "No pending requests",
      icon: AlertTriangle,
      color: "text-yellow-600",
      trend: "neutral",
    },
  ]

  const recentActivity = dashboardData?.recentActivity || [];
  const upcomingTasks = dashboardData?.upcomingTasks || [];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500"
      case "medium":
        return "bg-yellow-500"
      case "low":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "resource":
        return <Settings className="h-4 w-4" />
      case "approval":
        return <Calendar className="h-4 w-4" />
      case "maintenance":
        return <AlertTriangle className="h-4 w-4" />
      case "user":
        return <Users className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold gradient-text">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-2">Manage campus resources and monitor system activity.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index} className="  cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p
                      className={cn(
                        "text-xs mt-1",
                        stat.trend === "up"
                          ? "text-green-600"
                          : stat.trend === "down"
                            ? "text-red-600"
                            : "text-yellow-600",
                      )}
                    >
                      {stat.change}
                    </p>
                  </div>
                  <Icon className={cn("h-8 w-8", stat.color)} />
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Recent Activity
            </CardTitle>
            <CardDescription>Latest system activities and changes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start space-x-4 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="mt-1">{getActivityIcon(activity.type)}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-sm text-muted-foreground">{activity.resource}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-muted-foreground">by {activity.user}</span>
                      <span className="text-xs text-muted-foreground">•</span>
                      <span className="text-xs text-muted-foreground">{activity.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Tasks */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Upcoming Tasks
            </CardTitle>
            <CardDescription>Tasks that require your attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${getPriorityColor(task.priority)}`}></div>
                    <div>
                      <p className="text-sm font-medium">{task.task}</p>
                      <p className="text-xs text-muted-foreground">Due: {task.dueDate}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {task.priority}
                  </Badge>
                </div>
              ))}
            </div>

            <div className="mt-6">
              <Button className="w-full gradient-primary   text-white">View All Tasks</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common administrative tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-20 flex-col space-y-2 hover:bg-primary/5 bg-transparent">
              <Settings className="h-6 w-6" />
              <span>Add Resource</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col space-y-2 hover:bg-primary/5 bg-transparent">
              <CheckSquare className="h-6 w-6" />
              <span>Review Approvals</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col space-y-2 hover:bg-primary/5 bg-transparent">
              <BarChart3 className="h-6 w-6" />
              <span>View Analytics</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
