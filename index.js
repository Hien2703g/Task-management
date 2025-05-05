const express = require("express");
require("dotenv").config();
const database = require("./config/database");
const bodyParser = require("body-parser");
database.connect();
const app = express();
const port = process.env.PORT;
// parse application/json
app.use(bodyParser.json());
const route = require("./routes/index.route");

route(app);
app.listen(port, () => {
  console.log(`App listening on post ${port}`);
});
