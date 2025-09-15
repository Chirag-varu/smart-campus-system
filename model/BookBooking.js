import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",   // who is borrowing
    required: true
  },
  itemType: {
    type: String,
    enum: ["Book", "SportsEquipment"], // type of resource
    required: true
  },
  item: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: "itemType"  // dynamically points to Book or SportsEquipment
  },
  issueDate: {
    type: Date,
    default: Date.now
  },
  dueDate: {
    type: Date,
    required: true
  },
  returnDate: {
    type: Date
  },
  status: {
    type: String,
    enum: ["issued", "returned", "overdue"],
    default: "issued"
  },
  fine: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true // adds createdAt & updatedAt
});

const Booking = mongoose.model("Booking", bookingSchema);
export default Booking;
