const multer = require("multer");
const path = require("path");

// Configure multer storage
const diskStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/resumes"); 
  },
  filename: (req, file, cb) => {
    return cb(null, `${Date.now()} -${file.originalname}`);
  },
});

// File type validation
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new Error("Only PDF files are allowed"), false);
  }
};

const upload = multer({ storage:diskStorage, fileFilter });
module.exports = upload;
