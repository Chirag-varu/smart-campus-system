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

    if (req.method === 'GET') {
      const { resourceId, date } = req.query
      if (resourceId && date) {
        const items = await bookings.find({ resourceId, date }).project({ timeSlot: 1, _id: 0 }).toArray()
        const slots = items.map(i => i.timeSlot)
        return res.status(200).json({ slots })
      }
      return res.status(400).json({ error: 'Missing resourceId or date' })
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
        createdAt: new Date(),
      })
      return res.status(201).json({ success: true })
    }

    return res.status(405).end()
  } catch (err) {
    return res.status(500).json({ error: 'Server error', details: err })
  }
}


