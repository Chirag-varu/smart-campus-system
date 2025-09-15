"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ResourceCard } from "@/components/student/resource-card"
import { Search, Filter } from "lucide-react"

const mockResources = [
  {
    id: 1,
    name: "Library Study Room A",
    type: "Library",
    capacity: 6,
    status: "available",
    description: "Quiet study room with whiteboard and projector",
    amenities: ["Whiteboard", "Projector", "AC"],
    image: "/modern-library-study-room.jpg",
  },
  {
    id: 2,
    name: "Computer Lab 2",
    type: "Labs",
    capacity: 30,
    status: "booked",
    description: "High-performance computers with latest software",
    amenities: ["30 PCs", "High-speed Internet", "Printer"],
    image: "/computer-lab-with-modern-pcs.jpg",
  },
  {
    id: 3,
    name: "Basketball Court",
    type: "Sports",
    capacity: 10,
    status: "available",
    description: "Full-size basketball court with professional flooring",
    amenities: ["Professional Court", "Lighting", "Scoreboard"],
    image: "/indoor-basketball-court.png",
  },
  {
    id: 4,
    name: "Conference Room B",
    type: "Library",
    capacity: 12,
    status: "available",
    description: "Large conference room for group discussions",
    amenities: ["Conference Table", "Video Conferencing", "AC"],
    image: "/modern-conference-room.png",
  },
  {
    id: 5,
    name: "Chemistry Lab 1",
    type: "Labs",
    capacity: 20,
    status: "maintenance",
    description: "Fully equipped chemistry laboratory",
    amenities: ["Lab Equipment", "Safety Gear", "Fume Hoods"],
    image: "/chemistry-laboratory.jpg",
  },
  {
    id: 6,
    name: "Tennis Court 1",
    type: "Sports",
    capacity: 4,
    status: "available",
    description: "Professional tennis court with night lighting",
    amenities: ["Professional Court", "Night Lighting", "Equipment Storage"],
    image: "/outdoor-tennis-court.png",
  },
]

export function ResourceBrowser() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")

  const filteredResources = mockResources.filter((resource) => {
    const matchesSearch =
      resource.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === "all" || resource.type === filterType
    const matchesStatus = filterStatus === "all" || resource.status === filterStatus

    return matchesSearch && matchesType && matchesStatus
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold gradient-text">Browse Resources</h1>
        <p className="text-muted-foreground mt-2">Find and book campus resources for your needs.</p>
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
                className="w-full"
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
              </SelectContent>
            </Select>

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="booked">Booked</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Resource Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResources.map((resource) => (
          <ResourceCard key={resource.id} resource={resource} />
        ))}
      </div>

      {filteredResources.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Filter className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No resources found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filter criteria.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
