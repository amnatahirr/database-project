const express = require("express");
const {
  getAllJobs,
  postJob,
  getSingleJob,
} = require("../controller/jobController"); // Correct import path for jobController
const { authenticateAccessToken } = require("../middleware/auth");

const router = express.Router();

// Route definitions
router.get("/viewJob", getAllJobs); // Ensure getAllJobs is defined in jobController
router.post("/jobPostForm", authenticateAccessToken, postJob); // Ensure postJob is defined

router.get("/:id", getSingleJob); // Ensure getSingleJob is defined

module.exports = router;
