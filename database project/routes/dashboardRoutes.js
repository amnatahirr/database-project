const express = require("express");
const {
  getUsers,
  getJobs,
  generateReports,
  getDashboardStats,
  deleteExpiredJobs,
  deactivateInactiveUsers,
  activateUser,
  requestUserReactivation,
} = require("../controller/adminController");
const { getDashboard } = require('../controller/dashboardController');
const { authenticateAccessToken } = require('../middleware/auth');

const router = express.Router();

//get users
router.get("/getUsers", getUsers);

//get jobs
router.get("/getJobs", getJobs);

//generate reports
router.get("/generateReports", generateReports);

// Dashboard stats
router.get('/stats', getDashboardStats);

// Delete expired jobs
router.delete("/jobs/delete-expired", async (req, res) => {
  try {
    await deleteExpiredJobs();
    res.status(200).json({ message: "Expired jobs deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Deactivate users who have been inactive
router.post("/users/deactivate-inactive", async (req, res) => {
  try {
    await deactivateInactiveUsers();
    res.status(200).json({ message: "Inactive users deactivated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Reactivate a user by ID
router.post("/users/activate/:userId", async (req, res) => {
  try {
    await activateUser(req.params.userId);
    res.status(200).json({ message: "User reactivated" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Reactivation request
router.post("/users/reactivate-request", async (req, res) => {
  try {
    await requestUserReactivation();
    res.status(200).json({ message: "Reactivation request placeholder" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.get('/dashboard', authenticateAccessToken, getDashboard);

module.exports = router;