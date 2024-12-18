const express = require("express");
const {
  postApplication,
  employerGetAllApplications,
  jobseekerGetAllApplications,
  jobseekerDeleteApplication,
} = require("../controller/applicationController");

const { authenticateAccessToken } = require("../middleware/auth");

const router = express.Router();

// Routes for job applications
router.post("/post", authenticateAccessToken, postApplication);
router.get("/employer/getall", authenticateAccessToken, employerGetAllApplications);
router.get("/jobseeker/getall", authenticateAccessToken, jobseekerGetAllApplications);
router.delete("/delete/:id", authenticateAccessToken, jobseekerDeleteApplication);

module.exports = router;





