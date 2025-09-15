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
        password: await bcrypt.hash("admin123", 10),
        verified: true,
        createdAt: new Date(),
      },
      {
        firstName: "Student",
        lastName: "One",
        email: "student1@campus.test",
        studentId: "S001",
        department: "Computer Science",
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

    const usersCount = await users.countDocuments();
    const resourcesCount = await resources.countDocuments();
    console.log(`Seed complete. Users: ${usersCount}, Resources: ${resourcesCount}`);
  } catch (err) {
    console.error("Seed failed:", err);
    process.exitCode = 1;
  } finally {
    await client.close();
  }
}

main();


