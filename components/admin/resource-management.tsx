"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Plus, Search, Edit, Trash2, Settings, MapPin, Users } from "lucide-react"

interface Resource {
  id: number
  name: string
  type: string
  capacity: number
  status: "active" | "maintenance" | "inactive"
  description: string
  amenities: string[]
  location: string
  bookings: number
}

const mockResources: Resource[] = [
  {
    id: 1,
    name: "Library Study Room A",
    type: "Library",
    capacity: 6,
    status: "active",
    description: "Quiet study room with whiteboard and projector",
    amenities: ["Whiteboard", "Projector", "AC"],
    location: "Library Building, Floor 2",
    bookings: 24,
  },
  {
    id: 2,
    name: "Computer Lab 2",
    type: "Labs",
    capacity: 30,
    status: "active",
    description: "High-performance computers with latest software",
    amenities: ["30 PCs", "High-speed Internet", "Printer"],
    location: "Engineering Building, Floor 1",
    bookings: 18,
  },
  {
    id: 3,
    name: "Basketball Court",
    type: "Sports",
    capacity: 10,
    status: "active",
    description: "Full-size basketball court with professional flooring",
    amenities: ["Professional Court", "Lighting", "Scoreboard"],
    location: "Sports Complex",
    bookings: 32,
  },
  {
    id: 4,
    name: "Chemistry Lab 1",
    type: "Labs",
    capacity: 20,
    status: "maintenance",
    description: "Fully equipped chemistry laboratory",
    amenities: ["Lab Equipment", "Safety Gear", "Fume Hoods"],
    location: "Science Building, Floor 3",
    bookings: 0,
  },
]

export function ResourceManagement() {
  const [resources, setResources] = useState(mockResources)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editingResource, setEditingResource] = useState<Resource | null>(null)
  const { toast } = useToast()

  const [newResource, setNewResource] = useState({
    name: "",
    type: "",
    capacity: "",
    status: "active" as const,
    description: "",
    amenities: "",
    location: "",
  })

  const filteredResources = resources.filter((resource) => {
    const matchesSearch =
      resource.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === "all" || resource.type === filterType
    const matchesStatus = filterStatus === "all" || resource.status === filterStatus

    return matchesSearch && matchesType && matchesStatus
  })

  const handleAddResource = () => {
    if (!newResource.name || !newResource.type || !newResource.capacity) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    const resource: Resource = {
      id: Date.now(),
      name: newResource.name,
      type: newResource.type,
      capacity: Number.parseInt(newResource.capacity),
      status: newResource.status,
      description: newResource.description,
      amenities: newResource.amenities
        .split(",")
        .map((a) => a.trim())
        .filter((a) => a),
      location: newResource.location,
      bookings: 0,
    }

    setResources((prev) => [...prev, resource])
    setNewResource({
      name: "",
      type: "",
      capacity: "",
      status: "active",
      description: "",
      amenities: "",
      location: "",
    })
    setIsAddModalOpen(false)

    toast({
      title: "Resource Added",
      description: `${resource.name} has been successfully added.`,
    })
  }

  const handleDeleteResource = (id: number) => {
    setResources((prev) => prev.filter((resource) => resource.id !== id))
    toast({
      title: "Resource Deleted",
      description: "Resource has been successfully deleted.",
    })
  }

  const handleStatusChange = (id: number, newStatus: "active" | "maintenance" | "inactive") => {
    setResources((prev) => prev.map((resource) => (resource.id === id ? { ...resource, status: newStatus } : resource)))
    toast({
      title: "Status Updated",
      description: "Resource status has been updated.",
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500"
      case "maintenance":
        return "bg-yellow-500"
      case "inactive":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Resource Management</h1>
          <p className="text-muted-foreground mt-2">Add, edit, and manage campus resources.</p>
        </div>

        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button className="gradient-primary gradient-hover text-white">
              <Plus className="h-4 w-4 mr-2" />
              Add Resource
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Resource</DialogTitle>
              <DialogDescription>Create a new resource for campus booking.</DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Resource Name *</Label>
                <Input
                  id="name"
                  value={newResource.name}
                  onChange={(e) => setNewResource({ ...newResource, name: e.target.value })}
                  placeholder="Enter resource name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Type *</Label>
                <Select
                  value={newResource.type}
                  onValueChange={(value) => setNewResource({ ...newResource, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Library">Library</SelectItem>
                    <SelectItem value="Labs">Labs</SelectItem>
                    <SelectItem value="Sports">Sports</SelectItem>
                    <SelectItem value="Conference">Conference</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="capacity">Capacity *</Label>
                <Input
                  id="capacity"
                  type="number"
                  value={newResource.capacity}
                  onChange={(e) => setNewResource({ ...newResource, capacity: e.target.value })}
                  placeholder="Enter capacity"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={newResource.location}
                  onChange={(e) => setNewResource({ ...newResource, location: e.target.value })}
                  placeholder="Enter location"
                />
              </div>

              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newResource.description}
                  onChange={(e) => setNewResource({ ...newResource, description: e.target.value })}
                  placeholder="Enter resource description"
                />
              </div>

              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="amenities">Amenities (comma-separated)</Label>
                <Input
                  id="amenities"
                  value={newResource.amenities}
                  onChange={(e) => setNewResource({ ...newResource, amenities: e.target.value })}
                  placeholder="e.g., Projector, Whiteboard, AC"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button variant="outline" onClick={() => setIsAddModalOpen(false)} className="flex-1">
                Cancel
              </Button>
              <Button onClick={handleAddResource} className="flex-1 gradient-primary gradient-hover text-white">
                Add Resource
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search & Filter
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search resources..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Library">Library</SelectItem>
                <SelectItem value="Sports">Sports</SelectItem>
                <SelectItem value="Labs">Labs</SelectItem>
                <SelectItem value="Conference">Conference</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Resources Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredResources.map((resource) => (
          <Card key={resource.id} className="gradient-hover">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{resource.name}</CardTitle>
                  <CardDescription className="flex items-center gap-1 mt-1">
                    <MapPin className="h-4 w-4" />
                    {resource.location || resource.type}
                  </CardDescription>
                </div>
                <Badge className={`${getStatusColor(resource.status)} text-white border-0`}>{resource.status}</Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">{resource.description}</p>

              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>Capacity: {resource.capacity}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Settings className="h-4 w-4" />
                  <span>{resource.bookings} bookings</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-1">
                {resource.amenities.map((amenity, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {amenity}
                  </Badge>
                ))}
              </div>

              <div className="flex gap-2">
                <Select value={resource.status} onValueChange={(value: any) => handleStatusChange(resource.id, value)}>
                  <SelectTrigger className="flex-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>

                <Button variant="outline" size="icon">
                  <Edit className="h-4 w-4" />
                </Button>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleDeleteResource(resource.id)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredResources.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Settings className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No resources found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filter criteria.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
