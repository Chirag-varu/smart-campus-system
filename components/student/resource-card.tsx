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

  return (
    <>
      <Card className="overflow-hidden  ">
        <div className="relative">
          <Image
            src={getImagePath(resource.name) || "/placeholder.svg"}
            alt={resource.name}
            width={300}
            height={200}
            className="w-full h-48 object-cover"
          />
          <Badge className={`absolute top-2 right-2 ${getStatusColor(resource.status)} text-white border-0`}>
            {getStatusText(resource.status)}
          </Badge>
        </div>

        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-lg">{resource.name}</CardTitle>
              <CardDescription className="flex items-center gap-1 mt-1">
                <MapPin className="h-4 w-4" />
                {resource.type}
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">{resource.description}</p>

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>Capacity: {resource.capacity}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-1">
            {resource.amenities.map((amenity, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {amenity}
              </Badge>
            ))}
          </div>

          <Button
            className="w-full gradient-primary   text-white"
            disabled={resource.status !== "available"}
            onClick={() => setShowBookingModal(true)}
          >
            {resource.status === "available"
              ? "Book Now"
              : resource.status === "booked"
                ? "Currently Booked"
                : "Under Maintenance"}
          </Button>
        </CardContent>
      </Card>

      <BookingModal resource={resource} isOpen={showBookingModal} onClose={() => setShowBookingModal(false)} />
    </>
  )
}
