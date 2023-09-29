const express = require("express");
const controller = require("./controller");
const router = express.Router();

router.post("/tenant", controller.createTenant);

router.get("/tenant", controller.getTenants);

router.get("/tenant/:id", controller.getTenantById);

router.patch("/tenant/:id", controller.updateTenant);

router.delete("/tenant/:id", controller.deleteTenant);

module.exports = router;
