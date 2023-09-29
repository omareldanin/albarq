const express = require("express");
const controller = require("./controller");
const router = express.Router();

router.post("/category", controller.createCategory);

router.get("/category", controller.getCategories);

router.get("/category/:id", controller.getOneCategoryById);

router.patch("/category/:id", controller.editOne);

router.delete("/category/:id", controller.deleteOne);

module.exports = router;
