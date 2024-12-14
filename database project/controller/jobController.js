// controller/jobController.js
const Job = require("../models/job");

// Create a new job posting
exports.createJob = async (req, res) => {
  try {
    const {
      jobTitle,
      companyName,
      industry,
      jobType,
      location,
      salaryRange,
      jobDescription,
      responsibilities,
      requiredSkills,
      keywords
    } = req.body;

    // Create a new job using the data from the form
    const job = new Job({
      jobTitle,
      companyName,
      industry,
      jobType,
      location,
      salaryRange,
      jobDescription,
      responsibilities,
      requiredSkills,
      keywords: keywords.split(",").map(keyword => keyword.trim()) // Split and trim keywords
    });

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
    const {
      jobTitle,
      companyName,
      industry,
      jobType,
      location,
      salaryRange,
      jobDescription,
      responsibilities,
      requiredSkills,
      keywords
    } = req.query;

    const filters = {};

    if (jobTitle) filters.jobTitle = { $regex: jobTitle, $options: "i" };
    if (companyName) filters.companyName = { $regex: companyName, $options: "i" };
    if (industry) filters.industry = industry;
    if (jobType) filters.jobType = jobType;
    if (location) filters.location = { $regex: location, $options: "i" };
    if (salaryRange) filters.salaryRange = { $regex: salaryRange, $options: "i" };
    if (jobDescription) filters.jobDescription = { $regex: jobDescription, $options: "i" };
    if (responsibilities) filters.responsibilities = { $regex: responsibilities, $options: "i" };
    if (requiredSkills) filters.requiredSkills = { $regex: requiredSkills, $options: "i" };
    if (keywords) filters.keywords = { $regex: keywords.split(",").map(keyword => keyword.trim()).join("|"), $options: "i" };

    const jobs = await Job.find(filters);
    res.status(200).json(jobs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
