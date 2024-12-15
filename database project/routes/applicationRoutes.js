const express = require("express");
const { postApplication, employerGetAllApplications, jobseekerGetAllApplications, jobseekerDeleteApplication } = require("../controller/applicationController");
const { authenticate } = require("../middleware/auth");

const router = express.Router();

router.post("/post", authenticate, postApplication);
router.get("/employer/getall", authenticate, employerGetAllApplications);
router.get("/jobseeker/getall", authenticate, jobseekerGetAllApplications);
router.delete("/delete/:id", authenticate, jobseekerDeleteApplication);

module.exports = router;




// cloudinary.config({
//   cloud_name: process.env.CLOUD_NAME,
//   api_key: process.env.CLOUD_API_KEY,
//   api_secret: process.env.CLOUD_API_SECRET,
// });
