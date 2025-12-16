const taskRoute = require("./task.route");
const userRoute = require("./user.route");
const projectRoute = require("./project.route");
const diaryRoute = require("./user.route");
const userSocialRoutes = require("./social.route");
const chatRoutes = require("./chat.route");
const dashboardRouter = require("./dashboard.route");
const calendarRouter = require("./calendar.route");

const authMiddleware = require("../../middlewares/User/auth.middlewares");
const settingMiddleware = require("../../middlewares/User/setting.middleware");
const userMiddleware = require("../../middlewares/User/user.middleware");
module.exports = (app) => {
  const version = "/api/v1";
  app.use(settingMiddleware.settingGeneral);
  // app.use(userMiddleware.infoUser);
  app.use(version + "/dashboard", authMiddleware.requireAuth, dashboardRouter);

  app.use(version + "/tasks", authMiddleware.requireAuth, taskRoute);

  app.use(version + "/projects", authMiddleware.requireAuth, projectRoute);

  app.use(version + "/diarys", authMiddleware.requireAuth, diaryRoute);

  app.use(version + "/calendars", authMiddleware.requireAuth, calendarRouter);

  app.use(version + "/chat", authMiddleware.requireAuth, chatRoutes);

  app.use(version + "/users", userRoute);
};
