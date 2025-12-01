const express = require("express");
const route = express.Router();
const controller = require("../../controllers/User/task.controller");
route.get("/", controller.index);

route.get("/detail/:id", controller.detail);

route.patch("/change-status/:id", controller.changeStatus);

route.patch("/change-multi", controller.changeMulti);

route.post("/create", controller.create);

route.patch("/edit/:id", controller.edit);

route.patch("/delete/:id", controller.delete);

route.patch("/priority/:id", controller.changePriority);

module.exports = route;
