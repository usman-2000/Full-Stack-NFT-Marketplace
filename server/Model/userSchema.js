const mongoose = require("mongoose");
const validator = require("validator");

// Defining Schema

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Not a valid email");
      }
    },
  },
  walletAddress: {
    type: String,
    required: true,
  },
});

const users = new mongoose.model("users", userSchema);
module.exports = users;
