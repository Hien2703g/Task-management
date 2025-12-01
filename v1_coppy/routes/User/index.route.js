const taskRoute = require("./task.route");
const userRoute = require("./user.route");
const projectRoute = require("./project.route");
const diaryRoute = require("./user.route");

const authMiddleware = require("../../middlewares/User/auth.middlewares");

module.exports = (app) => {
  const version = "/api/v1";

  app.use(version + "/tasks", authMiddleware.requireAuth, taskRoute);

  app.use(version + "/projects", authMiddleware.requireAuth, projectRoute);

  app.use(version + "/diarys", authMiddleware.requireAuth, diaryRoute);

  app.use(version + "/users", userRoute);
};
