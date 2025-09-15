import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  // For backward compatibility, keep studentName optional
  studentName: {
    type: String,
    trim: true,
    required: false,
  },
  firstName: {
    type: String,
    trim: true,
    required: false,
  },
  lastName: {
    type: String,
    trim: true,
    required: false,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  studentId: {
    type: String,
    trim: true,
    required: false,
  },
  department: {
    type: String,
    trim: true,
    required: false,
  },
  phone: {
    type: String,
    trim: true,
    required: false,
  },
  role: {
    type: String,
    enum: ["student", "librarian", "sportsManager", "admin"],
    default: "student",
  },
  sapId: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  verified: {
    type: Boolean,
    default: false,
  },
  otp: {
    type: String,
  },
  otpExpires: {
    type: Date,
  },
  imageUrl: {
    type: String,
    trim: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  lastLogin: {
    type: Date,
  },
}, {
  timestamps: true // automatically adds createdAt & updatedAt
});

const User = mongoose.model("User", userSchema);
export default User;
