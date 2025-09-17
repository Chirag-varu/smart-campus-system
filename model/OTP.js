import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  otp: {
    type: String,
    required: true
  },
  expiresAt: {
    type: Date,
    required: true
  },
  purpose: {
    type: String,
    enum: ["verification", "password_reset", "login"],
    default: "verification"
  }
}, {
  timestamps: true // automatically adds createdAt & updatedAt
});

// Create index to ensure fast lookup and automatic expiry
otpSchema.index({ email: 1 });
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // TTL index

const OTP = mongoose.models.OTP || mongoose.model("OTP", otpSchema);
export default OTP;