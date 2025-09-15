import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  studentName: { 
    type: String, 
    required: true, 
    trim: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    lowercase: true, 
    trim: true 
  },
  password: { 
    type: String, 
    required: true 
  },
  role: { 
    type: String, 
    enum: ["student", "librarian", "sportsManager", "admin"], 
    default: "student" 
  },
  sapId: { 
    type: String, 
    required: true, 
    unique: true, 
    trim: true 
  },
  otp: {
    type: String
  },
  otpExpires: {
    type: Date
  },
  imageUrl: { 
    type: String, 
    trim: true 
  },
  isActive: { 
    type: Boolean, 
    default: true 
  },
  lastLogin: { 
    type: Date 
  }
}, {
  timestamps: true // automatically adds createdAt & updatedAt
});

const User = mongoose.model("User", userSchema);
export default User;
