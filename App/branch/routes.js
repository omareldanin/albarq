const express = require("express");
const controller = require("./controller");
const router = express.Router();

router.post("/branch", controller.createBranch);

router.get("/branch", controller.getBranches);

router.get("/branch/:id", controller.getBranchById);

router.patch("/branch/:id", controller.updateBranch);

router.delete("/branch/:id", controller.deleteBranch);

module.exports = router;
