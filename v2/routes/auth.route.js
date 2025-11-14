const express = require("express");
const router = express.Router();
const controller = require("../controllers/auth_controller");
const validates = require("../validate/auth.validate");

router.post("/login", validates.loginPost, controller.loginPost);

router.get("/logout", controller.logout);

module.exports = router;
