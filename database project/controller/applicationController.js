const Application = require("../models/application");
const Job  = require("../models/job");
const axios = require("../axiosConfig"); // Use CommonJS require syntax

const ErrorHandler = require("../middleware/error");
const catchAsyncErrors = require("../middleware/catchAsyncError");

//apply authorization that only job seeker will be able to apply for job  and job seeker is log in
// we will fetcht the role of req.user from the database  
//


// POST APPLICATION (Job Seeker Only)
const { authenticateAccessToken } = require("../middleware/auth");

// POST APPLICATION (Job Seeker Only)
exports.postApplication = [
  authenticateAccessToken, // Middleware to authenticate user
  catchAsyncErrors(async (req, res, next) => {
    console.log("Request Body:", req.body); // Debug to ensure jobId and other fields are received

    const { role } = req.user;

    // Step 1: Check user role
    if (role !== "job_seeker") {
      return next(new ErrorHandler("Only job seekers can apply for jobs.", 403));
    }

    // Step 2: Extract and validate fields from request body
    const { name, email, coverLetter, phone, address,jobId} = req.body;

    // Ensure all required fields are present
    if (!name || !email || !coverLetter || !phone || !address || !jobId) {
      return next(new ErrorHandler("All fields are required.", 400));
    }

    // Step 3: Validate the job
    const job = await Job.findById(jobId); // Find job by jobId
    if (!job || job.isExpired) { // Ensure job exists and is not expired
      return next(new ErrorHandler("Invalid or expired job.", 404));
    }

    // Step 4: Create the application
    const application = await Application.create({
      name,
      email,
      coverLetter,
      phone,
      address,
      applicantID: { user: req.user.id, role: "Job Seeker" },
      employerID: job.postedBy, // Link application to job's employer
    });

    // Step 5: Send success response
    res.status(201).json({
      message: "Application submitted successfully",
      application, // Include the created application in the response
    });
  }),
];


// GET ALL APPLICATIONS (Employer Only)
exports.employerGetAllApplications = catchAsyncErrors(async (req, res, next) => {
  if (req.user.role !== "employer") {
    return next(new ErrorHandler("Access denied.", 403));
  }

  const applications = await Application.find({ employerID: req.user.id });
  res.status(200).json({ applications });
});




exports.jobseekerGetAllApplications = catchAsyncErrors(async (req, res, next) => {

  const { role, id } = req.user; 

  if (role !== "job_seeker") {
    return next(new ErrorHandler("Only Job Seekers can access this resource.", 403));
  }

  //  fetching applications for Job Seeker ID
  console.log("Fetching applications for Job Seeker ID:", id);

  const applications = await Application.find({ "applicantID.user": id });

  console.log("Found applications:", applications);

  res.status(200).json({
    success: true,
    applications,
  });
});




exports.jobseekerDeleteApplication = catchAsyncErrors(
  async (req, res, next) => {
    const { role } = req.user;
    if (role === "Employer") {
      return next(
        new ErrorHandler("Employer not allowed to access this resource.", 400)
      );
    }
    const { id } = req.params;
    const application = await Application.findById(id);
    if (!application) {
      return next(new ErrorHandler("oops application not found!", 404));
    }
    await application.deleteOne();
    res.status(200).json({
      success: true,
      message: "Application Deleted!",
    });
  }
);
