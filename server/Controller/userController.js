const users = require("../Model/userSchema");
const moment = require("moment");

exports.userPost = async (req, res) => {
  const { username, email, walletAddress } = req.body;
  if (!username || !email || !walletAddress) {
    res.status(400).json({ error: "All fields are required" });
  }
  try {
    const preUser = await users.findOne({ walletAddress: walletAddress });
    if (preUser) {
      res.status(400).json({ error: "User already exists" });
    } else {
      const dateCreate = moment(new Date()).format("YYYY-MM-DD");

      const userData = new users({
        username,
        email,
        walletAddress,
        dateCreated: dateCreate,
      });
      await userData.save();
      res.status(200).json(userData);
    }
  } catch (err) {
    res.status(400).json({ error: err });
    console.log("catch block error" + err);
  }
};

exports.getSingleUser = async (req, res) => {
  const { walletAddress } = req.params;
  try {
    const singleUserData = await users.findOne({
      walletAddress: walletAddress,
    });
    res.status(200).json(singleUserData);
  } catch (error) {
    res.status(400).json({ error: error });
    console.log("catch block error" + error);
  }
};
