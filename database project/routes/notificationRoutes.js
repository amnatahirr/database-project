// routes/notificationRoutes.js
const express = require("express");
const { sendNotification, getNotifications } = require("../controller/notificationController");
const router = express.Router();

router.post("/", sendNotification);
router.get("/:userId", getNotifications);

module.exports = router;
