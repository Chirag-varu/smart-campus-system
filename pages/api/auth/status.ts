export const dynamic = "force-dynamic";

import type { NextApiRequest, NextApiResponse } from 'next'
import clientPromise from '@/lib/mongodb'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).end()

  // Get session token from cookies
  const token = req.cookies.session
  if (!token) {
    return res.status(200).json({ authenticated: false })
  }

  try {
    const client = await clientPromise
    const db = client.db()
    const sessions = db.collection('sessions')
    
    // Find valid session
    const session = await sessions.findOne({ 
      token,
      expiresAt: { $gt: new Date() } // Check if session hasn't expired
    })

    if (!session) {
      return res.status(200).json({ authenticated: false })
    }

    // Get user type
    const users = db.collection('users')
    const user = await users.findOne({ _id: session.userId })
    
    if (!user) {
      return res.status(200).json({ authenticated: false })
    }

    // User is authenticated
    const userType = user.role === 'admin' ? 'admin' : 'student'
    return res.status(200).json({ 
      authenticated: true,
      userType
    })
    
  } catch (error) {
    console.error('Error checking authentication status:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}