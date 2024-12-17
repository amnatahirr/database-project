const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');

//new line
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");


const connectDB = require('./db');

dotenv.config();

const app = express();

//new line
app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// new line

app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: "/tmp"
}))



// Set up EJS
app.use(expressLayouts);
app.set('layout', 'layouts/main'); // Default layout
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Import routes
const userRoutes = require('./routes/userRoutes');

//const adminRoutes = require('./routes/adminRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const jobRoutes = require('./routes/jobRoutes');
//const notificationRoutes = require('./routes/notificationRoutes');

// Use routes

app.use('/users', userRoutes);

//app.use('/admin', adminRoutes);
app.use('/application', applicationRoutes);
app.use('/job', jobRoutes);
//app.use('/notification', notificationRoutes);


// Frontend Routes
app.get('/', (req, res) => {
  res.render('users/index', { layout: 'layouts/main' });
});

app.get('/login', (req, res) => {
  res.render('users/login', { layout: 'layouts/main' });
});

app.get('/register', (req, res) => {
  res.render('users/register', { layout: 'layouts/main' });
});

app.get('/forgotPassword', (req, res) => {
  res.render('users/forgotPassword', { layout: 'layouts/main' }); 
});

app.get('/dashboard', (req, res) => {
  res.render('users/dashboard', { layout: 'layouts/main' });
});

app.get('/admin', (req, res) => {
  res.render('users/admin', { layout: 'layouts/main' });
});

app.get('/resetPassword',(req,res)=>{
  const { token } = req.query;
  res.render('users/resetPassword',{layout:"layouts/main",token});
});


app.get('/jobPostForm',(req,res)=>{
  const { token } = req.query;
  res.render('job/jobPostForm',{layout:"layouts/main"},token);
});

app.get('/viewJob',(req,res)=>{
  //const { token } = req.query;
  res.render('job/viewJob',{layout:"layouts/main"});
});

app.get('/JobApplicationForm',(req,res)=>{
  const { token } = req.query;
  res.render('jobApplication/applicationForm',{layout:"layouts/main"},token);
});


app.get('/JobApplicationForm',(req,res)=>{
  const { token } = req.query;
  res.render('JobApplication/applicationForm',{layout:"layouts/main",});
});

app.get('/viewAllApplications',(req,res)=>{
  const { token } = req.query;
  res.render('JobApplication/viewApplications',{layout:"layouts/main",});
});

app.get('/deleteApplication',(req,res)=>{
  const { token } = req.query;
  res.render('JobApplication/deleteApplication',{layout:"layouts/main",});
});

app.get('/GetApplications',(req,res)=>{
  const { token } = req.query;
  res.render('JobApplication/employerView',{layout:"layouts/main",});
});



connectDB();
// Start the server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));




