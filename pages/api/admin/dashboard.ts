export const dynamic = "force-dynamic";

import type { NextApiRequest, NextApiResponse } from 'next'
import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

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

    // Get statistics
    const totalUsers = await users.countDocuments()
    const totalResources = await resources.countDocuments()
    
    // Calculate active bookings (current date or future)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const activeBookings = await bookings.countDocuments({ 
      date: { $gte: today.toISOString().split('T')[0] },
      status: { $in: ['pending', 'approved'] }
    })
    
    // Get pending approvals count
    const pendingApprovals = await bookings.countDocuments({ status: 'pending' })

    // Recent activity
    const recentActivity = await bookings.aggregate([
      { $match: { createdAt: { $exists: true } } },
      { $sort: { createdAt: -1 } },
      { $limit: 10 },
      { $lookup: {
        from: 'resources',
        localField: 'resourceId',
        foreignField: '_id',
        as: 'resourceData'
      }},
      { $lookup: {
        from: 'users',
        localField: 'userId',
        foreignField: '_id',
        as: 'userData'
      }},
      { $project: {
        _id: 1,
        status: 1,
        date: 1,
        timeSlot: 1,
        createdAt: 1,
        'resourceData.name': 1,
        'userData.firstName': 1,
        'userData.lastName': 1,
        'userData.studentName': 1,
        'userData.email': 1
      }}
    ]).toArray()

    // Format activity data
    const formattedActivity = recentActivity.map(item => {
      const resourceName = item.resourceData && item.resourceData[0] ? item.resourceData[0].name : 'Unknown Resource'
      const userData = item.userData && item.userData[0] ? item.userData[0] : null
      const userName = userData ? 
        userData.studentName || 
        (userData.firstName || userData.lastName ? `${userData.firstName || ''} ${userData.lastName || ''}`.trim() : userData.email.split('@')[0]) 
        : 'Unknown User'

      let action = 'Booking'
      if (item.status === 'approved') action = 'Booking approved'
      else if (item.status === 'rejected') action = 'Booking rejected'
      else if (item.status === 'pending') action = 'New booking request'

      const createdAt = item.createdAt ? new Date(item.createdAt) : new Date()
      const now = new Date()
      const diffInMinutes = Math.round((now.getTime() - createdAt.getTime()) / (1000 * 60))
      
      let timeAgo
      if (diffInMinutes < 60) {
        timeAgo = `${diffInMinutes} minutes ago`
      } else if (diffInMinutes < 24 * 60) {
        timeAgo = `${Math.round(diffInMinutes / 60)} hours ago`
      } else {
        timeAgo = `${Math.round(diffInMinutes / (60 * 24))} days ago`
      }

      return {
        id: item._id,
        action,
        resource: resourceName,
        user: userName,
        time: timeAgo,
        date: item.date,
        timeSlot: item.timeSlot,
        type: 'booking'
      }
    })

    // Get upcoming tasks (Next 5 pending bookings)
    const upcomingTasks = await bookings.aggregate([
      { $match: { status: 'pending' } },
      { $sort: { date: 1, timeSlot: 1 } },
      { $limit: 5 },
      { $project: {
        _id: 1,
        date: 1,
        timeSlot: 1,
        resourceId: 1,
      }}
    ]).toArray()

    const formattedTasks = upcomingTasks.map(task => {
      // Calculate priority based on date proximity
      const today = new Date()
      const taskDate = new Date(task.date)
      const diffDays = Math.round((taskDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
      
      let priority = 'medium'
      let dueDate = task.date
      
      if (diffDays <= 0) {
        priority = 'high'
        dueDate = 'Today'
      } else if (diffDays === 1) {
        priority = 'medium'
        dueDate = 'Tomorrow'
      } else if (diffDays < 7) {
        priority = 'low'
        dueDate = 'This week'
      }
      
      return {
        id: task._id,
        task: `Review booking request for ${task.timeSlot}`,
        priority,
        dueDate
      }
    })

    // Return all data
    return res.status(200).json({
      stats: {
        totalResources,
        activeBookings,
        totalUsers,
        pendingApprovals
      },
      recentActivity: formattedActivity,
      upcomingTasks: formattedTasks
    })
  } catch (err) {
    console.error('Dashboard API error:', err)
    return res.status(500).json({ error: 'Server error', details: err })
  }
}