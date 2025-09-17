import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  resourceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Resource",
    required: true
  },
  date: {
    type: String, // Format: "YYYY-MM-DD"
    required: true
  },
  timeSlot: {
    type: String, // Format: "HH:MM AM/PM - HH:MM AM/PM"
    required: true
  },
  status: {
    type: String,
    enum: ["pending", "confirmed", "cancelled", "completed"],
    default: "pending"
  },
  reason: {
    type: String,
    trim: true
  },
  attendees: {
    type: Number,
    min: 1
  },
  checkedIn: {
    type: Boolean,
    default: false
  },
  checkedInAt: {
    type: Date
  },
  notes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true // automatically adds createdAt & updatedAt
});

// Create index on userId + resourceId + date + timeSlot to ensure unique bookings
bookingSchema.index({ userId: 1, resourceId: 1, date: 1, timeSlot: 1 }, { unique: true });

const Booking = mongoose.models.Booking || mongoose.model("Booking", bookingSchema);
export default Booking;