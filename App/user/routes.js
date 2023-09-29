const express = require("express");
const controller = require("./controller");
const router = express.Router();

router.post("/create-user", controller.createUser);

router.post("/create-admin", controller.createAdmin);

router.post("/create-assistant", controller.createClientAssistant);

router.get("/admins", controller.getAllAdmins);

router.post("/login", controller.login);

router.get("/profile", controller.getUserByToken);

router.get("/all-users", controller.getAllUsers);

router.post("/reset-password", controller.resetPassword);

router.patch("/update/:id", controller.updateUser);

router.delete("/delete/:id", controller.deleteUser);

module.exports = router;
