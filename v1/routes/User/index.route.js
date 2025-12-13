const taskRoute = require("./task.route");
const userRoute = require("./user.route");
const projectRoute = require("./project.route");
const diaryRoute = require("./user.route");
const userSocialRoutes = require("./social.route");
const chatRoutes = require("./chat.route");

const authMiddleware = require("../../middlewares/User/auth.middlewares");
const settingMiddleware = require("../../middlewares/User/setting.middleware");

module.exports = (app) => {
  const version = "/api/v1";
  app.use(settingMiddleware.settingGeneral);

  app.use(version + "/tasks", authMiddleware.requireAuth, taskRoute);

  app.use(version + "/projects", authMiddleware.requireAuth, projectRoute);

  app.use(version + "/diarys", authMiddleware.requireAuth, diaryRoute);

  app.use(version + "/chat", authMiddleware.requireAuth, chatRoutes);

  app.use(version + "/users", userRoute);
};
