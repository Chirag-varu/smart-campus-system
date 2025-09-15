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
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold gradient-text mb-1">Browse Resources</h1>
          <p className="text-muted-foreground text-base">Find and book campus resources for your needs.</p>
        </div>
        <div className="flex flex-col md:flex-row gap-2 md:gap-4 w-full md:w-auto">
          <Input
            placeholder="Search resources..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-64 shadow-sm border border-border focus:border-primary/60 focus:ring-2 focus:ring-primary/20"
          />
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

      {/* Resource Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
        {filteredResources.map((resource) => (
          <ResourceCard key={(resource as any)._id || (resource as any).id} resource={resource as any} />
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
