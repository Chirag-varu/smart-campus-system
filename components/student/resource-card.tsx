"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BookingModal } from "@/components/student/booking-modal"
import { MapPin, Users } from "lucide-react"
import Image from "next/image"

interface Resource {
  id: number
  name: string
  type: string
  capacity: number
  status: "available" | "booked" | "maintenance"
  description: string
  amenities: string[]
  image: string
  location?: string
}

interface ResourceCardProps {
  resource: Resource
}

export function ResourceCard({ resource }: ResourceCardProps) {
  const [showBookingModal, setShowBookingModal] = useState(false)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-500"
      case "booked":
        return "bg-red-500"
      case "maintenance":
        return "bg-yellow-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "available":
        return "Available"
      case "booked":
        return "Booked"
      case "maintenance":
        return "Maintenance"
      default:
        return "Unknown"
    }
  }

  const getImagePath = (resourceName: string) => {
    switch (resourceName) {
      case "Library Study Room A":
        return "/modern-library-study-room.jpg"
      case "Computer Lab 2":
        return "/computer-lab-with-modern-pcs.jpg"
      case "Basketball Court":
        return "/indoor-basketball-court.png"
      case "Conference Room B":
        return "/modern-conference-room.png"
      case "Chemistry Lab 1":
        return "/chemistry-laboratory.jpg"
      case "Tennis Court 1":
        return "/outdoor-tennis-court.png"
      default:
        return resource.image
    }
  }

  // Get the variant based on status
  const getStatusVariant = (status: string) => {
    switch (status) {
      case "available":
        return "outline"
      case "booked":
        return "outline"
      case "maintenance":
        return "outline"
      default:
        return "outline"
    }
  }

  return (
    <>
      <Card className="overflow-hidden flex flex-col h-full transition-all hover:shadow-md">
        <div className="relative">
          <Image
            src={getImagePath(resource.name) || "/placeholder.svg"}
            alt={resource.name}
            width={600}
            height={400}
            className="w-full h-48 object-cover"
          />
          <Badge 
            variant={getStatusVariant(resource.status) as any}
            className={`absolute top-3 right-3 capitalize px-2 py-1 text-xs ${
              resource.status === "available" 
                ? "border-green-200 bg-green-100 text-green-800 hover:bg-green-100"
                : resource.status === "booked"
                  ? "border-red-200 bg-red-100 text-red-800 hover:bg-red-100"
                  : "border-yellow-200 bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
            }`}
          >
            {getStatusText(resource.status)}
          </Badge>
          
          <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/60 to-transparent p-2">
            <Badge variant="outline" className="bg-white/90 text-foreground text-xs hover:bg-white/90">
              {resource.type}
            </Badge>
          </div>
        </div>

        <CardHeader className="pb-2">
          <CardTitle className="text-lg">{resource.name}</CardTitle>
          <CardDescription className="flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3" />
            {resource.location || resource.type + " Area"}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-3 flex-grow">
          <p className="text-sm text-muted-foreground line-clamp-2">{resource.description}</p>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Users className="h-3.5 w-3.5" />
              <span>Capacity: {resource.capacity}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-1 pt-1">
            {resource.amenities && resource.amenities.slice(0, 3).map((amenity, index) => (
              <Badge key={index} variant="outline" className="text-xs py-0 h-5 border-slate-200 hover:border-slate-300 bg-transparent">
                {amenity}
              </Badge>
            ))}
            {resource.amenities && resource.amenities.length > 3 && (
              <Badge variant="outline" className="text-xs py-0 h-5 border-slate-200 hover:border-slate-300 bg-transparent">
                +{resource.amenities.length - 3}
              </Badge>
            )}
          </div>
        </CardContent>
        
        <div className="px-6 pb-6 mt-auto">
          {resource.status === "available" ? (
            <Button
              className="w-full"
              variant="default"
              onClick={() => setShowBookingModal(true)}
            >
              Book Now
            </Button>
          ) : (
            <div className="text-center py-2 text-sm text-muted-foreground">
              Under Maintenance
            </div>
          )}
        </div>
      </Card>

      <BookingModal resource={resource} isOpen={showBookingModal} onClose={() => setShowBookingModal(false)} />
    </>
  )
}
