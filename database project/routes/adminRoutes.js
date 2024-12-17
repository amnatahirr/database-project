const express = require("express");
const {
  getUsers,
  getJobs,
  generateReports,
  updateUserRole,
  updateUserStatus,
  filterRole,
  filterUsers,
} = require("../controller/adminController");
const router = express.Router();

// Routes
router.get("/users", getUsers);
router.get("/jobs", getJobs);
router.get("/reports", generateReports);

// User Management APIs
router.put("/update-role", updateUserRole);
router.put("/update-status", updateUserStatus);
router.get("/filter-role", filterRole);
router.get("/filter-users", filterUsers);

module.exports = router;
