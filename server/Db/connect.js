const mongoose = require("mongoose");
const DB = process.env.MONGO_URL;

mongoose
  .connect(DB, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(() => console.log("Database Connected Successfully!"))
  .catch((err) => console.log(err));
