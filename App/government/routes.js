const express = require("express");
const controller = require("./controller");
const router = express.Router();

router.post("/government", controller.createGovernment);

router.get("/government", controller.getGovernments);

router.get("/government/:id", controller.getGovernmentById);

router.patch("/government/:id", controller.updateGovernment);

router.delete("/government/:id", controller.deleteGovernment);

module.exports = router;
