const express = require("express");
require("dotenv").config();

const database = require("./v1/config/database");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

//cors
const cors = require("cors");

const app = express();
const port = process.env.PORT;

database.connect();
app.use(cookieParser());
app.use(cors());
// parse application/json
app.use(bodyParser.json());

const route = require("./v1/routes/User/index.route");
const routeAdmin = require("./v2/routes/index.route");
const routeManager = require("./v1/routes/Manager/index.route");

route(app);
routeAdmin(app);
routeManager(app);

app.listen(port, () => {
  console.log(`App listening on post ${port}`);
});
