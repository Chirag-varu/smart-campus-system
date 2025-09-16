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
    const bookings = db.collection('bookings')
    const resources = db.collection('resources')

    const cookies = parseCookies(req.headers.cookie)
    const token = cookies.session
    if (!token) return res.status(401).json({ error: 'Not authenticated' })
    const session = await sessions.findOne({ token, expiresAt: { $gt: new Date() } })
    if (!session) return res.status(401).json({ error: 'Not authenticated' })
    const me = await users.findOne({ _id: session.userId })
    if (!me || me.role !== 'admin') return res.status(403).json({ error: 'Forbidden' })

    const [usersCount, bookingsCount, resourcesCount, pendingBookings] = await Promise.all([
      users.countDocuments(),
      bookings.countDocuments(),
      resources.countDocuments(),
      bookings.countDocuments({ status: 'pending' }),
    ])

    return res.status(200).json({ usersCount, bookingsCount, resourcesCount, pendingBookings })
  } catch (err) {
    return res.status(500).json({ error: 'Server error', details: err })
  }
}


