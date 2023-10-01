const notificationController = require("./controller");
const express = require("express");
const router = express.Router();

router.get("/user-notifications", notificationController.getUserNotification);

router.get("/all-seen", notificationController.makeAllSeen);

router.get("/notification/:id", notificationController.makeOneSeen);

module.exports = router;
