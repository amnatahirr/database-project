const mongoose = require("mongoose");
const validator = require('validator');

const applicationSchema = new mongoose.Schema({

  name: {
    type: String,
    required: [true, "Please enter your Name!"],
    minLength: [3, "Name must contain at least 3 Characters!"],
    maxLength: [30, "Name cannot exceed 30 Characters!"],
  },

  email: {
    type: String,
    required: [true, "Please enter your Email!"],
    validate: [validator.isEmail, "Please provide a valid Email!"],
  },

  coverLetter: {
    type: String,
    required: [true, "Please provide a cover letter!"],
  },

  phone: {
    type: Number,
    required: [true, "Please enter your Phone Number!"],
  },

  address: {
    type: String,
    required: [true, "Please enter your Address!"],
  },


  // resume: {
  //   public_id: {
  //     type: String, 
  //     required: true,
  //   },

  //   // public_id will come from cloudinary

  //   url: {
  //     type: String, 
  //     required: true,
  //   },
  // },

  applicantID: {

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",  // user model
      required: true,
    },


    role: {
      type: String,
      enum: ["Job Seeker"],
      required: true,
    },
    // role can be only job seeker 

  },

  employerID: {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    role: {
      type: String,
      enum: ["Employer"],
      required: true,
    },
    
  },

},{ timestamps: true });

// Avoid model overwrite error
const Application = mongoose.models.Application || mongoose.model("Application", applicationSchema);

module.exports = Application;
