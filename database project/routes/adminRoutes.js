const express = require("express");
const {
  getUsers,
  getJobs,
  generateReports,
  updateUserRole,
  filterRole,
  deactivateUser,
  activateUser,
} = require("../controller/adminController");
const router = express.Router();

// Routes
router.get("/users", getUsers);
router.get("/jobs", getJobs);
router.get("/reports", generateReports);

// User Management APIs
router.put("/update-role", updateUserRole);
router.get("/filter-role", filterRole);
router.post("/deactivate/:userId", deactivateUser);
router.post("/activate/:userId", activateUser);

module.exports = router;
