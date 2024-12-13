// controller/jobController.js
const Job = require("../models/job");

// Create a new job posting
exports.createJob = async (req, res) => {
  try {
    const job = new Job({ ...req.body });
    await job.save();
    res.status(201).json({ message: "Job posted successfully", job });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update an existing job posting
exports.updateJob = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedJob = await Job.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedJob) {
      return res.status(404).json({ message: "Job not found" });
    }
    res.status(200).json({ message: "Job updated successfully", updatedJob });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a job posting
exports.deleteJob = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedJob = await Job.findByIdAndDelete(id);
    if (!deletedJob) {
      return res.status(404).json({ message: "Job not found" });
    }
    res.status(200).json({ message: "Job deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get jobs with advanced filtering
exports.getJobs = async (req, res) => {
  try {
    const { title, location, employmentType, employer, salaryRange } = req.query;
    const filters = {};

    if (title) filters.title = { $regex: title, $options: "i" };
    if (location) filters.location = { $regex: location, $options: "i" };
    if (employmentType) filters.employmentType = employmentType;
    if (employer) filters.employer = employer;
    if (salaryRange) filters.salaryRange = { $regex: salaryRange, $options: "i" };

    const jobs = await Job.find(filters).populate("employer", "name email");
    res.status(200).json(jobs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
