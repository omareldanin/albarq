const express = require("express");
const controller = require("./controller");
const router = express.Router();

router.post("/product", controller.createProduct);

router.get("/client-products", controller.getClientProducts);

router.get("/product/:id", controller.getOneProduct);

router.patch("/product/:id", controller.updateProduct);

router.delete("/product/:id", controller.deleteOne);

router.delete("/color", controller.addColors);

router.delete("/color/:id", controller.deleteColor);

router.delete("/size/:id", controller.deleteSize);

module.exports = router;
