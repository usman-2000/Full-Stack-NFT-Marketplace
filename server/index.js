require("dotenv").config();
const express = require("express");
const app = express();
require("./Db/connect");
const cors = require("cors");
const router = require("./Routes/router");

PORT = 5004;
app.use(cors());
app.use(express.json());
app.use(router);

app.listen(PORT, () => {
  console.log(`Server Started at PORT : ${PORT}`);
});
