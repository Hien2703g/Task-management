const projectRoute = require("./project.route");
const userRoute = require("./user.route");

const authMiddleware = require("../../middlewares/Manager/auth.middlewares");

module.exports = (app) => {
  const version = "/api/v3";

  app.use(version + "/projects", authMiddleware.requireAuth, projectRoute);

  app.use(version + "/users", userRoute);
};
