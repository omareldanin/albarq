const express = require("express");
const controller = require("./controller");
const router = express.Router();

router.post("/repository", controller.createRepository);

router.get("/repository", controller.getRepositories);

router.get("/repository/:id", controller.getRepositoryById);

router.patch("/repository/:id", controller.updateRepository);

router.delete("/repository/:id", controller.deleteRepository);

module.exports = router;
