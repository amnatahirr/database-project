// controllers/adminController.js
const User = require('../models/user');
const Job = require('../models/job');
const Application = require('../models/Application');
const nodemailer = require('nodemailer'); // For sending emails

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({}, "name email role");
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getJobs = async (req, res) => {
  try {
    const jobs = await Job.find().populate("postedBy", "name email");
    res.status(200).json(jobs);
  } catch (err) {
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
    res.status(500).json({ error: err.message });
  }
};


// Update User Role
exports.updateUserRole = async (req, res) => {
  try {
    const { userId, newRole } = req.body;

    const validRoles = ["job_seeker", "employer", "admin"];
    if (!validRoles.includes(newRole)) {
      return res.status(400).json({ error: "Invalid role specified" });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { role: newRole },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ message: "User role updated successfully", user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Deactivate or Suspend User Account
exports.updateUserStatus = async (req, res) => {
  try {
    const { userId, isActive } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      { isActive },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const statusMessage = isActive
      ? "User account reactivated successfully"
      : "User account deactivated successfully";

    res.status(200).json({ message: statusMessage, user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// filter user on behalf of role
exports.filterRole = async (req, res) => {
  try {
    const { role, isActive } = req.query;

    const query = {};
    if (role) query.role = role;
    if (isActive !== undefined) query.isActive = isActive === "true";

    console.log("Generated Query Object:", query); // Log the query for debugging

    const users = await User.find(query, "name email role isActive createdAt");
    console.log("Matched Users:", users); // Log the matched users for debugging

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// filter user on behalf of role and status
exports.filterUsers = async (req, res) => {
  try {
    const { role, isActive } = req.query;

    const query = {};
    if (role) query.role = new RegExp(`^${role}$`, "i");
    if (isActive !== undefined) query.isActive = isActive === "true";

    console.log("Generated Query:", query);

    // Fetch all users and log them
    const allUsers = await User.find({}, "name email role isActive createdAt");
    console.log("All Users in Database:", allUsers);

    // Apply the filter and log the matched users
    const users = await User.find(query, "name email role isActive createdAt");
    console.log("Matched Users:", users);

    res.status(200).json(users);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: error.message });
  }
};


// Helper function for sending emails
const sendEmail = async (toEmail, subject, text) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER, // Your email
                pass: process.env.EMAIL_PASS, // Your email password or app password
            },
        });

        const info = await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: toEmail,
            subject,
            text,
        });

        console.log('Email sent:', info);
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

// Dashboard Stats
exports.getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalJobs = await Job.countDocuments();
    const totalApplications = await Application.countDocuments();

    res.render('dashboard/user_dashboard', {
      totalUsers,
      totalJobs,
      totalApplications,
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).send('Error');
  }
};

// Delete expired jobs
exports.deleteExpiredJobs = async () => {
  const expiryDate = new Date();
  expiryDate.setMonth(expiryDate.getMonth() - 3); // Jobs older than 3 months

  const result = await Job.deleteMany({ createdAt: { $lt: expiryDate } });
  console.log('Deleted expired jobs:', result);
};

// Deactivate users who have been inactive for a long period
exports.deactivateInactiveUsers = async () => {
  const inactivityDate = new Date();
  inactivityDate.setFullYear(inactivityDate.getFullYear() - 1); // Users inactive for over a year

  const result = await User.updateMany(
    { lastLogin: { $lt: inactivityDate } },
    { $set: { isActive: false } }
  );
  console.log('Deactivated users:', result);
};

// Activate a user by ID
exports.activateUser = async (userId) => {
  const result = await User.updateOne(
    { _id: userId },
    { $set: { isActive: true } }
  );
  console.log('Activated user:', result);
};

// Reactivate a user
exports.requestUserReactivation = async () => {
  console.log('User reactivation request functionality placeholder');
};