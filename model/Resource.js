import mongoose from "mongoose";

const resourceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    required: true,
    trim: true
    // Examples from seed file: "Library", "Labs", "Sports"
  },
  capacity: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ["active", "maintenance", "booked"],
    default: "active"
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  amenities: [{
    type: String,
    trim: true
  }],
  location: {
    type: String,
    required: true,
    trim: true
  },
  bookings: {
    type: Number,
    default: 0
  },
  imageUrl: {
    type: String,
    trim: true
  }
}, {
  timestamps: true // automatically adds createdAt & updatedAt
});

const Resource = mongoose.models.Resource || mongoose.model("Resource", resourceSchema);
export default Resource;