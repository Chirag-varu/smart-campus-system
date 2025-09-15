import mongoose from "mongoose";

const sportsEquipmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    trim: true
    // Example: "ball games", "indoor", "outdoor", "fitness"
  },
  quantityAvailable: {
    type: Number,
    required: true,
    min: 0
  },
  imageUrl: {
    type: String,
    trim: true
  }
}, {
  timestamps: true // adds createdAt & updatedAt
});

const SportsEquipment = mongoose.model("SportsEquipment", sportsEquipmentSchema);
export default SportsEquipment;
