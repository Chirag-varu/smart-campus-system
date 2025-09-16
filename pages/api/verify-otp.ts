export const dynamic = "force-dynamic";

import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '@/lib/mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  const { email, otp } = req.body;
  if (!email || !otp) return res.status(400).json({ error: 'Missing required fields' });

  try {
    const client = await clientPromise;
    const db = client.db();
    const otps = db.collection('otps');
    const users = db.collection('users');
    const record = await otps.findOne({ email, otp });
    if (!record) return res.status(401).json({ error: 'Invalid OTP' });

    // Mark user as verified
    await users.updateOne({ email }, { $set: { verified: true } });
    // Remove OTP after use
    await otps.deleteMany({ email });

    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err });
  }
}
