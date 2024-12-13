const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const app = express();
const connectDB = require('./db');
dotenv.config();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set up EJS
app.use(expressLayouts);
app.set('layout', 'layouts/main'); // Default layout
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

const userRoutes = require('./routes/userRoutes'); // Adjust the path if needed
app.use('/users', userRoutes);

const adminRoutes = require('./routes/adminRoutes'); // Adjust the path if needed
app.use('/admin', adminRoutes);

const applicationRoutes = require('./routes/applicationRoutes'); // Adjust the path if needed
app.use('/application', applicationRoutes);

const jobRoutes = require('./routes/jobRoutes'); // Adjust the path if needed
app.use('/job', jobRoutes);

const notificationRoutes = require('./routes/notificationRoutes'); // Adjust the path if needed
app.use('/notification', notificationRoutes);


const forgotPassword = require('./routes/forgot-password');
app.use('/forgotPassword', forgotPassword); 


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

app.get('/dashboard', (req, res) => {
  res.render('users/dashboard', { layout: 'layouts/main' });
});

app.get('/admin', (req, res) => {
  res.render('users/admin', { layout: 'layouts/main' });
});

app.get('/forgotPassword', (req, res) => {
  res.render('users/forgotPassword', { layout: 'layouts/main' }); 
});

app.get('/resetPassword',(req,res)=>{
  res.render('users/resetPassword',{layout:"layouts/main"});
});

connectDB();
// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));




