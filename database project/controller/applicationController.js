const Application = require("../models/Application");
const Job  = require("../models/job");
const axios = require("../axiosConfig"); // Use CommonJS require syntax

const ErrorHandler = require("../middleware/error");
const catchAsyncErrors = require("../middleware/catchAsyncError");



const { authenticateAccessToken } = require("../middleware/auth");

// exports.postApplication = catchAsyncErrors(async (req, res, next) => {
//   const { role } = req.user;

//   // Only Job Seekers are allowed to apply
//   if (role === "Employer") {
//     return next(new ErrorHandler("Employers are not allowed to apply for jobs.", 400));
//   }

//   const { name, email, coverLetter, phone, address, jobId } = req.body;

//   if (!name || !email || !coverLetter || !phone || !address || !jobId) {
//     return next(new ErrorHandler("Please fill in all required fields.", 400));
//   }

//   // Find job and validate
//   const job = await Job.findById(jobId);
//   if (!job) {
//     return next(new ErrorHandler("Job not found.", 404));
//   }

//   if (job.expired) {
//     return next(new ErrorHandler("This job has expired.", 400));
//   }

//   const applicantID = { user: req.user.id, role: "Job Seeker" };
//   const employerID = { user: job.postedBy, role: "Employer" };

//   // Validate employerID fields
//   if (!employerID.user || !employerID.role) {
//     return next(new ErrorHandler("Employer information is missing.", 400));
//   }

//   // Create Application
//   const application = await Application.create({
//     jobId,
//     name,
//     email,
//     coverLetter,
//     phone,
//     address,
//     applicantID,
//     employerID,
    
//   });

//   res.status(200).json({
//     success: true,
//     message: "Application submitted successfully!",
//     application,
//   });
// });

// GET ALL APPLICATIONS (Employer Only)
exports.employerGetAllApplications = catchAsyncErrors(async (req, res, next) => {
  if (req.user.role !== "employer") {
    return next(new ErrorHandler("Access denied.", 403));
  }

  const applications = await Application.find({ employerID: req.user.id });
  res.status(200).json({ applications });
});

// // jobseekerGetAllApplications - Fetch all job applications for a Job Seeker
// // exports.jobseekerGetAllApplications = catchAsyncErrors(async (req, res, next) => {

// //   const { role, id } = req.user;

// //   if (role !== "job_seeker") {
// //     return next(new ErrorHandler("Only Job Seekers can access this resource.", 403));
// //   }

// //   try {
// //     // Fetch applications for the Job Seeker and populate job details
// //     const applications = await Application.find({ "applicantID.user": id })
// //       // .populate({
// //       //   path: "jobid", // Reference to Job
// //       //   select: "jobTitle companyName", // Fetch these fields
// //       // });

// //     if (!applications || applications.length === 0) {
// //       return res.status(200).json({ success: true, applications: [] });
// //     }

// //     res.status(200).json({
// //       success: true,
// //       applications,
// //     });
// //   } catch (error) {
// //     next(error);
// //   }
// // });





// exports.jobseekerGetAllApplications = catchAsyncErrors(async (req, res, next) => {
//   const { role, id } = req.user; 

//   if (role !== "job_seeker") {
//     return next(new ErrorHandler("Only Job Seekers can access this resource.", 403));
//   }

//   console.log("Fetching applications for Job Seeker ID:", id);

//   // Fetch applications and populate job details
//   const applications = await Application.find({ "applicantID.user": id })
//     .populate('jobId', 'jobTitle companyName');

//   console.log("Found applications:", applications);

//   res.status(200).json({
//     success: true,
//     applications,
//   });
// });





// exports.jobseekerDeleteApplication = catchAsyncErrors(
//   async (req, res, next) => {
//     const { role } = req.user;
//     if (role === "Employer") {
//       return next(
//         new ErrorHandler("Employer not allowed to access this resource.", 400)
//       );
//     }
//     const { id } = req.params;
//     const application = await Application.findById(id);
//     if (!application) {
//       return next(new ErrorHandler("oops application not found!", 404));
//     }
//     await application.deleteOne();
//     res.status(200).json({
//       success: true,
//       message: "Application Deleted!",
//     });
//   

// );





// Authorization Middleware


// POST: Apply for a Job
exports.postApplication = catchAsyncErrors(async (req, res, next) => {
  const { role } = req.user;

  if (role === "Employer") {
    return next(new ErrorHandler("Employers are not allowed to apply for jobs.", 400));
  }

  const { name, email, coverLetter, phone, address, jobId } = req.body;

  if (!name || !email || !coverLetter || !phone || !address || !jobId) {
    return next(new ErrorHandler("Please fill in all required fields.", 400));
  }

  const job = await Job.findById(jobId);
  if (!job) return next(new ErrorHandler("Job not found.", 404));
  if (job.expired) return next(new ErrorHandler("This job has expired.", 400));

  const applicantID = { user: req.user.id, role: "Job Seeker" };
  const employerID = { user: job.postedBy, role: "Employer" };

  const application = await Application.create({
    jobId,
    name,
    email,
    coverLetter,
    phone,
    address,
    applicantID,
    employerID,
  });

  res.status(200).json({
    success: true,
    message: "Application submitted successfully!",
    application,
  });
});

// GET: Fetch All Applications for Job Seeker
exports.jobseekerGetAllApplications = catchAsyncErrors(async (req, res, next) => {
  const { role, id } = req.user;

  const applications = await Application.find({ "applicantID.user": id })
    .populate("jobId", "jobTitle companyName");

  res.status(200).json({
    success: true,
    applications,
  });
});

// DELETE: Delete a Job Application
exports.jobseekerDeleteApplication = catchAsyncErrors(async (req, res, next) => {
  const { role } = req.user;

  if (role === "Employer") {
    return next(new ErrorHandler("Employers are not allowed to access this resource.", 400));
  }

  const { id } = req.params;
  const application = await Application.findById(id);

  if (!application) return next(new ErrorHandler("Application not found.", 404));

  await application.deleteOne();
  res.status(200).json({
    success: true,
    message: "Application deleted successfully!",
  });
});
