const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Tweet = require("../models/Tweet");

const sendToken = async (req, res) => {
  // console.log(req.body);
  // let { user, password } = req.body;
  let user = req.body.username;
  let password = req.body.password;

  console.log(user + " " + password);
  let userDB;

  userDB = await User.findOne({ userName: user });
  console.log("usaste username");

  if (!userDB) {
    res.status(404).json({
      error: "Usuario o contraseña incorrectos.",
    });
  }

  if (!(await bcrypt.compare(password, userDB.password))) {
    res.status(404).json({
      error: "Usuario o contraseña incorrectos.",
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
  // console.log("Logeado como: " + req.user);
  // const user = req.user;

  const arrayDeTweets = await Tweet.find()
    .sort({ createdAt: -1 })
    .populate("user")
    .limit(20);

  // res.json({ arrayDeTweets, user });
  console.log(req.user.userId);

  const user = await User.findById(req.user.userId).select("following");
  console.log("usuario " + user);
  // const tweets = await Tweet.find({
  //   user: { $in: [...user.following, req.user.userId] },
  // })
  //   .populate("user")
  //   .sort({ createdAt: "desc" });
  console.log("tweets" + arrayDeTweets);
  res.json(arrayDeTweets);
};
module.exports = {
  sendToken,
  sendTweets,
};
