import type { NextApiRequest, NextApiResponse } from 'next'
import clientPromise from '@/lib/mongodb'

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
    const users = db.collection('users')

    if (req.method === 'GET') {
      const { resourceId, date, mine } = req.query
      if (resourceId && date) {
        const items = await bookings.find({ resourceId, date, status: { $ne: 'rejected' } }).project({ timeSlot: 1, _id: 0 }).toArray()
        const slots = items.map(i => i.timeSlot)
        return res.status(200).json({ slots })
      }
      if (mine === 'true') {
        const cookies = parseCookies(req.headers.cookie)
        const token = cookies.session
        if (!token) return res.status(401).json({ error: 'Not authenticated' })
        const session = await sessions.findOne({ token, expiresAt: { $gt: new Date() } })
        if (!session) return res.status(401).json({ error: 'Not authenticated' })
        const items = await bookings.find({ userId: session.userId }).sort({ createdAt: -1 }).toArray()
        return res.status(200).json({ bookings: items })
      }
      // Admin list (all)
      const items = await bookings.find({}).sort({ createdAt: -1 }).toArray()
      return res.status(200).json({ bookings: items })
    }

    if (req.method === 'POST') {
      const cookies = parseCookies(req.headers.cookie)
      const token = cookies.session
      if (!token) return res.status(401).json({ error: 'Not authenticated' })
      const session = await sessions.findOne({ token, expiresAt: { $gt: new Date() } })
      if (!session) return res.status(401).json({ error: 'Not authenticated' })

      const { resourceId, date, timeSlot } = req.body
      if (!resourceId || !date || !timeSlot) return res.status(400).json({ error: 'Missing fields' })

      const existing = await bookings.findOne({ resourceId, date, timeSlot })
      if (existing) return res.status(409).json({ error: 'Time slot already booked' })

      await bookings.insertOne({
        userId: session.userId,
        resourceId,
        date,
        timeSlot,
        status: 'pending',
        createdAt: new Date(),
      })
      return res.status(201).json({ success: true })
    }

    if (req.method === 'PATCH') {
      const cookies = parseCookies(req.headers.cookie)
      const token = cookies.session
      if (!token) return res.status(401).json({ error: 'Not authenticated' })
      const session = await sessions.findOne({ token, expiresAt: { $gt: new Date() } })
      if (!session) return res.status(401).json({ error: 'Not authenticated' })

      // Admin guard
      const user = await users.findOne({ _id: session.userId })
      if (!user || user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' })
      const { id, status } = req.body as { id?: string; status?: 'approved' | 'rejected' }
      if (!id || !status) return res.status(400).json({ error: 'Missing id or status' })

      const { ObjectId } = require('mongodb')
      const _id = new ObjectId(id)
      await bookings.updateOne({ _id }, { $set: { status, updatedAt: new Date() } })
      return res.status(200).json({ success: true })
    }

    return res.status(405).end()
  } catch (err) {
    return res.status(500).json({ error: 'Server error', details: err })
  }
}


