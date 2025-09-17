"use client"

import { useEffect, useState } from "react"
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Plus, Search, Edit, Trash2, Settings, MapPin, Users } from "lucide-react"

interface Resource { _id: string; name: string; type: string; capacity: number; status: "active" | "maintenance" | "inactive"; description: string; amenities: string[]; location: string; bookings: number }

const mockResources: Resource[] = []

export function ResourceManagement() {
  const [resources, setResources] = useState<Resource[]>(mockResources)
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

  useEffect(() => {
    ;(async () => {
      const resp = await fetch('/api/admin/resources')
      if (!resp.ok) return
      const data = await resp.json()
      setResources(data.resources || [])
    })()
  }, [])

  const filteredResources = resources.filter((resource) => {
    const matchesSearch =
      resource.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === "all" || resource.type === filterType
    const matchesStatus = filterStatus === "all" || resource.status === filterStatus

    return matchesSearch && matchesType && matchesStatus
  })

  const handleAddResource = async () => {
    if (!newResource.name || !newResource.type || !newResource.capacity) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    const payload = {
      name: newResource.name,
      type: newResource.type,
      capacity: Number.parseInt(newResource.capacity),
      status: newResource.status,
      description: newResource.description,
      amenities: newResource.amenities.split(",").map((a) => a.trim()).filter((a) => a),
      location: newResource.location,
    }

    const resp = await fetch('/api/admin/resources', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
    })
    if (!resp.ok) return
    const data = await resp.json()
    setResources((prev) => [...prev, data.resource])
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
      description: `${resources[resources.length - 1].name} has been successfully added.`,
    })
  }

  const [resourceToDelete, setResourceToDelete] = useState<string | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const confirmDeleteResource = (id: string) => {
    setResourceToDelete(id)
    setIsDeleteDialogOpen(true)
  }

  const handleDeleteResource = async () => {
    if (!resourceToDelete) return

    const resp = await fetch(`/api/admin/resources?id=${encodeURIComponent(resourceToDelete)}`, { method: 'DELETE' })
    if (!resp.ok) return
    
    setResources((prev) => prev.filter((resource) => resource._id !== resourceToDelete))
    setIsDeleteDialogOpen(false)
    setResourceToDelete(null)
    
    toast({
      title: "Resource Deleted",
      description: "Resource has been successfully deleted.",
    })
  }

  const handleStatusChange = async (id: string, newStatus: "active" | "maintenance" | "inactive") => {
    const resp = await fetch('/api/admin/resources', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, status: newStatus }) })
    if (!resp.ok) return
    setResources((prev) => prev.map((resource) => (resource._id === id ? { ...resource, status: newStatus } : resource)))
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
            <Button className="gradient-primary   text-white">
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
              <Button onClick={handleAddResource} className="flex-1 gradient-primary   text-white">
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
          <Card key={resource._id} className=" ">
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
                <Select value={resource.status} onValueChange={(value: any) => handleStatusChange(resource._id, value)}>
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
                  onClick={() => confirmDeleteResource(resource._id)}
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

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this resource?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the resource and remove it from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteResource} className="bg-red-600 hover:bg-red-700 text-white">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
