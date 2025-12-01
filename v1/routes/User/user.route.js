const express = require("express");
const route = express.Router();
const controller = require("../../controllers/User/user.controller");

const authMiddleware = require("../../middlewares/User/auth.middlewares");

route.post("/register", controller.register);

route.post("/login", controller.login);

route.post("/password/forgot", controller.forgotPassword);

route.post("/password/otp", controller.otpPassword);

route.post("/password/reset", controller.resetPassword);

route.get("/detail", authMiddleware.requireAuth, controller.detail);

route.get("/listuser", authMiddleware.requireAuth, controller.listuser);

module.exports = route;
