// routes/jobRoutes.js
const express = require("express");
const {
  createJob,
  updateJob,
  deleteJob,
  getJobs,
} = require("../controller/jobController");
const router = express.Router();

router.post("/", createJob);
router.put("/:id", updateJob);
router.delete("/:id", deleteJob);
router.get("/", getJobs);

module.exports = router;

