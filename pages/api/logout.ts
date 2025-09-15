import type { NextApiRequest, NextApiResponse } from 'next'
import clientPromise from '@/lib/mongodb'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()

  try {
    const cookieHeader = req.headers.cookie || ''
    const cookies = Object.fromEntries(cookieHeader.split(';').map(c => c.trim().split('='))) as any
    const token = cookies.session

    if (token) {
      const client = await clientPromise
      const db = client.db()
      const sessions = db.collection('sessions')
      await sessions.deleteOne({ token })
    }

    res.setHeader('Set-Cookie', `session=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`)
    return res.status(200).json({ success: true })
  } catch (err) {
    return res.status(500).json({ error: 'Server error', details: err })
  }
}


