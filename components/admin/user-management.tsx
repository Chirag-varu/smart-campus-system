"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"
import { Search, UserPlus, Mail, Calendar, MoreHorizontal, Ban, CheckCircle, Loader2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface User {
  _id: string
  firstName?: string
  lastName?: string
  studentName?: string
  email: string
  studentId?: string
  department?: string
  isActive: boolean
  role: string
  createdAt: string
  lastLogin?: string
  totalBookings?: number
  status: "active" | "inactive" | "suspended"
}

export function UserManagement() {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterDepartment, setFilterDepartment] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const { toast } = useToast()

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true)
        const response = await fetch('/api/admin/users')
        
        if (!response.ok) {
          throw new Error('Failed to fetch users')
        }
        
        const data = await response.json()
        
        // Transform the data to match our component needs
        const transformedUsers = data.users.map((user: any) => ({
          _id: user._id,
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          studentName: user.studentName || '',
          email: user.email,
          studentId: user.studentId || user.sapId || '',
          department: user.department || 'Not specified',
          isActive: user.isActive !== false,
          role: user.role || 'student',
          createdAt: user.createdAt ? new Date(user.createdAt).toISOString().split('T')[0] : 'Unknown',
          lastLogin: user.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'Never',
          totalBookings: user.totalBookings || 0,
          status: user.isActive === false ? 'inactive' : 'active'
        }))
        
        setUsers(transformedUsers)
      } catch (error) {
        console.error('Error fetching users:', error)
        toast({
          title: "Error",
          description: "Failed to load users. Please try again.",
          variant: "destructive"
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchUsers()
  }, [])

  const filteredUsers = users.filter((user) => {
    const userName = user.studentName || `${user.firstName || ''} ${user.lastName || ''}`.trim();
    const matchesSearch =
      userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.studentId || '').toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDepartment = filterDepartment === "all" || user.department === filterDepartment
    const matchesStatus = filterStatus === "all" || user.status === filterStatus

    return matchesSearch && matchesDepartment && matchesStatus
  })

  const handleStatusChange = async (userId: string, newStatus: "active" | "inactive" | "suspended") => {
    try {
      const isActive = newStatus === "active";
      
      const response = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          userId, 
          isActive,
          status: newStatus
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update user status');
      }

      // Update local state only after successful API call
      setUsers((prev) => prev.map((user) => 
        user._id === userId ? { ...user, status: newStatus, isActive } : user
      ));

      toast({
        title: "User Status Updated",
        description: `User status has been changed to ${newStatus}.`,
      });
    } catch (error) {
      console.error('Error updating user status:', error);
      toast({
        title: "Error",
        description: "Failed to update user status. Please try again.",
        variant: "destructive"
      });
    }
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

  const departments = [...new Set(users.map((user) => user.department).filter(Boolean))]

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

        <Button className="gradient-primary   text-white">
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
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-3">Loading users...</span>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredUsers.map((user) => {
                // Handle name display with fallbacks
                const displayName = user.studentName || 
                  `${user.firstName || ''} ${user.lastName || ''}`.trim() || 
                  user.email.split('@')[0];
                
                // Create initials from name
                const initials = displayName
                  .split(' ')
                  .map(n => n[0])
                  .join('')
                  .toUpperCase();
                
                return (
                  <div
                    key={user._id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={"/diverse-student-profiles.png"} />
                        <AvatarFallback>{initials}</AvatarFallback>
                      </Avatar>
  
                      <div>
                        <h4 className="font-medium">{displayName}</h4>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                          {user.studentId && (
                            <>
                              <span>{user.studentId}</span>
                              <span>•</span>
                            </>
                          )}
                          {user.department && (
                            <>
                              <span>{user.department}</span>
                              <span>•</span>
                            </>
                          )}
                          <div className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {user.email}
                          </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground mt-1">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Joined: {user.createdAt}
                          </div>
                          <span>•</span>
                          <span>{user.totalBookings || 0} bookings</span>
                          <span>•</span>
                          <span>Last active: {user.lastLogin || 'Never'}</span>
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
                          <DropdownMenuItem onClick={() => handleStatusChange(user._id, "active")}>
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Activate
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleStatusChange(user._id, "inactive")}>
                            Deactivate
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleStatusChange(user._id, "suspended")}
                            className="text-red-600"
                          >
                            <Ban className="h-4 w-4 mr-2" />
                            Suspend
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          

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
