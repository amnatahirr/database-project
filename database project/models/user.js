// models/user.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Hashed in the controller
  role: { 
    type: String, 
    enum: ["job_seeker", "employer", "admin"], 
    required: true, 
    default: "job_seeker" 
  },
  profile: {
    // Optional additional details specific to job seekers or employers
    resume: { type: String }, // For job seekers
    companyName: { type: String }, // For employers
  }
});

module.exports = mongoose.model("User", userSchema);
