const systemConfig = require("../config/system");

const accountRoute = require("./account.route");
const roleRoute = require("./role.route");
const authRoute = require("./auth.route");
module.exports = (app) => {
  const version = "/api/v2";
  const PATH_ADMIN = systemConfig.prefixAdmin;
  //   app.use(PATH_ADMIN + "/dashboard", dashboardRoute);

  app.use(PATH_ADMIN + version + "/accounts", accountRoute);

  app.use(PATH_ADMIN + version + "/roles", roleRoute);

  app.use(PATH_ADMIN + version + "/auth", authRoute);
};
