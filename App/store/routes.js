const express = require("express");
const controller = require("./controller");
const router = express.Router();

router.post("/store", controller.createStore);

router.get("/store", controller.getStores);

router.get("/store/:id", controller.getStoreById);

router.patch("/store/:id", controller.updateStore);

router.delete("/store/:id", controller.deleteStore);

module.exports = router;
