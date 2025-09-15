import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '@/lib/mongodb';
import nodemailer from 'nodemailer';
import bcrypt from 'bcryptjs';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  const { firstName, lastName, email, studentId, department, password, role } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Missing required fields' });

  try {
    const client = await clientPromise;
    const db = client.db();
    const users = db.collection('users');
    const existing = await users.findOne({ email });
    if (existing) return res.status(409).json({ error: 'User already exists' });

    // Save user as unverified
    const hashedPassword = await bcrypt.hash(password, 10);

    await users.insertOne({
      firstName,
      lastName,
      email,
      studentId,
      department,
      role: role === 'admin' ? 'admin' : 'student',
      password: hashedPassword,
      verified: false,
      createdAt: new Date(),
    });

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otps = db.collection('otps');
    await otps.insertOne({ email, otp, createdAt: new Date() });

    // Send OTP email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your OTP Code',
      text: `Your OTP code is: ${otp}`,
    });

    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err });
  }
}
