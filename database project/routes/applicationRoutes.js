const express = require("express");
const { postApplication, employerGetAllApplications, jobseekerGetAllApplications, jobseekerDeleteApplication } = require("../controller/applicationController");
const { authenticateAccessToken  } = require("../middleware/auth");

const router = express.Router();

router.post("/post", authenticateAccessToken , postApplication);
router.get("/employer/getall", authenticateAccessToken , employerGetAllApplications);
router.get("/jobseeker/getall", authenticateAccessToken , jobseekerGetAllApplications);
router.delete("/delete/:id", authenticateAccessToken , jobseekerDeleteApplication);

module.exports = router;




// cloudinary.config({
//   cloud_name: process.env.CLOUD_NAME,
//   api_key: process.env.CLOUD_API_KEY,
//   api_secret: process.env.CLOUD_API_SECRET,
// });
