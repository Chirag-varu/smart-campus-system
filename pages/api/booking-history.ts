import type { NextApiRequest, NextApiResponse } from 'next'
import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

function parseCookies(cookieHeader: string | undefined) {
  const header = cookieHeader || ''
  const entries = header.split(';').map(p => p.trim()).filter(Boolean).map(p => {
    const idx = p.indexOf('=')
    if (idx === -1) return [p, '']
    return [p.slice(0, idx), decodeURIComponent(p.slice(idx + 1))]
  })
  return Object.fromEntries(entries) as Record<string, string>
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const client = await clientPromise
    const db = client.db()
    const sessions = db.collection('sessions')
    const bookings = db.collection('bookings')
    const resources = db.collection('resources')
    
    // Validate authentication
    const cookies = parseCookies(req.headers.cookie)
    const token = cookies.session
    if (!token) return res.status(401).json({ error: 'Not authenticated' })
    const session = await sessions.findOne({ token, expiresAt: { $gt: new Date() } })
    if (!session) return res.status(401).json({ error: 'Not authenticated' })
    
    if (req.method === 'GET') {
      const userId = session.userId
      const today = new Date()
      today.setHours(0, 0, 0, 0) // Set to start of day for accurate comparison
      
      // Get all bookings for the user
      const userBookings = await bookings.find({ 
        userId: new ObjectId(userId.toString()) 
      }).toArray()
      
      // Populate resource details for each booking
      const enrichedBookings = await Promise.all(userBookings.map(async (booking) => {
        const resource = await resources.findOne({ _id: new ObjectId(booking.resourceId.toString()) })
        const bookingDate = new Date(booking.date)
        
        // Format date to match the expected format in the UI
        const formattedDate = booking.date
        
        return {
          id: booking._id.toString(),
          resource: resource?.name || 'Unknown Resource',
          date: formattedDate,
          time: booking.timeSlot,
          status: booking.status,
          type: resource?.type || 'Unknown',
          createdAt: booking.createdAt
        }
      }))
      
      // Split bookings into upcoming and past based on date
      const upcoming = []
      const past = []
      
      for (const booking of enrichedBookings) {
        const [year, month, day] = booking.date.split('-').map(Number)
        const bookingDate = new Date(year, month - 1, day) // Month is 0-indexed in JS Date
        
        if (bookingDate >= today) {
          upcoming.push(booking)
        } else {
          past.push(booking)
        }
      }
      
      // Sort upcoming by date (ascending)
      upcoming.sort((a, b) => {
        const dateA = new Date(a.date)
        const dateB = new Date(b.date)
        return dateA.getTime() - dateB.getTime()
      })
      
      // Sort past by date (descending)
      past.sort((a, b) => {
        const dateA = new Date(a.date)
        const dateB = new Date(b.date)
        return dateB.getTime() - dateA.getTime()
      })
      
      return res.status(200).json({ upcoming, past })
    }
    
    if (req.method === 'DELETE') {
      const { bookingId } = req.query
      
      if (!bookingId) {
        return res.status(400).json({ error: 'Missing bookingId parameter' })
      }
      
      // Verify the booking belongs to the user
      const booking = await bookings.findOne({ 
        _id: new ObjectId(bookingId as string),
        userId: new ObjectId(session.userId.toString())
      })
      
      if (!booking) {
        return res.status(404).json({ error: 'Booking not found or not authorized' })
      }
      
      // For safety, don't allow cancellation of past bookings
      const bookingDate = new Date(booking.date)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      
      if (bookingDate < today) {
        return res.status(400).json({ error: 'Cannot cancel past bookings' })
      }
      
      // Update the booking status to 'cancelled'
      await bookings.updateOne(
        { _id: new ObjectId(bookingId as string) },
        { $set: { status: 'cancelled', updatedAt: new Date() } }
      )
      
      return res.status(200).json({ success: true })
    }
    
    return res.status(405).json({ error: 'Method not allowed' })
  } catch (err: any) {
    console.error('API Error:', err)
    return res.status(500).json({ error: 'Server error', message: err.message })
  }
}