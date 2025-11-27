const express = require("express");
const router = express.Router();
const uploadCloudinary = require("../middlewares/uploadClould.middlewares");
const multer = require("multer");
const upload = multer();

const controller = require("../controllers/role_controller");
router.get("/", controller.index);

router.get("/detail/:id", controller.detail);

router.post(
  "/create",
  upload.single("avatar"),
  uploadCloudinary.upload,
  controller.createPost
);

router.patch("/edit/:id", controller.edit);

router.patch("/permissions", controller.permissionsPatch);

module.exports = router;
