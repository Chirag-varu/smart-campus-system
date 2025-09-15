import type { NextApiRequest, NextApiResponse } from 'next'
import clientPromise from '@/lib/mongodb'
import nodemailer from 'nodemailer'
import { generateOtp } from '@/lib/utils'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()

  const { email } = req.body
  if (!email) return res.status(400).json({ error: 'Missing email' })

  try {
    const client = await clientPromise
    const db = client.db()
    const otps = db.collection('otps')

    // Optionally, ensure user exists before sending OTP
    // const users = db.collection('users')
    // const user = await users.findOne({ email })
    // if (!user) return res.status(404).json({ error: 'User not found' })

    const otp = generateOtp(6)
    await otps.insertOne({ email, otp, createdAt: new Date() })

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    })

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your OTP Code',
      text: `Your OTP code is: ${otp}`,
    })

    return res.status(200).json({ success: true })
  } catch (err) {
    return res.status(500).json({ error: 'Server error', details: err })
  }
}


