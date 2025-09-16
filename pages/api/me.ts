export const dynamic = "force-dynamic";

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
  if (req.method !== 'GET') return res.status(405).end()
  try {
    const cookies = parseCookies(req.headers.cookie)
    const token = cookies.session
    if (!token) return res.status(401).json({ error: 'Not authenticated' })

    const client = await clientPromise
    const db = client.db()
    const sessions = db.collection('sessions')
    const users = db.collection('users')

    const session = await sessions.findOne({ token, expiresAt: { $gt: new Date() } })
    if (!session) return res.status(401).json({ error: 'Not authenticated' })

    const user = await users.findOne({ _id: session.userId })
    if (!user) return res.status(401).json({ error: 'Not authenticated' })

    return res.status(200).json({ user: { email: user.email, firstName: user.firstName, lastName: user.lastName, role: user.role || 'student' } })
  } catch (err) {
    return res.status(500).json({ error: 'Server error', details: err })
  }
}


