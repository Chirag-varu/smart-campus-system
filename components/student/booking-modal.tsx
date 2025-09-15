"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Clock, CalendarIcon, Users, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface Resource {
  id?: number
  _id?: string
  name: string
  type: string
  capacity: number
  status: string
  description: string
  amenities: string[]
  image: string
}

interface BookingModalProps {
  resource: Resource
  isOpen: boolean
  onClose: () => void
}

const timeSlots = [
  "9:00 AM - 10:00 AM",
  "10:00 AM - 11:00 AM",
  "11:00 AM - 12:00 PM",
  "12:00 PM - 1:00 PM",
  "1:00 PM - 2:00 PM",
  "2:00 PM - 3:00 PM",
  "3:00 PM - 4:00 PM",
  "4:00 PM - 5:00 PM",
  "5:00 PM - 6:00 PM",
]

const mockBookedSlots = {
  "2024-01-15": ["10:00 AM - 11:00 AM", "2:00 PM - 3:00 PM"],
  "2024-01-16": ["9:00 AM - 10:00 AM", "1:00 PM - 2:00 PM"],
  "2024-01-17": ["11:00 AM - 12:00 PM"],
}

export function BookingModal({ resource, isOpen, onClose }: BookingModalProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const [bookedSlots, setBookedSlots] = useState<string[]>([])
  const { toast } = useToast()

  useEffect(() => {
    if (!selectedDate) return
    const load = async () => {
      const dateKey = selectedDate.toISOString().split('T')[0]
      const resourceId = (resource._id || resource.id)?.toString()
      if (!resourceId) return
      try {
        const resp = await fetch(`/api/bookings?resourceId=${encodeURIComponent(resourceId)}&date=${encodeURIComponent(dateKey)}`)
        if (!resp.ok) return setBookedSlots([])
        const data = await resp.json()
        setBookedSlots(data.slots || [])
      } catch {
        setBookedSlots([])
      }
      setSelectedTimeSlot("")
    }
    load()
  }, [selectedDate, resource])

  const handleBooking = async () => {
    if (!selectedDate || !selectedTimeSlot) {
      toast({
        title: "Error",
        description: "Please select both date and time slot",
        variant: "destructive",
      })
      return
    }

    if (bookedSlots.includes(selectedTimeSlot)) {
      toast({
        title: "Slot Unavailable",
        description: "This time slot is already booked. Please select another slot.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const dateKey = selectedDate.toISOString().split('T')[0]
      const resourceId = (resource._id || resource.id)?.toString()
      const resp = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resourceId, date: dateKey, timeSlot: selectedTimeSlot })
      })
      setIsLoading(false)
      if (!resp.ok) {
        toast({ title: 'Error', description: 'Failed to book slot', variant: 'destructive' })
        return
      }
      toast({ title: 'Booking Successful!', description: `${resource.name} has been booked for ${selectedTimeSlot}` })
      setBookedSlots((prev) => [...prev, selectedTimeSlot])
      onClose()
    } catch (e) {
      setIsLoading(false)
      toast({ title: 'Error', description: 'Failed to book slot', variant: 'destructive' })
    }
  }

  const isSlotBooked = (slot: string) => bookedSlots.includes(slot)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-gray-900 dark:text-[var(--sc-text-white)]">
            <CalendarIcon className="h-5 w-5" />
            Book {resource.name}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">Select your preferred date and time slot for booking.</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Calendar */}
          <div>
            <h3 className="font-medium mb-3">Select Date</h3>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              disabled={(date) => date < new Date() || date < new Date("1900-01-01")}
              className="rounded-md border"
            />

            {selectedDate && (
              <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2 text-sm">
                  <Users className="h-4 w-4" />
                  <span>Capacity: {resource.capacity} people</span>
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  {bookedSlots.length > 0 ? `${bookedSlots.length} slots already booked` : "All slots available"}
                </div>
              </div>
            )}
          </div>

          {/* Time Slots */}
          <div>
            <h3 className="font-medium mb-3">Available Time Slots</h3>
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {timeSlots.map((slot) => {
                const isBooked = isSlotBooked(slot)
                const isSelected = selectedTimeSlot === slot

                return (
                  <Button
                    key={slot}
                    variant={isSelected ? "default" : "outline"}
                    className={`w-full justify-start relative ${
                      isSelected ? "gradient-primary text-white" : ""
                    } ${isBooked ? "opacity-50 cursor-not-allowed" : ""}`}
                    onClick={() => !isBooked && setSelectedTimeSlot(slot)}
                    disabled={isBooked}
                  >
                    <Clock className="h-4 w-4 mr-2" />
                    {slot}
                    {isBooked && (
                      <Badge variant="destructive" className="ml-auto text-xs">
                        Booked
                      </Badge>
                    )}
                  </Button>
                )
              })}
            </div>

            {bookedSlots.length > 0 && (
              <Alert className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-sm">
                  Some time slots are already booked. Please select an available slot.
                </AlertDescription>
              </Alert>
            )}
          </div>
        </div>

        {/* Resource Details */}
        <div className="border-t pt-4">
          <h3 className="font-medium mb-2">Resource Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
            <div>
              <div className="flex flex-wrap gap-2">
                {resource.amenities.map((amenity, index) => (
                  <Badge key={index} variant="secondary">
                    {amenity}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>Maximum capacity: {resource.capacity} people</span>
              </div>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">{resource.description}</p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <Button variant="outline" onClick={onClose} className="flex-1 bg-transparent">
            Cancel
          </Button>
          <Button
            onClick={handleBooking}
            disabled={isLoading || !selectedDate || !selectedTimeSlot || isSlotBooked(selectedTimeSlot)}
            className="flex-1 gradient-primary   text-white"
          >
            {isLoading ? "Booking..." : "Confirm Booking"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
