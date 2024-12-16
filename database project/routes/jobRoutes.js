// routes/jobRoutes.js
const express = require("express");
const {

  getAllJobs,
  postJob,
  getMyJobs,
  updateJob,
  deleteJob,
  getSingleJob,
  // getJobs,
} = require("../controller/jobController");

const {authenticateAccessToken} = require("../middleware/auth");

const router = express.Router();
///
router.get("/getall", getAllJobs);
router.post("/post",authenticateAccessToken, postJob);
router.get("/getmyjobs",authenticateAccessToken, getMyJobs);
router.put("/update/:id",authenticateAccessToken, updateJob);
router.delete("/delete/:id",authenticateAccessToken, deleteJob);
router.get("/:id", authenticateAccessToken, getSingleJob);


module.exports = router;

