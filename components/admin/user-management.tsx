"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"
import { Search, UserPlus, Mail, Calendar, MoreHorizontal, Ban, CheckCircle } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface User {
  id: number
  name: string
  email: string
  rollNo: string
  department: string
  status: "active" | "inactive" | "suspended"
  joinDate: string
  totalBookings: number
  lastActive: string
  avatar?: string
}

const mockUsers: User[] = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@university.edu",
    rollNo: "CS2021001",
    department: "Computer Science",
    status: "active",
    joinDate: "2021-08-15",
    totalBookings: 24,
    lastActive: "2 hours ago",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane.smith@university.edu",
    rollNo: "EE2021045",
    department: "Electrical Engineering",
    status: "active",
    joinDate: "2021-08-16",
    totalBookings: 18,
    lastActive: "1 day ago",
  },
  {
    id: 3,
    name: "Mike Johnson",
    email: "mike.johnson@university.edu",
    rollNo: "ME2020123",
    department: "Mechanical Engineering",
    status: "inactive",
    joinDate: "2020-08-20",
    totalBookings: 45,
    lastActive: "1 week ago",
  },
  {
    id: 4,
    name: "Sarah Wilson",
    email: "sarah.wilson@university.edu",
    rollNo: "CS2021078",
    department: "Computer Science",
    status: "suspended",
    joinDate: "2021-08-18",
    totalBookings: 12,
    lastActive: "2 weeks ago",
  },
  {
    id: 5,
    name: "David Brown",
    email: "david.brown@university.edu",
    rollNo: "PH2021056",
    department: "Physics",
    status: "active",
    joinDate: "2021-08-22",
    totalBookings: 31,
    lastActive: "3 hours ago",
  },
]

export function UserManagement() {
  const [users, setUsers] = useState(mockUsers)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterDepartment, setFilterDepartment] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const { toast } = useToast()

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.rollNo.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDepartment = filterDepartment === "all" || user.department === filterDepartment
    const matchesStatus = filterStatus === "all" || user.status === filterStatus

    return matchesSearch && matchesDepartment && matchesStatus
  })

  const handleStatusChange = (userId: number, newStatus: "active" | "inactive" | "suspended") => {
    setUsers((prev) => prev.map((user) => (user.id === userId ? { ...user, status: newStatus } : user)))

    toast({
      title: "User Status Updated",
      description: `User status has been changed to ${newStatus}.`,
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500"
      case "inactive":
        return "bg-gray-500"
      case "suspended":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-4 w-4" />
      case "suspended":
        return <Ban className="h-4 w-4" />
      default:
        return null
    }
  }

  const departments = [...new Set(users.map((user) => user.department))]

  const stats = [
    { label: "Total Users", value: users.length, color: "text-chart-1" },
    { label: "Active Users", value: users.filter((u) => u.status === "active").length, color: "text-green-600" },
    { label: "Inactive Users", value: users.filter((u) => u.status === "inactive").length, color: "text-gray-600" },
    { label: "Suspended Users", value: users.filter((u) => u.status === "suspended").length, color: "text-red-600" },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text">User Management</h1>
          <p className="text-muted-foreground mt-2">Manage student accounts and permissions.</p>
        </div>

        <Button className="gradient-primary gradient-hover text-white">
          <UserPlus className="h-4 w-4 mr-2" />
          Add User
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search & Filter Users
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search by name, email, or roll number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <Select value={filterDepartment} onValueChange={setFilterDepartment}>
              <SelectTrigger className="w-full md:w-64">
                <SelectValue placeholder="Filter by department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Users ({filteredUsers.length})</CardTitle>
          <CardDescription>Manage student accounts and their access</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredUsers.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={user.avatar || "/diverse-student-profiles.png"} />
                    <AvatarFallback>
                      {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>

                  <div>
                    <h4 className="font-medium">{user.name}</h4>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{user.rollNo}</span>
                      <span>•</span>
                      <span>{user.department}</span>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {user.email}
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Joined: {user.joinDate}
                      </div>
                      <span>•</span>
                      <span>{user.totalBookings} bookings</span>
                      <span>•</span>
                      <span>Last active: {user.lastActive}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Badge className={`${getStatusColor(user.status)} text-white border-0 flex items-center gap-1`}>
                    {getStatusIcon(user.status)}
                    {user.status}
                  </Badge>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleStatusChange(user.id, "active")}>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Activate
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleStatusChange(user.id, "inactive")}>
                        Deactivate
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleStatusChange(user.id, "suspended")}
                        className="text-red-600"
                      >
                        <Ban className="h-4 w-4 mr-2" />
                        Suspend
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No users found</h3>
              <p className="text-muted-foreground">Try adjusting your search or filter criteria.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
