const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const dotenv = require('dotenv');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const cors = require("cors");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const session = require("express-session");
const flash = require("express-flash");
const { isAuthenticated } = require("./middleware/auth");

const notificationRoutes = require("./routes/notificationRoutes");
const { authenticateAccessToken } = require("./middleware/auth");
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5000", // Update this with your frontend's origin
    methods: ["GET", "POST"]
  }
});
app.use('/socket.io', express.static('node_modules/socket.io/client-dist'));

app.use(cors({
  origin: "http://localhost:5000",
  credentials: true,
}));
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: "secret", resave: false, saveUninitialized: false }));
app.use(flash());
app.use((req, res, next) => {
  res.locals.user = req.session.user || null; // Store user info in res.locals
  next();
});
const connectDB = require('./db');

dotenv.config();


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
const dashboardRoutes = require('./routes/dashboardRoutes');
const adminRoutes = require('./routes/adminRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const jobRoutes = require('./routes/jobRoutes');
//const notificationRoutes = require('./routes/notificationRoutes');

// Use routes

app.use("/notifications", notificationRoutes);
app.use('/users', userRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/admin', adminRoutes);
app.use('/application', applicationRoutes);
app.use('/job', jobRoutes);
//app.use('/notification', notificationRoutes);


// Frontend Routes
app.get('/', (req, res) => {
  res.render('users/index', { layout: 'layouts/main' });
});

app.get('/login', (req, res) => {
  const message = req.query.message || null;
  res.render('users/login', { layout: 'layouts/main', message });
});

app.get('/register', (req, res) => {
  res.render('users/register', { layout: 'layouts/main' });
});

app.get('/forgotPassword', (req, res) => {
  res.render('users/forgotPassword', { layout: 'layouts/main' });
});

app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Error destroying session:', err);
    }
    res.redirect('/login');
  });
});

app.get('/admin', (req, res) => {
  const { token } = req.query;
  res.render('users/admin', { layout: 'layouts/main' });
});

app.get('/updateProfile', (req, res) => {
  res.render('users/updateProfile', { layout: 'layout/mains' });
})
app.get('/admin_dashboard', (req, res) => {
  const { token } = req.query;
  res.render('users/a_dashboard', { layout: 'layouts/main' });
});

app.get('/employer_dashboard', (req, res) => {
  res.render('users/employer_dashboard', { layout: 'layouts/main' });
});

app.get('/jobSeeker_dashboard', (req, res) => {
  res.render('users/jobSeeker_dashboard', { layout: 'layouts/main' });
});

  app.get('/profile', isAuthenticated, (req, res) => {
    if (!req.session.user) {
      return res.redirect('/login');
    }
    res.render('users/profile', { layout: 'layouts/main', user: req.session.user });
  });


  app.get('/resetPassword', (req, res) => {
    const { token } = req.query;
    res.render('users/resetPassword', { layout: "layouts/main", token });
  });

  app.get('/jobPostForm', (req, res) => {
    const { token } = req.query;
    res.render('job/jobPostForm', { layout: "layouts/main" }, token);
  });

  app.get('/viewJob', (req, res) => {
    res.render('job/viewJob', { layout: "layouts/main" });
  });


  app.get('/JobApplicationForm', (req, res) => {
    const { token } = req.query;
    res.render('JobApplication/applicationForm', { layout: "layouts/main", });
  });

  app.get('/viewAllApplications', (req, res) => {
    const { token } = req.query;
    res.render('JobApplication/viewApplications', { layout: "layouts/main", });
  });

  app.get('/deleteApplication', (req, res) => {
    const { token } = req.query;
    res.render('JobApplication/deleteApplication', { layout: "layouts/main", });
  });

  app.get('/GetApplications', (req, res) => {
    const { token } = req.query;
    res.render('JobApplication/employerView', { layout: "layouts/main", });
  });

  app.use("/", notificationRoutes);
  // Socket.IO
  // Handle Socket.IO connections
  io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('chatMessage', (data) => {
      console.log('Message received:', data);
      socket.broadcast.emit('receiveMessage', data);
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });

  connectDB();
  // Start the server
  const PORT = 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));




