const express = require("express");
const router = express.Router();
const controller = require("../Controller/userController");

router.post("/users/createuser", controller.userPost);
router.get("/users/getsingleuser/:walletAddress", controller.getSingleUser);

module.exports = router;
