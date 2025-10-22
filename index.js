const express = require("express");
require("dotenv").config();

const database = require("./config/database");
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
const route = require("./routes/index.route");

route(app);
app.listen(port, () => {
  console.log(`App listening on post ${port}`);
});
