// models/Job.js
const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  employer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  salaryRange: {
    type: String,
    default: "Negotiable",
  },
  employmentType: {
    type: String,
    enum: ["Full-time", "Part-time", "Contract", "Temporary"],
    default: "Full-time",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Job = mongoose.model("Job", jobSchema);
module.exports = Job;


