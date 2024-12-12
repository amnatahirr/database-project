// routes/applicationRoutes.js
const express = require("express");
const { applyForJob, getApplicationsByUser, getApplicationsByJob } = require("../controller/applicationController");
const router = express.Router();

router.post("/", applyForJob);
router.get("/user/:userId", getApplicationsByUser);
router.get("/job/:jobId", getApplicationsByJob);

module.exports = router;
