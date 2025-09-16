export const dynamic = "force-dynamic";

import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

function parseCookies(cookieHeader: string | undefined) {
  const header = cookieHeader || '';
  const entries = header.split(';').map(p => p.trim()).filter(Boolean).map(p => {
    const idx = p.indexOf('=');
    if (idx === -1) return [p, ''];
    return [p.slice(0, idx), decodeURIComponent(p.slice(idx + 1))];
  });
  return Object.fromEntries(entries) as Record<string, string>;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const cookies = parseCookies(req.headers.cookie);
  const token = cookies.session;
  if (!token) return res.status(401).json({ error: 'Not authenticated' });

  const client = await clientPromise;
  const db = client.db();
  const sessions = db.collection('sessions');
  const users = db.collection('users');

  const session = await sessions.findOne({ token, expiresAt: { $gt: new Date() } });
  if (!session) return res.status(401).json({ error: 'Not authenticated' });

  const userId = session.userId;

  if (req.method === 'GET') {
    // Fetch user profile
    const user = await users.findOne({ _id: userId });
    if (!user) return res.status(404).json({ error: 'User not found' });
    // Compose name from studentName, or firstName + lastName fallback
    let name = user.studentName;
    if (!name && (user.firstName || user.lastName)) {
      name = [user.firstName, user.lastName].filter(Boolean).join(' ');
    }
    return res.status(200).json({
      user: {
        name,
        email: user.email,
        rollNo: user.sapId,
        joinDate: user.createdAt ? user.createdAt.toISOString().slice(0, 10) : '',
        phone: user.phone || '',
        department: user.department || '',
      },
    });
  } else if (req.method === 'PUT') {
    // Update user profile
    const { name, email, rollNo, phone, department } = req.body;
    const update = {
      studentName: name,
      email,
      sapId: rollNo,
      phone,
      department,
    };
    await users.updateOne({ _id: userId }, { $set: update });
    return res.status(200).json({ message: 'Profile updated' });
  } else {
    return res.status(405).end();
  }
}
