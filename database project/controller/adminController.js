const User = require("../models/user");
const Job = require("../models/job");
const Application = require("../models/application");

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({}, "name email role");
    res.status(200).json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.getJobs = async (req, res) => {
  try {
    const jobs = await Job.find();
    res.status(200).json(jobs);
  } catch (err) {
    console.error("Error fetching jobs:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.generateReports = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalJobs = await Job.countDocuments();
    const totalApplications = await Application.countDocuments();

    const mostAppliedJob = await Application.aggregate([
      { $group: { _id: "$jobId", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 1 },
    ]);

    res.status(200).json({
      totalUsers,
      totalJobs,
      totalApplications,
      mostAppliedJob,
    });
  } catch (err) {
    console.error("Error generating reports:", err);
    res.status(500).json({ error: err.message });
  }
};

