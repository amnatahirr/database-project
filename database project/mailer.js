// mailer.js
const nodemailer = require('nodemailer');

// Create a transporter object using SMTP
const transporter = nodemailer.createTransport({
  host: 'smtp.example.com', // Replace with your email provider's SMTP server
  port: 587, // Usually 587 for TLS
  secure: false, // Use true for port 465, false for other ports
  auth: {
    user: 'your-email@example.com', // Your email address
    pass: 'your-email-password', // Your email password or app password
  },
});

// Function to send password reset email
const sendResetEmail = async (to, resetLink) => {
  const mailOptions = {
    from: '"Your App Name" <your-email@example.com>', // Sender address
    to, // Receiver address
    subject: 'Password Reset Request', // Subject line
    text: `You requested a password reset. Click the link to reset your password: ${resetLink}`, // Plain text body
    html: `<p>You requested a password reset. Click the link to reset your password:</p><a href="${resetLink}">${resetLink}</a>`, // HTML body
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Reset email sent successfully');
  } catch (error) {
    console.error('Error sending reset email:', error);
  }
};

module.exports = { sendResetEmail };
