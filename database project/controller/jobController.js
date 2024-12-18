// controller/jobController.js
const ErrorHandler = require("../middleware/error");
const catchAsyncErrors = require("../middleware/catchAsyncError");
const Job = require("../models/job");

// Get All Jobs method??
// check update jobs and delete jobs 
exports.getAllJobs = catchAsyncErrors(async (req, res, next) => {
  try {
    const { searchQuery } = req.query; // Extract the search query from the request

    let searchOptions = {};

    // Only proceed if the search query is not empty
    if (searchQuery && searchQuery.trim() !== '') {
      // Create a regular expression for case-insensitive search across multiple fields
      const regex = new RegExp(searchQuery, 'i'); // 'i' for case-insensitive search

      // Apply the search query to multiple fields (jobTitle, companyName, location)
      searchOptions = {
        $or: [
          { jobTitle: regex },
          { companyName: regex },
          { location: regex },
          { jobType: regex },
          { industry: regex }
        ]
      };
    }

    // Fetch jobs based on the search options and ensure expired: false
    const jobs = await Job.find({ ...searchOptions, expired: false });

    // Render the page with jobs data and the search query
    res.status(200).render('job/viewJob', {
      jobs: jobs,
      searchOptions: req.query, // Pass the search query to the template for persistence
    });
  } catch (error) {
    console.error(error); // Log the error
    res.status(500).json({
      success: false,
      message: 'Unable to fetch jobs at the moment.',
    });
  }
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
//updatejob
exports.updateJob = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate the request body to prevent invalid updates
    const updateData = req.body;

    // Perform the update and return the updated document
    const updatedJob = await Job.findByIdAndUpdate(
      id,
      updateData,
      {
        new: true, // Return the updated document
        runValidators: true, // Enforce schema validations on update
      }
    );

    // If no job was found with the given ID
    if (!updatedJob) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    res.status(200).json({
      success: true,
      message: "Job updated successfully",
      updatedJob,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred while updating the job",
      error: error.message,
    });
  }
};

// get my jobs
exports.getMyJobs = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.user; // Fetch the logged-in user's ID from the token
  
  const myJobs = await Job.find({ postedBy: id }); // Fetch jobs where postedBy matches the user's ID
  
  res.status(200).render('job/myJobs', {
    jobs: myJobs,
  });
});

// delete an existing job posting
exports.deleteJob = async (req, res) => {
  try {
    const { id } = req.params; // Extract job ID from request parameters
    const deletedJob = await Job.findByIdAndDelete(id); // Find the job by ID and delete it

    if (!deletedJob) {
      return res.status(404).json({ message: "Job not found" }); // If job is not found, return a 404 error
    }

    res.status(200).json({ message: "Job deleted successfully", deletedJob }); // Respond with success message
  } catch (err) {
    res.status(500).json({ error: err.message }); // Handle any server errors
  }
};

// Delete a job posting
// exports.deleteJob = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const deletedJob = await Job.findByIdAndDelete(id);
//     if (!deletedJob) {
//       return res.status(404).json({ message: "Job not found" });
//     }
//     res.status(200).json({ message: "Job deleted successfully" });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };


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
