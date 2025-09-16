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

    const list = await bookings.find({}).sort({ createdAt: -1 }).toArray()
    const userIds = Array.from(new Set(list.map(b => String(b.userId))))
    const resourceIds = Array.from(new Set(list.map(b => String(b.resourceId))))
    const { ObjectId } = require('mongodb')
    const usersMap = new Map(
      (await users.find({ _id: { $in: userIds.map((id: string) => new ObjectId(id)) } }).project({ password: 0 }).toArray())
        .map((u: any) => [String(u._id), u])
    )
    const resourcesMap = new Map(
      (await resources.find({ _id: { $in: resourceIds.map((id: string) => new ObjectId(id)) } }).toArray())
        .map((r: any) => [String(r._id), r])
    )

    const enriched = list.map((b: any) => ({
      ...b,
      user: usersMap.get(String(b.userId)) || null,
      resource: resourcesMap.get(String(b.resourceId)) || null,
    }))

    return res.status(200).json({ bookings: enriched })
  } catch (err) {
    return res.status(500).json({ error: 'Server error', details: err })
  }
}


