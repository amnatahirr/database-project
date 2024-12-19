// controllers/notificationController.js
const Notification = require("../models/notification");

exports.sendNotification = async (req, res) => {
  try {
    console.log("Request body:", req.body); // Debugging log
    const { userId, message } = req.body;
    const notification = new Notification({ user: userId, message });
    await notification.save();
    res.status(201).json({ message: "Notification sent successfully", notification });
  } catch (err) {
    console.error("Error sending notification:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// controllers/notificationController.js

/*
exports.getNotifications = async (req, res) => {
  try {
    console.log("Fetching notifications for user:", req.params.userId); // Debugging log
    const notifications = await Notification.find({ user: req.params.userId }).sort({ createdAt: -1 });
    res.status(200).json(notifications);
  } catch (err) {
    console.error("Error fetching notifications:", err.message);
    res.status(500).json({ error: err.message });
  }
};*/
exports.getUserNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    const notifications = await Notification.find({ user: userId }).sort({ createdAt: -1 });

    res.render("notifications/notifications", { notifications });
  } catch (err) {
    console.error("Error rendering notifications view:", err.message);
    res.status(500).send("Unable to load notifications view");
  }
};


// controllers/notificationController.js
exports.getJobSeekerDashboard = async (req, res) => {
  try {
    const userId = req.user.id; // Assumes req.user contains authenticated user details
    const notifications = await Notification.find({ user: userId }).sort({ createdAt: -1 });

    console.log("Notifications:", notifications); // Debugging log
    res.render("dashboard", { user: req.user, notifications });
  } catch (err) {
    console.error("Error fetching notifications:", err.message);
    res.status(500).send("An error occurred while loading the dashboard.");
  }
};



