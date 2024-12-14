const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const upload = require("../middleware/upload");
const nodemailer = require("nodemailer");

exports.registerUser = async (req, res) => {
  try {
    upload.single("resume")(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ message: err.message });
      }

      const { name, email, password, role, keywords } = req.body;

      // Validate role
      if (!["job_seeker", "employer", "admin"].includes(role)) {
        return res.status(400).json({ message: "Invalid role specified" });
      }

      // Validate keywords for job seekers or employers
      if ((role === "job_seeker" || role === "employer") && (!keywords || !keywords.length)) {
        return res.status(400).json({ message: "Keywords are required for job seekers or employers" });
      }

      // Validate password strength
      const passwordRequirements = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
      if (!passwordRequirements.test(password)) {
        return res.status(400).json({
          message: "Password must be at least 8 characters long, include at least one uppercase letter, and one number.",
        });
      }

      // Check if email is already registered
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "Email is already registered" });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user object
      const user = new User({
        name,
        email,
        password: hashedPassword,
        role,
        keywords: role === "job_seeker" || role === "employer" ? keywords : undefined,
        resumeUrl: req.file ? `/uploads/resumes/${req.file.filename}` : undefined, // Store resume file path
      });

      // Save user
      await user.save();

      // Redirect to login page
      return res.redirect("/login");
    });
  } catch (err) {
    console.error("Error registering user:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Redirect to dashboard after successful login
    return res.redirect("/dashboard");
  } catch (err) {
    console.error("Error logging in user:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, keywords } = req.body;

    const updates = { name, keywords };

    const user = await User.findByIdAndUpdate(id, updates, { new: true });
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ message: "Profile updated successfully", user });
  } catch (err) {
    console.error("Profile update error:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.uploadResume = async (req, res) => {
  try {
    upload.single("resume")(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ message: err.message });
      }

      const { id } = req.params;
      if (!req.file) return res.status(400).json({ message: "No file uploaded" });

      const user = await User.findByIdAndUpdate(
        id,
        { resumeUrl: `/uploads/resumes/${req.file.filename}` },
        { new: true }
      );
      if (!user) return res.status(404).json({ message: "User not found" });

      res.status(200).json({ message: "Resume uploaded successfully", user });
    });
  } catch (err) {
    console.error("Resume upload error:", err);
    res.status(500).json({ error: err.message });
  }
};

// Forgot Password
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Generate token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    // Send email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MY_GMAIL,
        pass: process.env.MY_PASSWORD,
      },
    });

    const resetLink = `${process.env.CLIENT_URL}/resetPassword?token=${token}`;

    const mailOptions = {
      from: process.env.MY_GMAIL,
      to: email,
      subject: "Password Reset Request",
      text: `Click on this link to reset your password: ${resetLink}`,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Password reset link sent successfully" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Reset Password
exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Validate and hash new password
    const passwordRequirements = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!passwordRequirements.test(newPassword)) {
      return res.status(400).json({
        message: "Password must be at least 8 characters long, include an uppercase letter, and a number.",
      });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password reset successful" });
    return res.redirect("/login");
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({ message: "Invalid or expired token" });
  }
};
