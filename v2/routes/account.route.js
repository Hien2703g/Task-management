const express = require("express");
const router = express.Router();

const controller = require("../controllers/account_controller");
router.post("/create", controller.createPost);

router.patch("/edit/:id", controller.edit);

router.get("/detail/:id", controller.detail);

module.exports = router;
