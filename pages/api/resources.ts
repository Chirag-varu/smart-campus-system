export const dynamic = "force-dynamic";

import type { NextApiRequest, NextApiResponse } from 'next'
import clientPromise from '@/lib/mongodb'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).end()

  try {
    const client = await clientPromise
    const db = client.db()
    const resources = db.collection('resources')
    const items = await resources.find({}).toArray()
    return res.status(200).json({ resources: items })
  } catch (err) {
    return res.status(500).json({ error: 'Server error', details: err })
  }
}


