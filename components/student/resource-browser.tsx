"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ResourceCard } from "@/components/student/resource-card"
import { Search, Filter } from "lucide-react"

type Resource = {
  _id: string
  name: string
  type: string
  capacity: number
  status: string
  description: string
  amenities: string[]
  location?: string
  bookings?: number
  image?: string
}

export function ResourceBrowser() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [resources, setResources] = useState<Resource[]>([])

  useEffect(() => {
    ;(async () => {
      try {
        const resp = await fetch('/api/resources')
        if (!resp.ok) return
        const data = await resp.json()
        setResources(data.resources || [])
      } catch {}
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

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-background to-muted/30 border rounded-lg p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Browse Resources</h1>
            <p className="text-muted-foreground text-base">Find and book campus resources for your needs.</p>
          </div>
          <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search resources..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full md:w-64 pl-9"
              />
            </div>
            <div className="flex gap-3">
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Library">Library</SelectItem>
                  <SelectItem value="Sports">Sports</SelectItem>
                  <SelectItem value="Labs">Labs</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="booked">Booked</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Resources Count */}
      <div className="flex justify-between items-center mb-4">
        <div className="text-sm text-muted-foreground">
          Showing {filteredResources.length} resources
        </div>
        <div className="text-sm">
          {filterType !== 'all' && `Filtered by ${filterType}`}
          {filterType !== 'all' && filterStatus !== 'all' && ' • '}
          {filterStatus !== 'all' && `Status: ${filterStatus}`}
        </div>
      </div>

      {/* Resource Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
        {filteredResources.map((resource) => (
          <div className="h-full" key={(resource as any)._id || (resource as any).id}>
            <ResourceCard resource={resource as any} />
          </div>
        ))}
      </div>

      {filteredResources.length === 0 && (
        <Card className="border-dashed border-2">
          <CardContent className="text-center py-16 flex flex-col items-center">
            <div className="rounded-full bg-muted p-3 mb-4">
              <Filter className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-2">No resources found</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Try adjusting your search or filter criteria to find available resources.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
