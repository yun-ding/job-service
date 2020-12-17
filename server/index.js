const bodyParser = require("body-parser");
const express = require("express");
var routes = require("./routes.js");
const cors = require("cors");

const app = express();

app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/jobs", routes.getJobs);
app.get("/popular", routes.getSkills);
app.get("/popular/:skill", routes.getPopularLocations);
app.get("/popular/:skill/:state", routes.getPopularLocations);
app.get("/popular/topskills/:selectedTitle", routes.getTopSkills);

app.listen(8081, () => {
  console.log(`Server listening on PORT 8081`);
});
