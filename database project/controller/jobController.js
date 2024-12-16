// controller/jobController.js
const ErrorHandler = require("../middleware/error");
const catchAsyncErrors = require("../middleware/catchAsyncError");
const Job = require("../models/job");

// Get All Jobs method??
// check update jobs and delete jobs 
exports.getAllJobs = catchAsyncErrors(async (req, res, next) => {

  const jobs = await Job.find({ expired: false });
  res.status(200).json({
    success: true,
    jobs,
  });
  console.log(jobs); // Debugging: Log fetched jobs
  res.render('job/viewJob', { jobs }); // Pass 'jobs' to the EJS template


});

// post new Job 
exports.postJob = catchAsyncErrors(async (req, res, next) => {

  const { role } = req.user;
  if (role === "Job Seeker") {
    return next(
      new ErrorHandler("Job Seeker not allowed to access this resource.", 400)
    );
  }

  // Creating a new job post
  const {
    jobTitle,
    companyName,
    industry,
    jobType,
    location,
    salaryRange,
    jobDescription,
    responsibilities,
    requiredSkills,
  } = req.body;

  if (!jobTitle || !companyName || !industry || !jobType || !location || !salaryRange || !jobDescription ||
    !responsibilities || !requiredSkills) {
    return next(new ErrorHandler("Please provide full job details.", 400));
  }

  const postedBy = req.user.id;  // `id` from JWT which is a string

  const job = await Job.create({
    jobTitle,
    companyName,
    industry,
    jobType,
    location,
    salaryRange,
    jobDescription,
    responsibilities,
    requiredSkills,
    postedBy,  // Mongoose will automatically handle the type conversion
  });

  res.status(200).json({
    success: true,
    message: "Job Posted Successfully!",
    job,
  });
});


// get my jobs
exports.getMyJobs = catchAsyncErrors(async (req, res, next) => {

  const { role } = req.user;
  if (role === "Job Seeker") {
    return next(
      new ErrorHandler("Job Seeker not allowed to access this resource.", 400)
    );
  }

  const myJobs = await Job.find({ postedBy: req.user._id });
  res.status(200).json({
    success: true,
    myJobs,
  });

});



// Update an existing job posting
exports.updateJob = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedJob = await Job.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedJob) {
      return res.status(404).json({ message: "Job not found" });
    }
    res.status(200).json({ message: "Job updated successfully", updatedJob });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a job posting
exports.deleteJob = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedJob = await Job.findByIdAndDelete(id);
    if (!deletedJob) {
      return res.status(404).json({ message: "Job not found" });
    }
    res.status(200).json({ message: "Job deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.getSingleJob = catchAsyncErrors(async (req, res, next) => {
  
  const { id } = req.params;
  try {
    const job = await Job.findById(id);
    if (!job) {
      return next(new ErrorHandler("Job not found.", 404));
    }
    res.status(200).json({
      success: true,
      job,
    });
  } catch (error) {
    return next(new ErrorHandler(`Invalid ID / CastError`, 404));
  }
});

// // Get jobs with advanced filtering
// exports.getJobs = async (req, res) => {
//   try {
//     const {
//       jobTitle,
//       companyName,
//       industry,
//       jobType,
//       location,
//       salaryRange,
//       jobDescription,
//       responsibilities,
//       requiredSkills,
//       postedBy,
//       expired,
//       keywords
//     } = req.query;

//     const filters = {};

//     if (jobTitle) filters.jobTitle = { $regex: jobTitle, $options: "i" };
//     if (companyName) filters.companyName = { $regex: companyName, $options: "i" };
//     if (industry) filters.industry = industry;
//     if (jobType) filters.jobType = jobType;
//     if (location) filters.location = { $regex: location, $options: "i" };
//     if (salaryRange) filters.salaryRange = { $regex: salaryRange, $options: "i" };
//     if (jobDescription) filters.jobDescription = { $regex: jobDescription, $options: "i" };
//     if (responsibilities) filters.responsibilities = { $regex: responsibilities, $options: "i" };
//     if (requiredSkills) filters.requiredSkills = { $regex: requiredSkills, $options: "i" };
//     if (postedBy) filters.postedBy = postedBy;
//     if (expired !== undefined) filters.expired = expired === 'true';
//     if (keywords) filters.keywords = { $regex: keywords.split(",").map(keyword => keyword.trim()).join("|"), $options: "i" };

//     const jobs = await Job.find(filters);
//     res.status(200).json(jobs);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };
