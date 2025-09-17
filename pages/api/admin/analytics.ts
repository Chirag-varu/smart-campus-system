export const dynamic = "force-dynamic";

import type { NextApiRequest, NextApiResponse } from 'next'
import clientPromise from '@/lib/mongodb'

function parseCookies(cookieHeader?: string) {
  const header = cookieHeader || ''
  const entries = header.split(';').map(p => p.trim()).filter(Boolean).map(p => {
    const idx = p.indexOf('=')
    if (idx === -1) return [p, '']
    return [p.slice(0, idx), decodeURIComponent(p.slice(idx + 1))]
  })
  return Object.fromEntries(entries) as Record<string, string>
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).end()

  try {
    const client = await clientPromise
    const db = client.db()
    const sessions = db.collection('sessions')
    const users = db.collection('users')
    const resources = db.collection('resources')
    const bookings = db.collection('bookings')

    const cookies = parseCookies(req.headers.cookie)
    const token = cookies.session
    if (!token) return res.status(401).json({ error: 'Not authenticated' })
    
    const session = await sessions.findOne({ token, expiresAt: { $gt: new Date() } })
    if (!session) return res.status(401).json({ error: 'Not authenticated' })
    
    const me = await users.findOne({ _id: session.userId })
    if (!me || me.role !== 'admin') return res.status(403).json({ error: 'Forbidden' })

    // Get timeRange parameter (default: 7d)
    const timeRange = req.query.timeRange as string || '7d'
    
    // Get all resources
    const allResources = await resources.find().toArray()
    
    // Calculate resource usage data
    const resourceUsagePromises = allResources.map(async resource => {
      const bookingsCount = await bookings.countDocuments({ resourceId: resource._id, status: 'approved' })
      
      return {
        name: resource.name,
        bookings: bookingsCount,
        capacity: resource.capacity || 0,
        utilization: resource.capacity ? Math.round((bookingsCount / resource.capacity) * 100) : 0
      }
    })
    
    const resourceUsageData = await Promise.all(resourceUsagePromises)
    
    // Generate peak hours data (mock for now, would need actual time-based booking data)
    const peakHoursData = [
      { hour: "8 AM", bookings: await bookings.countDocuments({ timeSlot: { $regex: /^08:/ } }) },
      { hour: "9 AM", bookings: await bookings.countDocuments({ timeSlot: { $regex: /^09:/ } }) },
      { hour: "10 AM", bookings: await bookings.countDocuments({ timeSlot: { $regex: /^10:/ } }) },
      { hour: "11 AM", bookings: await bookings.countDocuments({ timeSlot: { $regex: /^11:/ } }) },
      { hour: "12 PM", bookings: await bookings.countDocuments({ timeSlot: { $regex: /^12:/ } }) },
      { hour: "1 PM", bookings: await bookings.countDocuments({ timeSlot: { $regex: /^13:/ } }) },
      { hour: "2 PM", bookings: await bookings.countDocuments({ timeSlot: { $regex: /^14:/ } }) },
      { hour: "3 PM", bookings: await bookings.countDocuments({ timeSlot: { $regex: /^15:/ } }) },
      { hour: "4 PM", bookings: await bookings.countDocuments({ timeSlot: { $regex: /^16:/ } }) },
      { hour: "5 PM", bookings: await bookings.countDocuments({ timeSlot: { $regex: /^17:/ } }) },
      { hour: "6 PM", bookings: await bookings.countDocuments({ timeSlot: { $regex: /^18:/ } }) },
      { hour: "7 PM", bookings: await bookings.countDocuments({ timeSlot: { $regex: /^19:/ } }) },
    ]
    
    // Get resource types from all resources
    const resourceTypes = [...new Set(allResources.map(r => r.type))]
    
    // Calculate booking trends by resource type
    const bookingTrendsPromises = resourceTypes.map(async (type, index) => {
      const typeResources = allResources.filter(r => r.type === type).map(r => r._id)
      const count = await bookings.countDocuments({ 
        resourceId: { $in: typeResources },
        status: 'approved'
      })
      
      return {
        name: type || 'Other',
        value: count,
        color: `hsl(var(--chart-${(index % 4) + 1}))`
      }
    })
    
    const bookingTrendsData = await Promise.all(bookingTrendsPromises)
    
    // Generate weekly trend data
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    const today = new Date()
    
    const weeklyTrendPromises = days.map(async (day, index) => {
      const date = new Date()
      date.setDate(today.getDate() - (today.getDay() - index + 7) % 7)
      const dateString = date.toISOString().split('T')[0]
      
      const approvedCount = await bookings.countDocuments({
        date: dateString,
        status: 'approved'
      })
      
      const cancelledCount = await bookings.countDocuments({
        date: dateString,
        status: 'rejected'
      })
      
      return {
        day,
        bookings: approvedCount,
        cancellations: cancelledCount
      }
    })
    
    const weeklyTrendData = await Promise.all(weeklyTrendPromises)
    
    // Calculate overall statistics
    const totalBookings = await bookings.countDocuments({ status: 'approved' })
    
    // Calculate average utilization
    const totalUtilization = resourceUsageData.reduce((sum, item) => sum + item.utilization, 0)
    const averageUtilization = resourceUsageData.length > 0 
      ? (totalUtilization / resourceUsageData.length).toFixed(1) 
      : "0.0"
    
    // Find peak hour
    const peakHour = [...peakHoursData].sort((a, b) => b.bookings - a.bookings)[0]
    
    // Count active resources
    const activeResourcesCount = await resources.countDocuments({ status: 'active' })
    
    // Return analytics data
    return res.status(200).json({
      resourceUsageData,
      peakHoursData,
      bookingTrendsData,
      weeklyTrendData,
      stats: {
        totalBookings,
        averageUtilization,
        peakHour: peakHour?.hour || "N/A",
        peakHourBookings: peakHour?.bookings || 0,
        activeResourcesCount
      }
    })
  } catch (err) {
    console.error('Analytics API error:', err)
    return res.status(500).json({ error: 'Server error', details: err })
  }
}