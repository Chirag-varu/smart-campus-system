/*
  Seed script for Smart Campus System
  - Inserts sample users and resources
  - Reads MONGODB_URI from process.env or .env.local
*/

const { MongoClient } = require("mongodb");
const fs = require("fs");
const path = require("path");

function loadEnvLocalIfPresent() {
  if (process.env.MONGODB_URI) return;
  const envPath = path.join(__dirname, "..", ".env.local");
  if (!fs.existsSync(envPath)) return;
  const content = fs.readFileSync(envPath, "utf8");
  for (const line of content.split(/\r?\n/)) {
    if (!line || line.trim().startsWith("#")) continue;
    const eq = line.indexOf("=");
    if (eq === -1) continue;
    const key = line.slice(0, eq).trim();
    const value = line.slice(eq + 1).trim();
    if (!process.env[key]) process.env[key] = value;
  }
}

async function main() {
  loadEnvLocalIfPresent();
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("MONGODB_URI is not set. Define it in environment or .env.local");
    process.exit(1);
  }

  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db();

    // Collections
    const users = db.collection("users");
    const resources = db.collection("resources");
    const otps = db.collection("otps");
    const bookings = db.collection("bookings");

    // Indexes
    await users.createIndex({ email: 1 }, { unique: true });
    await otps.createIndex({ email: 1 });

    // Seed Users (passwords are plain text as per current API; hash in production)
    const bcrypt = require('bcryptjs')
    const seedUsers = [
      {
        firstName: "Admin",
        lastName: "User",
        email: "admin@campus.test",
        studentId: "A000",
        department: "Administration",
        role: 'admin',
        sapId: "SAP0001",
        phone: "+(91) 900-404-7858",
        password: await bcrypt.hash("admin123", 10),
        verified: true,
        createdAt: new Date(),
      },
      {
        firstName: "Chirag",
        lastName: "Varu",
        email: "chiragvaru.main@gmail.com",
        studentId: "S001",
        department: "Computer Science",
        role: 'student',
        sapId: "SAP0002",
        phone: "+(91) 900-404-7858",
        password: await bcrypt.hash("student123", 10),
        verified: true,
        createdAt: new Date(),
      },
    ];

    for (const user of seedUsers) {
      await users.updateOne(
        { email: user.email },
        { $setOnInsert: user },
        { upsert: true }
      );
    }

    // Seed Resources (mirrors UI mock data)
    const seedResources = [
      {
        name: "Library Study Room A",
        type: "Library",
        capacity: 6,
        status: "active",
        description: "Quiet study room with whiteboard and projector",
        amenities: ["Whiteboard", "Projector", "AC"],
        location: "Library Building, Floor 2",
        bookings: 24,
        createdAt: new Date(),
      },
      {
        name: "Computer Lab 2",
        type: "Labs",
        capacity: 30,
        status: "active",
        description: "High-performance computers with latest software",
        amenities: ["30 PCs", "High-speed Internet", "Printer"],
        location: "Engineering Building, Floor 1",
        bookings: 18,
        createdAt: new Date(),
      },
      {
        name: "Basketball Court",
        type: "Sports",
        capacity: 10,
        status: "active",
        description: "Full-size basketball court with professional flooring",
        amenities: ["Professional Court", "Lighting", "Scoreboard"],
        location: "Sports Complex",
        bookings: 32,
        createdAt: new Date(),
      },
      {
        name: "Chemistry Lab 1",
        type: "Labs",
        capacity: 20,
        status: "maintenance",
        description: "Fully equipped chemistry laboratory",
        amenities: ["Lab Equipment", "Safety Gear", "Fume Hoods"],
        location: "Science Building, Floor 3",
        bookings: 0,
        createdAt: new Date(),
      },
    ];

    for (const resource of seedResources) {
      await resources.updateOne(
        { name: resource.name },
        { $setOnInsert: resource },
        { upsert: true }
      );
    }

    // Sample bookings (with different statuses and dates)
    const student = await users.findOne({ email: "chiragvaru.main@gmail.com" })
    const lib = await resources.findOne({ name: "Library Study Room A" })
    const lab = await resources.findOne({ name: "Computer Lab 2" })
    const basketball = await resources.findOne({ name: "Basketball Court" })
    const chemlab = await resources.findOne({ name: "Chemistry Lab 1" })

    if (student && lib && lab && basketball && chemlab) {
      // Current date for reference
      const today = new Date();
      const currentYear = today.getFullYear();
      const currentMonth = today.getMonth() + 1; // JavaScript months are 0-indexed
      const currentDay = today.getDate();

      // UPCOMING BOOKINGS (Future dates)
      
      // Tomorrow
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);
      const tomorrowStr = `${tomorrow.getFullYear()}-${String(tomorrow.getMonth() + 1).padStart(2, '0')}-${String(tomorrow.getDate()).padStart(2, '0')}`;
      
      // Next Week
      const nextWeek = new Date(today);
      nextWeek.setDate(today.getDate() + 7);
      const nextWeekStr = `${nextWeek.getFullYear()}-${String(nextWeek.getMonth() + 1).padStart(2, '0')}-${String(nextWeek.getDate()).padStart(2, '0')}`;
      
      // Two Weeks Out
      const twoWeeks = new Date(today);
      twoWeeks.setDate(today.getDate() + 14);
      const twoWeeksStr = `${twoWeeks.getFullYear()}-${String(twoWeeks.getMonth() + 1).padStart(2, '0')}-${String(twoWeeks.getDate()).padStart(2, '0')}`;
      
      // PAST BOOKINGS (Past dates)
      
      // Last week
      const lastWeek = new Date(today);
      lastWeek.setDate(today.getDate() - 7);
      const lastWeekStr = `${lastWeek.getFullYear()}-${String(lastWeek.getMonth() + 1).padStart(2, '0')}-${String(lastWeek.getDate()).padStart(2, '0')}`;
      
      // Two weeks ago
      const twoWeeksAgo = new Date(today);
      twoWeeksAgo.setDate(today.getDate() - 14);
      const twoWeeksAgoStr = `${twoWeeksAgo.getFullYear()}-${String(twoWeeksAgo.getMonth() + 1).padStart(2, '0')}-${String(twoWeeksAgo.getDate()).padStart(2, '0')}`;
      
      // Last Month
      const lastMonth = new Date(today);
      lastMonth.setMonth(today.getMonth() - 1);
      const lastMonthStr = `${lastMonth.getFullYear()}-${String(lastMonth.getMonth() + 1).padStart(2, '0')}-${String(lastMonth.getDate()).padStart(2, '0')}`;

      // UPCOMING BOOKINGS - Different statuses
      await bookings.updateOne(
        { userId: student._id, resourceId: lib._id, date: tomorrowStr, timeSlot: "10:00 AM - 12:00 PM" },
        { $setOnInsert: { userId: student._id, resourceId: lib._id, date: tomorrowStr, timeSlot: "10:00 AM - 12:00 PM", status: 'pending', createdAt: new Date() } },
        { upsert: true }
      );
      
      await bookings.updateOne(
        { userId: student._id, resourceId: lab._id, date: nextWeekStr, timeSlot: "2:00 PM - 4:00 PM" },
        { $setOnInsert: { userId: student._id, resourceId: lab._id, date: nextWeekStr, timeSlot: "2:00 PM - 4:00 PM", status: 'approved', createdAt: new Date() } },
        { upsert: true }
      );
      
      await bookings.updateOne(
        { userId: student._id, resourceId: basketball._id, date: twoWeeksStr, timeSlot: "6:00 PM - 8:00 PM" },
        { $setOnInsert: { userId: student._id, resourceId: basketball._id, date: twoWeeksStr, timeSlot: "6:00 PM - 8:00 PM", status: 'approved', createdAt: new Date() } },
        { upsert: true }
      );
      
      // PAST BOOKINGS - Different statuses
      await bookings.updateOne(
        { userId: student._id, resourceId: lib._id, date: lastWeekStr, timeSlot: "1:00 PM - 3:00 PM" },
        { $setOnInsert: { userId: student._id, resourceId: lib._id, date: lastWeekStr, timeSlot: "1:00 PM - 3:00 PM", status: 'completed', createdAt: new Date(lastWeek) } },
        { upsert: true }
      );
      
      await bookings.updateOne(
        { userId: student._id, resourceId: chemlab._id, date: twoWeeksAgoStr, timeSlot: "9:00 AM - 11:00 AM" },
        { $setOnInsert: { userId: student._id, resourceId: chemlab._id, date: twoWeeksAgoStr, timeSlot: "9:00 AM - 11:00 AM", status: 'completed', createdAt: new Date(twoWeeksAgo) } },
        { upsert: true }
      );
      
      await bookings.updateOne(
        { userId: student._id, resourceId: basketball._id, date: lastMonthStr, timeSlot: "4:00 PM - 6:00 PM" },
        { $setOnInsert: { userId: student._id, resourceId: basketball._id, date: lastMonthStr, timeSlot: "4:00 PM - 6:00 PM", status: 'cancelled', createdAt: new Date(lastMonth) } },
        { upsert: true }
      );
    }

    const usersCount = await users.countDocuments();
    const resourcesCount = await resources.countDocuments();
    const bookingsCount = await bookings.countDocuments();
    console.log(`Seed complete. Users: ${usersCount}, Resources: ${resourcesCount}, Bookings: ${bookingsCount}`);
  } catch (err) {
    console.error("Seed failed:", err);
    process.exitCode = 1;
  } finally {
    await client.close();
  }
}

main();


