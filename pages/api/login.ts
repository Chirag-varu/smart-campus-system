import type { NextApiRequest, NextApiResponse } from 'next'
import clientPromise from '@/lib/mongodb'
import crypto from 'crypto'
import bcrypt from 'bcryptjs'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()

  const { email, password } = req.body
  if (!email || !password) return res.status(400).json({ error: 'Missing email or password' })

  try {
    const client = await clientPromise
    const db = client.db()
    const users = db.collection('users')
    const sessions = db.collection('sessions')

    const user = await users.findOne({ email })
    if (!user) return res.status(401).json({ error: 'Invalid credentials' })

    // NOTE: Passwords are stored in plain text in current starter
    const ok = await bcrypt.compare(password, user.password)
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' })
    if (!user.verified) return res.status(403).json({ error: 'Email not verified' })

    // Create session token
    const token = crypto.randomBytes(32).toString('hex')
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7) // 7 days
    await sessions.insertOne({ token, userId: user._id, createdAt: new Date(), expiresAt })

    const cookie = `session=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${60 * 60 * 24 * 7}${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`
    res.setHeader('Set-Cookie', cookie)

  // Support both studentName and firstName/lastName for compatibility
  let firstName = user.firstName || (user.studentName ? user.studentName.split(' ')[0] : '')
  let lastName = user.lastName || (user.studentName ? user.studentName.split(' ').slice(1).join(' ') : '')
  return res.status(200).json({ success: true, user: { email: user.email, firstName, lastName } })
  } catch (err) {
    console.log('====================================');
    console.log(err);
    console.log('====================================');
    return res.status(500).json({ error: 'Server error', details: err })
  }
}


