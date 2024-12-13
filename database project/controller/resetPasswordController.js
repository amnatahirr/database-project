// controllers/resetPasswordController.js
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { sendResetEmail } = require('../mailer'); // Import the email sending function

// Forgot Password function
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  // Find the user by email
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // Generate a token for password reset
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

  // Send email with reset link (include the token in the URL)
  const resetLink = `http://your-frontend-url/reset-password?token=${token}`; // Update with your actual frontend URL

  // Call the function to send the email
  await sendResetEmail(user.email, resetLink);

  res.status(200).json({ message: "Password reset link sent to your email" });
};

// Reset Password function
exports.resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    // Validate password strength
    const passwordRequirements = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/; // At least 8 characters, one uppercase, one number
    if (!passwordRequirements.test(newPassword)) {
      return res.status(400).json({ message: "Password must be at least 8 characters long, include at least one uppercase letter, and one number." });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password
    await User.findByIdAndUpdate(userId, { password: hashedPassword });

    res.status(200).json({ message: "Password reset successfully" });
  } catch (err) {
    res.status(400).json({ message: "Invalid token" });
  }
};
