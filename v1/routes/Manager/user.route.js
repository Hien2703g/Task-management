const express = require("express");
const route = express.Router();
const multer = require("multer");
const upload = multer();
const uploadClould = require("../../middlewares/Manager/uploadClould.middlewares");
const controller = require("../../controllers/Manager/user.controller");

const authMiddleware = require("../../middlewares/Manager/auth.middlewares");

route.post("/login", controller.login);

route.get("/logout", controller.logout);

route.get("/detail", authMiddleware.requireAuth, controller.detail);

route.get("/listuser", authMiddleware.requireAuth, controller.listuser);

route.patch(
  "/edit",
  authMiddleware.requireAuth,
  upload.single("avatar"),
  uploadClould.upload,
  controller.editPatch
);

module.exports = route;
