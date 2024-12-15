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

const { authenticate } = require("../middleware/auth");

const router = express.Router();
///
router.get("/getall", getAllJobs);
router.post("/post",authenticate, postJob);
router.get("/getmyjobs",authenticate, getMyJobs);
router.put("/update/:id",authenticate, updateJob);
router.delete("/delete/:id",authenticate, deleteJob);
router.get("/:id", authenticate, getSingleJob);


module.exports = router;

