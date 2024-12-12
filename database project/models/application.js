// models/Application.js
const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema({
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
  applicantId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  status: { type: String, enum: ["applied", "shortlisted", "rejected"], default: "applied" },
  appliedDate: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Application", applicationSchema);
