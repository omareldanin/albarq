const express = require("express");
const controller = require("./controller");
const router = express.Router();

router.post("/create-order", controller.createOrderByClient);

router.get("/client-statistics", controller.getClientNumbers);

router.get("/client-orders", controller.getClientOrders);

router.get("/order-receipt/:id", controller.createReceipt);

module.exports = router;
