// controllers/applicationController.js
const Application = require("../models/Application");
const Job = require("../models/job");

exports.applyForJob = async (req, res) => {
  try {
    const { jobId, applicantId } = req.body;

    // Check if the job exists
    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: "Job not found" });

    // Create the application
    const application = new Application({ jobId, applicantId });
    await application.save();
    res.status(201).json({ message: "Applied successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getApplicationsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const applications = await Application.find({ applicantId: userId }).populate("jobId", "title");
    res.status(200).json(applications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getApplicationsByJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const applications = await Application.find({ jobId }).populate("applicantId", "name email");
    res.status(200).json(applications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
