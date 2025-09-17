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

    // Get user's bookings
    const bookings = db.collection('bookings');
    const resources = db.collection('resources');
    
    // Total bookings count
    const totalBookings = await bookings.countDocuments({ userId: userId.toString() });
    
    // Calculate total hours booked
    const userBookings = await bookings.find({ userId: userId.toString() }).toArray();
    let totalHours = 0;
    userBookings.forEach(booking => {
      // Assuming timeSlot is in format "13:00-15:00"
      if (booking.timeSlot && typeof booking.timeSlot === 'string') {
        const times = booking.timeSlot.split('-');
        if (times.length === 2) {
          const startHour = parseInt(times[0].split(':')[0]);
          const endHour = parseInt(times[1].split(':')[0]);
          if (!isNaN(startHour) && !isNaN(endHour)) {
            totalHours += (endHour - startHour);
          }
        }
      }
    });
    
    // Find favorite resource (most booked)
    const resourceCounts: Record<string, number> = {};
    userBookings.forEach(booking => {
      const resourceId = booking.resourceId?.toString();
      if (resourceId) {
        resourceCounts[resourceId] = (resourceCounts[resourceId] || 0) + 1;
      }
    });
    
    let favoriteResourceName = "None";
    if (Object.keys(resourceCounts).length > 0) {
      const favoriteResourceId = Object.entries(resourceCounts)
        .sort((a, b) => b[1] - a[1])[0][0];
      
      try {
        // Convert string ID to ObjectId
        const objectId = new ObjectId(favoriteResourceId);
        const favoriteResource = await resources.findOne({ _id: objectId });
        
        if (favoriteResource && favoriteResource.name) {
          favoriteResourceName = favoriteResource.name;
        }
      } catch (error) {
        console.error("Error fetching favorite resource:", error);
      }
    }
    
    // Calculate member since year
    const memberSince = user.createdAt 
      ? new Date(user.createdAt).getFullYear().toString() 
      : new Date().getFullYear().toString();
    
    return res.status(200).json({
      user: {
        name,
        email: user.email,
        rollNo: user.sapId,
        joinDate: user.createdAt ? user.createdAt.toISOString().slice(0, 10) : '',
        phone: user.phone || '',
        department: user.department || '',
        stats: {
          totalBookings,
          totalHours,
          favoriteResource: favoriteResourceName,
          memberSince
        }
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
