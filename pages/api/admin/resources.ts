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
  try {
    const client = await clientPromise
    const db = client.db()
    const sessions = db.collection('sessions')
    const users = db.collection('users')
    const resources = db.collection('resources')
    const { ObjectId } = require('mongodb')

    const cookies = parseCookies(req.headers.cookie)
    const token = cookies.session
    if (!token) return res.status(401).json({ error: 'Not authenticated' })
    const session = await sessions.findOne({ token, expiresAt: { $gt: new Date() } })
    if (!session) return res.status(401).json({ error: 'Not authenticated' })
    const me = await users.findOne({ _id: session.userId })
    if (!me || me.role !== 'admin') return res.status(403).json({ error: 'Forbidden' })

    if (req.method === 'GET') {
      const list = await resources.find({}).sort({ createdAt: -1 }).toArray()
      return res.status(200).json({ resources: list })
    }

    if (req.method === 'POST') {
      const { name, type, capacity, status = 'active', description = '', amenities = [], location = '' } = req.body
      if (!name || !type || !capacity) return res.status(400).json({ error: 'Missing fields' })
      const doc = { name, type, capacity: Number(capacity), status, description, amenities, location, bookings: 0, createdAt: new Date() }
      const result = await resources.insertOne(doc)
      return res.status(201).json({ id: result.insertedId, resource: { _id: result.insertedId, ...doc } })
    }

    if (req.method === 'PATCH') {
      const { id, ...updates } = req.body
      if (!id) return res.status(400).json({ error: 'Missing id' })
      const _id = new ObjectId(id)
      await resources.updateOne({ _id }, { $set: { ...updates, updatedAt: new Date() } })
      return res.status(200).json({ success: true })
    }

    if (req.method === 'DELETE') {
      const { id } = req.query
      if (!id || typeof id !== 'string') return res.status(400).json({ error: 'Missing id' })
      const _id = new ObjectId(id)
      await resources.deleteOne({ _id })
      return res.status(200).json({ success: true })
    }

    return res.status(405).end()
  } catch (err) {
    return res.status(500).json({ error: 'Server error', details: err })
  }
}


