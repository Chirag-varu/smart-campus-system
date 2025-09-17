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
    const sessions = db.collection('sessions');
    
    const record = await otps.findOne({ email, otp });
    if (!record) return res.status(401).json({ error: 'Invalid OTP' });

    // Get the user
    const user = await users.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Mark user as verified
    await users.updateOne({ email }, { $set: { verified: true } });
    
    // Remove OTP after use
    await otps.deleteMany({ email });
    
    // Create a session for the user so they're automatically logged in
    const crypto = require('crypto');
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7); // 7 days
    
    await sessions.insertOne({ 
      token, 
      userId: user._id, 
      createdAt: new Date(), 
      expiresAt 
    });

    // Determine user type (admin or student)
    const userType = user.role === 'admin' ? 'admin' : 'student';
    const maxAge = 60 * 60 * 24 * 7; // 7 days in seconds

    // Set cookies
    const sessionCookie = `session=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`;
    const userTypeCookie = `userType=${userType}; Path=/; SameSite=Lax; Max-Age=${maxAge}${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`;
    
    res.setHeader('Set-Cookie', [sessionCookie, userTypeCookie]);
    res.status(200).json({ success: true, redirect: `/${userType}/dashboard` });
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err });
  }
}
