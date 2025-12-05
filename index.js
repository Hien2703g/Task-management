const express = require("express");
require("dotenv").config();
const path = require("path");
// const http = require("http");
const systemConfig = require("./v2/config/system");
const database = require("./v1/config/database");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const flash = require("express-flash");
const session = require("express-session");

//cors
const cors = require("cors");

const app = express();
const port = process.env.PORT;

database.connect();
// methodOverride
const methodOverride = require("method-override");
app.use(methodOverride("_method"));

//Tinymce
app.use(
  "/tinymce",
  express.static(path.join(__dirname, "node_modules", "tinymce"))
);

//End Tinymce
app.set("views", `${__dirname}/v2/views`);
app.set("view engine", "pug");

app.use(express.static(`${__dirname}/v2/public`));
//flash
app.use(cookieParser("keyboard cat"));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({ cookie: { maxAge: 60000 } }));
app.use(flash());

app.locals.prefixAdmin = systemConfig.prefixAdmin;

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
