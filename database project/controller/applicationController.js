const Application = require("../models/application");
const Job  = require("../models/job");
const cloudinary = require("cloudinary");
const ErrorHandler = require("../middleware/error");
const catchAsyncErrors = require("../middleware/catchAsyncError");

//apply authorization that only job seeker will be able to apply for job  and job seeker is log in
// we will fetcht the role of req.user from the database  
//


// POST APPLICATION (Job Seeker Only)
exports.postApplication = catchAsyncErrors(async (req, res, next) => {
  const { role } = req.user;

  if (role !== "job_seeker") {
    return next(new ErrorHandler("Only job seekers can apply for jobs.", 403));
  }

  const { name, email, coverLetter, phone, address, jobId } = req.body;

  if (!name || !email || !coverLetter || !phone || !address || !jobId) {
    return next(new ErrorHandler("All fields are required.", 400));
  }

  const job = await Job.findById(jobId);
  if (!job || job.isExpired) {
    return next(new ErrorHandler("Invalid or expired job.", 404));
  }

  const application = await Application.create({
    name,
    email,
    coverLetter,
    phone,
    address,
    applicantID: req.user.id,
    employerID: job.postedBy,
  });

  res.status(201).json({ message: "Application submitted successfully", application });
});

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
