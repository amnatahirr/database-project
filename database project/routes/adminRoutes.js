const express = require("express");
const {
  getUsers,
  getJobs,
  getAllJobs,
  filterRole,
  deactivateUser,
  activateUser,
  deleteJob,
  getTopTrendingJobs,
} = require("../controller/adminController");

// const { authenticateAccessToken } = require('../middleware/auth');
const router = express.Router();

// router.use(authenticateAccessToken);
// Routes
router.get("/users", getUsers);
router.get('/job_management/all', getAllJobs);
router.get("/jobs", getJobs);

// User Management APIs
router.get("/filter-role", filterRole);
router.post("/deactivate/:userId", deactivateUser);
router.post("/activate/:userId", activateUser);

// Job Management APIs
router.get('/job_management/all/:id/delete', deleteJob);
router.get('/top_trending_jobs', getTopTrendingJobs);


module.exports = router;
