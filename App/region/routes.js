const express = require("express");
const controller = require("./controller");
const router = express.Router();

router.post("/region", controller.createRegion);

router.post("/assign-regions", controller.assignRegionsToDelivery);

router.get("/region", controller.getRegions);

router.get("/region/:id", controller.updateRegion);

router.patch("/region/:id", controller.updateRegion);

router.delete("/region/:id", controller.deleteRegion);

module.exports = router;
