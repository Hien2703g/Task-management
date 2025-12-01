const express = require("express");
const route = express.Router();
const multer = require("multer");
const uploadCloudinary = require("../../middlewares/Manager/uploadClould.middlewares");
const controller = require("../../controllers/Manager/project.controller");
const upload = multer();

route.get("/", controller.index);

route.get("/detail/:id", controller.detail);

route.patch("/change-status/:id", controller.changeStatus);

route.patch("/change-multi", controller.changeMulti);

route.post(
  "/create",
  upload.single("thumbnail"),
  uploadCloudinary.upload,
  controller.create
);

route.patch("/edit/:id", controller.edit);

route.patch("/delete/:id", controller.delete);

route.post("/comment/:id", controller.comment);

route.patch("/comment/edit/:id", controller.editComment);

module.exports = route;
