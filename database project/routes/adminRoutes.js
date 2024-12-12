// routes/adminRoutes.js
const express = require("express");
const { getUsers, getJobs, generateReports } = require("../controller/adminController");
const { authenticate } = require("../middleware/auth");
const { authorizeRoles } = require("../middleware/roleMiddleware");

const router = express.Router();

router.get("/users", authenticate, authorizeRoles("admin"), getUsers);
router.get("/jobs", authenticate, authorizeRoles("admin"), getJobs);
router.get("/reports", authenticate, authorizeRoles("admin"), generateReports);

module.exports = router;
