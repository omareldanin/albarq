const notificationController = require("./controller");
const express = require("express");
const router = express.Router();

router.get("/user-notifications", notificationController.getUserNotification);

module.exports = router;
