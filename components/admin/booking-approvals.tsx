"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
import { useToast } from "@/hooks/use-toast"
import { CheckCircle, XCircle, Clock, Calendar, MapPin, User } from "lucide-react"

interface BookingRequest {
  _id: string
  userId: string
  resourceId: string
  date: string
  timeSlot: string
  status: "pending" | "approved" | "rejected"
  createdAt: string
  reason?: string
}

const mockBookingRequests: BookingRequest[] = []

export function BookingApprovals() {
  const [bookingRequests, setBookingRequests] = useState<BookingRequest[]>(mockBookingRequests)
  const [pendingAction, setPendingAction] = useState<{ id: string, status: "approved" | "rejected" } | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    ;(async () => {
      try {
        const resp = await fetch('/api/admin/bookings')
        if (!resp.ok) return
        const data = await resp.json()
        setBookingRequests(data.bookings || [])
      } catch {}
    })()
  }, [])

  const confirmApproval = (id: string, status: "approved" | "rejected") => {
    setPendingAction({ id, status })
    setIsDialogOpen(true)
  }

  const handleApproval = async () => {
    if (!pendingAction) return

    const { id, status } = pendingAction
    
    try {
      const resp = await fetch('/api/bookings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status })
      })
      if (!resp.ok) {
        toast({ title: 'Error', description: 'Failed to update booking', variant: 'destructive' })
        return
      }
      
      setBookingRequests((prev) => 
        prev.map((request) => (request._id === id ? { ...request, status } : request))
      )

      const action = status === "approved" ? "approved" : "rejected"
      toast({
        title: `Booking ${action}`,
        description: `The booking request has been ${action}.`,
      })
    } catch {
      toast({ title: 'Error', description: 'Failed to update booking', variant: 'destructive' })
    } finally {
      setPendingAction(null)
      setIsDialogOpen(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500"
      case "approved":
        return "bg-green-500"
      case "rejected":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />
      case "approved":
        return <CheckCircle className="h-4 w-4" />
      case "rejected":
        return <XCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const pendingRequests = bookingRequests.filter((req) => req.status === "pending")
  const approvedRequests = bookingRequests.filter((req) => req.status === "approved")
  const rejectedRequests = bookingRequests.filter((req) => req.status === "rejected")

  const BookingCard = ({ request, showActions = false }: { request: BookingRequest; showActions?: boolean }) => (
    <Card className=" ">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="font-semibold text-lg">Resource #{request.resourceId}</h3>
            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" />
                User {request.userId}
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                Booking
              </div>
            </div>
          </div>

          <Badge className={`${getStatusColor(request.status)} text-white border-0 flex items-center gap-1`}>
            {getStatusIcon(request.status)}
            {request.status}
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4" />
            <span>Date: {request.date}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4" />
            <span>Time: {request.timeSlot}</span>
          </div>
        </div>

        <div className="text-xs text-muted-foreground mb-4">Requested on: {request.createdAt}</div>

        {request.reason && (
          <div className="mb-4 p-3 bg-muted/50 rounded-lg">
            <p className="text-sm font-medium mb-1">Reason:</p>
            <p className="text-sm text-muted-foreground">{request.reason}</p>
          </div>
        )}

        {showActions && request.status === "pending" && (
          <div className="flex gap-3">
            <Button
              onClick={() => confirmApproval(request._id, "approved")}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Approve
            </Button>
            <Button
              onClick={() => confirmApproval(request._id, "rejected")}
              variant="outline"
              className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <XCircle className="h-4 w-4 mr-2" />
              Reject
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold gradient-text">Booking Approvals</h1>
        <p className="text-muted-foreground mt-2">Review and manage booking requests from students.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending Requests</p>
                <p className="text-2xl font-bold text-yellow-600">{pendingRequests.length}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Approved Today</p>
                <p className="text-2xl font-bold text-green-600">{approvedRequests.length}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Rejected Today</p>
                <p className="text-2xl font-bold text-red-600">{rejectedRequests.length}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="pending" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pending">Pending ({pendingRequests.length})</TabsTrigger>
          <TabsTrigger value="approved">Approved ({approvedRequests.length})</TabsTrigger>
          <TabsTrigger value="rejected">Rejected ({rejectedRequests.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pending Approvals</CardTitle>
              <CardDescription>Booking requests awaiting your review</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {pendingRequests.length > 0 ? (
                pendingRequests.map((request) => <BookingCard key={request._id} request={request} showActions={true} />)
              ) : (
                <div className="text-center py-8">
                  <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No pending requests</h3>
                  <p className="text-muted-foreground">All booking requests have been reviewed.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="approved" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Approved Bookings</CardTitle>
              <CardDescription>Recently approved booking requests</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {approvedRequests.map((request) => (
                <BookingCard key={request._id} request={request} />
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rejected" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Rejected Bookings</CardTitle>
              <CardDescription>Recently rejected booking requests</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {rejectedRequests.map((request) => (
                <BookingCard key={request._id} request={request} />
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Confirmation Dialog for Approval/Rejection */}
      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {pendingAction?.status === "approved" ? "Approve Booking Request" : "Reject Booking Request"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {pendingAction?.status === "approved" 
                ? "Are you sure you want to approve this booking request? This will confirm the reservation for the student."
                : "Are you sure you want to reject this booking request? The student will be notified that their request was denied."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleApproval} 
              className={pendingAction?.status === "approved" ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"}
            >
              {pendingAction?.status === "approved" ? "Approve" : "Reject"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
