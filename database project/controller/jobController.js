// controllers/jobController.js
const Job = require("../models/job");

exports.createJob = async (req, res) => {
  try {
    const job = new Job({ ...req.body});
    await job.save();
    res.status(201).json({ message: "Job posted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateJob = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedJob = req.body;
    await Job.findByIdAndUpdate(id, updatedJob, { new: true });
    res.status(200).json({ message: "Job updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteJob = async (req, res) => {
  try {
    const { id } = req.params;
    await Job.findByIdAndDelete(id);
    res.status(200).json({ message: "Job deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getJobs = async (req, res) => {
  try {
    const jobs = await Job.find(req.query);
    res.status(200).json(jobs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
