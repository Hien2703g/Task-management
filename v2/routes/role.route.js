const express = require("express");
const router = express.Router();

const controller = require("../controllers/role_controller");
router.get("/", controller.index);

router.get("/detail/:id", controller.detail);

router.post("/create", controller.createPost);

router.patch("/edit/:id", controller.edit);

router.patch("/permissions", controller.permissionsPatch);

module.exports = router;
