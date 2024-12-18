const express = require("express");
const {
  getUsers,
  getJobs,
  getAllJobs,
  generateReports,
  filterRole,
  deactivateUser,
  activateUser,
  deleteJob,
  viewApplications,
} = require("../controller/adminController");
const router = express.Router();

// Routes
router.get("/users", getUsers);
router.get('/job_management', getAllJobs);
router.get("/jobs", getJobs);
router.get("/reports", generateReports);

// User Management APIs
router.get("/filter-role", filterRole);
router.post("/deactivate/:userId", deactivateUser);
router.post("/activate/:userId", activateUser);

// Job Management APIs
router.get('/job_management/:id/delete', deleteJob);
router.get('/job_management/:id/applications', viewApplications);

module.exports = router;
