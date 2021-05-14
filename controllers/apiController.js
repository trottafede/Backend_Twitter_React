const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Tweet = require("../models/Tweet");

const sendToken = async (req, res) => {
  let user = req.body.username;
  let password = req.body.password;

  let userDB;

  userDB = await User.findOne({ userName: user });

  if (!userDB) {
    res.status(404).json({
      error: "Usuario incorrecto",
    });
  }

  if (!(await bcrypt.compare(password, userDB.password))) {
    res.status(404).json({
      error: "Contraseña incorrecta",
    });
  }

  let token = jwt.sign(
    { userId: userDB._id, userName: userDB.userName, email: userDB.email },
    process.env.ACCESS_TOKEN_SECRET
  );

  res.json({
    userId: userDB._id,
    userName: userDB.userName,
    token,
  });
};

const sendTweets = async (req, res) => {
  const user = req.user;

  const arrayDeTweets = await Tweet.find()
    .sort({ createdAt: -1 })
    .populate("author")
    .limit(20);

  console.log("usuario " + user);
  console.log("tweets" + arrayDeTweets);
  res.json({ arrayDeTweets, user });
};
module.exports = {
  sendToken,
  sendTweets,
};
