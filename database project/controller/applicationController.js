const Application = require("../models/application");
const Job  = require("../models/job");
const cloudinary = require("cloudinary");
const ErrorHandler = require("../middleware/error");
const catchAsyncErrors = require("../middleware/catchAsyncError");


//apply authorization that only job seeker will be able to apply for job  and job seeker is log in
// we will fetcht the role of req.user from the database  

exports.postApplication = catchAsyncErrors(async (req, res, next) => {
  const { role } = req.user;

  // Only Job Seekers are allowed to apply
  if (role === "Employer") {
    return next(
      new ErrorHandler("Employers are not allowed to apply for jobs.", 400)
    );
  }

  // Extract application details from the request body
  const { name, email, coverLetter, phone, address, jobId } = req.body;

  // Ensure all required fields are provided
  if (!name || !email || !coverLetter || !phone || !address || !jobId) {
    return next(new ErrorHandler("Please fill in all required fields.", 400));
  }

  // Find the job by ID and check its status
  const job = await Job.findById(jobId);

  if (!job) {
    return next(new ErrorHandler("Job not found.", 404));
  }

  if (job.isExpired) {
    return next(new ErrorHandler("This job has expired.", 400));
  }

  // Construct applicantID
  const applicantID = {
    user: req.user.id, // Ensure `req.user` contains the authenticated user's ID
    role: "Job Seeker",
  };

  // Construct employerID
  const employerID = {
    user: job.postedBy, // Assumes `job.postedBy` contains the employer's user ID
    role: "Employer",
  };

  // Create a new application
  const application = await Application.create({
    name,
    email,
    coverLetter,
    phone,
    address,
    applicantID,
    employerID,
  });

  // Respond with success message
  res.status(200).json({
    success: true,
    message: "Application submitted successfully!",
    application,
  });
});

exports.employerGetAllApplications = catchAsyncErrors(

  async (req, res, next) => {
    const { role } = req.user;
    if (role === "Job Seeker") {
      return next(
        new ErrorHandler("Job Seeker not allowed to access this resource.", 400)
      );
    }
    const { _id } = req.user;
    const applications = await Application.find({ "employerID.user": _id });
    res.status(200).json({
      success: true,
      applications,
    });
  }
);

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
