// models/Job.js
const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  employer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  
});

const Job = mongoose.model('Job', jobSchema);
module.exports = Job;
