import { MongoClient } from "mongodb";
import { existsSync, readFileSync } from "fs";
import { join } from "path";
import bcrypt from "bcryptjs";

function loadEnvLocalIfPresent() {
  if (process.env.MONGODB_URI) return; 
  const envPath = join(__dirname, "..", ".env.local");
  if (!existsSync(envPath)) return;
  const content = readFileSync(envPath, "utf8");
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
    console.error(
      "MONGODB_URI is not set. Define it in environment or .env.local"
    );
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

    // ✅ Clear old data
    await users.deleteMany({});
    await resources.deleteMany({});
    await otps.deleteMany({});
    await bookings.deleteMany({});
    console.log("All old data cleared ✅");

    // Indexes
    await users.createIndex({ email: 1 }, { unique: true });
    await otps.createIndex({ email: 1 });

    // Seed Users
    const seedUsers = [
      {
        firstName: "Admin",
        lastName: "User",
        email: "admin@campus.test",
        studentId: "A000",
        department: "Administration",
        role: "admin",
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
        role: "student",
        sapId: "SAP0002",
        phone: "+(91) 900-404-7858",
        password: await bcrypt.hash("student123", 10),
        verified: true,
        createdAt: new Date(),
      },
    ];

    await users.insertMany(seedUsers);

    // Seed Resources
    const seedResources = [
      {
        name: "Library Study Room A",
        type: "Library",
        capacity: 16,
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

    await resources.insertMany(seedResources);

    // Example booking
    const student = await users.findOne({
      email: "chiragvaru.main@gmail.com",
    });
    const lib = await resources.findOne({ name: "Library Study Room A" });

    if (student && lib) {
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);

      await bookings.insertOne({
        userId: student._id,
        resourceId: lib._id,
        date: `${tomorrow.getFullYear()}-${String(
          tomorrow.getMonth() + 1
        ).padStart(2, "0")}-${String(tomorrow.getDate()).padStart(2, "0")}`,
        timeSlot: "10:00 AM - 12:00 PM",
        status: "pending",
        createdAt: new Date(),
      });
    }

    const usersCount = await users.countDocuments();
    const resourcesCount = await resources.countDocuments();
    const bookingsCount = await bookings.countDocuments();
    console.log(
      `Seed complete ✅ Users: ${usersCount}, Resources: ${resourcesCount}, Bookings: ${bookingsCount}`
    );
  } catch (err) {
    console.error("Seed failed:", err);
    process.exitCode = 1;
  } finally {
    await client.close();
  }
}

main();